// Trinity Demo Flow Definitions

export interface DemoFlow {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  nodes: DemoNode[];
  edges: DemoEdge[];
  roiMetrics: ROIMetric[];
  duration: number; // milliseconds
  quote: string;
}

export interface DemoNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  label: string;
  provider: string;
  config: Record<string, any>;
  delay: number; // ms from start
  duration: number; // ms to execute
  mockResponse?: any;
}

export interface DemoEdge {
  from: string;
  to: string;
}

export interface ROIMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
}

// Demo 1: Revenue Rescue
export const revenueRescueFlow: DemoFlow = {
  id: 'revenue-rescue',
  name: 'Revenue Rescue',
  category: 'Business / Sales',
  description: 'Prevent revenue loss from inventory stockouts with automated multi-channel response',
  icon: '💰',
  color: '#10B981', // emerald
  duration: 45000, // 45 seconds
  quote: 'Brikk doesn\'t just automate tasks — it orchestrates your business.',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      label: 'Shopify Inventory Alert',
      provider: 'Shopify',
      config: { threshold: 5, sku: 'WIDGET-PRO-2024' },
      delay: 0,
      duration: 2000,
      mockResponse: {
        sku: 'WIDGET-PRO-2024',
        inventory: 4,
        velocity: 12, // units per hour
        productName: 'Premium Widget Pro',
      },
    },
    {
      id: 'condition-1',
      type: 'condition',
      label: 'Mistral AI Forecast',
      provider: 'Mistral AI',
      config: { model: 'mistral-large', forecast_hours: 24 },
      delay: 3000,
      duration: 4000,
      mockResponse: {
        sellOutTime: 2.1, // hours
        confidence: 0.94,
        recommendation: 'immediate_action',
        forecastDemand: 25,
      },
    },
    {
      id: 'action-1',
      type: 'action',
      label: 'Slack Alert to #supply-chain',
      provider: 'Slack',
      config: { channel: '#supply-chain', priority: 'high' },
      delay: 8000,
      duration: 1500,
      mockResponse: {
        messageId: 'msg_abc123',
        timestamp: new Date().toISOString(),
        delivered: true,
      },
    },
    {
      id: 'action-2',
      type: 'action',
      label: 'Pause Meta Campaign',
      provider: 'Meta Ads',
      config: { campaignId: 'Promo-123', action: 'pause' },
      delay: 10000,
      duration: 2000,
      mockResponse: {
        campaignId: 'Promo-123',
        status: 'paused',
        adSpendSaved: 1240,
        currency: 'USD',
      },
    },
    {
      id: 'action-3',
      type: 'action',
      label: 'Draft Supplier Reorder Email',
      provider: 'Email',
      config: { supplier: 'ACME Corp', quantity: 500 },
      delay: 13000,
      duration: 2500,
      mockResponse: {
        draftId: 'draft_xyz789',
        recipient: 'orders@acmecorp.com',
        subject: 'URGENT: Reorder Request - WIDGET-PRO-2024',
        quantity: 500,
        estimatedDelivery: '2-3 business days',
      },
    },
    {
      id: 'action-4',
      type: 'action',
      label: 'Log to Snowflake',
      provider: 'Snowflake',
      config: { table: 'brikk_logs.inventory_events' },
      delay: 16000,
      duration: 1500,
      mockResponse: {
        rowsInserted: 1,
        executionId: 'exec_rev_001',
        timestamp: new Date().toISOString(),
      },
    },
  ],
  edges: [
    { from: 'trigger-1', to: 'condition-1' },
    { from: 'condition-1', to: 'action-1' },
    { from: 'condition-1', to: 'action-2' },
    { from: 'condition-1', to: 'action-3' },
    { from: 'condition-1', to: 'action-4' },
  ],
  roiMetrics: [
    { label: 'Ad Spend Saved', value: '$1,240', icon: '💵', color: '#10B981' },
    { label: 'Manual Time Avoided', value: '3 hours', icon: '⏱️', color: '#3B82F6' },
    { label: 'Stockout Risk', value: '–87%', icon: '📉', color: '#8B5CF6' },
  ],
};

