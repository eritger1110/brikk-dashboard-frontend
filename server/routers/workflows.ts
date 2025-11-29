import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { workflows, auditLogs } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Workflows Router
 * 
 * Handles workflow/BrikkFlow management with RBAC enforcement
 */

export const workflowsRouter = router({
  /**
   * List all workflows for the current organization
   */
  list: publicProcedure
    .input(z.object({
      status: z.enum(["draft", "active", "paused", "archived", "all"]).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const { status, limit, offset } = input;
      const conditions = [eq(workflows.organizationId, ctx.user.organizationId)];
      
      if (status && status !== "all") {
        conditions.push(eq(workflows.status, status));
      }

      const results = await db
        .select()
        .from(workflows)
        .where(and(...conditions))
        .orderBy(desc(workflows.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        workflows: results,
        total: results.length,
      };
    }),

  /**
   * Get a single workflow by ID
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
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.organizationId, ctx.user.organizationId)
          )
        )
        .limit(1);

      if (result.length === 0) {
        throw new Error("Workflow not found");
      }

      return result[0];
    }),

  /**
   * Create a new workflow
   * Requires: builder+ role
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      config: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const workflowId = nanoid();
      const now = new Date();

      await db.insert(workflows).values({
        id: workflowId,
        organizationId: ctx.user.organizationId,
        name: input.name,
        description: input.description,
        config: input.config || { nodes: [], edges: [] },
        status: "draft",
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "workflow.created",
        resourceType: "workflow",
        resourceId: workflowId,
        details: { name: input.name },
        createdAt: now,
      });

      return { id: workflowId, success: true };
    }),

  /**
   * Update an existing workflow
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

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const { id, ...updates } = input;

      await db
        .update(workflows)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(workflows.id, id),
            eq(workflows.organizationId, ctx.user.organizationId)
          )
        );

      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "workflow.updated",
        resourceType: "workflow",
        resourceId: id,
        details: updates,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Publish a workflow (change status from draft to active)
   * Requires: builder+ role
   */
  publish: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      await db
        .update(workflows)
        .set({
          status: "active",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.organizationId, ctx.user.organizationId)
          )
        );

      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "workflow.published",
        resourceType: "workflow",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Pause a workflow
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

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      await db
        .update(workflows)
        .set({
          status: "paused",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.organizationId, ctx.user.organizationId)
          )
        );

      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "workflow.paused",
        resourceType: "workflow",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Duplicate a workflow
   * Requires: builder+ role
   */
  duplicate: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      // Get original workflow
      const original = await db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.organizationId, ctx.user.organizationId)
          )
        )
        .limit(1);

      if (original.length === 0) {
        throw new Error("Workflow not found");
      }

      const newId = nanoid();
      const now = new Date();

      await db.insert(workflows).values({
        id: newId,
        organizationId: ctx.user.organizationId,
        name: `${original[0].name} (Copy)`,
        description: original[0].description,
        config: original[0].config,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "workflow.duplicated",
        resourceType: "workflow",
        resourceId: newId,
        details: { originalId: input.id },
        createdAt: now,
      });

      return { id: newId, success: true };
    }),

  /**
   * Delete a workflow
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

      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      await db
        .delete(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.organizationId, ctx.user.organizationId)
          )
        );

      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "workflow.deleted",
        resourceType: "workflow",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),
});
