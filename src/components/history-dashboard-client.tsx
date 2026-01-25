'use client';

import { useState } from 'react';
import { HistoryCard } from '@/components/history-card';
import { HistoryCardSkeleton } from '@/components/history-card-skeleton';
import { ErrorState } from '@/components/error-state';
import { EmptyState } from '@/components/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { WikipediaFeed, EventCategory } from '@/lib/types';

interface HistoryDashboardClientProps {
  initialData: WikipediaFeed;
  month: number;
  day: number;
}

export function HistoryDashboardClient({
  initialData,
  month: initialMonth,
  day: initialDay,
}: HistoryDashboardClientProps) {
  const { theme, setTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date(2026, initialMonth - 1, initialDay));
  const [data, setData] = useState<WikipediaFeed>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentMonth = selectedDate.getMonth() + 1;
  const currentDay = selectedDate.getDate();

  const fetchHistoryData = async (month: number, day: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, day }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const newData = await response.json();
      setData(newData);
    } catch (err) {
      setError('Unable to load historical data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchHistoryData(date.getMonth() + 1, date.getDate());
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    handleDateChange(newDate);
  };

  const EventsList = ({ category, events }: { category: EventCategory; events: any[] }) => {
    if (isLoading) {
      return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <HistoryCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (events.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {events.map((event, index) => (
          <div
            key={`${event.year}-${index}`}
            className="break-inside-avoid"
          >
            <HistoryCard event={event} category={category} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif-heading font-bold mb-2 elegant-underline">
            This Day in History
          </h1>
          <div className="vintage-divider-ornament text-lg text-accent mt-4">
            {format(selectedDate, 'MMMM d, yyyy')}
          </div>
        </div>

        <Button
          variant="vintage"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="vintage-border-hover"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <Card className="vintage-frame vintage-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-serif-heading">
                Calendar
                <Badge variant="secondary" className="ml-2 font-serif-heading font-semibold border-2 border-accent">
                  {format(selectedDate, 'MMM d')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="vintage"
                  size="icon"
                  onClick={() => navigateDate(-1)}
                  className="vintage-border-hover"
                  title="Previous day"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-serif-heading font-semibold gold-accent-text">
                  {format(selectedDate, 'MMM d')}
                </span>
                <Button
                  variant="vintage"
                  size="icon"
                  onClick={() => navigateDate(1)}
                  className="vintage-border-hover"
                  title="Next day"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border-2 border-accent"
                disabled={(date) =>
                  date > new Date() || date < new Date('0001-01-01')
                }
              />
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          {error && <ErrorState message={error} onRetry={() => fetchHistoryData(currentMonth, currentDay)} />}

          {!error && (
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="featured">
                  Featured
                </TabsTrigger>
                <TabsTrigger value="births">
                  Births
                </TabsTrigger>
                <TabsTrigger value="deaths">
                  Deaths
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                <TabsContent value="featured">
                  <EventsList category={EventCategory.FEATURED} events={data.events} />
                </TabsContent>

                <TabsContent value="births">
                  <EventsList category={EventCategory.BIRTHS} events={data.births} />
                </TabsContent>

                <TabsContent value="deaths">
                  <EventsList category={EventCategory.DEATHS} events={data.deaths} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}
