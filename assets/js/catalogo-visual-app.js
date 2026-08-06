/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — Catálogo Visual · Vanilla JS Puro (sin frameworks)
   Rendimiento máximo: sin React, sin Tailwind, sin dependencias CDN
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────────
     CONSTANTES Y HELPERS
  ────────────────────────────────────────────────────────────────── */
  const IMG_BASE = '../imagenes_catalogos_palazzo/';
  const WA_BASE  = 'https://wa.me/584241288247?text=';

  function waUrl(text) {
    return WA_BASE + encodeURIComponent(text);
  }

  function $(id) { return document.getElementById(id); }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class')      node.className = v;
        else if (k === 'style') node.style.cssText = v;
        else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
        else                    node.setAttribute(k, v);
      });
    }
    children.flat(Infinity).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function icon(name, extra) {
    const s = document.createElement('span');
    s.className = 'mi' + (extra ? ' ' + extra : '');
    s.setAttribute('aria-hidden', 'true');
    s.textContent = name;
    return s;
  }

  /* ──────────────────────────────────────────────────────────────────
     PREPARACIÓN DE DATOS
     VM_ITEMS formato: [isDama(0|1), pageNum, imgNum, filename]
  ────────────────────────────────────────────────────────────────── */
  function buildItems(rawItems) {
    return rawItems.map((row, idx) => {
      const isDama = row[0] === 1;
      const pn     = row[1];
      const im     = row[2];
      const file   = row[3];
      const col    = isDama ? 'Palazzo Dama & Finezza' : 'Palazzo Caballeros';
      const ps     = String(pn).padStart(2, '0');
      const ref    = (isDama ? 'PD' : 'PC') + '-P' + ps + '-' + im;

      let cat = 'Monturas Ejecutivas';
      if (pn <= 2 || pn === 27) cat = 'Portada & Colección Principal';
      else if (pn % 4 === 1)    cat = 'Monturas Titán & Ultralivianas';
      else if (pn % 4 === 2)    cat = 'Lentes de Sol & Acetato';
      else if (pn % 4 === 3)    cat = 'Cristales Anti-Reflejo';

      return { id: 'i' + idx, idx, isDama, pn, im, file, col, cat, ref,
               title: col + ' — Modelo P' + pn + '.' + im,
               url: IMG_BASE + file };
    });
  }

  /* ──────────────────────────────────────────────────────────────────
     ESTADO GLOBAL DE LA APP
  ────────────────────────────────────────────────────────────────── */
  const state = {
    allItems:   [],
    filtered:   [],
    collection: 'TODOS',
    query:      '',
    sort:       'default',
    view:       'grid',
    page:       1,
    perPage:    12,
    modalIdx:   -1,
  };

  const COLLECTIONS = [
    'TODOS',
    'Palazzo Dama & Finezza',
    'Palazzo Caballeros',
    'Portada & Colección Principal',
    'Monturas Titán & Ultralivianas',
    'Lentes de Sol & Acetato',
    'Cristales Anti-Reflejo',
  ];

  /* ──────────────────────────────────────────────────────────────────
     FILTRADO + ORDENAMIENTO
  ────────────────────────────────────────────────────────────────── */
  function applyFilters() {
    const q = state.query.toLowerCase();
    let r = state.allItems.filter(i => {
      const matchCol = state.collection === 'TODOS' ||
                       i.col === state.collection ||
                       i.cat === state.collection;
      const matchQ   = !q || i.title.toLowerCase().includes(q) ||
                       i.ref.toLowerCase().includes(q) ||
                       String(i.pn).includes(q);
      return matchCol && matchQ;
    });

    if      (state.sort === 'page-asc')  r.sort((a, b) => a.pn - b.pn);
    else if (state.sort === 'page-desc') r.sort((a, b) => b.pn - a.pn);
    else if (state.sort === 'ref-asc')   r.sort((a, b) => a.ref.localeCompare(b.ref));

    state.filtered = r;
    state.page = 1;
  }

  function totalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.perPage));
  }

  function pageItems() {
    const s = (state.page - 1) * state.perPage;
    return state.filtered.slice(s, s + state.perPage);
  }

  /* ──────────────────────────────────────────────────────────────────
     CARRUSEL HERO
  ────────────────────────────────────────────────────────────────── */
  let carouselIdx      = 0;
  let carouselPaused   = false;
  let carouselInterval = null;
  const SLIDE_DURATION = 5500;

  function buildSlide(s) {
    const badgeClass = s.g === 'Dama' ? 'badge-dama' : s.g === 'Caballero' ? 'badge-cabal' : 'badge-cristal';
    const badgeLabel = s.g === 'Dama' ? 'Colección Dama' : s.g === 'Caballero' ? 'Colección Caballeros' : 'Cristales Ópticos';

    const slide = el('div', { class: 'carousel-slide' },
      el('div', { class: 'slide-img-wrap' },
        el('img', { src: IMG_BASE + s.i, alt: s.t, loading: 'eager', decoding: 'async', fetchpriority: 'high' })
      ),
      el('div', { class: 'slide-content' },
        el('span', { class: 'slide-badge ' + badgeClass },
          icon('auto_awesome'), badgeLabel
        ),
        el('h2', { class: 'slide-title' }, s.t),
        el('p', { class: 'slide-sub' }, s.s),
        el('div', { class: 'slide-actions' },
          el('button', {
            class: 'btn-primary',
            onclick: () => {
              const col = s.g === 'Dama' ? 'Palazzo Dama & Finezza' : s.g === 'Caballero' ? 'Palazzo Caballeros' : 'TODOS';
              state.collection = col;
              applyFilters();
              renderCatalog();
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 'Ver catálogo', icon('arrow_forward')),
          el('a', {
            href: waUrl('Hola Venemedical, quiero información sobre: ' + s.t),
            target: '_blank', rel: 'noopener noreferrer', class: 'btn-wa'
          }, icon('chat'), 'WhatsApp')
        )
      )
    );
    return slide;
  }

  function initCarousel(slides) {
    const track  = $('ctrack');
    const dots   = $('cdots');
    const pbar   = $('cpbar');
    const wrap   = document.querySelector('.carousel-wrap');
    if (!track || !slides.length) return;

    // Render slides
    slides.forEach(s => track.appendChild(buildSlide(s)));

    // Render dots
    slides.forEach((_, i) => {
      const dot = el('button', {
        class: 'carousel-dot' + (i === 0 ? ' active' : ''),
        role: 'tab',
        'aria-selected': i === 0 ? 'true' : 'false',
        'aria-label': 'Slide ' + (i + 1),
        onclick: () => goToSlide(i)
      });
      dots.appendChild(dot);
    });

    // Touch/swipe
    let tx = 0;
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const d = tx - e.changedTouches[0].clientX;
      if (d > 45) goToSlide(carouselIdx + 1);
      if (d < -45) goToSlide(carouselIdx - 1);
    }, { passive: true });

    wrap.addEventListener('mouseenter', () => { carouselPaused = true;  });
    wrap.addEventListener('mouseleave', () => { carouselPaused = false; });

    $('c-prev').addEventListener('click', () => goToSlide(carouselIdx - 1));
    $('c-next').addEventListener('click', () => goToSlide(carouselIdx + 1));

    startCarouselProgress(pbar, slides.length);
  }

  function goToSlide(n) {
    const slides  = document.querySelectorAll('.carousel-slide');
    const dots    = document.querySelectorAll('.carousel-dot');
    const pbar    = $('cpbar');
    const len     = slides.length;
    carouselIdx   = ((n % len) + len) % len;

    document.getElementById('ctrack').style.transform = 'translateX(-' + (carouselIdx * 100) + '%)';

    dots.forEach((d, i) => {
      d.className  = 'carousel-dot' + (i === carouselIdx ? ' active' : '');
      d.setAttribute('aria-selected', i === carouselIdx ? 'true' : 'false');
    });

    if (pbar) { pbar.style.transition = 'none'; pbar.style.width = '0%'; setTimeout(() => { pbar.style.transition = ''; }, 60); }
  }

  function startCarouselProgress(pbar, total) {
    if (carouselInterval) clearInterval(carouselInterval);
    let t0 = Date.now();

    carouselInterval = setInterval(() => {
      if (carouselPaused) { t0 = Date.now() - (parseFloat(pbar.style.width) / 100 * SLIDE_DURATION); return; }
      const elapsed = Date.now() - t0;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      pbar.style.width = pct + '%';
      if (elapsed >= SLIDE_DURATION) {
        goToSlide(carouselIdx + 1);
        t0 = Date.now();
      }
    }, 60);
  }

  /* ──────────────────────────────────────────────────────────────────
     RENDERIZADO DEL CATÁLOGO
  ────────────────────────────────────────────────────────────────── */
  function createImageEl(src, alt) {
    const wrap = el('div', { class: 'card-img-wrap' });
    const sk   = el('div', { class: 'skeleton' });
    const img  = el('img', { src: '', alt: alt, loading: 'lazy', decoding: 'async' });

    wrap.appendChild(sk);
    wrap.appendChild(img);

    // Lazy load via Intersection Observer
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = src;
            img.onload = () => { img.classList.add('loaded'); sk.classList.add('done'); };
            img.onerror = () => { sk.classList.add('done'); img.alt = 'No disponible'; };
            o.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      obs.observe(img);
    } else {
      img.src = src;
      img.onload = () => { img.classList.add('loaded'); sk.classList.add('done'); };
    }
    return wrap;
  }

  function createGridCard(item) {
    const imgWrap = createImageEl(item.url, item.title);

    const ref = el('span', { class: 'card-ref' }, item.ref);

    const overlay = el('div', { class: 'card-overlay' },
      el('button', {
        class: 'card-overlay-btn cob-zoom',
        onclick: (e) => { e.stopPropagation(); openModal(item.idx); }
      }, icon('zoom_in', ''), ' Ampliar'),
      el('a', {
        class: 'card-overlay-btn cob-wa',
        href: waUrl('Hola, me interesa la montura: ' + item.title + ' (Ref: ' + item.ref + ')'),
        target: '_blank', rel: 'noopener noreferrer',
        onclick: (e) => e.stopPropagation()
      }, icon('chat', ''), ' WhatsApp')
    );

    imgWrap.appendChild(ref);
    imgWrap.appendChild(overlay);

    const foot = el('div', { class: 'card-foot' },
      el('div', { class: 'card-name' }, item.title),
      el('div', { class: 'card-meta' },
        el('span', null, item.col.includes('Dama') ? 'Dama' : 'Caballeros'),
        el('span', null, 'P.' + item.pn)
      )
    );

    const card = el('article', {
      class: 'card',
      role: 'button',
      tabindex: '0',
      'aria-label': 'Ver ' + item.title,
      onclick: () => openModal(item.idx)
    }, imgWrap, foot);

    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item.idx); }});
    return card;
  }

  function createListCard(item) {
    const thumbWrap = el('div', { class: 'list-thumb' });
    const sk  = el('div', { class: 'skeleton', style: 'border-radius:var(--r-lg)' });
    const img = el('img', { src: '', alt: item.title, loading: 'lazy', decoding: 'async' });
    thumbWrap.appendChild(sk);
    thumbWrap.appendChild(img);

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            img.src = item.url;
            img.onload = () => { img.classList.add('loaded'); sk.classList.add('done'); };
            o.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      obs.observe(img);
    } else {
      img.src = item.url;
      img.onload = () => { img.classList.add('loaded'); sk.classList.add('done'); };
    }

    return el('article', {
      class: 'list-card',
      onclick: () => openModal(item.idx)
    },
      el('div', { style: 'display:flex;align-items:center;gap:10px;min-width:0;flex:1' },
        thumbWrap,
        el('div', { class: 'list-info' },
          el('span', { class: 'list-ref' }, item.ref),
          el('div', { class: 'list-name' }, item.title),
          el('div', { class: 'list-sub' }, item.col + ' · Pág. ' + item.pn)
        )
      ),
      el('div', { class: 'list-actions', onclick: e => e.stopPropagation() },
        el('button', { class: 'list-btn view', onclick: () => openModal(item.idx) }, icon('visibility', ''), ' Ver'),
        el('a', {
          class: 'list-btn wa',
          href: waUrl('Hola, me interesa: ' + item.title + ' (Ref: ' + item.ref + ')'),
          target: '_blank', rel: 'noopener noreferrer'
        }, icon('chat', ''), ' Cotizar')
      )
    );
  }

  function renderCatalog() {
    const container = $('items-container');
    const statsBar  = $('stats-bar');
    const pagDiv    = $('pagination');
    const subtitle  = $('catalog-subtitle');
    if (!container) return;

    // Subtitle
    if (subtitle) subtitle.textContent = state.allItems.length + ' imágenes reales · Catálogos Palazzo Dama & Caballeros';

    // Stats
    const total   = state.filtered.length;
    const tp      = totalPages();
    const startI  = (state.page - 1) * state.perPage + 1;
    const endI    = Math.min(state.page * state.perPage, total);
    if (statsBar) statsBar.innerHTML = `<span>Mostrando <strong>${startI}–${endI}</strong> de <strong>${total}</strong> modelos</span>`;

    // Items
    container.innerHTML = '';
    const items = pageItems();

    if (!items.length) {
      container.appendChild(
        el('div', { class: 'empty' },
          icon('find_in_page', ''),
          el('h3', null, 'Sin resultados'),
          el('p', null, 'Ningún modelo coincide con tu búsqueda o filtros.'),
          el('button', { class: 'btn-primary', onclick: () => { state.collection='TODOS'; state.query=''; state.sort='default'; $('cat-search').value=''; $('cat-sort').value='default'; applyFilters(); renderCatalog(); } },
            'Limpiar filtros'
          )
        )
      );
      if (pagDiv) pagDiv.innerHTML = '';
      return;
    }

    if (state.view === 'grid') {
      const grid = el('div', { class: 'catalog-grid' });
      items.forEach(i => grid.appendChild(createGridCard(i)));
      container.appendChild(grid);
    } else {
      const list = el('div', { class: 'catalog-list' });
      items.forEach(i => list.appendChild(createListCard(i)));
      container.appendChild(list);
    }

    // Paginador
    renderPagination(tp, pagDiv);
  }

  /* ──────────────────────────────────────────────────────────────────
     PAGINADOR
  ────────────────────────────────────────────────────────────────── */
  function renderPagination(tp, container) {
    if (!container) return;
    if (tp <= 1 && state.filtered.length <= state.perPage) { container.innerHTML = ''; return; }
    container.innerHTML = '';

    const cp = state.page;

    // Fila 1: info + por página
    const row1 = el('div', { class: 'pag-info-row' },
      el('span', { class: 'pag-info' },
        'Página ', el('strong', null, String(cp)), ' de ', el('strong', null, String(tp))
      ),
      (() => {
        const sel = el('select', { class: 'per-page-sel', 'aria-label': 'Registros por página' });
        [12, 24, 36, 48].forEach(n => {
          const opt = el('option', { value: String(n) }, String(n) + ' por página');
          if (n === state.perPage) opt.selected = true;
          sel.appendChild(opt);
        });
        sel.addEventListener('change', () => {
          state.perPage = +sel.value;
          state.page = 1;
          renderCatalog();
          scrollToCatalog();
        });
        return sel;
      })()
    );

    // Página numbers
    function makePages() {
      const list = [];
      const delta = 1;
      for (let i = 1; i <= tp; i++) {
        if (i === 1 || i === tp || (i >= cp - delta && i <= cp + delta)) list.push(i);
        else if (list[list.length - 1] !== '…') list.push('…');
      }
      return list;
    }

    const btns = el('div', { class: 'pag-btns', role: 'navigation', 'aria-label': 'Paginación' });

    // Anterior
    const prevBtn = el('button', {
      class: 'pag-btn', 'aria-label': 'Página anterior',
      onclick: () => { state.page--; renderCatalog(); scrollToCatalog(); }
    }, icon('navigate_before'));
    if (cp === 1) prevBtn.disabled = true;
    btns.appendChild(prevBtn);

    // Números
    makePages().forEach(p => {
      if (p === '…') {
        btns.appendChild(el('span', { class: 'pag-ellipsis' }, '…'));
      } else {
        const b = el('button', {
          class: 'pag-btn' + (p === cp ? ' active' : ''),
          'aria-label': 'Ir a página ' + p,
          'aria-current': p === cp ? 'page' : undefined,
          onclick: () => { state.page = p; renderCatalog(); scrollToCatalog(); }
        }, String(p));
        btns.appendChild(b);
      }
    });

    // Siguiente
    const nextBtn = el('button', {
      class: 'pag-btn', 'aria-label': 'Página siguiente',
      onclick: () => { state.page++; renderCatalog(); scrollToCatalog(); }
    }, icon('navigate_next'));
    if (cp === tp) nextBtn.disabled = true;
    btns.appendChild(nextBtn);

    // Jump form
    let jumpVal = '';
    const jumpInput = el('input', { type: 'number', min: '1', max: String(tp), placeholder: String(cp), 'aria-label': 'Saltar a página' });
    jumpInput.addEventListener('input', e => { jumpVal = e.target.value; });
    const jumpBtn = el('button', { type: 'button', onclick: () => {
      const n = parseInt(jumpVal, 10);
      if (n >= 1 && n <= tp) { state.page = n; renderCatalog(); scrollToCatalog(); jumpInput.value = ''; }
    }}, 'Ir');
    const jumpForm = el('div', { class: 'pag-jump' }, 'Ir a pág:', jumpInput, jumpBtn);

    const row2 = el('div', { class: 'pag-btns-row' }, btns, jumpForm);

    container.appendChild(row1);
    container.appendChild(row2);
  }

  function scrollToCatalog() {
    setTimeout(() => $('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  /* ──────────────────────────────────────────────────────────────────
     CHIPS DE COLECCIÓN
  ────────────────────────────────────────────────────────────────── */
  function renderChips() {
    const row = $('chips-row');
    if (!row) return;
    row.innerHTML = '';
    COLLECTIONS.forEach(c => {
      const chip = el('button', {
        class: 'chip' + (c === state.collection ? ' active' : ''),
        role: 'listitem',
        'aria-pressed': c === state.collection ? 'true' : 'false',
        onclick: () => {
          state.collection = c;
          applyFilters();
          renderChips();
          renderCatalog();
        }
      }, c);
      row.appendChild(chip);
    });
  }

  /* ──────────────────────────────────────────────────────────────────
     MODAL LIGHTBOX
  ────────────────────────────────────────────────────────────────── */
  function openModal(filteredIdx) {
    state.modalIdx = filteredIdx;
    renderModal();
    const modal = $('modal');
    if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }

  function closeModal() {
    const modal = $('modal');
    if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
    state.modalIdx = -1;
  }

  function renderModal() {
    const item = state.filtered[state.modalIdx];
    if (!item) return;

    const $id = (id, val) => { const el = $(id); if (el) el.textContent = val; };

    $id('modal-ref',   item.ref);
    $id('modal-title', item.title);
    $id('modal-sub',   item.col + ' · Página ' + item.pn);
    $id('modal-counter', (state.modalIdx + 1) + ' / ' + state.filtered.length);

    const img = $('modal-img');
    if (img) { img.src = item.url; img.alt = item.title; }

    const wa = $('modal-wa');
    if (wa) wa.href = waUrl('Hola Venemedical, me interesa: ' + item.title + ' (Ref: ' + item.ref + ')');

    const prev = $('modal-prev');
    const next = $('modal-next');
    if (prev) prev.style.display = state.modalIdx > 0 ? 'flex' : 'none';
    if (next) next.style.display = state.modalIdx < state.filtered.length - 1 ? 'flex' : 'none';
  }

  function initModal() {
    $('modal-close')?.addEventListener('click', closeModal);
    $('modal')?.addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
    $('modal-prev')?.addEventListener('click', () => {
      if (state.modalIdx > 0) { state.modalIdx--; renderModal(); }
    });
    $('modal-next')?.addEventListener('click', () => {
      if (state.modalIdx < state.filtered.length - 1) { state.modalIdx++; renderModal(); }
    });
    document.addEventListener('keydown', e => {
      if (!$('modal')?.classList.contains('open')) return;
      if (e.key === 'Escape')      closeModal();
      if (e.key === 'ArrowLeft'  && state.modalIdx > 0) { state.modalIdx--; renderModal(); }
      if (e.key === 'ArrowRight' && state.modalIdx < state.filtered.length - 1) { state.modalIdx++; renderModal(); }
    });
  }

  /* ──────────────────────────────────────────────────────────────────
     CONTROLES DEL CATÁLOGO (search, sort, view toggle)
  ────────────────────────────────────────────────────────────────── */
  function initControls() {
    const search = $('cat-search');
    if (search) {
      let debounce;
      search.addEventListener('input', e => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.query = e.target.value.trim();
          applyFilters();
          renderChips();
          renderCatalog();
        }, 250);
      });
    }

    const sort = $('cat-sort');
    if (sort) {
      sort.addEventListener('change', e => {
        state.sort = e.target.value;
        applyFilters();
        renderCatalog();
      });
    }

    const vGrid = $('view-grid');
    const vList = $('view-list');
    if (vGrid) vGrid.addEventListener('click', () => {
      state.view = 'grid';
      vGrid.className = 'view-btn active'; vGrid.setAttribute('aria-pressed', 'true');
      vList.className = 'view-btn';        vList.setAttribute('aria-pressed', 'false');
      renderCatalog();
    });
    if (vList) vList.addEventListener('click', () => {
      state.view = 'list';
      vList.className = 'view-btn active'; vList.setAttribute('aria-pressed', 'true');
      vGrid.className = 'view-btn';        vGrid.setAttribute('aria-pressed', 'false');
      renderCatalog();
    });
  }

  /* ──────────────────────────────────────────────────────────────────
     PUNTO DE ENTRADA — Espera a que los datos estén listos
  ────────────────────────────────────────────────────────────────── */
  function boot() {
    if (!window.VM_ITEMS || !window.VM_CATALOG_SLIDES) {
      // Retry en 100ms si los datos aún no cargaron (defer)
      setTimeout(boot, 100);
      return;
    }

    // Construir dataset
    state.allItems = buildItems(window.VM_ITEMS);
    applyFilters();

    // Carrusel
    initCarousel(window.VM_CATALOG_SLIDES);

    // Chips + catálogo inicial
    renderChips();
    renderCatalog();

    // Controles
    initControls();
    initModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
