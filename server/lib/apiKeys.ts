import crypto from 'crypto';
import { logSecurityEvent } from '../middleware/security';

/**
 * API Key Management System
 * 
 * Implements secure API key generation, hashing, validation, and rotation
 * Required for SOC 2 and HIPAA compliance
 * 
 * Security Features:
 * - Cryptographically secure random generation
 * - PBKDF2 hashing with salt
 * - Automatic expiration
 * - Usage tracking
 * - Rotation policies
 */

// ============================================================================
// Types
// ============================================================================

export interface ApiKey {
  id: string;
  name: string;
  orgId: string;
  userId: string;
  keyHash: string;
  salt: string;
  prefix: string; // First 8 chars for identification (e.g., "bk_live_")
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  usageCount: number;
  status: 'active' | 'revoked' | 'expired';
  revokedAt: string | null;
  revokedBy: string | null;
  revokedReason: string | null;
}

export interface ApiKeyCreateParams {
  name: string;
  orgId: string;
  userId: string;
  scopes: string[];
  expiresInDays?: number; // null = never expires
}

export interface ApiKeyValidationResult {
  valid: boolean;
  apiKey?: ApiKey;
  reason?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const API_KEY_LENGTH = 32; // bytes (64 hex chars)
const SALT_LENGTH = 16; // bytes
const HASH_ITERATIONS = 100000; // PBKDF2 iterations
const HASH_ALGORITHM = 'sha256';
const DEFAULT_EXPIRY_DAYS = 90; // 90 days default expiration

// In-memory store (in production, use database)
const apiKeyStore = new Map<string, ApiKey>();

// ============================================================================
// API Key Generation
// ============================================================================

/**
 * Generate a new API key with secure random bytes
 * Format: bk_live_<random_64_chars>
 */
export function generateApiKey(environment: 'live' | 'test' = 'live'): string {
  const randomBytes = crypto.randomBytes(API_KEY_LENGTH);
  const keyBody = randomBytes.toString('hex');
  const prefix = `bk_${environment}_`;
  return `${prefix}${keyBody}`;
}

/**
 * Hash an API key using PBKDF2
 */
function hashApiKey(apiKey: string, salt: Buffer): string {
  return crypto
    .pbkdf2Sync(apiKey, salt, HASH_ITERATIONS, 64, HASH_ALGORITHM)
    .toString('hex');
}

/**
 * Extract prefix from API key for identification
 */
function extractPrefix(apiKey: string): string {
  return apiKey.substring(0, 8);
}

// ============================================================================
// API Key Creation
// ============================================================================

/**
 * Create a new API key
 * Returns the plaintext key (only shown once) and metadata
 */
export async function createApiKey(
  params: ApiKeyCreateParams
): Promise<{ apiKey: ApiKey; plaintextKey: string }> {
  const plaintextKey = generateApiKey('live');
  const salt = crypto.randomBytes(SALT_LENGTH);
  const keyHash = hashApiKey(plaintextKey, salt);
  const prefix = extractPrefix(plaintextKey);
  
  const expiresAt = params.expiresInDays
    ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;
  
  const apiKey: ApiKey = {
    id: crypto.randomUUID(),
    name: params.name,
    orgId: params.orgId,
    userId: params.userId,
    keyHash,
    salt: salt.toString('hex'),
    prefix,
    scopes: params.scopes,
    createdAt: new Date().toISOString(),
    expiresAt,
    lastUsedAt: null,
    usageCount: 0,
    status: 'active',
    revokedAt: null,
    revokedBy: null,
    revokedReason: null,
  };
  
  // Store in database (using Map for now)
  apiKeyStore.set(apiKey.id, apiKey);
  
  // Log security event
  logSecurityEvent({
    type: 'suspicious_activity',
    severity: 'low',
    ip: 'system',
    userId: params.userId,
    details: `API key created: ${apiKey.name} (${apiKey.id})`,
  });
  
  return { apiKey, plaintextKey };
}

// ============================================================================
// API Key Validation
// ============================================================================

/**
 * Validate an API key
 * Returns validation result with key metadata if valid
 */
export async function validateApiKey(
  plaintextKey: string
): Promise<ApiKeyValidationResult> {
  const prefix = extractPrefix(plaintextKey);
  
  // Find all keys with matching prefix
  const matchingKeys = Array.from(apiKeyStore.values()).filter(
    (key) => key.prefix === prefix && key.status === 'active'
  );
  
  if (matchingKeys.length === 0) {
    logSecurityEvent({
      type: 'auth_failure',
      severity: 'medium',
      ip: 'unknown',
      details: `Invalid API key prefix: ${prefix}`,
    });
    
    return { valid: false, reason: 'Invalid API key' };
  }
  
  // Try to match hash
  for (const key of matchingKeys) {
    const salt = Buffer.from(key.salt, 'hex');
    const hash = hashApiKey(plaintextKey, salt);
    
    if (hash === key.keyHash) {
      // Check expiration
      if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
        key.status = 'expired';
        apiKeyStore.set(key.id, key);
        
        logSecurityEvent({
          type: 'auth_failure',
          severity: 'low',
          ip: 'unknown',
          details: `Expired API key used: ${key.name} (${key.id})`,
        });
        
        return { valid: false, reason: 'API key expired' };
      }
      
      // Update usage stats
      key.lastUsedAt = new Date().toISOString();
      key.usageCount++;
      apiKeyStore.set(key.id, key);
      
      return { valid: true, apiKey: key };
    }
  }
  
  logSecurityEvent({
    type: 'auth_failure',
    severity: 'medium',
    ip: 'unknown',
    details: `Invalid API key hash for prefix: ${prefix}`,
  });
  