// Demo 2: Marketing Maestro
export const marketingMaestroFlow: DemoFlow = {
  id: 'marketing-maestro',
  name: 'Marketing Maestro',
  category: 'Marketing / Growth',
  description: 'AI-powered campaign optimization with real-time performance monitoring',
  icon: '🎯',
  color: '#3B82F6', // blue
  duration: 50000, // 50 seconds
  quote: 'Brikk doesn\'t just automate tasks — it orchestrates your business.',
  nodes: [
    {
      id: 'trigger-2',
      type: 'trigger',
      label: 'Campaign Performance Update',
      provider: 'Meta Ads',
      config: { campaignId: 'SUMMER-2025', interval: '15min' },
      delay: 0,
      duration: 2000,
      mockResponse: {
        campaignId: 'SUMMER-2025',
        impressions: 45230,
        clicks: 512,
        ctr: 1.13, // %
        conversions: 23,
        spend: 1847,
      },
    },
    {
      id: 'condition-2a',
      type: 'condition',
      label: 'Sentiment Analysis',
      provider: 'OpenAI',
      config: { model: 'gpt-4o', analyze: 'comments' },
      delay: 3000,
      duration: 3500,
      mockResponse: {
        sentimentScore: 54, // %
        negativeThemes: ['price', 'shipping time'],
        positiveThemes: ['quality', 'design'],
        recommendation: 'adjust_messaging',
      },
    },
    {
      id: 'condition-2b',
      type: 'condition',
      label: 'CTR Threshold Check',
      provider: 'Internal',
      config: { threshold: 1.5 },
      delay: 3000,
      duration: 500,
      mockResponse: {
        ctr: 1.13,
        threshold: 1.5,
        passed: false,
        delta: -0.37,
      },
    },
    {
      id: 'action-5',
      type: 'action',
      label: 'OpenAI Rewrite Headline',
      provider: 'OpenAI',
      config: { model: 'gpt-4o', task: 'headline_optimization' },
      delay: 8000,
      duration: 4000,
      mockResponse: {
        originalHeadline: 'Summer Sale - Up to 40% Off',
        newHeadline: 'Premium Quality, Summer Prices – Save 40% Today',
        expectedCTRLift: 0.28,
      },
    },
    {
      id: 'action-6',
      type: 'action',
      label: 'Update Meta Creative',
      provider: 'Meta Ads',
      config: { campaignId: 'SUMMER-2025', updateType: 'headline' },
      delay: 13000,
      duration: 2500,
      mockResponse: {
        adSetId: 'adset_456',
        status: 'active',
        updatedAt: new Date().toISOString(),
      },
    },
    {
      id: 'action-7',
      type: 'action',
      label: 'Rebalance Google Ads Budget',
      provider: 'Google Ads',
      config: { shift: '+15%', from: 'Display', to: 'Search' },
      delay: 16500,
      duration: 2000,
      mockResponse: {
        budgetShift: 275,
        newAllocation: { search: 1650, display: 850 },
        expectedCPAImprovement: 0.12,
      },
    },
    {
      id: 'action-8',
      type: 'action',
      label: 'Slack Summary to #marketing',
      provider: 'Slack',
      config: { channel: '#marketing', type: 'optimization_report' },
      delay: 19500,
      duration: 1500,
      mockResponse: {
        messageId: 'msg_marketing_001',
        summary: 'Campaign optimized: New headline deployed, budget rebalanced',
      },
    },
    {
      id: 'action-9',
      type: 'action',
      label: 'Log to Snowflake',
      provider: 'Snowflake',
      config: { table: 'brikk_logs.campaign_optimizations' },
      delay: 22000,
      duration: 1500,
      mockResponse: {
        rowsInserted: 1,
        executionId: 'exec_mkt_001',
      },
    },
  ],
  edges: [
    { from: 'trigger-2', to: 'condition-2a' },
    { from: 'trigger-2', to: 'condition-2b' },
    { from: 'condition-2a', to: 'action-5' },
    { from: 'condition-2b', to: 'action-5' },
    { from: 'action-5', to: 'action-6' },
    { from: 'action-6', to: 'action-7' },
    { from: 'action-7', to: 'action-8' },
    { from: 'action-8', to: 'action-9' },
  ],
  roiMetrics: [
    { label: 'CTR Improvement', value: '+28%', icon: '📈', color: '#10B981' },
    { label: 'CPA Reduction', value: '–12%', icon: '💰', color: '#3B82F6' },
    { label: 'Response Time', value: '–30 min', icon: '⚡', color: '#F59E0B' },
  ],
};

