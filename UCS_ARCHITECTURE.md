# Brikk Universal Connector System (UCS) Architecture

**Version:** 1.0  
**Date:** November 19, 2025  
**Status:** Design Phase

---

## Executive Summary

The Universal Connector System (UCS) is Brikk's AI-powered integration marketplace that enables autonomous agents to connect with thousands of external systems. Unlike traditional integration platforms (Zapier, Make.com), UCS features:

- **AI-generated connectors** from API documentation
- **Auto-repair capabilities** when APIs change
- **Agent-native integration** for autonomous workflows
- **Version management** without breaking existing workflows

---

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                     BRIKK PLATFORM                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Agents     │  │  BrikkFlows  │  │  Dashboard   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │             │
│         └─────────────────┴──────────────────┘             │
│                           │                                │
│         ┌─────────────────▼─────────────────┐             │
│         │  UNIVERSAL CONNECTOR SYSTEM (UCS)  │             │
│         └─────────────────┬─────────────────┘             │
│                           │                                │
├───────────────────────────┼────────────────────────────────┤
│                           │                                │
│  ┌────────────────────────▼────────────────────────┐      │
│  │        Integration Execution Engine (IEE)       │      │
│  │  - Request routing                              │      │
│  │  - Auth management                              │      │
│  │  - Rate limiting                                │      │
│  │  - Error handling                               │      │
│  └────────────────────────┬────────────────────────┘      │
│                           │                                │
│  ┌────────────────────────▼────────────────────────┐      │
│  │      Connector Generation Service (CGS)         │      │
│  │  - OpenAPI parser                               │      │
│  │  - Postman parser                               │      │
│  │  - LLM schema extraction                        │      │
│  │  - CDF generation                               │      │
│  └────────────────────────┬────────────────────────┘      │
│                           │                                │
│  ┌────────────────────────▼────────────────────────┐      │
│  │      Integration Registry Service (IRS)         │      │
│  │  - Connector storage                            │      │
│  │  - Version management                           │      │
│  │  - Metadata indexing                            │      │
│  └────────────────────────┬────────────────────────┘      │
│                           │                                │
│  ┌────────────────────────▼────────────────────────┐      │
│  │         Auto-Repair Service (ARS)               │      │
│  │  - Endpoint health monitoring                   │      │
│  │  - Failure detection                            │      │
│  │  - LLM-based fix generation                     │      │
│  │  - Auto-versioning                              │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      EXTERNAL SYSTEMS                │
        │  Shopify, NetSuite, Stripe, SAP,     │
        │  Salesforce, Oracle, Gmail, etc.     │
        └──────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

#### 1. `integrations`
Stores all integration definitions and metadata.

```sql
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- CRM, ERP, logistics, marketing, finance, etc.
    description TEXT,
    icon_url VARCHAR(500),
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, published, deprecated
    created_by_user_id UUID NOT NULL,
    connector_definition JSONB NOT NULL, -- Full CDF (Connector Definition File)
    changelog JSONB DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    install_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    deprecated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_integrations_category (category),
    INDEX idx_integrations_status (status),
    INDEX idx_integrations_slug (slug),
    INDEX idx_integrations_created_by (created_by_user_id)
);
```

#### 2. `integration_auth_methods`
Stores authentication configuration for each integration.

```sql
CREATE TABLE integration_auth_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    auth_type VARCHAR(50) NOT NULL, -- api_key_header, api_key_query, oauth2, basic, custom
    config JSONB NOT NULL, -- Auth-specific configuration
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_auth_methods_integration (integration_id)
);
```

#### 3. `integration_versions`
Tracks version history for each integration.

```sql
CREATE TABLE integration_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    connector_definition JSONB NOT NULL,
    changelog TEXT,
    breaking_changes BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by_user_id UUID NOT NULL,
    
    UNIQUE(integration_id, version),
    INDEX idx_versions_integration (integration_id),
    INDEX idx_versions_created_at (created_at DESC)
);
```

#### 4. `integration_installations`
Tracks which users/organizations have installed which integrations.

```sql
CREATE TABLE integration_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    version VARCHAR(50) NOT NULL,
    auth_credentials JSONB, -- Encrypted user credentials
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, error
    installed_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP,
    
    UNIQUE(integration_id, organization_id),
    INDEX idx_installations_user (user_id),
    INDEX idx_installations_org (organization_id),
    INDEX idx_installations_integration (integration_id)
);
```

#### 5. `integration_logs`
Stores execution logs for debugging and monitoring.

```sql
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    installation_id UUID REFERENCES integration_installations(id) ON DELETE CASCADE,
    endpoint VARCHAR(500),
    method VARCHAR(10),
    status_code INTEGER,
    request_body JSONB,
    response_body JSONB,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_logs_integration (integration_id),
    INDEX idx_logs_installation (installation_id),
    INDEX idx_logs_created_at (created_at DESC),
    INDEX idx_logs_status_code (status_code)
);
```

#### 6. `integration_health_checks`
Tracks endpoint health status for auto-repair.

