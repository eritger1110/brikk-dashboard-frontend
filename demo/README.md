# BrikkFlows Trinity Demo

Three interactive workflow demonstrations showcasing BrikkFlows' capabilities in real-world business scenarios.

## 🎯 Overview

The Trinity Demo consists of three complete workflow demonstrations that can run in **Simulation Mode** (with mock data) or connect to live APIs. Each demo completes in under 60 seconds and demonstrates visible trigger → condition → action chains with realistic data and ROI metrics.

## 🎬 The Three Demos

### 1. Revenue Rescue (Business / Sales)
**Scenario:** Prevent revenue loss from inventory stockouts with automated multi-channel response

**Flow:**
1. **Trigger:** Shopify inventory alert (< 5 units)
2. **Condition:** Mistral AI forecast (sell-out in 2.1 hours)
3. **Actions:**
   - Slack alert to #supply-chain
   - Pause Meta campaign (Promo-123) to save ad spend
   - Draft supplier reorder email (500 units)
   - Log event to Snowflake

**ROI Metrics:**
- 💵 **$1,240** ad spend saved
- ⏱️ **3 hours** manual time avoided
- 📉 **–87%** stockout risk

**Duration:** ~45 seconds

---

### 2. Marketing Maestro (Marketing / Growth)
**Scenario:** AI-powered campaign optimization with real-time performance monitoring

**Flow:**
1. **Trigger:** Campaign performance update (CTR: 1.13%)
2. **Conditions:**
   - Sentiment analysis (54% - below threshold)
   - CTR check (below 1.5% threshold)
3. **Actions:**
   - OpenAI rewrites headline (expected +28% CTR lift)
   - Update Meta creative with new headline
   - Rebalance Google Ads budget (+15% to Search)
   - Slack summary to #marketing
   - Log optimization to Snowflake

**ROI Metrics:**
- 📈 **+28%** CTR improvement
- 💰 **–12%** CPA reduction
- ⚡ **–30 min** response time

**Duration:** ~50 seconds

---

### 3. Operations Genius (Logistics / Ops)
**Scenario:** Intelligent logistics optimization with demand forecasting and route planning

**Flow:**
1. **Trigger:** ERP order batch update (247 orders, 1,842 units)
2. **Conditions:**
   - Demand forecast analysis (7-day horizon)
   - Inventory imbalance check (34% imbalance detected)
3. **Actions:**
   - Generate rebalance plan (pending approval)
   - Optimize pick routes (TSP algorithm, –23% travel)
   - Draft restock purchase order
   - Slack update to #operations
   - Log metrics to Snowflake

**ROI Metrics:**
- ⚡ **+17%** fulfillment speed
- 🚶 **–23%** picker travel distance
- 📊 **–40%** stock risk

**Duration:** ~55 seconds

---

## 🎮 How to Use

### Access the Demo Gallery

1. Navigate to **🎬 Demo Gallery** in the sidebar
2. Choose one of the three demo flows
3. Click **"Launch Demo"** to open the execution canvas

### Running a Demo

1. **Review the flow:** See all nodes (triggers, conditions, actions) laid out sequentially
2. **Start execution:** Click the **"Start Execution"** button
3. **Watch the magic:** Nodes light up and execute one by one with realistic timing
4. **See the results:** Each node shows its mock response data
5. **View ROI metrics:** After completion, see dynamic ROI cards with impact metrics
6. **Read the quote:** "Brikk doesn't just automate tasks — it orchestrates your business."

### Simulation Mode Toggle

- **ON (default):** Uses mock data via MSW (Mock Service Worker)
- **OFF:** Connects to live APIs (requires backend configuration)

Toggle is located in the top-right corner of the Demo Gallery page.

---

## 🔧 Technical Implementation

### Mock Data Architecture

Each demo flow is defined in `client/src/lib/demo-flows.ts` with:

```typescript
interface DemoFlow {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  nodes: DemoNode[];        // Trigger/condition/action nodes
  edges: DemoEdge[];        // Flow connections
  roiMetrics: ROIMetric[];  // Impact metrics
  duration: number;         // Total execution time (ms)
  quote: string;            // Brand quote
}
```

### Node Execution Timing

Each node has:
- **delay:** Time from flow start (ms)
- **duration:** Execution time (ms)
- **mockResponse:** Realistic mock data

Example:
```typescript
{
  id: 'action-1',
  type: 'action',
  label: 'Slack Alert to #supply-chain',
  provider: 'Slack',
  delay: 8000,      // Start at 8s
  duration: 1500,   // Takes 1.5s
  mockResponse: {
    messageId: 'msg_abc123',
    delivered: true
  }
}
```

