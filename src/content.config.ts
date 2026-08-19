import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const book = z.object({
  rank: z.number().int().positive(),
  title: z.string(),
  author: z.string(),
  published: z.string(),
  blurb: z.string(),
  keyIdea: z.string(),
  bestFor: z.string(),
  skipIf: z.string(),
  amazonUrl: z.string().url().optional(),
  bookshopUrl: z.string().url().optional(),
  formats: z.string(),
  coverImageUrl: z.string().optional(),
  isbn13: z.string().optional(),
});

const lists = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/lists' }),
  schema: z.object({
    path: z.string(),
    category: z.string(),
    kicker: z.string(),
    title: z.string(),
    intro: z.string(),
    listKicker: z.string(),
    listTitle: z.string(),
    listStandfirst: z.string(),
    quote: z.string(),
    quoteSource: z.string(),
    cardTitle: z.string(),
    cardSummary: z.string(),
    methodTitle: z.string(),
    methodBody: z.string(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    updated: z.coerce.date(),
    seo: z.object({
      title: z.string(),
      description: z.string().max(160),
      ogImage: z.string().optional(),
    }),
    books: z.array(book).min(1),
  }),
});

export const collections = { lists };
