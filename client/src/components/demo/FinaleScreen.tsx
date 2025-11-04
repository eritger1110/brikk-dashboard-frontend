import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home, Zap } from 'lucide-react';

interface FinaleScreenProps {
  onReplayTrilogy: () => void;
  onBackToGallery: () => void;
}

export default function FinaleScreen({ onReplayTrilogy, onBackToGallery }: FinaleScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center p-8"
    >
      <div className="max-w-5xl w-full space-y-12">
        {/* Animated Network Diagram */}
        <div className="relative h-96">
          {/* Center: Brikk Core */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              />
              <Card className="p-8 bg-primary/10 border-2 border-primary relative z-10">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">B</div>
                  <div className="text-sm font-semibold">Brikk Core</div>
                  <div className="text-xs text-muted-foreground">Orchestration Engine</div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Three Spokes */}
          {[
            { label: 'Revenue Rescue', icon: '💰', color: '#10B981', angle: -90 },
            { label: 'Marketing Maestro', icon: '🎯', color: '#3B82F6', angle: 30 },
            { label: 'Operations Genius', icon: '🚚', color: '#8B5CF6', angle: 150 },
          ].map((spoke, index) => {
            const radius = 200;
            const angleRad = (spoke.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <motion.div
                key={spoke.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.2, type: 'spring' }}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <Card
                  className="p-6 border-2 relative"
                  style={{ borderColor: spoke.color }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{spoke.icon}</div>
                    <div className="text-sm font-semibold whitespace-nowrap">
                      {spoke.label}
                    </div>
                  </div>

                  {/* Connection Line */}
                  <svg
                    className="absolute left-1/2 top-1/2 pointer-events-none"
                    style={{
                      width: Math.abs(x) + 100,
                      height: Math.abs(y) + 100,
                      transform: `translate(-50%, -50%)`,
                    }}
                  >
                    <motion.line
                      x1={x > 0 ? 0 : Math.abs(x)}
                      y1={y > 0 ? 0 : Math.abs(y)}
                      x2={x > 0 ? Math.abs(x) : 0}
                      y2={y > 0 ? Math.abs(y) : 0}
                      stroke={spoke.color}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                    />
                  </svg>

                  {/* Animated Signal */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: spoke.color }}
                    animate={{
                      x: [0, -x / 2, 0],
                      y: [0, -y / 2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1.5 + index * 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Brikk doesn't just automate each department —
            <br />
            <span className="text-primary">it unites them into one intelligent enterprise.</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full"
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-primary">
              "Brikk doesn't just automate tasks — it orchestrates your business."
            </span>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="flex items-center justify-center gap-4"
        >
          <Button
            onClick={onReplayTrilogy}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Replay Trilogy
          </Button>

          <Button
            onClick={onBackToGallery}
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Home className="h-5 w-5" />
            Back to Gallery
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { label: 'Workflows Executed', value: '3' },
            { label: 'Systems Coordinated', value: '12' },
            { label: 'Time Saved', value: '~5h' },
          ].map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

