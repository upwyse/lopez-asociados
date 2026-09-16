// López & Asociados — shared site behavior
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Team search filter (Nuestro Equipo page)
  var search = document.getElementById('team-search');
  var cards = document.querySelectorAll('.team-card');
  var empty = document.querySelector('.team-empty');
  if (search && cards.length) {
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-name').toLowerCase();
        var match = haystack.indexOf(q) !== -1;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (empty) empty.classList.toggle('show', visible === 0);
    });
  }

  // Sidebar category tabs (Nuestro Equipo page)
  var tabButtons = document.querySelectorAll('.side-nav button');
  var tabNote = document.getElementById('team-tab-note');
  var teamGridWrap = document.getElementById('team-grid-wrap');
  if (tabButtons.length) {
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var isPartners = btn.getAttribute('data-tab') === 'socios';
        if (teamGridWrap) teamGridWrap.style.display = isPartners ? '' : 'none';
        if (tabNote) tabNote.style.display = isPartners ? 'none' : 'block';
      });
    });
  }

  // Scroll-reveal animations (progressive enhancement).
  // We add .js-reveal to <html> so the hiding CSS only applies when JS runs.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Header gains a shadow once the page is scrolled
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});
