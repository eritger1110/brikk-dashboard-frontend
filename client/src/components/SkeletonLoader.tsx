import { Card } from './ui/card';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'table' | 'chart' | 'metric';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ type = 'card', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'metric':
        return (
          <Card className={`p-6 ${className}`}>
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
              </div>
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          </Card>
        );

      case 'card':
        return (
          <Card className={`p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
            </div>
          </Card>
        );

      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="h-3 w-1/3 bg-muted rounded" />
                  </div>
                  <div className="h-8 w-20 bg-muted rounded" />
                </div>
              </Card>
            ))}
          </div>
        );

      case 'table':
        return (
          <Card className={`overflow-hidden ${className}`}>
            <div className="animate-pulse">
              {/* Table header */}
              <div className="border-b p-4 bg-muted/30">
                <div className="flex gap-4">
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                </div>
              </div>
              {/* Table rows */}
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="border-b p-4">
                  <div className="flex gap-4">
                    <div className="h-4 w-1/4 bg-muted rounded" />
                    <div className="h-4 w-1/4 bg-muted rounded" />
                    <div className="h-4 w-1/4 bg-muted rounded" />
                    <div className="h-4 w-1/4 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'chart':
        return (
          <Card className={`p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-8 w-24 bg-muted rounded" />
              </div>
              <div className="h-64 bg-muted rounded-lg relative overflow-hidden">
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-muted rounded-full" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-muted rounded-full" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div role="status" aria-live="polite" aria-label="Loading content">
      {type === 'list' || type === 'table' ? (
        renderSkeleton()
      ) : (
        <>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Add shimmer animation to global CSS
export const skeletonStyles = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;
