import { Suspense } from 'react';
import { HistoryDashboardClient } from '@/components/history-dashboard-client';
import { fetchHistory } from '@/actions/fetch-history';
import { HistoryCardSkeleton } from '@/components/history-card-skeleton';
import { ErrorState } from '@/components/error-state';

async function HistoryContent({ month, day }: { month: number; day: number }) {
  try {
    const data = await fetchHistory({ month, day, bypassCache: false });
    return <HistoryDashboardClient initialData={data} month={month} day={day} />;
  } catch (error) {
    console.error('Error in HistoryContent:', error);
    return <ErrorState message="Failed to load historical data. Please try again later." onRetry={() => window.location.reload()} />;
  }
}

export const dynamic = 'force-dynamic';

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl pt-32 lg:pt-12">
      <div className="mb-12">
        <div className="h-16 w-80 bg-muted/40 rounded-xl mb-4 animate-pulse glass" />
        <div className="h-6 w-56 bg-muted/30 rounded-lg animate-pulse glass" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="h-96 bg-muted/20 rounded-2xl glass animate-pulse" />
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-muted/20 rounded-2xl glass animate-pulse" />
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
  let month: number;
  let day: number;

  try {
    const resolvedParams = await searchParams;
    month = parseInt(resolvedParams.month ?? String(today.getMonth() + 1));
    day = parseInt(resolvedParams.day ?? String(today.getDate()));
  } catch (error) {
    console.error('Error parsing search params:', error);
    month = today.getMonth() + 1;
    day = today.getDate();
  }

  return (
    <main>
      <Suspense fallback={<LoadingSkeleton />}>
        <HistoryContent month={month} day={day} />
      </Suspense>
    </main>
  );
}