### Visual Execution

The `DemoExecutionCanvas` component:
1. Renders all nodes in sequence
2. Highlights active node (pulsing animation)
3. Shows completed nodes (green checkmark)
4. Displays mock response data
5. Tracks progress bar

### ROI Metrics Animation

The `ROIMetricsPanel` component:
1. Animates metric cards with stagger effect
2. Shows color-coded impact badges
3. Displays animated progress bars
4. Presents brand quote with icon animation
5. Shows summary statistics

---

## 🎨 Customization

### Adding a New Demo

1. **Define the flow** in `demo-flows.ts`:
```typescript
export const myNewFlow: DemoFlow = {
  id: 'my-new-flow',
  name: 'My New Demo',
  category: 'Category',
  description: 'Description',
  icon: '🚀',
  color: '#3B82F6',
  duration: 45000,
  quote: 'Your quote here',
  nodes: [/* ... */],
  edges: [/* ... */],
  roiMetrics: [/* ... */]
};
```

2. **Add to exports**:
```typescript
export const allDemoFlows = [
  revenueRescueFlow,
  marketingMaestroFlow,
  operationsGeniusFlow,
  myNewFlow  // Add here
];
```

3. **Test:** Navigate to Demo Gallery and launch

### Modifying Timing

Adjust `delay` and `duration` in each node:
- Keep total under 60 seconds
- Space nodes 2-4 seconds apart for visibility
- Longer durations for AI/complex operations
- Shorter for simple API calls

### Changing ROI Metrics

Update `roiMetrics` array:
```typescript
roiMetrics: [
  { label: 'Metric Name', value: '+42%', icon: '📈', color: '#10B981' },
  // Add more...
]
```

---

## 🔌 Switching to Live APIs

### Prerequisites

1. Backend API running at `VITE_API_BASE_URL`
2. WebSocket server at `VITE_WS_BASE_URL`
3. Auth token and tenant configured

### Steps

1. **Set environment variables:**
```env
VITE_API_BASE_URL=https://api.brikk.prod
VITE_WS_BASE_URL=wss://api.brikk.prod/v1/stream
```

2. **Toggle Simulation Mode OFF** in the Demo Gallery

3. **Configure integrations:**
   - Connect Shopify, Meta Ads, Slack, etc. in Settings
   - Ensure API keys are valid

4. **Update flow definitions** to use real flow IDs from backend

5. **Test with real data** (recommended: start with staging environment)

---

## 📊 Analytics & Tracking

Each demo execution generates:
- Audit log entries (visible in Audit Logs page)
- Execution records (visible in Monitoring page)
- Cost tracking (per-provider breakdown)
- Performance metrics (latency, success rate)

---

## 🎯 Use Cases

### Sales Demos
- Show prospects the platform in action
- Demonstrate ROI with realistic scenarios
- Highlight multi-system orchestration

### Investor Presentations
- Prove technical capability
- Show market fit across industries
- Demonstrate scalability

### Onboarding
- Train new users on workflow concepts
- Explain trigger → condition → action logic
- Build confidence before creating real flows

### Marketing
- Create video demos for website
- Generate screenshots for pitch decks
- Produce case study materials

---

## 🚀 Performance

- **Load time:** < 2s
- **Execution time:** 45-55s per demo
- **Animation frame rate:** 60 FPS
- **Memory usage:** < 50 MB
- **Bundle size impact:** +47 KB (MSW)

---

## 🐛 Troubleshooting

### Demo won't start
- Check browser console for errors
- Ensure Framer Motion is installed
- Verify demo flow definitions are valid

### Animations stuttering
- Reduce number of concurrent animations
- Check browser performance
- Disable other heavy processes

### Mock data not showing
- Verify MSW is installed (`pnpm add msw`)
- Check mock responses in `demo-flows.ts`
- Ensure Simulation Mode is ON

---

## 📝 Future Enhancements

- [ ] Add warehouse map visualization for Operations Genius
- [ ] Implement chained demo mode (all 3 in sequence)
- [ ] Add export to video feature
- [ ] Create shareable demo links
- [ ] Add voice narration option
- [ ] Implement A/B testing for different ROI metrics
- [ ] Add custom demo builder UI

---

## 📄 License

Proprietary - Brikk, Inc.

---

**Built with ❤️ by the Brikk team**

*"Brikk doesn't just automate tasks — it orchestrates your business."*

