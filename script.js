/* ==================================================
   macabogados.cl — script.js
   Mínimo: nav toggle, FAQ categorías, carousel.
   Nada de esto es imprescindible: sin JS el hero se ve
   (clase .js + fallback en styles.css) y el <details> nativo.
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
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };

    navToggle.addEventListener('click', () => {
      setOpen(!nav.classList.contains('is-open'));
    });

    // Cerrar menú al click en link
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Cerrar con Escape y devolver el foco al botón
    nav.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        navToggle.focus();
      }
    });

    // Cerrar al hacer click fuera del header
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
        setOpen(false);
      }
    });
  }

  /* ---------- FAQ categorías (tabs) ---------- */
  const cats = document.querySelectorAll('.faq__cat');
  const panels = document.querySelectorAll('.faq__panel');
  const activateCat = (cat, moveFocus) => {
    const target = cat.dataset.cat;
    cats.forEach(c => {
      const on = c === cat;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => {
      const on = p.dataset.panel === target;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
    if (moveFocus) cat.focus();
  };

  cats.forEach((cat, i) => {
    cat.addEventListener('click', () => activateCat(cat, false));

    // Navegación con flechas entre tabs (patrón ARIA de tabs)
    cat.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      const next = cats[(i + step + cats.length) % cats.length];
      activateCat(next, true);
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

    // El carril es una región con scroll: accesible por teclado
    track.addEventListener('keydown', (e) => {
      const map = {
        ArrowRight: step(),
        ArrowLeft: -step(),
        Home: -track.scrollWidth,
        End: track.scrollWidth
      };
      if (!(e.key in map)) return;
      e.preventDefault();
      track.scrollBy({ left: map[e.key], behavior: 'smooth' });
    });
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
