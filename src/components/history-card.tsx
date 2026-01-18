'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Image as ImageIcon, Bookmark, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { WikipediaEvent, EventCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HistoryCardProps {
  event: WikipediaEvent;
  category: EventCategory;
}

const categoryColors = {
  [EventCategory.FEATURED]: 'bg-gradient-to-r from-amber-500 to-orange-500',
  [EventCategory.BIRTHS]: 'bg-gradient-to-r from-emerald-500 to-green-500',
  [EventCategory.DEATHS]: 'bg-gradient-to-r from-purple-500 to-violet-500',
};

const categoryBorders = {
  [EventCategory.FEATURED]: 'border-l-amber-500',
  [EventCategory.BIRTHS]: 'border-l-emerald-500',
  [EventCategory.DEATHS]: 'border-l-purple-500',
};

function formatTitle(title?: string): string {
  return title?.replace(/_/g, ' ') || 'Untitled Event';
}

export function HistoryCard({ event, category }: HistoryCardProps) {
  const thumbnail = event.pages[0]?.thumbnail;
  const pageTitle = formatTitle(event.pages[0]?.title);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className={cn(
          "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4",
          categoryBorders[category]
        )}>
          <Badge className={cn(
            "absolute top-3 left-3 z-10 text-white shadow-lg text-lg font-bold px-3 py-1",
            categoryColors[category]
          )}>
            {event.year}
          </Badge>

          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {thumbnail ? (
              <Image
                src={thumbnail.source}
                alt={pageTitle}
                width={thumbnail.width}
                height={thumbnail.height}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-slate-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <CardContent className="p-5 space-y-3">
            <h3 className="text-xl font-semibold leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
              {pageTitle}
            </h3>
            <p
              className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: event.text }}
            />

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <a
                href={event.pages[0]?.content_urls?.desktop?.page || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="group/btn" asChild>
                  <span>
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </span>
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="hover:bg-amber-100 dark:hover:bg-amber-900/20">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{pageTitle}</h4>
          <p
            className="text-sm text-muted-foreground line-clamp-4"
            dangerouslySetInnerHTML={{ __html: event.pages[0]?.extract || event.text }}
          />
          <a
            href={event.pages[0]?.content_urls?.desktop?.page || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="w-full mt-2" asChild>
              <span>View Full Article</span>
            </Button>
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
