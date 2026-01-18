import { z } from 'zod';

export const WikipediaPageSchema = z.object({
  title: z.string(),
  extract: z.string().nullable(),
  thumbnail: z.object({
    source: z.string().url(),
    width: z.number(),
    height: z.number(),
  }).nullable().optional(),
  content_urls: z.object({
    desktop: z.object({
      page: z.string().url(),
    }),
  }).optional(),
});

export const WikipediaEventSchema = z.object({
  year: z.number(),
  text: z.string(),
  pages: z.array(WikipediaPageSchema),
});

export const WikipediaFeedSchema = z.object({
  births: z.array(WikipediaEventSchema),
  deaths: z.array(WikipediaEventSchema),
  events: z.array(WikipediaEventSchema),
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
