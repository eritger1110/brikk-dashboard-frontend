import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { agentAnalyticsDaily, userAnalyticsDaily, agentUsageEvents, usageLedger } from "../../drizzle/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

/**
 * Analytics Router
 * 
 * Provides usage metrics, performance data, and cost tracking
 */

export const analyticsRouter = router({
  /**
   * Get agent analytics for a date range
   */
  agentMetrics: publicProcedure
    .input(z.object({
      agentId: z.string().optional(),
      startDate: z.string(), // ISO date
      endDate: z.string(),   // ISO date
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const conditions = [
        gte(agentAnalyticsDaily.date, new Date(input.startDate)),
        lte(agentAnalyticsDaily.date, new Date(input.endDate)),
      ];

      if (input.agentId) {
        conditions.push(eq(agentAnalyticsDaily.agentId, input.agentId));
      }

      const results = await db
        .select()
        .from(agentAnalyticsDaily)
        .where(and(...conditions))
        .orderBy(desc(agentAnalyticsDaily.date));

      return {
        metrics: results,
        total: results.length,
      };
    }),

  /**
   * Get user analytics for a date range
   */
  userMetrics: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const conditions = [
        gte(userAnalyticsDaily.date, new Date(input.startDate)),
        lte(userAnalyticsDaily.date, new Date(input.endDate)),
      ];

      if (input.userId) {
        conditions.push(eq(userAnalyticsDaily.userId, input.userId));
      }

      const results = await db
        .select()
        .from(userAnalyticsDaily)
        .where(and(...conditions))
        .orderBy(desc(userAnalyticsDaily.date));

      return {
        metrics: results,
        total: results.length,
      };
    }),

  /**
   * Get recent agent usage events
   */
  recentEvents: publicProcedure
    .input(z.object({
      agentId: z.string().optional(),
      limit: z.number().min(1).max(1000).default(100),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const conditions = [
        eq(agentUsageEvents.organizationId, ctx.user.organizationId),
      ];

      if (input.agentId) {
        conditions.push(eq(agentUsageEvents.agentId, input.agentId));
      }

      const results = await db
        .select()
        .from(agentUsageEvents)
        .where(and(...conditions))
        .orderBy(desc(agentUsageEvents.createdAt))
        .limit(input.limit);

      return {
        events: results,
        total: results.length,
      };
    }),

  /**
   * Get cost tracking data
   */
  costs: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      resourceType: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const conditions = [
        eq(usageLedger.organizationId, ctx.user.organizationId),
        gte(usageLedger.createdAt, new Date(input.startDate)),
        lte(usageLedger.createdAt, new Date(input.endDate)),
      ];

      if (input.resourceType) {
        conditions.push(eq(usageLedger.resourceType, input.resourceType));
      }

      const results = await db
        .select()
        .from(usageLedger)
        .where(and(...conditions))
        .orderBy(desc(usageLedger.createdAt));

      // Calculate total cost
      const totalCost = results.reduce((sum, item) => {
        const cost = item.cost ? parseFloat(item.cost.toString()) : 0;
        return sum + cost;
      }, 0);

      return {
        costs: results,
        totalCost,
        total: results.length,
      };
    }),

  /**
   * Get overview statistics
   */
  overview: publicProcedure
    .input(z.object({
      period: z.enum(["24h", "7d", "30d"]).default("7d"),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const now = new Date();
      const periodHours = input.period === "24h" ? 24 : input.period === "7d" ? 168 : 720;
      const startDate = new Date(now.getTime() - periodHours * 60 * 60 * 1000);

      // Get agent usage events for the period
      const events = await db
        .select()
        .from(agentUsageEvents)
        .where(
          and(
            eq(agentUsageEvents.organizationId, ctx.user.organizationId),
            gte(agentUsageEvents.createdAt, startDate)
          )
        );

      const totalInvocations = events.length;
      const successfulInvocations = events.filter(e => e.success).length;
      const failedInvocations = totalInvocations - successfulInvocations;
      const successRate = totalInvocations > 0 ? (successfulInvocations / totalInvocations) * 100 : 0;

      // Get cost data
      const costs = await db
        .select()
        .from(usageLedger)
        .where(
          and(
            eq(usageLedger.organizationId, ctx.user.organizationId),
            gte(usageLedger.createdAt, startDate)
          )
        );

      const totalCost = costs.reduce((sum, item) => {
        const cost = item.cost ? parseFloat(item.cost.toString()) : 0;
        return sum + cost;
      }, 0);

      return {
        period: input.period,
        totalInvocations,
        successfulInvocations,
        failedInvocations,
        successRate: Math.round(successRate * 100) / 100,
        totalCost,
        uniqueAgents: new Set(events.map(e => e.agentId)).size,
        uniqueUsers: new Set(events.map(e => e.userId).filter(Boolean)).size,
      };
    }),
});
