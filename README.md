# MostafaOkasha.github.io
## Personal Website and Portfolio
### Check out: https://www.okasha.me


&nbsp;

This website was created in 2019 using an open-source Jekyll theme, heavily modified over the years. As of 2026 it is plain Jekyll + vanilla JavaScript — no jQuery, no frameworks.

This is hosted on [Github Pages](https://pages.github.com/), with a custom domain name (okasha.me) through NameCheap, SSL Certified through Cloudflare with custom global CDN hosting (overkill, I know).


&nbsp;


## Running Locally

To get started with Jekyll for Github Pages web hosting see the Jekyll Guide [here](https://jekyllrb.com/docs/)

```console
git clone https://github.com/MostafaOkasha/MostafaOkasha.github.io
cd MostafaOkasha.github.io
bundle install
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 bundle exec jekyll serve
# or on a different port:
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 bundle exec jekyll serve --port 4001
```

The UTF-8 locale variables matter: the GitHub Pages sass converter fails with `Invalid US-ASCII character` without them. Stop the server with <kbd>Ctrl</kbd><kbd>C</kbd>.

## Project Structure

- `_layouts/default.html` — the single page layout (head, header, content, footer, scripts)
- `_includes/` — page sections: `home-body.html` (experience/education/projects/skills/design/about), `header.html` (hero + video parallax), `head.html`, `scripts.html`, `icon.html` (inline SVG icons)
- `css/stylesheet.css` — all styling, including the mobile layout (`@media (max-width: 768px)` block at the bottom)
- `javascripts/main.js` — all site behavior (typewriter, timeline reveal, lightbox, hero video)
- `images/webp/` — optimized WebP versions used for display; originals elsewhere in `images/` are kept for the lightbox full-size views
- `resume/resume.pdf` — linked from the nav

Third-party libraries (all loaded deferred from CDNs): [GLightbox](https://biati-digital.github.io/glightbox/) for galleries, [Jarallax](https://github.com/nk-o/jarallax) for the hero video parallax, [TypewriterJS](https://github.com/tameemsafi/typewriterjs) for the hero text.

&nbsp;

# License

www.okasha.me is licensed under The MIT License. You can view it [here](https://github.com/MostafaOkasha/MostafaOkasha.github.io/blob/master/LICENSE).

&nbsp;

##### Built using Jekyll, HTML5, CSS3
