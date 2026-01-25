'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Bookmark, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { WikipediaEvent, EventCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HistoryCardProps {
  event: WikipediaEvent;
  category: EventCategory;
}

const categoryColors = {
  [EventCategory.FEATURED]: 'bg-gradient-to-r from-amber-600 to-amber-700',
  [EventCategory.BIRTHS]: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
  [EventCategory.DEATHS]: 'bg-gradient-to-r from-purple-600 to-purple-700',
};

const categoryBorders = {
  [EventCategory.FEATURED]: 'border-accent',
  [EventCategory.BIRTHS]: 'border-secondary',
  [EventCategory.DEATHS]: 'border-primary',
};

function formatTitle(title?: string): string {
  return title?.replace(/_/g, ' ') || 'Untitled Event';
}

export function HistoryCard({ event, category }: HistoryCardProps) {
  const firstPage = event.pages?.[0];
  const thumbnail = firstPage?.thumbnail;
  const pageTitle = formatTitle(firstPage?.title);
  
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500 hover:vintage-shadow-lg hover:-translate-y-1 border-2 vintage-frame vintage-hover",
      categoryBorders[category]
    )}>
      <Badge className={cn(
        "absolute top-3 left-3 z-10 text-white shadow-lg text-lg font-serif-heading font-bold px-3 py-1 border-2 border-white/20",
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
        <h3 className="text-xl font-serif-heading font-semibold leading-tight group-hover:text-accent transition-colors line-clamp-2">
          {pageTitle}
        </h3>
        <p
          className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: event.text || '' }}
        />

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <a
            href={firstPage?.content_urls?.desktop?.page || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 border-accent text-primary bg-background hover:bg-accent/10 hover:border-accent hover:vintage-shadow transition-all font-serif-heading h-8 gap-1.5 px-3 group/btn"
          >
            Read Article
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
          <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
