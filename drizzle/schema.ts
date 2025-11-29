import { pgTable, varchar, text, timestamp, boolean, jsonb, integer, numeric } from "drizzle-orm/pg-core";

/**
 * Brikk Dashboard - PostgreSQL Database Schema
 * 
 * This schema maps to EXISTING tables in Render Postgres.
 * DO NOT run migrations - tables already exist.
 * Use this for type-safe queries via Drizzle ORM.
 */

// ============================================================================
// Core User & Organization Tables
// ============================================================================

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 50 }).default("member"),
  auth0Id: varchar("auth0_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  permissions: jsonb("permissions").$type<string[]>().default([]),
});

export const organizations = pgTable("organizations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  subscriptionStatus: text("subscription_status").default("inactive"),
  planTier: text("plan_tier").default("free"),
  industry: varchar("industry", { length: 100 }),
  teamSize: varchar("team_size", { length: 50 }),
  maxAgents: integer("max_agents").default(10),
  maxIntegrations: integer("max_integrations").default(50),
  simulationEnabled: boolean("simulation_enabled").default(true),
  negotiationEnabled: boolean("negotiation_enabled").default(true),
});

// ============================================================================
// API Key Management
// ============================================================================

export const apiKeys = pgTable("api_keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: varchar("key_hash", { length: 255 }).notNull(),
  keyPrefix: varchar("key_prefix", { length: 50 }).notNull(),
  environment: varchar("environment", { length: 20 }).default("live"),
  scopes: text("scopes").array().default(["read", "write"]),
  rateLimit: integer("rate_limit").default(10000),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
});

export const orgApiKeys = pgTable("org_api_keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  keyHash: varchar("key_hash", { length: 255 }).notNull(),
  keyPrefix: varchar("key_prefix", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }),
  scopes: jsonb("scopes").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
});

// ============================================================================
// Agents & Workflows
// ============================================================================

export const agents = pgTable("agents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("active"),
  config: jsonb("config").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workflows = pgTable("workflows", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  config: jsonb("config").$type<Record<string, any>>(),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// Marketplace & Integrations
// ============================================================================

export const marketplaceAgents = pgTable("marketplace_agents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  rating: numeric("rating").default("0"),
  installs: integer("installs").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: varchar("status", { length: 50 }).default("available"),
  pricing: jsonb("pricing").$type<Record<string, any>>(),
});

export const marketplaceListings = pgTable("marketplace_listings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  agentId: varchar("agent_id", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  pricing: jsonb("pricing").$type<Record<string, any>>(),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const installedAgents = pgTable("installed_agents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  agentId: varchar("agent_id", { length: 255 }).notNull(),
  installedAt: timestamp("installed_at").defaultNow().notNull(),
});

export const agentInstallations = pgTable("agent_installations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  marketplaceAgentId: varchar("marketplace_agent_id", { length: 255 }).notNull(),
  installedAt: timestamp("installed_at").defaultNow().notNull(),
  uninstalledAt: timestamp("uninstalled_at"),
});

// ============================================================================
// Analytics & Metrics
// ============================================================================

export const agentAnalyticsDaily = pgTable("agent_analytics_daily", {
  id: varchar("id", { length: 255 }).primaryKey(),
  agentId: varchar("agent_id", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  invocationCount: integer("invocation_count"),
  uniqueUsers: integer("unique_users"),
  successCount: integer("success_count"),
  errorCount: integer("error_count"),
  avgDurationMs: numeric("avg_duration_ms"),
  p50DurationMs: integer("p50_duration_ms"),
  p95DurationMs: integer("p95_duration_ms"),
  p99DurationMs: integer("p99_duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAnalyticsDaily = pgTable("user_analytics_daily", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  agentInvocations: integer("agent_invocations"),
  uniqueAgentsUsed: integer("unique_agents_used"),
  totalDurationMs: integer("total_duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentUsageEvents = pgTable("agent_usage_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  agentId: varchar("agent_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  organizationId: varchar("organization_id", { length: 255 }),
  eventType: varchar("event_type", { length: 50 }),
  durationMs: integer("duration_ms"),
  success: boolean("success"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usageLedger = pgTable("usage_ledger", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }),
  resourceId: varchar("resource_id", { length: 255 }),
  quantity: integer("quantity"),
  cost: numeric("cost"),
  billingPeriod: varchar("billing_period", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// Audit Logging (SOC 2 / HIPAA Compliance)
// ============================================================================

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  action: varchar("action", { length: 255 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }),
  resourceId: varchar("resource_id", { length: 255 }),
  details: jsonb("details").$type<Record<string, any>>(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiAuditLog = pgTable("api_audit_log", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 }),
  apiKeyId: varchar("api_key_id", { length: 255 }),
  endpoint: varchar("endpoint", { length: 255 }),
  method: varchar("method", { length: 10 }),
  statusCode: integer("status_code"),
  responseTime: integer("response_time"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const securityEvents = pgTable("security_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }),
  userId: varchar("user_id", { length: 100 }),
  agentId: varchar("agent_id", { length: 36 }),
  resourceAccessed: varchar("resource_accessed", { length: 200 }),
  accessGranted: boolean("access_granted"),
  securityLevelRequired: varchar("security_level_required", { length: 20 }),
  securityLevelProvided: varchar("security_level_provided", { length: 20 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),
  eventData: text("event_data"),
  timestamp: timestamp("timestamp"),
});

// ============================================================================
// Connectors & Integrations
// ============================================================================

export const connectors = pgTable("connectors", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  description: text("description"),
  config: jsonb("config").$type<Record<string, any>>(),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const connectorInstances = pgTable("connector_instances", {
  id: varchar("id", { length: 255 }).primaryKey(),
  connectorId: varchar("connector_id", { length: 255 }).notNull(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  config: jsonb("config").$type<Record<string, any>>(),
  credentials: jsonb("credentials").$type<Record<string, any>>(),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

export type MarketplaceAgent = typeof marketplaceAgents.$inferSelect;
export type InsertMarketplaceAgent = typeof marketplaceAgents.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = typeof securityEvents.$inferInsert;

export type AgentAnalyticsDaily = typeof agentAnalyticsDaily.$inferSelect;
export type UserAnalyticsDaily = typeof userAnalyticsDaily.$inferSelect;
export type AgentUsageEvent = typeof agentUsageEvents.$inferSelect;
