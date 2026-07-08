/* Site behavior, consolidated from the inline scripts that used to live in
   _includes/header.html, home-body.html and scripts.html.
   Loaded with `defer`, so the DOM is ready when this runs. */

(function () {
  'use strict';

  /* ---- Tab title swap when the page loses focus ---- */
  var originalTitle = document.title;
  window.addEventListener('blur', function () {
    document.title = 'Away | Mostafa Okasha';
  });
  window.addEventListener('focus', function () {
    document.title = originalTitle;
  });

  /* ---- Hero video parallax (desktop only — phones get the static
     background instead of a 7MB video) ---- */
  var hero = document.querySelector('.jarallax');
  if (hero && typeof jarallax !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* wait for the load event so the video download never competes
       with images and fonts for first-paint bandwidth */
    window.addEventListener('load', function () {
      jarallax(hero, {
        speed: 0.8,
        videoSrc: 'mp4:/videos/hero_2026.mp4'
      });
    });
  }

  /* ---- Image lightbox galleries ---- */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  /* ---- Typewriter in the hero ---- */
  var app = document.getElementById('app');
  if (app && typeof Typewriter !== 'undefined') {
    new Typewriter(app, { loop: true })
      .typeString('Explore My: Experiences')
      .pauseFor(1500)
      .deleteChars(11)
      .typeString('Projects')
      .pauseFor(1500)
      .deleteChars(8)
      .typeString('Skills')
      .pauseFor(1500)
      .deleteChars(6)
      .typeString('Education')
      .pauseFor(1500)
      .deleteChars(9)
      .typeString('Values')
      .pauseFor(1500)
      .deleteChars(6)
      .typeString('Goals')
      .pauseFor(1500)
      .deleteChars(5)
      .typeString('Interests')
      .pauseFor(1500)
      .deleteChars(9)
      .typeString('World')
      .pauseFor(5000)
      .deleteAll()
      .typeString('Get To Know Me!')
      .pauseFor(3000)
      .deleteAll()
      .start();
  }

  /* ---- Size the hero picture area to fill the first viewport ---- */
  function headerFit() {
    var header = document.querySelector('.landing-header');
    var wrapper = document.querySelector('.wrapper');
    var pic = document.querySelector('.wrapper-pic');
    if (!header || !wrapper || !pic) return;

    var remaining = window.innerHeight - header.offsetHeight;
    var maxWidth = 0.3 * wrapper.offsetWidth;

    pic.style.height = (maxWidth < remaining ? remaining : maxWidth + 15) + 'px';
  }
  headerFit();
  window.addEventListener('resize', headerFit);

  /* ---- Reveal timeline entries as they scroll into view ---- */
  var items = document.querySelectorAll('.timeline > ul > li');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (item) { observer.observe(item); });
  } else {
    /* Fallback for very old browsers: show everything */
    items.forEach(function (item) { item.classList.add('in-view'); });
  }
})();
