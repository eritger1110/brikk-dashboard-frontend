import { router } from "../_core/trpc";
import { agentsRouter } from "./agents";
import { workflowsRouter } from "./workflows";
import { marketplaceRouter } from "./marketplace";
import { analyticsRouter } from "./analytics";
import { apiKeysRouter } from "./apiKeys";
import { auditLogsRouter } from "./auditLogs";

/**
 * Main Application Router
 * 
 * Combines all feature routers into a single tRPC app router
 * with type-safe end-to-end API calls
 */

export const appRouter = router({
  agents: agentsRouter,
  workflows: workflowsRouter,
  marketplace: marketplaceRouter,
  analytics: analyticsRouter,
  apiKeys: apiKeysRouter,
  auditLogs: auditLogsRouter,
});

// Export type definition for client-side type safety
export type AppRouter = typeof appRouter;
