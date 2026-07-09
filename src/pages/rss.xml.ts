import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SHELF_TYPES } from '../data/shelves';

export async function GET(context: APIContext) {
  const entries = (await getCollection('library', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'Mostafa Okasha — The Library',
    description:
      'Essays, deep dives, CS & ML notes, book summaries, paper notes, open ideas, reflections, and resource maps.',
    site: context.site!,
    items: entries.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/library/${e.id}`,
      categories: [SHELF_TYPES[e.data.type].label, ...e.data.topics],
    })),
    customData: '<language>en-us</language>',
    trailingSlash: false,
  });
}
