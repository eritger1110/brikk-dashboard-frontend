import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { marketplaceAgents, installedAgents, agentInstallations, auditLogs } from "../../drizzle/schema";
import { eq, and, desc, like, or } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Marketplace Router
 * 
 * Handles marketplace agent browsing and installation
 */

export const marketplaceRouter = router({
  /**
   * List marketplace agents with filtering
   */
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      status: z.enum(["available", "deprecated", "all"]).default("available"),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database unavailable");
      }

      const { category, search, status, limit, offset } = input;
      const conditions = [];

      if (status !== "all") {
        conditions.push(eq(marketplaceAgents.status, status));
      }

      if (category) {
        conditions.push(eq(marketplaceAgents.category, category));
      }

      if (search) {
        conditions.push(
          or(
            like(marketplaceAgents.name, `%${search}%`),
            like(marketplaceAgents.description, `%${search}%`)
          )!
        );
      }

      const results = await db
        .select()
        .from(marketplaceAgents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(marketplaceAgents.installs))
        .limit(limit)
        .offset(offset);

      return {
        agents: results,
        total: results.length,
      };
    }),

  /**
   * Get a single marketplace agent by ID
   */
  get: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database unavailable");
      }

      const result = await db
        .select()
        .from(marketplaceAgents)
        .where(eq(marketplaceAgents.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new Error("Agent not found");
      }

      return result[0];
    }),

  /**
   * Install a marketplace agent
   * Requires: builder+ role
   */
  install: publicProcedure
    .input(z.object({
      agentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      // Check if already installed
      const existing = await db
        .select()
        .from(agentInstallations)
        .where(
          and(
            eq(agentInstallations.organizationId, ctx.user.organizationId),
            eq(agentInstallations.marketplaceAgentId, input.agentId)
          )
        )
        .limit(1);

      if (existing.length > 0 && !existing[0].uninstalledAt) {
        throw new Error("Agent already installed");
      }

      const installId = nanoid();
      const now = new Date();

      await db.insert(agentInstallations).values({
        id: installId,
        organizationId: ctx.user.organizationId,
        marketplaceAgentId: input.agentId,
        installedAt: now,
        uninstalledAt: null,
      });

      // Increment install count
      const agent = await db
        .select()
        .from(marketplaceAgents)
        .where(eq(marketplaceAgents.id, input.agentId))
        .limit(1);

      if (agent.length > 0) {
        await db
          .update(marketplaceAgents)
          .set({
            installs: (agent[0].installs || 0) + 1,
            updatedAt: now,
          })
          .where(eq(marketplaceAgents.id, input.agentId));
      }

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "marketplace.agent.installed",
        resourceType: "marketplace_agent",
        resourceId: input.agentId,
        createdAt: now,
      });

      return { id: installId, success: true };
    }),

  /**
   * Uninstall a marketplace agent
   * Requires: builder+ role
   */
  uninstall: publicProcedure
    .input(z.object({
      agentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      if (!["builder", "admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const now = new Date();

      await db
        .update(agentInstallations)
        .set({
          uninstalledAt: now,
        })
        .where(
          and(
            eq(agentInstallations.organizationId, ctx.user.organizationId),
            eq(agentInstallations.marketplaceAgentId, input.agentId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "marketplace.agent.uninstalled",
        resourceType: "marketplace_agent",
        resourceId: input.agentId,
        createdAt: now,
      });

      return { success: true };
    }),

  /**
   * List installed agents for current organization
   */
  installed: publicProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const results = await db
        .select({
          installation: agentInstallations,
          agent: marketplaceAgents,
        })
        .from(agentInstallations)
        .leftJoin(
          marketplaceAgents,
          eq(agentInstallations.marketplaceAgentId, marketplaceAgents.id)
        )
        .where(
          and(
            eq(agentInstallations.organizationId, ctx.user.organizationId),
            eq(agentInstallations.uninstalledAt, null)
          )
        )
        .orderBy(desc(agentInstallations.installedAt));

      return {
        installations: results.map(r => ({
          ...r.installation,
          agent: r.agent,
        })),
        total: results.length,
      };
    }),
});
