import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Keep archive-only media out of the deploy. The root media dirs are symlinked
 * into public/, so Astro copies every file into dist/ — including large raw
 * originals no page has ever linked. archive-only-media.txt lists those (see its
 * header for how it was built); this hook removes them from dist/ after the build.
 *
 * Safety rails:
 *  - the build FAILS if any built page, style, script or feed references a
 *    listed file, so a file can never be silently un-published while in use;
 *  - it only ever deletes inside dist/ — a path that is a symlink or resolves
 *    outside dist/ aborts the build instead of reaching the repo's real media.
 */
function archiveOnlyMedia() {
  return {
    name: 'archive-only-media',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fs.realpathSync(fileURLToPath(dir));
        const list = fs
          .readFileSync(new URL('./archive-only-media.txt', import.meta.url), 'utf8')
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith('#'));

        // 1. no built output may reference an archived file
        const chunks = [];
        (function walk(d) {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (/\.(html|css|js|mjs|json|xml|txt|webmanifest)$/i.test(e.name)) {
              chunks.push(fs.readFileSync(p, 'utf8'));
            }
          }
        })(out);
        const corpus = chunks.join('\n');
        const inUse = list.filter((rel) => {
          const base = path.basename(rel);
          return [base, encodeURI(base)].some((v) => corpus.includes(v));
        });
        if (inUse.length) {
          throw new Error(
            'archive-only media is referenced by the built site. Remove these lines from ' +
              'archive-only-media.txt to publish them again:\n  ' +
              inUse.join('\n  ')
          );
        }

        // 2. delete from dist/ only — never follow a path out of it
        let bytes = 0;
        let count = 0;
        for (const rel of list) {
          const target = path.join(out, rel);
          if (!fs.existsSync(target)) continue;
          const stat = fs.lstatSync(target);
          const real = fs.realpathSync(target);
          if (stat.isSymbolicLink() || !stat.isFile() || !real.startsWith(out + path.sep)) {
            throw new Error(`refusing to remove "${rel}": it is not a plain file inside dist/ (${real})`);
          }
          bytes += stat.size;
          count += 1;
          fs.unlinkSync(target);
        }
        logger.info(
          `excluded ${count} archive-only media files (${(bytes / 1048576).toFixed(1)} MB) from the deploy`
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.okasha.me',
  trailingSlash: 'never',
  integrations: [sitemap(), archiveOnlyMedia()],
  build: {
    format: 'file',
  },
});
