import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { auditLogs, securityEvents } from "../../drizzle/schema";
import { eq, and, desc, gte, lte, like } from "drizzle-orm";

/**
 * Audit Logs Router
 * 
 * Provides compliance audit trail and security event tracking
 * Required for SOC 2 and HIPAA compliance
 */

export const auditLogsRouter = router({
  /**
   * List audit logs with filtering
   * Requires: admin+ role (compliance requirement)
   */
  list: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      action: z.string().optional(),
      resourceType: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().min(1).max(1000).default(100),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can view audit logs
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const conditions = [
        eq(auditLogs.organizationId, ctx.user.organizationId),
      ];

      if (input.userId) {
        conditions.push(eq(auditLogs.userId, input.userId));
      }

      if (input.action) {
        conditions.push(like(auditLogs.action, `%${input.action}%`));
      }

      if (input.resourceType) {
        conditions.push(eq(auditLogs.resourceType, input.resourceType));
      }

      if (input.startDate) {
        conditions.push(gte(auditLogs.createdAt, new Date(input.startDate)));
      }

      if (input.endDate) {
        conditions.push(lte(auditLogs.createdAt, new Date(input.endDate)));
      }

      const results = await db
        .select()
        .from(auditLogs)
        .where(and(...conditions))
        .orderBy(desc(auditLogs.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        logs: results,
        total: results.length,
      };
    }),

  /**
   * Get a single audit log entry
   * Requires: admin+ role
   */
  get: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can view audit logs
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const result = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.id, input.id),
            eq(auditLogs.organizationId, ctx.user.organizationId)
          )
        )
        .limit(1);

      if (result.length === 0) {
        throw new Error("Audit log not found");
      }

      return result[0];
    }),

  /**
   * List security events
   * Requires: admin+ role
   */
  securityEvents: publicProcedure
    .input(z.object({
      severity: z.enum(["low", "medium", "high", "critical", "all"]).default("all"),
      eventType: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().min(1).max(1000).default(100),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can view security events
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const conditions = [];

      if (input.severity !== "all") {
        conditions.push(eq(securityEvents.severity, input.severity));
      }

      if (input.eventType) {
        conditions.push(eq(securityEvents.eventType, input.eventType));
      }

      if (input.startDate) {
        conditions.push(gte(securityEvents.timestamp, new Date(input.startDate)));
      }

      if (input.endDate) {
        conditions.push(lte(securityEvents.timestamp, new Date(input.endDate)));
      }

      const results = await db
        .select()
        .from(securityEvents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(securityEvents.timestamp))
        .limit(input.limit)
        .offset(input.offset);

      return {
        events: results,
        total: results.length,
      };
    }),

  /**
   * Get audit statistics
   * Requires: admin+ role
   */
  stats: publicProcedure
    .input(z.object({
      period: z.enum(["24h", "7d", "30d"]).default("7d"),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can view audit stats
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const now = new Date();
      const periodHours = input.period === "24h" ? 24 : input.period === "7d" ? 168 : 720;
      const startDate = new Date(now.getTime() - periodHours * 60 * 60 * 1000);

      const logs = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.organizationId, ctx.user.organizationId),
            gte(auditLogs.createdAt, startDate)
          )
        );

      const events = await db
        .select()
        .from(securityEvents)
        .where(gte(securityEvents.timestamp, startDate));

      // Group by action type
      const actionCounts: Record<string, number> = {};
      logs.forEach(log => {
        const action = log.action;
        actionCounts[action] = (actionCounts[action] || 0) + 1;
      });

      // Group by severity
      const severityCounts: Record<string, number> = {};
      events.forEach(event => {
        const severity = event.severity || "unknown";
        severityCounts[severity] = (severityCounts[severity] || 0) + 1;
      });

      return {
        period: input.period,
        totalAuditLogs: logs.length,
        totalSecurityEvents: events.length,
        actionCounts,
        severityCounts,
        uniqueUsers: new Set(logs.map(l => l.userId).filter(Boolean)).size,
        criticalEvents: events.filter(e => e.severity === "critical").length,
      };
    }),
});