  return { valid: false, reason: 'Invalid API key' };
}

// ============================================================================
// API Key Revocation
// ============================================================================

/**
 * Revoke an API key
 */
export async function revokeApiKey(
  keyId: string,
  revokedBy: string,
  reason: string
): Promise<boolean> {
  const apiKey = apiKeyStore.get(keyId);
  
  if (!apiKey) {
    return false;
  }
  
  apiKey.status = 'revoked';
  apiKey.revokedAt = new Date().toISOString();
  apiKey.revokedBy = revokedBy;
  apiKey.revokedReason = reason;
  
  apiKeyStore.set(keyId, apiKey);
  
  logSecurityEvent({
    type: 'suspicious_activity',
    severity: 'medium',
    ip: 'system',
    userId: revokedBy,
    details: `API key revoked: ${apiKey.name} (${keyId}). Reason: ${reason}`,
  });
  
  return true;
}

// ============================================================================
// API Key Rotation
// ============================================================================

/**
 * Rotate an API key (create new, revoke old)
 */
export async function rotateApiKey(
  oldKeyId: string,
  rotatedBy: string
): Promise<{ apiKey: ApiKey; plaintextKey: string } | null> {
  const oldKey = apiKeyStore.get(oldKeyId);
  
  if (!oldKey) {
    return null;
  }
  
  // Create new key with same params
  const newKeyResult = await createApiKey({
    name: `${oldKey.name} (Rotated)`,
    orgId: oldKey.orgId,
    userId: oldKey.userId,
    scopes: oldKey.scopes,
    expiresInDays: DEFAULT_EXPIRY_DAYS,
  });
  
  // Revoke old key
  await revokeApiKey(oldKeyId, rotatedBy, 'Key rotation');
  
  logSecurityEvent({
    type: 'suspicious_activity',
    severity: 'low',
    ip: 'system',
    userId: rotatedBy,
    details: `API key rotated: ${oldKey.name} (${oldKeyId}) -> ${newKeyResult.apiKey.id}`,
  });
  
  return newKeyResult;
}

// ============================================================================
// API Key Listing
// ============================================================================

/**
 * List all API keys for an organization
 * Returns sanitized data (no hashes or salts)
 */
export async function listApiKeys(orgId: string): Promise<Omit<ApiKey, 'keyHash' | 'salt'>[]> {
  const keys = Array.from(apiKeyStore.values())
    .filter((key) => key.orgId === orgId)
    .map((key) => {
      const { keyHash, salt, ...sanitized } = key;
      return sanitized;
    });
  
  return keys;
}

/**
 * Get API key by ID (sanitized)
 */
export async function getApiKey(keyId: string): Promise<Omit<ApiKey, 'keyHash' | 'salt'> | null> {
  const key = apiKeyStore.get(keyId);
  
  if (!key) {
    return null;
  }
  
  const { keyHash, salt, ...sanitized } = key;
  return sanitized;
}

// ============================================================================
// API Key Expiration Checking
// ============================================================================

/**
 * Check for expired keys and mark them
 * Should be run periodically (e.g., daily cron job)
 */
export async function checkExpiredKeys(): Promise<number> {
  let expiredCount = 0;
  const now = new Date();
  
  for (const [id, key] of apiKeyStore.entries()) {
    if (
      key.status === 'active' &&
      key.expiresAt &&
      new Date(key.expiresAt) < now
    ) {
      key.status = 'expired';
      apiKeyStore.set(id, key);
      expiredCount++;
      
      logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'low',
        ip: 'system',
        details: `API key expired: ${key.name} (${id})`,
      });
    }
  }
  
  return expiredCount;
}

// ============================================================================
// API Key Scope Validation
// ============================================================================

/**
 * Check if an API key has a specific scope
 */
export function hasScope(apiKey: ApiKey, requiredScope: string): boolean {
  // Wildcard scope
  if (apiKey.scopes.includes('*')) {
    return true;
  }
  
  // Exact match
  if (apiKey.scopes.includes(requiredScope)) {
    return true;
  }
  
  // Wildcard resource (e.g., agents:*)
  const [resource] = requiredScope.split(':');
  if (apiKey.scopes.includes(`${resource}:*`)) {
    return true;
  }
  
  return false;
}

// ============================================================================
// API Key Statistics
// ============================================================================

export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  expiringIn30Days: number;
}

/**
 * Get API key statistics for an organization
 */
export async function getApiKeyStats(orgId: string): Promise<ApiKeyStats> {
  const keys = Array.from(apiKeyStore.values()).filter(
    (key) => key.orgId === orgId
  );
  
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return {
    total: keys.length,
    active: keys.filter((k) => k.status === 'active').length,
    expired: keys.filter((k) => k.status === 'expired').length,
    revoked: keys.filter((k) => k.status === 'revoked').length,
    expiringIn30Days: keys.filter(
      (k) =>
        k.status === 'active' &&
        k.expiresAt &&
        new Date(k.expiresAt) < in30Days
    ).length,
  };
}

// ============================================================================
// Cleanup
// ============================================================================

/**
 * Delete old revoked/expired keys (after retention period)
 * HIPAA requires 7 years retention for audit purposes
 */
export async function cleanupOldKeys(retentionDays: number = 2555): Promise<number> {
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  let deletedCount = 0;
  
  for (const [id, key] of apiKeyStore.entries()) {
    if (
      (key.status === 'revoked' || key.status === 'expired') &&
      new Date(key.revokedAt || key.expiresAt || key.createdAt) < cutoffDate
    ) {
      apiKeyStore.delete(id);
      deletedCount++;
    }
  }
  
  return deletedCount;
}
