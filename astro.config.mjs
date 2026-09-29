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

/**
 * Drafts and placeholders (see src/data/drafts.ts for the rule).
 *
 * dev   — pages under src/drafts/pages/ are routed at the same path they will
 *         have once moved into src/pages/ (or under /drafts/ when that path is
 *         already taken, e.g. the About rewrite at /drafts/about), plus the
 *         /drafts dashboard. None of these exist in a production build.
 * build — two guards, so a template can never ship:
 *         1. no ✎ placeholder may appear anywhere in the output;
 *         2. no internal link may point at a page or file that was not built
 *            (catches a draft that was un-drafted but not moved, typos, and
 *            anything that links to a template).
 */
function draftsAndGuards() {
  const root = fileURLToPath(new URL('.', import.meta.url));
  const draftPages = path.join(root, 'src/drafts/pages');
  const realPages = path.join(root, 'src/pages');

  return {
    name: 'drafts-and-guards',
    hooks: {
      'astro:config:setup': ({ command, injectRoute, logger }) => {
        if (command !== 'dev') return;
        injectRoute({ pattern: '/drafts', entrypoint: path.join(root, 'src/drafts/dashboard.astro') });
        if (!fs.existsSync(draftPages)) return;
        (function walk(dir) {
          for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, e.name);
            if (e.isDirectory()) { walk(abs); continue; }
            if (!e.name.endsWith('.astro')) continue;
            const rel = path.relative(draftPages, abs).replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
            const taken = ['.astro', '/index.astro'].some((x) => fs.existsSync(path.join(realPages, rel + x)));
            const pattern = (taken ? '/drafts/' : '/') + rel;
            injectRoute({ pattern, entrypoint: abs });
            logger.info(`draft page ${pattern}  <-  src/drafts/pages/${rel}.astro`);
          }
        })(draftPages);
      },

      'astro:build:done': ({ dir }) => {
        const out = fs.realpathSync(fileURLToPath(dir));
        const texts = [];
        (function walk(d) {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (/\.(html|css|js|mjs|json|xml|txt|webmanifest)$/i.test(e.name)) {
              texts.push([path.relative(out, p), fs.readFileSync(p, 'utf8')]);
            }
          }
        })(out);

        // 1. placeholders
        const leaked = texts.filter(([, t]) => t.includes('✎')).map(([f]) => f);
        if (leaked.length) {
          throw new Error(
            'a ✎ placeholder reached the production build. Replace it (or keep the entry ' +
              '`draft: true`) — found in:\n  ' + leaked.join('\n  ')
          );
        }

        // 2. internal links: href/src attributes, plus href/url values in inline JSON
        const exists = (url) => {
          let p = decodeURI(url.split('#')[0].split('?')[0]);
          if (p === '' || p === '/') return fs.existsSync(path.join(out, 'index.html'));
          p = p.replace(/\/$/, '');
          return [p, p + '.html', p + '/index.html'].some((c) => {
            const f = path.join(out, c);
            return f.startsWith(out) && fs.existsSync(f) && fs.statSync(f).isFile();
          });
        };
        const dead = new Set();
        const linkRe = /(?:\b(?:href|src)=["']|["'](?:href|url)["']\s*:\s*["'])(\/(?!\/)[^"'\s]*)["']/g;
        for (const [file, text] of texts) {
          if (!file.endsWith('.html') && !file.endsWith('.json')) continue;
          for (const m of text.matchAll(linkRe)) if (!exists(m[1])) dead.add(`${m[1]}   (in ${file})`);
        }
        if (dead.size) {
          throw new Error('internal links point at pages or files that were not built:\n  ' + [...dead].join('\n  '));
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.okasha.me',
  trailingSlash: 'never',
  integrations: [sitemap(), archiveOnlyMedia(), draftsAndGuards()],
  build: {
    format: 'file',
  },
});
