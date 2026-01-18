import { Suspense } from 'react';
import { HistoryDashboardClient } from '@/components/history-dashboard-client';
import { fetchHistory } from '@/actions/fetch-history';
import { HistoryCardSkeleton } from '@/components/history-card-skeleton';

async function HistoryContent({ month, day }: { month: number; day: number }) {
  const data = await fetchHistory({ month, day, bypassCache: false });

  return <HistoryDashboardClient initialData={data} month={month} day={day} />;
}

export const dynamic = 'force-dynamic';

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <div className="h-12 w-64 bg-muted rounded mb-2" />
        <div className="h-6 w-48 bg-muted rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="h-64 bg-muted rounded-lg" />
        </div>

        <div className="lg:col-span-3">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HistoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const today = new Date();
  const resolvedParams = await searchParams;
  const month = parseInt(resolvedParams.month ?? String(today.getMonth() + 1));
  const day = parseInt(resolvedParams.day ?? String(today.getDate()));

  return (
    <main>
      <Suspense fallback={<LoadingSkeleton />}>
        <HistoryContent month={month} day={day} />
      </Suspense>
    </main>
  );
}
