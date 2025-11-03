import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ROIMetric } from '@/lib/demo-flows';
import { TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';

interface ROIMetricsPanelProps {
  metrics: ROIMetric[];
  quote: string;
}

export default function ROIMetricsPanel({ metrics, quote }: ROIMetricsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* ROI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.15, type: 'spring' }}
          >
            <Card className="p-6 border-2 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{metric.icon}</div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                >
                  Impact
                </motion.div>
              </div>

              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {metric.label}
              </h4>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.2 }}
                className="text-3xl font-bold"
                style={{ color: metric.color }}
              >
                {metric.value}
              </motion.div>

              {/* Animated Progress Bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.15 + 0.4, duration: 0.8 }}
                className="mt-4 h-1 rounded-full origin-left"
                style={{ backgroundColor: metric.color }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quote Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="p-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border-2 border-primary/20">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary"
            >
              <Zap className="h-8 w-8" />
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-2xl font-semibold text-foreground italic"
            >
              "{quote}"
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Automated</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-500" />
                <span>Cost-effective</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { label: 'Execution Time', value: '< 60s', icon: Clock },
          { label: 'Steps Completed', value: '100%', icon: TrendingUp },
          { label: 'Error Rate', value: '0%', icon: Zap },
          { label: 'Confidence', value: '94%', icon: DollarSign },
        ].map((stat, index) => (
          <Card key={index} className="p-4 text-center">
            <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
            <div className="text-lg font-bold">{stat.value}</div>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}

