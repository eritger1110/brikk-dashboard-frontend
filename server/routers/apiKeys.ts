import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { apiKeys, auditLogs } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import crypto from "crypto";

/**
 * API Keys Router
 * 
 * Handles API key generation, listing, and revocation with security
 */

// Helper to generate secure API key
function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `bk_${nanoid(32)}`;
  const prefix = key.substring(0, 10);
  
  // Hash the key using SHA-256
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  
  return { key, hash, prefix };
}

export const apiKeysRouter = router({
  /**
   * List API keys for the current organization
   * Note: Only returns metadata, not the actual keys
   */
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      const results = await db
        .select({
          id: apiKeys.id,
          name: apiKeys.name,
          keyPrefix: apiKeys.keyPrefix,
          environment: apiKeys.environment,
          scopes: apiKeys.scopes,
          rateLimit: apiKeys.rateLimit,
          createdAt: apiKeys.createdAt,
          lastUsedAt: apiKeys.lastUsedAt,
          revokedAt: apiKeys.revokedAt,
        })
        .from(apiKeys)
        .where(eq(apiKeys.organizationId, ctx.user.organizationId))
        .orderBy(desc(apiKeys.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        keys: results,
        total: results.length,
      };
    }),

  /**
   * Generate a new API key
   * Requires: admin+ role
   * Returns the key ONCE - it cannot be retrieved again
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      environment: z.enum(["live", "test"]).default("live"),
      scopes: z.array(z.string()).default(["read", "write"]),
      rateLimit: z.number().min(100).max(100000).default(10000),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can create API keys
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const { key, hash, prefix } = generateApiKey();
      const keyId = nanoid();
      const now = new Date();

      await db.insert(apiKeys).values({
        id: keyId,
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        name: input.name,
        keyHash: hash,
        keyPrefix: prefix,
        environment: input.environment,
        scopes: input.scopes,
        rateLimit: input.rateLimit,
        createdAt: now,
        lastUsedAt: null,
        revokedAt: null,
      });

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "api_key.created",
        resourceType: "api_key",
        resourceId: keyId,
        details: { name: input.name, environment: input.environment },
        createdAt: now,
      });

      // Return the key ONCE - it will never be shown again
      return {
        id: keyId,
        key, // ⚠️ Only time the actual key is returned
        prefix,
        success: true,
      };
    }),

  /**
   * Revoke an API key
   * Requires: admin+ role
   */
  revoke: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can revoke API keys
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const now = new Date();

      await db
        .update(apiKeys)
        .set({
          revokedAt: now,
        })
        .where(
          and(
            eq(apiKeys.id, input.id),
            eq(apiKeys.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "api_key.revoked",
        resourceType: "api_key",
        resourceId: input.id,
        createdAt: now,
      });

      return { success: true };
    }),

  /**
   * Delete an API key permanently
   * Requires: owner role
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

      // RBAC: Only owner can permanently delete API keys
      if (ctx.user.role !== "owner") {
        throw new Error("Insufficient permissions");
      }

      await db
        .delete(apiKeys)
        .where(
          and(
            eq(apiKeys.id, input.id),
            eq(apiKeys.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "api_key.deleted",
        resourceType: "api_key",
        resourceId: input.id,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Update API key settings
   * Requires: admin+ role
   */
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(255).optional(),
      scopes: z.array(z.string()).optional(),
      rateLimit: z.number().min(100).max(100000).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user) {
        throw new Error("Unauthorized");
      }

      // RBAC: Only admin+ can update API keys
      if (!["admin", "owner"].includes(ctx.user.role || "")) {
        throw new Error("Insufficient permissions");
      }

      const { id, ...updates } = input;

      await db
        .update(apiKeys)
        .set(updates)
        .where(
          and(
            eq(apiKeys.id, id),
            eq(apiKeys.organizationId, ctx.user.organizationId)
          )
        );

      // Audit log
      await db.insert(auditLogs).values({
        id: nanoid(),
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        action: "api_key.updated",
        resourceType: "api_key",
        resourceId: id,
        details: updates,
        createdAt: new Date(),
      });

      return { success: true };
    }),
});
