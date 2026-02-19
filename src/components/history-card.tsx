'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Expand, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { WikipediaEvent, EventCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card className={cn(
          "group relative h-full overflow-hidden border-2 vintage-frame glass-card",
          categoryBorders[category]
        )}>
          <Badge className={cn(
            "absolute top-3 left-3 z-10 text-white shadow-lg text-lg font-serif-heading font-bold px-3 py-1 border-2 border-white/20 transition-transform group-hover:scale-110",
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
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-slate-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          </div>

          <CardContent className="p-5 space-y-3 flex flex-col h-[calc(100%-12rem)]">
            <h3 className="text-xl font-serif-heading font-semibold leading-tight group-hover:text-accent transition-colors line-clamp-2">
              {pageTitle}
            </h3>
            <p
              className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-grow"
              dangerouslySetInnerHTML={{ __html: event.text || '' }}
            />

            <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
              <a
                href={firstPage?.content_urls?.desktop?.page || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-accent/40 text-primary bg-background/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all font-serif-heading h-9 gap-1.5 px-4 group/btn shadow-sm"
              >
                Read Article
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
              <Button
                variant="vintage"
                size="icon"
                className="hover:bg-accent/20 hover:text-accent rounded-full glass"
                onClick={() => setIsDialogOpen(true)}
                title="Read full description"
                aria-label="Expand to read more"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="vintage-frame vintage-shadow-lg max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif-heading text-2xl">
              {pageTitle}
            </DialogTitle>
            <div className="vintage-divider-ornament text-sm text-accent font-serif-body mt-1">
              {event.year} • {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="prose prose max-w-none">
              <p className="text-foreground leading-relaxed">
                {firstPage?.extract || event.text || 'No description available.'}
              </p>
            </div>
          </DialogDescription>

          <div className="flex justify-end pt-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="font-serif-heading"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
