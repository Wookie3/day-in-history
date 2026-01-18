import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function HistoryCardSkeleton() {
  return (
    <Card className="overflow-hidden border-l-4 border-l-slate-300 dark:border-l-slate-700">
      <Skeleton className="h-48 w-full" />

      <CardContent className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
