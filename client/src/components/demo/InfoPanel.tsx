import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2 } from 'lucide-react';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  goal: string;
  howItWorks: string[];
  businessImpact: Array<{ label: string; value: string }>;
  color: string;
}

export default function InfoPanel({
  isOpen,
  onClose,
  goal,
  howItWorks,
  businessImpact,
  color,
}: InfoPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Demo Information</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Goal */}
              <Card className="p-4 border-2" style={{ borderColor: color }}>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Goal
                </h4>
                <p className="text-sm text-muted-foreground">{goal}</p>
              </Card>

              {/* How Brikk Solves It */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  How Brikk Solves It
                </h4>
                <div className="space-y-3">
                  {howItWorks.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        className="h-5 w-5 flex-shrink-0 mt-0.5"
                        style={{ color }}
                      />
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Business Impact
                </h4>
                <div className="space-y-3">
                  {businessImpact.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">
                          {metric.label}
                        </div>
                        <div className="text-2xl font-bold" style={{ color }}>
                          {metric.value}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground italic text-center">
                  "Brikk doesn't just automate tasks — it orchestrates your business."
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

