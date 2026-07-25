/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — JavaScript Compartido
   Menú móvil, cookie banner, año dinámico, scroll navbar, lazy images
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Menú Móvil (Drawer) ──────────────────────────────────── */
  var backdrop = null;
  var drawer   = null;

  function initMobileMenu() {
    backdrop = document.getElementById('mobile-backdrop');
    drawer   = document.getElementById('mobile-drawer');

    if (!backdrop || !drawer) return;

    // Cerrar al hacer click en backdrop
    backdrop.addEventListener('click', closeMobileMenu);

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  window.openMobileMenu = function () {
    if (!backdrop || !drawer) return;
    backdrop.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileMenu = function () {
    if (!backdrop || !drawer) return;
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ── 2. Navbar con efecto scroll ──────────────────────────────── */
  function initScrollNavbar() {
    var navbar = document.querySelector('.vm-navbar');
    if (!navbar) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 8) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── 3. Cookie Banner ─────────────────────────────────────────── */
  function initCookieBanner() {
    var banner = document.getElementById('vm-cookie-banner');
    if (!banner) return;

    // Si ya aceptó, no mostrar
    if (localStorage.getItem('vm_cookies_accepted') === '1') {
      banner.style.display = 'none';
      return;
    }

    var acceptBtn = document.getElementById('vm-cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('vm_cookies_accepted', '1');
        banner.classList.add('hidden');
        setTimeout(function () { banner.style.display = 'none'; }, 400);
      });
    }
  }

  /* ── 4. Año Dinámico en el Footer ────────────────────────────── */
  function setDynamicYear() {
    var yearEls = document.querySelectorAll('.vm-copyright-year');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ── 5. Lazy Loading de Imágenes (fallback manual) ───────────── */
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser nativo soporta loading="lazy"
      return;
    }
    // Fallback: Intersection Observer
    var imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(function (img) { observer.observe(img); });
  }

  /* ── 6. Marcar enlace activo en el nav ───────────────────────── */
  function markActiveNavLinks() {
    var current = window.location.pathname;
    // Normaliza: /nosotros/index.html → /nosotros/
    var links = document.querySelectorAll('a.vm-nav-link, a.vm-drawer-link, a.vm-footer-link');

    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (!href || href === '#') return;

      // Construye ruta absoluta del href
      var linkPath = new URL(href, window.location.href).pathname;

      if (linkPath === current || (linkPath !== '/' && current.startsWith(linkPath.replace('index.html', '')))) {
        link.classList.add('active');
      }
    });
  }

  /* ── 7. Ripple effect en botones ─────────────────────────────── */
  function initRipple() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.vm-btn, .vm-btn-cta');
      if (!btn) return;

      var ripple = document.createElement('span');
      var rect   = btn.getBoundingClientRect();
      var size   = Math.max(rect.width, rect.height);
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = [
        'position:absolute',
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + x + 'px',
        'top:'    + y + 'px',
        'background:rgba(255,255,255,0.3)',
        'border-radius:50%',
        'transform:scale(0)',
        'animation:vm-ripple 0.5s ease-out forwards',
        'pointer-events:none'
      ].join(';');

      // Necesita position relative en el botón
      var prevPos = getComputedStyle(btn).position;
      if (prevPos === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });

    // Añadir el keyframe si no existe
    if (!document.getElementById('vm-ripple-style')) {
      var style = document.createElement('style');
      style.id = 'vm-ripple-style';
      style.textContent = '@keyframes vm-ripple{to{transform:scale(2.5);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  /* ── Init: Ejecutar todo cuando el DOM esté listo ────────────── */
  function init() {
    initMobileMenu();
    initScrollNavbar();
    initCookieBanner();
    setDynamicYear();
    initLazyImages();
    markActiveNavLinks();
    initRipple();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
