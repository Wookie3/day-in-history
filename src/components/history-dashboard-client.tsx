'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, Sun, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { WikipediaFeed, EventCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollYRef.current) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={`${event.year}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4, 
                delay: Math.min(index * 0.05, 0.5),
                ease: "easeOut" 
              }}
              className="h-full"
            >
              <HistoryCard event={event} category={category} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <header className={cn(
        "lg:sticky lg:top-0 fixed top-0 left-0 right-0 z-40 glass border-b border-border/40",
        "lg:transition-all transition-transform duration-500",
        !isHeaderVisible && "-translate-y-full"
      )}>
        <div className="container mx-auto py-4 px-4 lg:py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-2xl lg:text-4xl md:text-5xl font-serif-heading font-bold mb-0 lg:mb-2 elegant-underline">
                This Day in History
              </h1>
              <div className="vintage-divider-ornament text-sm lg:text-lg text-accent mt-2 lg:mt-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Button
                variant="vintage"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="vintage-border-hover glass hover:bg-accent/20 transition-all rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <Sheet open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="vintage"
            size="icon"
            className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full shadow-lg lg:hidden vintage-border-hover"
            aria-label="Open calendar"
          >
            <CalendarIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-[50vh] overflow-y-auto">
          <SheetHeader className="px-4 pt-4">
            <SheetTitle className="flex items-center justify-between font-serif-heading">
              Calendar
              <Badge variant="secondary" className="font-serif-heading font-semibold border-2 border-accent">
                {format(selectedDate, 'MMM d')}
              </Badge>
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="vintage"
                size="icon"
                onClick={() => {
                  navigateDate(-1);
                  setIsCalendarOpen(false);
                }}
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
                onClick={() => {
                  navigateDate(1);
                  setIsCalendarOpen(false);
                }}
                className="vintage-border-hover"
                title="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                handleDateChange(date);
                setIsCalendarOpen(false);
              }}
              className="rounded-md border-2 border-accent"
              disabled={(date) =>
                date > new Date() || date < new Date('0001-01-01')
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="container mx-auto px-4 lg:px-0 lg:py-0 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 pt-24 lg:pt-8 lg:pb-12">
        <motion.aside 
          className="hidden lg:block lg:col-span-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Card className="vintage-frame vintage-shadow glass-card border-accent/20 sticky top-32">
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-serif-heading">
                Calendar
                <Badge variant="secondary" className="ml-2 font-serif-heading font-semibold border-2 border-accent/40 bg-accent/10">
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
                  className="vintage-border-hover glass hover:bg-accent/20 rounded-full"
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
                  className="vintage-border-hover glass hover:bg-accent/20 rounded-full"
                  title="Next day"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border-2 border-accent/20 glass"
                disabled={(date) =>
                  date > new Date() || date < new Date('0001-01-01')
                }
              />
            </CardContent>
          </Card>
        </motion.aside>

        <motion.main 
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {error && <ErrorState message={error} onRetry={() => fetchHistoryData(currentMonth, currentDay)} />}

          {!error && (
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 glass p-1 rounded-xl border-border/30">
                <TabsTrigger value="featured" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300">
                  Featured
                </TabsTrigger>
                <TabsTrigger value="births" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300">
                  Births
                </TabsTrigger>
                <TabsTrigger value="deaths" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300">
                  Deaths
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-320px)] w-full pr-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDate.toISOString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <TabsContent value="featured" className="mt-0 outline-none w-full">
                      <EventsList category={EventCategory.FEATURED} events={data.events} />
                    </TabsContent>

                    <TabsContent value="births" className="mt-0 outline-none w-full">
                      <EventsList category={EventCategory.BIRTHS} events={data.births} />
                    </TabsContent>

                    <TabsContent value="deaths" className="mt-0 outline-none w-full">
                      <EventsList category={EventCategory.DEATHS} events={data.deaths} />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </Tabs>
          )}
        </motion.main>
      </div>
    </div>
    </>
  );
}
