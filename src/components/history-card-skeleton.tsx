import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function HistoryCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 vintage-frame glass-card animate-pulse">
      <Skeleton className="h-48 w-full opacity-40" />

      <CardContent className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full opacity-40" />
        </div>

        <Skeleton className="h-8 w-3/4 opacity-40" />
        <Skeleton className="h-4 w-full opacity-30" />
        <Skeleton className="h-4 w-5/6 opacity-30" />

        <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
          <Skeleton className="h-9 w-28 rounded-lg opacity-40" />
          <Skeleton className="h-9 w-9 rounded-full opacity-40" />
        </div>
      </CardContent>
    </Card>
  );
}
