/* ==================================================
   macabogados.cl — script.js
   Mínimo: nav toggle, FAQ categorías, carousel.
   ================================================== */

(function () {
  'use strict';

  /* ---------- Hero: trigger reveals escalonados ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.hero [data-reveal]');
    reveals.forEach(el => el.classList.add('is-revealed'));
  });

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
  const feedback = document.getElementById('contactFeedback');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (feedback) {
            feedback.hidden = false;
            feedback.textContent = '¡Gracias! Te responderemos a la brevedad.';
            feedback.className = 'contact__feedback contact__feedback--ok';
          }
        } else {
          throw new Error('Network');
        }
      } catch (err) {
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = 'Hubo un error. Intenta de nuevo o escríbenos directo a mac@macabogados.cl';
          feedback.className = 'contact__feedback contact__feedback--err';
        }
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

})();