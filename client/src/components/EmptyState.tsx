import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  ariaLabel?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  ariaLabel,
}: EmptyStateProps) {
  return (
    <Card 
      className="p-12 text-center border-dashed border-2 hover:border-primary/50 transition-all duration-300"
      role="region"
      aria-label={ariaLabel || `Empty state: ${title}`}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Animated Icon - Decorative, hidden from screen readers */}
        <div className="relative inline-flex" aria-hidden="true">
          {/* Pulsing background */}
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
          
          {/* Icon container with gradient */}
          <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
            <Icon className="w-16 h-16 text-primary animate-in fade-in zoom-in duration-500" />
          </div>
          
          {/* Decorative rings */}
          <div className="absolute -inset-2 border-2 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-4 border border-primary/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
        </div>

        {/* Content - Semantic heading structure */}
        <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-700">
          <h3 
            className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            id="empty-state-title"
          >
            {title}
          </h3>
          <p 
            className="text-muted-foreground text-base leading-relaxed"
            id="empty-state-description"
          >
            {description}
          </p>
        </div>

        {/* Actions - Keyboard accessible with proper focus management */}
        {(actionLabel || secondaryActionLabel) && (
          <div 
            className="flex items-center justify-center gap-3 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-150"
            role="group"
            aria-labelledby="empty-state-title"
          >
            {actionLabel && onAction && (
              <Button
                onClick={onAction}
                size="lg"
                className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-primary/50"
                aria-describedby="empty-state-description"
              >
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button
                onClick={onSecondaryAction}
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-primary/50"
                aria-describedby="empty-state-description"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}

        {/* Decorative gradient line - Hidden from screen readers */}
        <div className="pt-6" aria-hidden="true">
          <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </div>
    </Card>
  );
}
