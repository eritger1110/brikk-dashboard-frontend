import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { agents, auditLogs } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Agents Router
 * 
 * Handles agent management with RBAC enforcement:
 * - list: viewer+ can list agents in their org
 * - get: viewer+ can get agent details
 * - create: builder+ can create agents
 * - update: builder+ can update agents
 * - delete: admin+ can delete agents
 * - pause/resume: builder+ can control agent status
 */

export const agentsRouter = router({
  /**
   * List all agents for the current organization
   */
  list: publicProcedure
    .input(z.object({
      status: z.enum(["active", "paused", "error", "all"]).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const { status, limit, offset } = input;
      const orgId = ctx.user.organizationId;

      const conditions = [eq(agents.organizationId, orgId)];
      if (status && status !== "all") {
        conditions.push(eq(agents.status, status));
      }

      const results = await db
        .select()
        .from(agents)
        .where(and(...conditions))
        .orderBy(desc(agents.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        agents: results,
        total: results.length,
      };
    }),

  /**
   * Get a single agent by ID
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

      const result = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.organizationId, ctx.user.organizationId)
          )
        )
        .limit(1);

      if (result.length === 0) {
        throw new Error("Agent not found");
      }

      return result[0];
    }),

  /**
   * Create a new agent
   * Requires: builder+ role
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      type: z.string(),
      config: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only builder+ can create agents
      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const agentId = nanoid();
      const now = new Date();

      await db.insert(agents).values({
        id: agentId,
        organizationId: ctx.user.organizationId,
        name: input.name,
        description: input.description,
        status: "active",
        config: input.config || {},
        createdAt: now,
        updatedAt: now,
      });

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "agent.created",
        resourceType: "agent",
        resourceId: agentId,
        details: { name: input.name },
        createdAt: now,
      });

      return { id: agentId, success: true };
    }),

  /**
   * Update an existing agent
   * Requires: builder+ role
   */
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      config: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only builder+ can update agents
      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const { id, ...updates } = input;

      await db
        .update(agents)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(agents.id, id),
            eq(agents.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "agent.updated",
        resourceType: "agent",
        resourceId: id,
        details: updates,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Pause an agent
   * Requires: builder+ role
   */
  pause: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only builder+ can pause agents
      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      await db
        .update(agents)
        .set({
          status: "paused",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "agent.paused",
        resourceType: "agent",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Resume a paused agent
   * Requires: builder+ role
   */
  resume: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only builder+ can resume agents
      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      await db
        .update(agents)
        .set({
          status: "active",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "agent.resumed",
        resourceType: "agent",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Delete an agent
   * Requires: admin+ role
   */
  delete: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can delete agents
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      await db
        .delete(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "agent.deleted",
        resourceType: "agent",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),
});
