import { z } from 'zod';

export const WikipediaPageSchema = z.object({
  title: z.string().optional(),
  extract: z.string().nullable().optional(),
  thumbnail: z.object({
    source: z.string().url(),
    width: z.number(),
    height: z.number(),
  }).nullable().optional(),
  content_urls: z.object({
    desktop: z.object({
      page: z.string().url(),
    }).optional(),
  }).optional(),
});

export const WikipediaEventSchema = z.object({
  year: z.number().optional(),
  text: z.string().optional(),
  pages: z.array(WikipediaPageSchema).optional().default([]),
});

export const WikipediaFeedSchema = z.object({
  births: z.array(WikipediaEventSchema).optional().default([]),
  deaths: z.array(WikipediaEventSchema).optional().default([]),
  events: z.array(WikipediaEventSchema).optional().default([]),
});

export type WikipediaPage = z.infer<typeof WikipediaPageSchema>;
export type WikipediaEvent = z.infer<typeof WikipediaEventSchema>;
export type WikipediaFeed = z.infer<typeof WikipediaFeedSchema>;

export enum EventCategory {
  FEATURED = 'featured',
  BIRTHS = 'births',
  DEATHS = 'deaths',
}

export interface HistoryCardProps {
  event: WikipediaEvent;
  category: EventCategory;
}

export interface FetchHistoryInput {
  month: number;
  day: number;
  bypassCache?: boolean;
}
