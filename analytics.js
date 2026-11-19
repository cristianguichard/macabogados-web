/* ==================================================
   macabogados.cl — analytics.js
   Eventos propios de GA4 (el tag base está en el <head>).

   Mide acciones, no personas: nunca envía nombre, email ni el
   mensaje del formulario. Solo cuenta el clic y de dónde vino.

   Eventos:
     whatsapp_click  → cualquier enlace wa.me
     tel_click       → cualquier enlace tel:
     email_click     → cualquier enlace mailto:
     contacto_enviado → envío válido del formulario de contacto

   Cada evento lleva: page_name (home | cae | karime) y placement
   (el valor de data-track en el enlace, o "sin-etiqueta").
   ================================================== */

(function () {
  'use strict';

  // Si GA4 no cargó (bloqueador, red, consentimiento), no hacemos nada.
  if (typeof window.gtag !== 'function') return;

  function send(name, params) {
    try {
      window.gtag('event', name, params);
    } catch (err) {
      /* la medición nunca debe romper la página */
    }
  }

  function pageName() {
    return (document.body && document.body.dataset.page) ||
      location.pathname.replace(/\/+$/, '') || 'home';
  }

  function label(el) {
    var text = (el.getAttribute('aria-label') || el.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.slice(0, 80);
  }

  // Delegación en fase de captura: se registra el clic antes de que el
  // navegador abra la pestaña nueva del enlace.
  document.addEventListener('click', function (event) {
    var el = event.target && event.target.closest
      ? event.target.closest('a[href]')
      : null;
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var params = {
      page_name: pageName(),
      placement: el.dataset.track || 'sin-etiqueta',
      link_text: label(el)
    };

    if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      send('whatsapp_click', params);
    } else if (href.indexOf('tel:') === 0) {
      send('tel_click', params);
    } else if (href.indexOf('mailto:') === 0) {
      send('email_click', params);
    }
  }, true);

  // Formulario de contacto (index y CAE): solo envíos válidos, sin leer campos.
  // Ojo: no usar el nombre "form_submit", GA4 lo reserva para su medición
  // automática y descarta el evento personalizado.
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function () {
      if (form.checkValidity()) {
        send('contacto_enviado', { page_name: pageName() });
      }
    }, true);
  }
})();
