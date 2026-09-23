/* =========================================================
   López & Asociados — comportamiento del sitio
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initReveal();
  initGallery();
  initMosaic();
  initPeopleFilter();
  initForm();
});

/* Mosaico: las columnas se desplazan a distinta velocidad con el scroll */
const initMosaic = () => {
  const mosaic = document.getElementById('mosaic');
  if (!mosaic) return;

  const cols = [...mosaic.querySelectorAll('.mos-col')];
  if (!cols.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const update = () => {
    const rect = mosaic.getBoundingClientRect();
    // Progreso de la sección respecto a la ventana: -1 (abajo) .. 1 (arriba)
    const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;

    cols.forEach((col) => {
      const speed = parseFloat(col.dataset.speed) || 0;
      // Cuánto puede moverse sin dejar huecos
      const room = Math.max(col.scrollHeight - mosaic.clientHeight, 0);
      const shift = progress * speed * room;
      col.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  // Punto de partida: cada columna arranca desplazada para que se vea escalonada
  cols.forEach((col) => {
    const room = Math.max(col.scrollHeight - mosaic.clientHeight, 0);
    col.style.transform = `translate3d(0, ${(-room / 2).toFixed(1)}px, 0)`;
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
};

/* Galería de servicios: flechas que desplazan de tarjeta en tarjeta */
const initGallery = () => {
  const gallery = document.getElementById('gallery');
  const prev = document.getElementById('gal-prev');
  const next = document.getElementById('gal-next');
  if (!gallery || !prev || !next) return;

  const step = () => {
    const card = gallery.querySelector('.g-item');
    if (!card) return gallery.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(gallery).gap) || 20;
    return card.getBoundingClientRect().width + gap;
  };

  const sync = () => {
    const max = gallery.scrollWidth - gallery.clientWidth - 2;
    prev.disabled = gallery.scrollLeft <= 2;
    next.disabled = gallery.scrollLeft >= max;
  };

  prev.addEventListener('click', () => gallery.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => gallery.scrollBy({ left: step(), behavior: 'smooth' }));
  gallery.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
};

/* Cabecera: fondo sólido al salir del hero (o siempre si no hay hero) */
const initHeader = () => {
  const head = document.getElementById('head');
  if (!head) return;

  const hero = document.querySelector('.hero');
  if (!hero) {
    head.classList.add('solid');
    return;
  }

  const onScroll = () => {
    const past = window.scrollY > window.innerHeight - 120;
    head.classList.toggle('solid', past);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* Menú en móvil */
const initMobileNav = () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
};

/* Aparición discreta de bloques al entrar en pantalla */
const initReveal = () => {
  const blocks = document.querySelectorAll('.enter');
  if (!blocks.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) {
    blocks.forEach((b) => b.classList.add('seen'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('seen');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  blocks.forEach((b) => io.observe(b));
};

/* Equipo: búsqueda por nombre/especialidad y filtro por área */
const initPeopleFilter = () => {
  const grid = document.getElementById('people');
  if (!grid) return;

  const search = document.getElementById('finder');
  const chips = document.getElementById('chips');
  const empty = document.getElementById('nomatch');
  let area = 'all';

  const apply = () => {
    const q = (search ? search.value : '').trim().toLowerCase();
    let shown = 0;

    grid.querySelectorAll('.person').forEach((card) => {
      const areas = (card.dataset.area || '').split(' ');
      const matchArea = area === 'all' || areas.includes(area);
      const matchText = !q || (card.dataset.search || '').toLowerCase().includes(q);
      const show = matchArea && matchText;
      card.classList.toggle('hidden', !show);
      if (show) shown += 1;
    });

    if (empty) empty.classList.toggle('show', shown === 0);
  };

  if (search) search.addEventListener('input', apply);

  if (chips) {
    chips.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        area = btn.dataset.area;
        apply();
      });
    });
  }
};

/* Formulario de contacto */
const initForm = () => {
  const form = document.getElementById('form');
  const sent = document.getElementById('sent');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (sent) sent.classList.add('show');
    form.reset();
    window.setTimeout(() => sent && sent.classList.remove('show'), 8000);
  });
};
