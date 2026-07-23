import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The Library: essays, notes, papers, reflections, quotes… one shelf system.
 * (Books live in their own `books` collection — see below.)
 */
const library = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!_templates/**'], base: './src/content/library' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum([
      'essay', // essays & deep dives
      'cs', // CS curriculum
      'ml', // ML / AI notes
      'paper', // paper notes
      'idea', // open ideas
      'reflection', // personal reflections
      'quote', // quotes + commentary
      'spirit', // spirituality
      'resources', // resource maps
    ]),
    topics: z.array(z.string()).default([]),
    date: z.coerce.date(),
    readingTime: z.number().optional(), // minutes; computed from words if absent
    draft: z.boolean().default(false),
  }),
});

/**
 * The Bookshelf: every book I've read, am reading, or want to read.
 * The markdown body is the summary/notes (optional — reading & to-read
 * books can have none). Grouped on /books by `status`.
 */
const books = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!_templates/**'], base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string().optional(),
    cover: z.string().optional(), // /images/covers/... ; falls back to a spine card
    status: z.enum(['To read', 'Currently reading', 'Finished']),
    recommended: z.boolean().default(false),
    rating: z.number().min(0).max(5).optional(),
    pages: z.number().optional(),
    published: z.string().optional(),
    publisher: z.string().optional(),
    categories: z.array(z.string()).default([]),
    topics: z.array(z.string()).default([]),
    date: z.coerce.date().optional(), // when read / added
    purchase: z.string().optional(),
    links: z
      .object({ goodreads: z.string().optional(), amazon: z.string().optional() })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { library, books };
