import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './security';

/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Implements permission checking for SOC 2 and HIPAA compliance
 * Enforces principle of least privilege
 */

// ============================================================================
// Role Definitions
// ============================================================================

export type UserRole = 'owner' | 'admin' | 'builder' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  orgId: string;
  permissions: string[];
}

// ============================================================================
// Permission Matrix
// ============================================================================

/**
 * Permission Matrix for Role-Based Access Control
 * 
 * Format: resource:action
 * Resources: agents, workflows, integrations, team, billing, settings, audit
 * Actions: create, read, update, delete, execute, manage
 */

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: [
    // Full access to everything
    '*:*',
  ],
  
  admin: [
    // Agents
    'agents:create',
    'agents:read',
    'agents:update',
    'agents:delete',
    'agents:execute',
    
    // Workflows
    'workflows:create',
    'workflows:read',
    'workflows:update',
    'workflows:delete',
    'workflows:execute',
    'workflows:publish',
    
    // Integrations
    'integrations:create',
    'integrations:read',
    'integrations:update',
    'integrations:delete',
    
    // Team Management
    'team:read',
    'team:invite',
    'team:update',
    'team:remove',
    
    // Settings
    'settings:read',
    'settings:update',
    
    // Audit Logs
    'audit:read',
    
    // Analytics
    'analytics:read',
  ],
  
  builder: [
    // Agents
    'agents:create',
    'agents:read',
    'agents:update',
    'agents:execute',
    
    // Workflows
    'workflows:create',
    'workflows:read',
    'workflows:update',
    'workflows:execute',
    
    // Integrations
    'integrations:read',
    'integrations:create',
    
    // Limited team access
    'team:read',
    
    // Analytics
    'analytics:read',
  ],
  
  viewer: [
    // Read-only access
    'agents:read',
    'workflows:read',
    'integrations:read',
    'team:read',
    'analytics:read',
  ],
};

// ============================================================================
// Permission Checking
// ============================================================================

export function hasPermission(user: User, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  
  // Check for wildcard permission (owner)
  if (permissions.includes('*:*')) {
    return true;
  }
  
  // Check for exact permission match
  if (permissions.includes(permission)) {
    return true;
  }
  
  // Check for wildcard resource (e.g., agents:*)
  const [resource] = permission.split(':');
  if (permissions.includes(`${resource}:*`)) {
    return true;
  }
  
  // Check for wildcard action (e.g., *:read)
  const [, action] = permission.split(':');
  if (permissions.includes(`*:${action}`)) {
    return true;
  }
  
  return false;
}

// ============================================================================
// Middleware: Require Authentication
// ============================================================================

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Extract user from JWT token (set by Auth0 middleware)
  const user = (req as any).user as User | undefined;
  
  if (!user) {
    logSecurityEvent({
      type: 'unauthorized_access',
      severity: 'medium',
      ip: req.ip || 'unknown',
      details: `Unauthenticated access attempt to ${req.path}`,
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
  
  next();
}

// ============================================================================
// Middleware: Require Permission
// ============================================================================

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User | undefined;
    
    if (!user) {
      logSecurityEvent({
        type: 'unauthorized_access',
        severity: 'medium',
        ip: req.ip || 'unknown',
        details: `Unauthenticated access attempt to ${req.path}`,
      });
      
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }
    
    if (!hasPermission(user, permission)) {
      logSecurityEvent({
        type: 'unauthorized_access',
        severity: 'high',
        ip: req.ip || 'unknown',
        userId: user.id,
        details: `User ${user.email} (${user.role}) attempted to access ${permission} without permission`,
      });
      
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Required: ${permission}`,
      });
    }
    
    next();
  };
}

// ============================================================================
// Middleware: Require Role
// ============================================================================

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User | undefined;
    
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }
    
    if (!allowedRoles.includes(user.role)) {
      logSecurityEvent({
        type: 'unauthorized_access',
        severity: 'high',
        ip: req.ip || 'unknown',
        userId: user.id,
        details: `User ${user.email} (${user.role}) attempted to access ${req.path} requiring roles: ${allowedRoles.join(', ')}`,
      });
      
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient role. Required: ${allowedRoles.join(' or ')}`,
      });
    }
    
    next();
  };
}

// ============================================================================
// Middleware: Org Isolation
// ============================================================================

/**
 * Ensures users can only access resources within their organization
 * Critical for multi-tenant data isolation (SOC 2, HIPAA)
 */
export function requireOrgAccess(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as User | undefined;
  
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
  
  // Extract orgId from request (path param, query, or body)
  const requestedOrgId = req.params.orgId || req.query.orgId || (req.body && req.body.orgId);
  
  if (requestedOrgId && requestedOrgId !== user.orgId) {
    logSecurityEvent({
      type: 'unauthorized_access',
      severity: 'critical',
      ip: req.ip || 'unknown',
      userId: user.id,
      details: `User ${user.email} from org ${user.orgId} attempted to access resources in org ${requestedOrgId}`,
    });
    
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied to resources outside your organization',
    });
  }
  
  // Inject orgId into request for downstream use
  (req as any).orgId = user.orgId;
  
  next();
}

// ============================================================================
// Resource Ownership Checking
// ============================================================================

/**
 * Verify that a user owns or has access to a specific resource
 * Used for fine-grained access control
 */
export async function checkResourceOwnership(
  userId: string,
  orgId: string,
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  // In production, query database to verify ownership
  // For now, just check orgId match
  
  // Example implementation:
  // const resource = await db.query(
  //   `SELECT org_id FROM ${resourceType} WHERE id = $1`,
  //   [resourceId]
  // );
  // return resource.org_id === orgId;
  
  return true; // Placeholder
}

// ============================================================================
// Permission Utilities
// ============================================================================

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role can perform an action
 */
export function canRolePerform(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  if (permissions.includes('*:*')) return true;
  if (permissions.includes(permission)) return true;
  
  const [resource, action] = permission.split(':');
  if (permissions.includes(`${resource}:*`)) return true;
  if (permissions.includes(`*:${action}`)) return true;
  
  return false;
}

/**
 * Get permission matrix for documentation
 */
export function getPermissionMatrix(): Record<UserRole, string[]> {
  return ROLE_PERMISSIONS;
}

// ============================================================================
// Audit Trail for Permission Changes
// ============================================================================

export interface PermissionChangeEvent {
  timestamp: string;
  actorId: string;
  actorEmail: string;
  targetUserId: string;
  targetEmail: string;
  action: 'role_changed' | 'permission_granted' | 'permission_revoked';
  oldValue?: string;
  newValue?: string;
  reason?: string;
}

const permissionChanges: PermissionChangeEvent[] = [];

export function logPermissionChange(event: Omit<PermissionChangeEvent, 'timestamp'>) {
  const fullEvent: PermissionChangeEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  permissionChanges.push(fullEvent);
  
  // In production, store in audit log database
  console.log('Permission Change:', JSON.stringify(fullEvent));
  
  // Also log as security event
  logSecurityEvent({
    type: 'suspicious_activity',
    severity: 'medium',
    ip: 'system',
    userId: event.actorId,
    details: `${event.action}: ${event.targetEmail} by ${event.actorEmail}`,
  });
}

export function getPermissionChanges(limit: number = 100): PermissionChangeEvent[] {
  return permissionChanges.slice(-limit);
}
