import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  X,
  MessageSquare,
  Mail,
  FileSpreadsheet,
  Image,
  DollarSign,
  Route,
  FileText,
  Megaphone,
  Check,
} from 'lucide-react';
import { ResultTile } from '@/hooks/useResultsPane';

interface ResultsPaneProps {
  tiles: ResultTile[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultsPane({ tiles, isOpen, onClose }: ResultsPaneProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-card border-l border-border shadow-2xl z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Results</h3>
          <p className="text-xs text-muted-foreground">{tiles.length} actions completed</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tiles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <ResultTileCard tile={tile} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ResultTileCard({ tile }: { tile: ResultTile }) {
  const getIcon = () => {
    switch (tile.type) {
      case 'slack':
        return <MessageSquare className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sheet':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'creative':
        return <Image className="h-5 w-5" />;
      case 'budget':
        return <DollarSign className="h-5 w-5" />;
      case 'route':
        return <Route className="h-5 w-5" />;
      case 'plan':
        return <FileText className="h-5 w-5" />;
      case 'campaign':
        return <Megaphone className="h-5 w-5" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  const getColor = () => {
    switch (tile.type) {
      case 'slack':
        return '#4A154B'; // Slack purple
      case 'email':
        return '#EA4335'; // Gmail red
      case 'sheet':
        return '#0F9D58'; // Google green
      case 'creative':
        return '#1877F2'; // Meta blue
      case 'budget':
        return '#FBBC04'; // Google yellow
      case 'route':
        return '#8B5CF6'; // Purple
      case 'plan':
        return '#3B82F6'; // Blue
      case 'campaign':
        return '#F59E0B'; // Amber
      default:
        return '#10B981'; // Green
    }
  };

  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Color accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: getColor() }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pl-3">
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${getColor()}20`, color: getColor() }}
          >
            {getIcon()}
          </div>
          <div>
            <h4 className="font-medium text-sm">{tile.title}</h4>
            <p className="text-xs text-muted-foreground">
              {tile.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {tile.isLive && (
          <Badge variant="outline" className="text-xs border-green-500 text-green-500">
            <Check className="h-3 w-3 mr-1" />
            Sent live
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="pl-3">
        {tile.type === 'slack' && (
          <div className="bg-muted/50 rounded p-3 text-sm">
            <p className="font-medium text-xs text-muted-foreground mb-1">
              {tile.content.channel}
            </p>
            <p>{tile.content.message}</p>
          </div>
        )}

        {tile.type === 'email' && (
          <div className="space-y-2">
            <div className="text-xs">
              <span className="text-muted-foreground">To:</span>{' '}
              <span className="font-medium">{tile.content.recipient}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Subject:</span>{' '}
              <span className="font-medium">{tile.content.subject}</span>
            </div>
            <div className="bg-muted/50 rounded p-2 text-xs">{tile.content.preview}</div>
          </div>
        )}

        {tile.type === 'sheet' && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {tile.content.spreadsheetName}
            </div>
            <div className="bg-muted/50 rounded p-2 text-xs font-mono">
              {Object.entries(tile.content.row).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {tile.type === 'creative' && (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Before</div>
              <div className="bg-muted/30 rounded p-2 text-xs line-through opacity-60">
                <div className="font-medium">{tile.content.before.headline}</div>
                <div className="text-muted-foreground">{tile.content.before.cta}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-green-600 mb-1">After</div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-xs">
                <div className="font-medium">{tile.content.after.headline}</div>
                <div className="text-muted-foreground">{tile.content.after.cta}</div>
              </div>
            </div>
          </div>
        )}

        {tile.type === 'budget' && (
          <div className="space-y-2">
            {tile.content.shifts.map((shift: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-medium">{shift.platform}</span>
                <Badge
                  variant="outline"
                  className={shift.change > 0 ? 'text-green-600' : 'text-red-600'}
                >
                  {shift.change > 0 ? '+' : ''}
                  {shift.change}%
                </Badge>
              </div>
            ))}
          </div>
        )}

        {tile.type === 'route' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{tile.content.distance} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reduction</span>
              <Badge variant="outline" className="text-green-600">
                –{(tile.content.reduction * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated Time</span>
              <span className="font-medium">{tile.content.estimatedTime}</span>
            </div>
          </div>
        )}

        {tile.type === 'plan' && (
          <div className="space-y-2">
            <div className="text-xs">
              <span className="text-muted-foreground">Plan ID:</span>{' '}
              <span className="font-mono">{tile.content.planId}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Status:</span>{' '}
              <Badge variant="outline" className="text-amber-600">
                {tile.content.status}
              </Badge>
            </div>
            <div className="space-y-1">
              {tile.content.moves.slice(0, 2).map((move: any, idx: number) => (
                <div key={idx} className="text-xs bg-muted/50 rounded p-2">
                  {move.from} → {move.to}: {move.units} units
                </div>
              ))}
              {tile.content.moves.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{tile.content.moves.length - 2} more moves
                </div>
              )}
            </div>
          </div>
        )}

        {tile.type === 'campaign' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Campaign ID</span>
              <span className="font-mono">{tile.content.campaignId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Action</span>
              <Badge variant="outline">{tile.content.action}</Badge>
            </div>
            {tile.content.adSpendSaved && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ad Spend Saved</span>
                <span className="font-semibold text-green-600">
                  ${tile.content.adSpendSaved.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

