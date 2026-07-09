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
  }),
});

export const collections = { library };