```sql
CREATE TABLE integration_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    endpoint VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL, -- healthy, degraded, failed
    last_check_at TIMESTAMP DEFAULT NOW(),
    last_success_at TIMESTAMP,
    last_failure_at TIMESTAMP,
    failure_count INTEGER DEFAULT 0,
    error_details JSONB,
    
    UNIQUE(integration_id, endpoint),
    INDEX idx_health_integration (integration_id),
    INDEX idx_health_status (status)
);
```

#### 7. `integration_endpoints`
Stores individual endpoints for each integration.

```sql
CREATE TABLE integration_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    description TEXT,
    endpoint_type VARCHAR(50) NOT NULL, -- action, trigger
    request_schema JSONB,
    response_schema JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_endpoints_integration (integration_id),
    INDEX idx_endpoints_type (endpoint_type)
);
```

---

## Connector Definition File (CDF) Format

The CDF is a JSON structure that defines how to interact with an external API.

```json
{
  "version": "1.0",
  "integration": {
    "id": "shopify",
    "name": "Shopify",
    "description": "E-commerce platform for online stores",
    "category": "ecommerce",
    "base_url": "https://{{shop_name}}.myshopify.com/admin/api/2024-01",
    "documentation_url": "https://shopify.dev/docs/api"
  },
  "authentication": {
    "type": "oauth2",
    "oauth2": {
      "authorization_url": "https://{{shop_name}}.myshopify.com/admin/oauth/authorize",
      "token_url": "https://{{shop_name}}.myshopify.com/admin/oauth/access_token",
      "scopes": ["read_products", "write_products", "read_orders"],
      "grant_type": "authorization_code"
    }
  },
  "endpoints": [
    {
      "id": "orders.list",
      "name": "List Orders",
      "description": "Retrieve a list of orders",
      "type": "action",
      "method": "GET",
      "path": "/orders.json",
      "parameters": [
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "Filter by order status",
          "enum": ["open", "closed", "cancelled"]
        },
        {
          "name": "limit",
          "type": "integer",
          "required": false,
          "default": 50,
          "description": "Number of results to return"
        }
      ],
      "response_schema": {
        "type": "object",
        "properties": {
          "orders": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {"type": "integer"},
                "order_number": {"type": "integer"},
                "total_price": {"type": "string"},
                "created_at": {"type": "string"}
              }
            }
          }
        }
      }
    },
    {
      "id": "products.create",
      "name": "Create Product",
      "description": "Create a new product",
      "type": "action",
      "method": "POST",
      "path": "/products.json",
      "request_schema": {
        "type": "object",
        "required": ["product"],
        "properties": {
          "product": {
            "type": "object",
            "required": ["title"],
            "properties": {
              "title": {"type": "string"},
              "body_html": {"type": "string"},
              "vendor": {"type": "string"},
              "product_type": {"type": "string"},
              "tags": {"type": "string"}
            }
          }
        }
      },
      "response_schema": {
        "type": "object",
        "properties": {
          "product": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "title": {"type": "string"},
              "created_at": {"type": "string"}
            }
          }
        }
      }
    }
  ],
  "triggers": [
    {
      "id": "order.created",
      "name": "Order Created",
      "description": "Triggered when a new order is created",
      "type": "webhook",
      "webhook_url": "/webhooks/orders/create",
      "event_schema": {
        "type": "object",
        "properties": {
          "id": {"type": "integer"},
          "order_number": {"type": "integer"},
          "total_price": {"type": "string"},
          "customer": {
            "type": "object",
            "properties": {
              "email": {"type": "string"},
              "first_name": {"type": "string"},
              "last_name": {"type": "string"}
            }
          }
        }
      }
    }
  ],
  "rate_limits": {
    "requests_per_second": 2,
    "requests_per_day": 10000
  },
  "error_handling": {
    "retry_strategy": "exponential_backoff",
    "max_retries": 3,
    "retry_delay_ms": 1000
  }
}
```

---

## Service Specifications

### 1. Connector Generation Service (CGS)

**Purpose:** Generate CDF files from various input formats using AI.

**Inputs:**
- OpenAPI/Swagger JSON/YAML
- Postman Collection JSON
- API Documentation URL
- Raw API documentation text
- CURL/JSON sample requests

**Process:**
1. Parse input format
2. Extract endpoints, methods, parameters
3. Use LLM to infer:
   - Authentication type
   - Request/response schemas
   - Error codes
   - Rate limits
4. Generate CDF
5. Validate CDF structure
6. Store in Integration Registry

**API Endpoints:**
```
POST /api/v1/ucs/generate/openapi
POST /api/v1/ucs/generate/postman
POST /api/v1/ucs/generate/url
POST /api/v1/ucs/generate/text
POST /api/v1/ucs/generate/samples
```

---

### 2. Integration Execution Engine (IEE)

**Purpose:** Execute API requests securely and reliably.

**Responsibilities:**
- Load connector definition from registry
- Inject user credentials
- Build HTTP request
- Handle authentication (OAuth refresh, API key injection)
- Execute request with retry logic
- Parse response according to schema
- Log execution details
- Return structured response to agent

