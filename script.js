/* ==================================================
   macabogados.cl — script.js
   Mínimo: nav toggle, FAQ categorías, carousel.
   ================================================== */

(function () {
  'use strict';

  /* ---------- Nav móvil ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    // Cerrar menú al click en link
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });
  }

  /* ---------- FAQ categorías ---------- */
  const cats = document.querySelectorAll('.faq__cat');
  const panels = document.querySelectorAll('.faq__panel');
  cats.forEach(cat => {
    cat.addEventListener('click', () => {
      const target = cat.dataset.cat;
      cats.forEach(c => c.classList.toggle('is-active', c === cat));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });

  /* ---------- Carousel testimonios ---------- */
  const track = document.querySelector('.carousel__track');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if (track && prev && next) {
    const step = () => {
      const card = track.querySelector('.testimonial');
      if (!card) return 320;
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      return card.offsetWidth + gap;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---------- Form: feedback antes de mailto ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Validación nativa HTML5 ya cubre required + type=email.
      // mailto: con enctype=text/plain arma el body automáticamente.
      // Nada más que hacer acá; dejamos que el form proceda.
    });
  }

})();