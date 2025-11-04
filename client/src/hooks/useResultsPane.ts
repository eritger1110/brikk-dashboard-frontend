import { useState, useCallback } from 'react';

export interface ResultTile {
  id: string;
  type: 'slack' | 'email' | 'sheet' | 'creative' | 'budget' | 'route' | 'plan' | 'campaign';
  title: string;
  content: any;
  timestamp: Date;
  isLive?: boolean;
}

export function useResultsPane() {
  const [tiles, setTiles] = useState<ResultTile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addTile = useCallback((tile: Omit<ResultTile, 'id' | 'timestamp'>) => {
    const newTile: ResultTile = {
      ...tile,
      id: `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setTiles((prev) => [...prev, newTile]);
    setIsOpen(true);
  }, []);

  const addSlack = useCallback((message: string, channel: string, isLive = false) => {
    addTile({
      type: 'slack',
      title: `Slack → ${channel}`,
      content: { message, channel },
      isLive,
    });
  }, [addTile]);

  const addEmail = useCallback((
    subject: string,
    recipient: string,
    preview: string,
    isLive = false
  ) => {
    addTile({
      type: 'email',
      title: `Email → ${recipient}`,
      content: { subject, recipient, preview },
      isLive,
    });
  }, [addTile]);

  const addSheet = useCallback((
    spreadsheetName: string,
    row: Record<string, any>,
    isLive = false
  ) => {
    addTile({
      type: 'sheet',
      title: `Google Sheets → ${spreadsheetName}`,
      content: { spreadsheetName, row },
      isLive,
    });
  }, [addTile]);

  const addCreative = useCallback((
    before: { headline: string; cta: string },
    after: { headline: string; cta: string }
  ) => {
    addTile({
      type: 'creative',
      title: 'Creative Updated',
      content: { before, after },
    });
  }, [addTile]);

  const addBudgetShift = useCallback((shifts: Array<{ platform: string; change: number }>) => {
    addTile({
      type: 'budget',
      title: 'Budget Rebalanced',
      content: { shifts },
    });
  }, [addTile]);

  const addRoute = useCallback((
    distance: number,
    reduction: number,
    estimatedTime: string
  ) => {
    addTile({
      type: 'route',
      title: 'Pick Routes Optimized',
      content: { distance, reduction, estimatedTime },
    });
  }, [addTile]);

  const addPlan = useCallback((
    planId: string,
    moves: Array<{ from: string; to: string; units: number }>,
    status: string
  ) => {
    addTile({
      type: 'plan',
      title: 'Restock Plan Drafted',
      content: { planId, moves, status },
    });
  }, [addTile]);

  const addCampaign = useCallback((
    campaignId: string,
    action: string,
    adSpendSaved?: number
  ) => {
    addTile({
      type: 'campaign',
      title: `Campaign ${action}`,
      content: { campaignId, action, adSpendSaved },
    });
  }, [addTile]);

  const clear = useCallback(() => {
    setTiles([]);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    tiles,
    isOpen,
    setIsOpen,
    addTile,
    addSlack,
    addEmail,
    addSheet,
    addCreative,
    addBudgetShift,
    addRoute,
    addPlan,
    addCampaign,
    clear,
    toggle,
  };
}