**API Endpoints:**
```
POST /api/v1/ucs/execute/{integration_id}/{endpoint_id}
GET /api/v1/ucs/execute/status/{execution_id}
```

---

### 3. Integration Registry Service (IRS)

**Purpose:** Store and manage connector definitions.

**Responsibilities:**
- CRUD operations for integrations
- Version management
- Search and discovery
- Installation tracking
- Rating and reviews (future)

**API Endpoints:**
```
GET /api/v1/ucs/integrations
GET /api/v1/ucs/integrations/{id}
POST /api/v1/ucs/integrations
PUT /api/v1/ucs/integrations/{id}
DELETE /api/v1/ucs/integrations/{id}
POST /api/v1/ucs/integrations/{id}/install
DELETE /api/v1/ucs/integrations/{id}/uninstall
GET /api/v1/ucs/integrations/{id}/versions
```

---

### 4. Auto-Repair Service (ARS)

**Purpose:** Monitor endpoint health and auto-fix broken connectors.

**Process:**
1. **Health Monitoring** (every 15 minutes):
   - Test sample requests for each endpoint
   - Record success/failure
   - Detect patterns (404, 401, schema mismatch)

2. **Failure Detection**:
   - 404: Endpoint moved or removed
   - 401: Auth expired or changed
   - Schema mismatch: New required fields or changed response structure

3. **Auto-Repair**:
   - Fetch latest API documentation
   - Use LLM to analyze changes
   - Generate updated CDF
   - Create new version
   - Notify users of update

4. **Versioning**:
   - Minor version (1.0 → 1.1): Non-breaking changes
   - Major version (1.0 → 2.0): Breaking changes
   - Maintain backward compatibility for minor versions

**API Endpoints:**
```
GET /api/v1/ucs/health/{integration_id}
POST /api/v1/ucs/repair/{integration_id}
GET /api/v1/ucs/repair/status/{repair_id}
```

---

## Agent Integration

### How Agents Use Integrations

Agents can discover and use integrations through the following capabilities:

```json
{
  "action": "integration.call",
  "integration_id": "shopify",
  "endpoint": "orders.list",
  "params": {
    "status": "open",
    "limit": 10
  }
}
```

### Agent Configuration

In the Agent Configuration page, users can:
1. Browse available integrations
2. Select integrations to attach
3. Configure permissions (which endpoints the agent can access)
4. Test integration connectivity

---

## Security Considerations

### 1. Credential Storage
- All user credentials encrypted at rest
- OAuth tokens stored with refresh capability
- API keys encrypted with organization-specific keys

### 2. Access Control
- Integrations scoped to organizations
- Users can only access integrations they've installed
- Agents can only use integrations attached to them

### 3. Rate Limiting
- Per-integration rate limits enforced
- Per-organization quotas
- Graceful degradation when limits reached

### 4. Audit Logging
- All API calls logged with user/agent attribution
- Sensitive data redacted from logs
- Compliance-ready audit trail

---

## Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-2)
- Database schema implementation
- Integration Registry Service
- Basic CRUD operations
- Manual connector creation UI

### Phase 2: Connector Generation (Weeks 3-4)
- OpenAPI parser
- Postman parser
- LLM-based schema extraction
- CDF generation pipeline

### Phase 3: Execution Engine (Weeks 5-6)
- Request execution
- Authentication handling
- Error handling and retries
- Logging infrastructure

### Phase 4: Marketplace (Week 7)
- Integration discovery UI
- Installation workflow
- Search and filtering
- Integration detail pages

### Phase 5: Agent Integration (Week 8)
- Agent configuration UI
- Integration attachment
- Runtime execution from agents
- Testing console

### Phase 6: Auto-Repair (Weeks 9-10)
- Health monitoring
- Failure detection
- LLM-based repair
- Auto-versioning

### Phase 7: Polish & Launch (Week 11)
- Developer portal
- Documentation
- Testing
- Production deployment

---

## Success Metrics

### Technical Metrics
- Connector generation success rate > 90%
- API execution success rate > 99%
- Auto-repair success rate > 80%
- Average connector generation time < 2 minutes

### Business Metrics
- Number of integrations in marketplace
- Number of installations per integration
- Agent usage of integrations
- User satisfaction score

---

## Future Enhancements

### Phase 2 Features
- User ratings and reviews
- Community-contributed connectors
- Integration templates
- Visual connector builder (no-code)
- Webhook management UI
- Real-time integration monitoring dashboard
- Cost tracking per integration
- Integration analytics

### Phase 3 Features
- AI-suggested integrations based on agent behavior
- Auto-discovery of new APIs
- Integration recommendations
- Batch operations
- Integration testing framework
- Integration marketplace revenue sharing

---

## Conclusion

The Universal Connector System is the foundation for Brikk's vision of autonomous AI workforces. By enabling agents to seamlessly connect with any external system, we unlock unlimited automation possibilities.

The combination of AI-generated connectors, auto-repair capabilities, and agent-native integration makes UCS a game-changer in the integration platform market.

**Next Steps:** Begin Phase 1 implementation with database schema and Integration Registry Service.
