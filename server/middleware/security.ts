import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Security Middleware for SOC 2 and HIPAA Compliance
 * 
 * Implements:
 * - Security headers (CSP, HSTS, etc.)
 * - Rate limiting
 * - Request validation
 * - Audit logging
 * - CORS configuration
 */

// ============================================================================
// Security Headers Middleware
// ============================================================================

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Content Security Policy - Prevent XSS attacks
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.auth0.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.auth0.com https://api.stripe.com https://*.railway.app",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // HTTP Strict Transport Security - Force HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS Protection (legacy, but still useful)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy - Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - Control browser features
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(self)'
  );

  // Remove X-Powered-By header (security through obscurity)
  res.removeHeader('X-Powered-By');

  // Add security-related response headers
  res.setHeader('X-Request-ID', crypto.randomUUID());

  next();
}

// ============================================================================
// Rate Limiting Middleware
// ============================================================================

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    const record = rateLimitStore.get(identifier);
    
    if (!record || now > record.resetTime) {
      // New window or expired window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      
      res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', (config.maxRequests - 1).toString());
      res.setHeader('X-RateLimit-Reset', new Date(now + config.windowMs).toISOString());
      
      return next();
    }
    
    if (record.count >= config.maxRequests) {
      // Rate limit exceeded
      res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString());
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: config.message || 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }
    
    // Increment counter
    record.count++;
    rateLimitStore.set(identifier, record);
    
    res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (config.maxRequests - record.count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
    
    next();
  };
}

// Clean up expired rate limit records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ============================================================================
// Audit Logging Middleware
// ============================================================================

export interface AuditLogEntry {
  timestamp: string;
  requestId: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  userId?: string;
  orgId?: string;
  statusCode?: number;
  duration?: number;
  error?: string;
}

const auditLogs: AuditLogEntry[] = [];

export function auditLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  // Attach request ID to request object
  (req as any).requestId = requestId;
  
  // Create audit log entry
  const logEntry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.get('user-agent') || 'unknown',
    // userId and orgId would be extracted from JWT token
  };
  
  // Capture response
  const originalSend = res.send;
  res.send = function (data: any) {
    logEntry.statusCode = res.statusCode;
    logEntry.duration = Date.now() - startTime;
    
    // Log errors
    if (res.statusCode >= 400) {
      logEntry.error = typeof data === 'string' ? data : JSON.stringify(data);
    }
    
    // Store audit log (in production, send to centralized logging)
    auditLogs.push(logEntry);
    
    // Keep only last 10,000 logs in memory
    if (auditLogs.length > 10000) {
      auditLogs.shift();
    }
    
    // In production, send to logging service (e.g., CloudWatch, Datadog)
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}

// Export audit logs for compliance reporting
export function getAuditLogs(limit: number = 100): AuditLogEntry[] {
  return auditLogs.slice(-limit);
}

// ============================================================================
// Input Validation Middleware
// ============================================================================

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        // Remove potentially dangerous characters
        req.query[key] = (req.query[key] as string)
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim();
      }
    }
  }
  
  // Sanitize body (if JSON)
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  next();
}

function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// ============================================================================
// CORS Configuration
// ============================================================================

export function corsConfig(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://brikk-rules-dashboard.netlify.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean);
  
  const origin = req.get('origin');
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
}

// ============================================================================
// Request Size Limiting
// ============================================================================

export function requestSizeLimit(maxSizeBytes: number = 10 * 1024 * 1024) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('content-length') || '0', 10);
    
    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: `Request body exceeds maximum size of ${maxSizeBytes} bytes`,
      });
    }
    
    next();
  };
}

// ============================================================================
// Security Event Logging
// ============================================================================

export interface SecurityEvent {
  timestamp: string;
  type: 'auth_failure' | 'rate_limit' | 'invalid_token' | 'suspicious_activity' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userId?: string;
  details: string;
}

const securityEvents: SecurityEvent[] = [];

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  securityEvents.push(fullEvent);
  
  // Keep only last 1,000 security events
  if (securityEvents.length > 1000) {
    securityEvents.shift();
  }
  
  // In production, send to SIEM (Security Information and Event Management)
  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(fullEvent));
  }
  
  // Alert on critical events
  if (event.severity === 'critical') {
    // In production, send to alerting service (PagerDuty, Slack, etc.)
    console.error('🚨 CRITICAL SECURITY EVENT:', fullEvent);
  }
}

export function getSecurityEvents(limit: number = 100): SecurityEvent[] {
  return securityEvents.slice(-limit);
}
