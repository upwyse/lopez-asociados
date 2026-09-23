/* =========================================================
   López & Asociados — comportamiento del sitio
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initReveal();
  initFigures();
  initGallery();
  initMosaic();
  initPeopleFilter();
  initForm();
});

/* Cifras del hero: pasan solas de una a la siguiente,
   y también al pulsar los indicadores. */
const initFigures = () => {
  const box = document.getElementById('figures');
  if (!box) return;

  const figs = [...box.querySelectorAll('.fig')];
  const dots = [...box.querySelectorAll('.bars button')];
  if (figs.length < 2) return;

  let index = 0;
  let timer = null;
  const DELAY = 4200;
  box.style.setProperty('--delay', DELAY + 'ms');

  const show = (next) => {
    const target = (next + figs.length) % figs.length;
    if (target === index) return;

    const current = figs[index];
    current.classList.remove('on');
    current.classList.add('out');
    window.setTimeout(() => current.classList.remove('out'), 600);

    index = target;
    figs[index].classList.add('on');
    dots.forEach((d, i) => {
      d.setAttribute('aria-current', String(i === index));
      if (i === index) {
        // reinicia la animación de la barra
        const bar = d;
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      }
    });
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    box.classList.add('paused');   // congela la barra de avance
  };

  const play = () => {
    if (timer) window.clearInterval(timer);
    box.classList.remove('paused');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setInterval(() => show(index + 1), DELAY);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { show(i); play(); });
  });

  // Se detiene mientras el visitante lo mira de cerca
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', play);
  box.addEventListener('focusin', stop);
  box.addEventListener('focusout', play);

  play();
};

/* El mosaico se mueve solo por CSS (bucle continuo).
   Aquí solo se detiene cuando la sección no está en pantalla,
   para no gastar batería ni CPU de más. */
const initMosaic = () => {
  const mosaic = document.getElementById('mosaic');
  if (!mosaic || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Se usa una clase (no estilo en línea) para que la pausa al pasar
      // el mouse siga funcionando desde el CSS.
      mosaic.classList.toggle('is-off', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  io.observe(mosaic);
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
