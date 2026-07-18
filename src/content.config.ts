import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The Library: every entry is a markdown file in src/content/library/.
 * Drop a file in, it appears on the shelf that matches its `type`.
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
      'book', // book summaries
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

    // Optional book metadata — set on `type: book` entries. Renders as a
    // properties panel at the top of the page. All fields optional except author.
    book: z
      .object({
        author: z.string(),
        cover: z.string().optional(), // /images/... path to the cover
        pages: z.number().optional(),
        published: z.string().optional(), // e.g. "June 20, 2022"
        publisher: z.string().optional(),
        status: z.enum(['To read', 'In progress', 'Finished']).optional(),
        rating: z.number().min(0).max(5).optional(), // out of 5
        categories: z.array(z.string()).default([]),
        links: z
          .object({ goodreads: z.string().optional(), amazon: z.string().optional() })
          .optional(),
      })
      .optional(),
  }),
});

export const collections = { library };
