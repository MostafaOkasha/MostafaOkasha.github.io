import { buildSearchIndex } from '../data/search-index';

// Prerendered to dist/search.json at build time; fetched (and then cached by
// the browser) the first time someone opens the ⌘K palette.
export async function GET() {
  return new Response(JSON.stringify(await buildSearchIndex()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
