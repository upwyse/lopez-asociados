// =========================================================
// López & Asociados — shared site behavior
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTeamSearch();
  initTeamTabs();
  initContactForm();
  initScrollReveal();
  initHeaderShadow();
});

// ---------------------------------------------------------
// Mobile navigation toggle
// ---------------------------------------------------------
const initMobileNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Direct links close the mobile menu; dropdown parents toggle an accordion
  links.querySelectorAll('a').forEach((link) => {
    if (link.closest('.nav-dropdown')) {
      // links inside a dropdown just close the whole menu on click
      link.addEventListener('click', () => links.classList.remove('open'));
    }
  });

  // On mobile, tapping a dropdown's top-level label toggles its panel
  links.querySelectorAll('.nav-item > a').forEach((parentLink) => {
    parentLink.addEventListener('click', (event) => {
      if (window.innerWidth > 980) return; // desktop uses hover
      event.preventDefault();
      parentLink.parentElement.classList.toggle('open');
    });
  });

  // Plain top-level links (Inicio, Nuestro Equipo, Contacto) close the menu
  links.querySelectorAll(':scope > a').forEach((link) => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
};

// ---------------------------------------------------------
// Team search filter (Nuestro Equipo page)
// ---------------------------------------------------------
const initTeamSearch = () => {
  const search = document.getElementById('team-search');
  const cards = document.querySelectorAll('.team-card');
  const empty = document.querySelector('.team-empty');
  if (!search || cards.length === 0) return;

  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const haystack = (card.dataset.name || '').toLowerCase();
      const match = haystack.includes(query);
      card.classList.toggle('hidden', !match);
      if (match) visible += 1;
    });

    if (empty) empty.classList.toggle('show', visible === 0);
  });
};

// ---------------------------------------------------------
// Sidebar category tabs (Nuestro Equipo page)
// ---------------------------------------------------------
const initTeamTabs = () => {
  const tabButtons = document.querySelectorAll('.side-nav button');
  const tabNote = document.getElementById('team-tab-note');
  const teamGridWrap = document.getElementById('team-grid-wrap');
  if (tabButtons.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const isPartners = btn.dataset.tab === 'socios';
      if (teamGridWrap) teamGridWrap.classList.toggle('is-hidden', !isPartners);
      if (tabNote) tabNote.classList.toggle('show', !isPartners);
    });
  });
};

// ---------------------------------------------------------
// Contact form: validation + success message (static site,
// no backend — shows a confirmation on valid submit).
// ---------------------------------------------------------
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (success) success.classList.add('show');
    form.reset();

    // Hide the confirmation again after a while
    window.setTimeout(() => {
      if (success) success.classList.remove('show');
    }, 8000);
  });
};

// ---------------------------------------------------------
// Scroll-reveal animations (progressive enhancement).
// The hiding CSS only applies once .js-reveal is added, so if JS
// fails to run, all content stays visible.
// ---------------------------------------------------------
const initScrollReveal = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0 || reduceMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach((el) => observer.observe(el));
};

// ---------------------------------------------------------
// Header gains a shadow once the page is scrolled
// ---------------------------------------------------------
const initHeaderShadow = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};
