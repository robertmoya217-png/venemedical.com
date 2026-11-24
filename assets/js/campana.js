/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — Banner Black Friday (no altera la estética original)
   Cambiar `mode` a 'off' apaga el aviso por completo.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.VM_CAMPAIGN = {
    mode: 'bf-countdown', // 'off' | 'bf-countdown' | 'black-friday' | 'navidad'
    targetISO: '2026-11-27T00:00:00-04:00', // Black Friday 2026 (hora Caracas UTC-4)
    waPhone: '584241288247',
    waMsg: '[BLACK FRIDAY] Hola Venemedical, quiero enterarme primero de los descuentos de Black Friday.',
    // Listo para cargar los descuentos que apruebe gerencia:
    packs: []
  };

  if (CFG.mode === 'off') return;

  var targetMs = Date.parse(CFG.targetISO);
  var waHref = 'https://wa.me/' + CFG.waPhone + '?text=' + encodeURIComponent(CFG.waMsg);

  function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function getRemaining() {
    var diff = Math.max(0, targetMs - Date.now());
    return {
      done: diff === 0,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000)
    };
  }

  function mountTopbar() {
    // En el Home ya mostramos la franja grande debajo del menú; dejamos arriba el contacto normal sin duplicar.
    if (document.getElementById('inicio')) return;
    var navbar = document.querySelector('header.vm-navbar');
    var topbar = navbar && navbar.previousElementSibling;
    if (!topbar) return;

    topbar.className = 'vm-bf-bar';
    topbar.removeAttribute('style');
    topbar.innerHTML =
      '<div class="vm-bf-bar-inner">' +
        '<div class="vm-bf-bar-left">' +
          '<span class="vm-bf-pill"><span class="vm-bf-dot"></span>BLACK FRIDAY</span>' +
          '<span class="vm-bf-bar-label" data-bf-inline-wrap>Faltan <strong data-bf-inline class="vm-bf-nums">--d --h --m</strong></span>' +
        '</div>' +
        '<a href="' + waHref + '" target="_blank" rel="noopener noreferrer" class="vm-bf-bar-cta">' +
          'Avisarme →' +
        '</a>' +
      '</div>';
  }

  function mountHomeStrip() {
    // Franja dedicada solo en el Home, justo arriba del Hero (sin tocar el Hero original)
    var hero = document.getElementById('inicio');
    if (!hero || !hero.parentNode || document.getElementById('vm-bf-strip')) return;

    var strip = document.createElement('section');
    strip.id = 'vm-bf-strip';
    strip.className = 'vm-bf-strip';
    strip.setAttribute('aria-label', 'Cuenta regresiva Black Friday Venemedical');
    strip.innerHTML =
      '<div class="vm-bf-strip-inner">' +
        '<div class="vm-bf-strip-copy">' +
          '<span class="vm-bf-pill"><span class="vm-bf-dot"></span>VIERNES 27 DE NOVIEMBRE</span>' +
          '<div class="vm-bf-strip-titles">' +
            '<strong>BLACK FRIDAY VENEMEDICAL</strong>' +
            '<span>Descuentos especiales próximamente en Laboratorio, Consultas y Óptica</span>' +
          '</div>' +
        '</div>' +
        '<div class="vm-bf-strip-right">' +
          '<div class="vm-bf-clock" aria-label="Tiempo restante">' +
            '<div class="vm-bf-box"><b data-bf-d class="vm-bf-nums">--</b><small>Días</small></div>' +
            '<span class="vm-bf-colon" aria-hidden="true">:</span>' +
            '<div class="vm-bf-box"><b data-bf-h class="vm-bf-nums">--</b><small>Horas</small></div>' +
            '<span class="vm-bf-colon" aria-hidden="true">:</span>' +
            '<div class="vm-bf-box"><b data-bf-m class="vm-bf-nums">--</b><small>Min</small></div>' +
          '</div>' +
          '<a href="' + waHref + '" target="_blank" rel="noopener noreferrer" class="vm-bf-strip-btn">' +
            'Recibir ofertas →' +
          '</a>' +
        '</div>' +
      '</div>';
    hero.parentNode.insertBefore(strip, hero);
  }

  function updateClock() {
    var r = getRemaining();
    document.querySelectorAll('[data-bf-inline-wrap]').forEach(function (wrap) {
      var strong = wrap.querySelector('[data-bf-inline]');
      if (r.done) {
        wrap.innerHTML = '<strong data-bf-inline class="vm-bf-nums">¡HOY ACTIVO!</strong>';
      } else if (strong) {
        strong.textContent = pad2(r.days) + 'd ' + pad2(r.hours) + 'h ' + pad2(r.mins) + 'm';
      }
    });
    document.querySelectorAll('[data-bf-d]').forEach(function (el) { el.textContent = pad2(r.days); });
    document.querySelectorAll('[data-bf-h]').forEach(function (el) { el.textContent = pad2(r.hours); });
    document.querySelectorAll('[data-bf-m]').forEach(function (el) { el.textContent = pad2(r.mins); });
  }

  function init() {
    mountTopbar();
    mountHomeStrip();
    updateClock();

    var tick = setInterval(function () {
      if (!document.hidden) updateClock();
    }, 15000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) updateClock();
    });
    window.addEventListener('pagehide', function () { clearInterval(tick); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