// Demo 3: Operations Genius
export const operationsGeniusFlow: DemoFlow = {
  id: 'operations-genius',
  name: 'Operations Genius',
  category: 'Logistics / Ops',
  description: 'Intelligent logistics optimization with demand forecasting and route planning',
  icon: '🚚',
  color: '#8B5CF6', // purple
  duration: 55000, // 55 seconds
  quote: 'Brikk doesn\'t just automate tasks — it orchestrates your business.',
  nodes: [
    {
      id: 'trigger-3',
      type: 'trigger',
      label: 'ERP Order Batch Update',
      provider: 'SAP',
      config: { batchSize: 247, warehouse: 'WH-EAST-01' },
      delay: 0,
      duration: 2500,
      mockResponse: {
        batchId: 'BATCH-20250103-001',
        orderCount: 247,
        totalUnits: 1842,
        priority: ['zone-A', 'zone-C', 'zone-B'],
      },
    },
    {
      id: 'condition-3a',
      type: 'condition',
      label: 'Demand Forecast Analysis',
      provider: 'Mistral AI',
      config: { model: 'mistral-large', horizon: '7d' },
      delay: 3500,
      duration: 4500,
      mockResponse: {
        forecast: { zoneA: 520, zoneB: 310, zoneC: 480 },
        confidence: 0.91,
        imbalanceDetected: true,
        recommendation: 'rebalance_stock',
      },
    },
    {
      id: 'condition-3b',
      type: 'condition',
      label: 'Inventory Imbalance Check',
      provider: 'Internal',
      config: { threshold: 0.25 },
      delay: 3500,
      duration: 1000,
      mockResponse: {
        currentStock: { zoneA: 380, zoneB: 520, zoneC: 290 },
        imbalanceScore: 0.34,
        critical: true,
      },
    },
    {
      id: 'action-10',
      type: 'action',
      label: 'Generate Rebalance Plan',
      provider: 'Internal',
      config: { mode: 'optimize', approval: 'pending' },
      delay: 10000,
      duration: 3000,
      mockResponse: {
        planId: 'REBAL-001',
        moves: [
          { from: 'zone-B', to: 'zone-A', units: 140 },
          { from: 'zone-B', to: 'zone-C', units: 190 },
        ],
        estimatedTime: '4.2 hours',
        costSavings: 1840,
      },
    },
    {
      id: 'action-11',
      type: 'action',
      label: 'Optimize Pick Routes',
      provider: 'Internal',
      config: { algorithm: 'tsp', zones: ['A', 'B', 'C'] },
      delay: 14000,
      duration: 3500,
      mockResponse: {
        routeId: 'ROUTE-20250103-001',
        totalDistance: 2.3, // km
        reduction: 0.23, // 23%
        estimatedPickTime: '1.8 hours',
      },
    },
    {
      id: 'action-12',
      type: 'action',
      label: 'Draft Restock Purchase Order',
      provider: 'Email',
      config: { supplier: 'Regional Distributor', priority: 'high' },
      delay: 18500,
      duration: 2500,
      mockResponse: {
        poId: 'PO-20250103-047',
        items: [
          { sku: 'WIDGET-A', qty: 500 },
          { sku: 'WIDGET-C', qty: 350 },
        ],
        estimatedDelivery: '24-48 hours',
      },
    },
    {
      id: 'action-13',
      type: 'action',
      label: 'Slack Update to #operations',
      provider: 'Slack',
      config: { channel: '#operations', type: 'logistics_optimization' },
      delay: 22000,
      duration: 1500,
      mockResponse: {
        messageId: 'msg_ops_001',
        summary: 'Batch optimized: Routes improved 23%, rebalance plan pending approval',
      },
    },
    {
      id: 'action-14',
      type: 'action',
      label: 'Log Metrics to Snowflake',
      provider: 'Snowflake',
      config: { table: 'brikk_logs.logistics_events' },
      delay: 24500,
      duration: 1500,
      mockResponse: {
        rowsInserted: 1,
        executionId: 'exec_ops_001',
        metrics: { routeOptimization: 0.23, fulfillmentImprovement: 0.17 },
      },
    },
  ],
  edges: [
    { from: 'trigger-3', to: 'condition-3a' },
    { from: 'trigger-3', to: 'condition-3b' },
    { from: 'condition-3a', to: 'action-10' },
    { from: 'condition-3b', to: 'action-10' },
    { from: 'action-10', to: 'action-11' },
    { from: 'action-11', to: 'action-12' },
    { from: 'action-12', to: 'action-13' },
    { from: 'action-13', to: 'action-14' },
  ],
  roiMetrics: [
    { label: 'Fulfillment Speed', value: '+17%', icon: '⚡', color: '#10B981' },
    { label: 'Picker Travel', value: '–23%', icon: '🚶', color: '#3B82F6' },
    { label: 'Stock Risk', value: '–40%', icon: '📊', color: '#8B5CF6' },
  ],
};

export const allDemoFlows = [revenueRescueFlow, marketingMaestroFlow, operationsGeniusFlow];

