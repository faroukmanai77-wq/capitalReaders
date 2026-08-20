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
    // Points at another list's `path`. Set only on sub-topic pages, never on
    // hub pages — a hub's "sub-topics" section is computed by scanning the
    // collection for entries whose pillarPath matches the hub's own path,
    // so adding a new child never requires editing the parent hub's file.
    pillarPath: z.string().optional(),
  }),
});

const guideBook = z.object({
  title: z.string(),
  author: z.string(),
  coverImageUrl: z.string().optional(),
  amazonUrl: z.string().url().optional(),
  bookshopUrl: z.string().url().optional(),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/guides' }),
  schema: z.object({
    path: z.string(),
    format: z.enum(['deepdive', 'comparison']),
    pillarPath: z.string(),
    category: z.string(),
    kicker: z.string(),
    title: z.string(),
    intro: z.string(),
    updated: z.coerce.date(),
    seo: z.object({
      title: z.string(),
      description: z.string().max(160),
    }),
    // deepdive
    book: guideBook.optional(),
    takeaways: z.array(z.object({ title: z.string(), body: z.string() })).length(5).optional(),
    // comparison
    bookA: guideBook.optional(),
    bookB: guideBook.optional(),
    comparisonRows: z.array(z.object({ dimension: z.string(), a: z.string(), b: z.string() })).optional(),
    verdict: z.string().optional(),
  }),
});

export const collections = { lists, guides };
