/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — App React Catálogo Visual (Versión Senior Pro v2)
   Responsive completo · Animaciones premium · 135 imágenes reales
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const { useState, useEffect, useMemo, useRef, useCallback, createElement: h } = React;

  /* ═══════════════════════════════════════════════════════════════════
     UTILIDADES
  ════════════════════════════════════════════════════════════════════ */
  const cx = (...args) => args.filter(Boolean).join(' ');

  function buildWAUrl(text) {
    return 'https://wa.me/584241288247?text=' + encodeURIComponent(text);
  }

  /* ═══════════════════════════════════════════════════════════════════
     COMPONENTE: BARRA DE PROGRESO ANIMADA (usada en el carrusel)
  ════════════════════════════════════════════════════════════════════ */
  function ProgressBar({ value }) {
    return h('div', { className: 'w-full h-1 bg-surface-container-high overflow-hidden flex-shrink-0' },
      h('div', {
        className: 'h-full bg-primary progress-bar',
        style: { width: value + '%' },
        role: 'progressbar',
        'aria-valuenow': Math.round(value),
        'aria-valuemin': 0,
        'aria-valuemax': 100
      })
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     COMPONENTE: CARRUSEL HERO (Autoplay + Barra de Progreso + Swipe)
  ════════════════════════════════════════════════════════════════════ */
  function HeroCarousel({ slides, onScrollToCatalog, onFilterCollection }) {
    const [idx, setIdx]         = useState(0);
    const [paused, setPaused]   = useState(false);
    const [progress, setProgress] = useState(0);
    const touchStartX            = useRef(0);
    const DURATION               = 5500;

    useEffect(() => {
      if (paused || !slides.length) return;
      const t0 = Date.now();
      const tick = setInterval(() => {
        const elapsed = Date.now() - t0;
        const pct = Math.min((elapsed / DURATION) * 100, 100);
        setProgress(pct);
        if (elapsed >= DURATION) {
          setIdx(p => (p + 1) % slides.length);
          setProgress(0);
          clearInterval(tick);
        }
      }, 50);
      return () => clearInterval(tick);
    }, [idx, paused, slides.length]);

    const goTo = useCallback((n) => {
      setIdx(((n % slides.length) + slides.length) % slides.length);
      setProgress(0);
    }, [slides.length]);

    const slide = slides[idx] || {};

    return h('section', {
      className: 'relative w-full bg-surface-container-low py-4 sm:py-6 px-4 sm:px-6 lg:px-8',
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onTouchStart: (e) => { touchStartX.current = e.touches[0].clientX; },
      onTouchEnd:   (e) => {
        const d = touchStartX.current - e.changedTouches[0].clientX;
        if (d > 45) goTo(idx + 1);
        if (d < -45) goTo(idx - 1);
      }
    },
      h('div', { className: 'max-w-[1200px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-border-subtle bg-surface-pure' },

        h(ProgressBar, { value: progress }),

        /* Pista de slides */
        h('div', { className: 'relative overflow-hidden' },
          h('div', {
            className: 'flex carousel-track',
            style: { transform: 'translateX(-' + (idx * 100) + '%)' , transition: 'transform 0.65s cubic-bezier(.4,0,.2,1)' }
          },
            slides.map((s, i) =>
              h('div', { key: s.id, className: 'min-w-full flex flex-col md:flex-row items-stretch' },

                /* Imagen del slide */
                h('div', { className: 'w-full md:w-3/5 carousel-slide-img md:h-auto relative bg-[#0a0f1a] overflow-hidden flex items-center justify-center' },
                  h('img', {
                    src: s.image, alt: s.title,
                    loading: i === 0 ? 'eager' : 'lazy',
                    decoding: 'async',
                    className: 'w-full h-full object-contain p-3 sm:p-6 transition-transform duration-[1.2s] hover:scale-105'
                  }),
                  h('div', { className: 'absolute inset-0 bg-gradient-to-r from-transparent to-surface-pure/5 pointer-events-none' })
                ),

                /* Contenido de texto */
                h('div', { className: 'w-full md:w-2/5 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 flex flex-col justify-center gap-4 bg-surface-pure' },
                  h('span', { className: cx('inline-flex items-center gap-1.5 self-start px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest rounded-full border', s.badgeColor) },
                    h('span', { className: 'material-symbols-outlined text-sm', 'aria-hidden': 'true' }, 'auto_awesome'),
                    s.tag
                  ),
                  h('div', null,
                    h('h2', { className: 'text-xl sm:text-2xl md:text-3xl font-black text-on-surface leading-tight' }, s.title),
                    h('p', { className: 'mt-2 text-sm sm:text-base text-on-surface-variant leading-relaxed line-clamp-3' }, s.subtitle)
                  ),
                  h('div', { className: 'flex flex-wrap items-center gap-2 sm:gap-3' },
                    h('button', {
                      onClick: () => { onFilterCollection(s.category); onScrollToCatalog(); },
                      className: 'btn-touch inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#004491] text-white text-xs sm:text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all'
                    }, s.ctaText, h('span', { className: 'material-symbols-outlined text-base', 'aria-hidden': 'true' }, 'arrow_forward')),
                    h('a', {
                      href: buildWAUrl('Hola Venemedical, me interesa: ' + s.title),
                      target: '_blank', rel: 'noopener noreferrer',
                      className: 'btn-touch inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border-subtle hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold transition-colors'
                    },
                      h('span', { className: 'material-symbols-outlined text-base text-[#25D366]', 'aria-hidden': 'true' }, 'chat'),
                      'WhatsApp'
                    )
                  )
                )
              )
            )
          ),

          /* Flechas prev/next */
          h('button', {
            onClick: () => goTo(idx - 1),
            'aria-label': 'Slide anterior',
            className: 'absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 btn-touch w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-surface-pure/90 hover:bg-white border border-border-subtle shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10'
          }, h('span', { className: 'material-symbols-outlined text-xl', 'aria-hidden': 'true' }, 'chevron_left')),

          h('button', {
            onClick: () => goTo(idx + 1),
            'aria-label': 'Siguiente slide',
            className: 'absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 btn-touch w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-surface-pure/90 hover:bg-white border border-border-subtle shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10'
          }, h('span', { className: 'material-symbols-outlined text-xl', 'aria-hidden': 'true' }, 'chevron_right'))
        ),

        /* Dots indicadores */
        h('div', { className: 'flex items-center justify-center gap-2 py-3 bg-surface-bright border-t border-border-subtle' },
          slides.map((_, i) =>
            h('button', {
              key: i,
              onClick: () => goTo(i),
              'aria-label': 'Ir al slide ' + (i + 1),
              'aria-current': i === idx ? 'true' : 'false',
              className: cx('rounded-full transition-all duration-300', i === idx ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-outline-variant hover:bg-outline')
            })
          )
        )
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     COMPONENTE: TARJETA DE CATÁLOGO (Grid & List)
  ════════════════════════════════════════════════════════════════════ */
  function CatalogCard({ item, viewMode, onSelect }) {
    const [loaded, setLoaded]   = useState(false);
    const [errored, setErrored] = useState(false);

    const waUrl = buildWAUrl('Hola Venemedical, me interesa la montura: ' + item.title + ' (Ref: ' + item.refCode + ')');

    /* Vista Lista compacta */
    if (viewMode === 'list') {
      return h('div', {
        className: 'group flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-surface-pure border border-border-subtle rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer',
        onClick: () => onSelect(item)
      },
        h('div', { className: 'flex items-center gap-3 min-w-0' },
          h('div', { className: 'w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden relative' },
            !loaded && !errored && h('div', { className: 'absolute inset-0 skeleton' }),
            h('img', {
              src: item.imageUrl, alt: item.title, loading: 'lazy',
              onLoad: () => setLoaded(true), onError: () => setErrored(true),
              className: 'w-full h-full object-contain p-1'
            })
          ),
          h('div', { className: 'min-w-0' },
            h('span', { className: 'inline-block text-[10px] sm:text-[11px] font-extrabold text-primary bg-primary-fixed px-2 py-0.5 rounded-full mb-1' }, item.refCode),
            h('p', { className: 'text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate' }, item.title),
            h('p', { className: 'text-[11px] sm:text-xs text-text-muted mt-0.5 truncate' }, item.collection + ' · Pág. ' + item.pageNumber)
          )
        ),
        h('div', { className: 'flex items-center gap-2 flex-shrink-0' },
          h('button', {
            onClick: (e) => { e.stopPropagation(); onSelect(item); },
            className: 'btn-touch hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors'
          }, h('span', { className: 'material-symbols-outlined text-base', 'aria-hidden': 'true' }, 'visibility'), 'Ver'),
          h('a', {
            href: waUrl, target: '_blank', rel: 'noopener noreferrer',
            onClick: (e) => e.stopPropagation(),
            className: 'btn-touch inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:brightness-105 transition-all'
          }, h('span', { className: 'material-symbols-outlined text-base', 'aria-hidden': 'true' }, 'chat'), 'Cotizar')
        )
      );
    }

    /* Vista Cuadrícula (default) */
    return h('div', {
      className: 'catalog-card group relative bg-surface-pure border border-border-subtle rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer flex flex-col anim-fade-up',
      onClick: () => onSelect(item)
    },
      h('div', { className: 'relative w-full overflow-hidden bg-surface-container-low', style: { aspectRatio: '3/4' } },

        /* Ref Badge */
        h('span', { className: 'absolute top-2 left-2 z-10 text-[9px] sm:text-[10px] font-extrabold text-primary bg-surface-pure/95 border border-primary-fixed-dim px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm' },
          item.refCode
        ),

        /* Skeleton */
        !loaded && !errored && h('div', { className: 'absolute inset-0 skeleton' }),

        /* Imagen */
        h('img', {
          src: item.imageUrl, alt: item.title, loading: 'lazy',
          onLoad: () => setLoaded(true), onError: () => setErrored(true),
          className: cx('w-full h-full object-contain p-2 transition-all duration-500 group-hover:scale-110', loaded ? 'opacity-100' : 'opacity-0')
        }),

        /* Error */
        errored && h('div', { className: 'absolute inset-0 flex flex-col items-center justify-center p-3 bg-surface-container text-text-muted text-center' },
          h('span', { className: 'material-symbols-outlined text-2xl text-error mb-1', 'aria-hidden': 'true' }, 'broken_image'),
          h('span', { className: 'text-[11px]' }, 'No disponible')
        ),

        /* Hover Overlay */
        h('div', { className: 'absolute inset-0 bg-primary/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2' },
          h('button', {
            onClick: (e) => { e.stopPropagation(); onSelect(item); },
            className: 'inline-flex items-center gap-1 px-3 py-1.5 bg-white text-primary text-[11px] font-bold rounded-full shadow-lg hover:bg-primary hover:text-white transition-all translate-y-2 group-hover:translate-y-0 duration-300'
          }, h('span', { className: 'material-symbols-outlined text-sm', 'aria-hidden': 'true' }, 'zoom_in'), 'Ampliar'),
          h('a', {
            href: waUrl, target: '_blank', rel: 'noopener noreferrer',
            onClick: (e) => e.stopPropagation(),
            className: 'inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] text-white text-[11px] font-bold rounded-full shadow-lg hover:bg-[#1eb256] transition-all translate-y-2 group-hover:translate-y-0 duration-300'
          }, h('span', { className: 'material-symbols-outlined text-sm', 'aria-hidden': 'true' }, 'chat'), 'WhatsApp')
        )
      ),

      /* Footer de tarjeta */
      h('div', { className: 'px-2.5 sm:px-3 py-2 sm:py-2.5 border-t border-border-subtle bg-surface-bright flex flex-col gap-0.5' },
        h('p', { className: 'text-[10px] sm:text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors leading-tight' }, item.title),
        h('div', { className: 'flex items-center justify-between gap-1' },
          h('span', { className: 'text-[9px] sm:text-[10px] text-text-muted truncate flex-1' }, item.collection),
          h('span', { className: 'text-[9px] sm:text-[10px] font-semibold text-on-surface-variant flex-shrink-0' }, 'P.' + item.pageNumber)
        )
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     COMPONENTE: PAGINADOR COMPLETO (con salto a página)
  ════════════════════════════════════════════════════════════════════ */
  function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onPerPageChange }) {
    const [jumpVal, setJumpVal] = useState('');

    const pages = useMemo(() => {
      const list = [];
      const delta = 1;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
          list.push(i);
        } else if (list[list.length - 1] !== '…') {
          list.push('…');
        }
      }
      return list;
    }, [currentPage, totalPages]);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem   = Math.min(currentPage * itemsPerPage, totalItems);

    const submitJump = (e) => {
      e.preventDefault();
      const n = parseInt(jumpVal, 10);
      if (n >= 1 && n <= totalPages) { onPageChange(n); setJumpVal(''); }
    };

    return h('div', { className: 'mt-10 pt-6 border-t border-border-subtle flex flex-col gap-4' },

      /* Fila 1: Resumen y selector por página */
      h('div', { className: 'flex flex-wrap items-center justify-between gap-3' },
        h('p', { className: 'text-xs text-on-surface-variant' },
          'Mostrando ',
          h('strong', { className: 'text-on-surface' }, startItem),
          '–',
          h('strong', { className: 'text-on-surface' }, endItem),
          ' de ',
          h('strong', { className: 'text-on-surface' }, totalItems),
          ' modelos'
        ),
        h('div', { className: 'flex items-center gap-2 text-xs text-on-surface-variant' },
          h('label', { htmlFor: 'per-page-select', className: 'font-medium' }, 'Mostrar:'),
          h('select', {
            id: 'per-page-select',
            value: itemsPerPage,
            onChange: (e) => onPerPageChange(+e.target.value),
            className: 'h-9 px-2 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary'
          },
            h('option', { value: 12 }, '12'),
            h('option', { value: 24 }, '24'),
            h('option', { value: 36 }, '36'),
            h('option', { value: 48 }, '48')
          )
        )
      ),

      /* Fila 2: Botones de página + Salto */
      h('div', { className: 'flex flex-wrap items-center justify-between gap-3' },
        h('div', { className: 'flex items-center gap-1 pagination-row' },
          /* Anterior */
          h('button', {
            onClick: () => onPageChange(currentPage - 1),
            disabled: currentPage === 1,
            'aria-label': 'Página anterior',
            className: 'btn-touch inline-flex items-center justify-center h-9 px-3 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0'
          },
            h('span', { className: 'material-symbols-outlined text-base', 'aria-hidden': 'true' }, 'navigate_before'),
            h('span', { className: 'hidden sm:inline ml-0.5' }, 'Anterior')
          ),

          /* Números */
          pages.map((p, i) =>
            p === '…'
              ? h('span', { key: 'e' + i, className: 'px-1.5 text-text-muted text-xs font-bold select-none' }, '…')
              : h('button', {
                  key: p,
                  onClick: () => onPageChange(p),
                  'aria-label': 'Ir a página ' + p,
                  'aria-current': p === currentPage ? 'page' : undefined,
                  className: cx('btn-touch h-9 min-w-[36px] px-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0',
                    p === currentPage
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-pure text-on-surface border border-border-subtle hover:bg-surface-container'
                  )
                }, p)
          ),

          /* Siguiente */
          h('button', {
            onClick: () => onPageChange(currentPage + 1),
            disabled: currentPage === totalPages,
            'aria-label': 'Página siguiente',
            className: 'btn-touch inline-flex items-center justify-center h-9 px-3 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0'
          },
            h('span', { className: 'hidden sm:inline mr-0.5' }, 'Siguiente'),
            h('span', { className: 'material-symbols-outlined text-base', 'aria-hidden': 'true' }, 'navigate_next')
          )
        ),

        /* Salto rápido */
        h('form', { onSubmit: submitJump, className: 'flex items-center gap-2 text-xs text-on-surface-variant' },
          h('label', { htmlFor: 'page-jump', className: 'font-medium hidden sm:inline' }, 'Ir a pág:'),
          h('input', {
            id: 'page-jump', type: 'number', min: 1, max: totalPages,
            placeholder: currentPage, value: jumpVal,
            onChange: (e) => setJumpVal(e.target.value),
            className: 'w-14 h-9 text-center rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary'
          }),
          h('button', {
            type: 'submit',
            className: 'btn-touch h-9 px-3 rounded-xl bg-primary-fixed text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all'
          }, 'Ir')
        )
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     COMPONENTE: LIGHTBOX MODAL (Navegación tipo revista + teclado)
  ════════════════════════════════════════════════════════════════════ */
  function Lightbox({ item, items, onClose, onNavigate }) {
    const currentIdx = useMemo(() => items.findIndex(i => i.id === item?.id), [item, items]);

    useEffect(() => {
      if (!item) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const onKey = (e) => {
        if (e.key === 'Escape')      onClose();
        if (e.key === 'ArrowLeft' && currentIdx > 0)                onNavigate(items[currentIdx - 1]);
        if (e.key === 'ArrowRight' && currentIdx < items.length - 1) onNavigate(items[currentIdx + 1]);
      };
      window.addEventListener('keydown', onKey);
      return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }, [item, currentIdx, items, onClose, onNavigate]);

    if (!item) return null;

    const hasPrev = currentIdx > 0;
    const hasNext = currentIdx < items.length - 1;
    const waUrl   = buildWAUrl('Hola Venemedical, me interesa: ' + item.title + ' (Ref: ' + item.refCode + ')');

    return h('div', {
      className: 'modal-overlay fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8',
      onClick: onClose,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Vista ampliada: ' + item.title
    },
      h('div', {
        className: 'modal-panel relative max-w-4xl w-full max-h-[92vh] bg-surface-pure rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-border-subtle',
        onClick: (e) => e.stopPropagation()
      },

        /* Header */
        h('div', { className: 'flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border-subtle bg-surface-bright flex-shrink-0' },
          h('div', { className: 'flex items-center gap-2 sm:gap-3 min-w-0' },
            h('span', { className: 'hidden sm:inline-block text-[11px] font-extrabold text-primary bg-primary-fixed px-2.5 py-1 rounded-full flex-shrink-0' }, item.refCode),
            h('div', { className: 'min-w-0' },
              h('h3', { className: 'text-sm sm:text-base font-extrabold text-on-surface truncate' }, item.title),
              h('p', { className: 'text-[11px] sm:text-xs text-text-muted' }, item.collection + ' · Página ' + item.pageNumber)
            )
          ),
          h('div', { className: 'flex items-center gap-2 flex-shrink-0' },
            h('span', { className: 'text-[11px] font-semibold text-text-muted hidden md:inline' }, (currentIdx + 1) + ' / ' + items.length),
            h('button', {
              onClick: onClose,
              'aria-label': 'Cerrar visor',
              className: 'btn-touch w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors'
            }, h('span', { className: 'material-symbols-outlined text-lg sm:text-xl', 'aria-hidden': 'true' }, 'close'))
          )
        ),

        /* Área de imagen */
        h('div', { className: 'flex-1 overflow-auto relative flex items-center justify-center bg-[#0a0f1a] min-h-[280px] sm:min-h-[380px]' },

          hasPrev && h('button', {
            onClick: () => onNavigate(items[currentIdx - 1]),
            'aria-label': 'Imagen anterior',
            className: 'btn-touch absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center z-10 transition-all hover:scale-110'
          }, h('span', { className: 'material-symbols-outlined text-xl sm:text-2xl', 'aria-hidden': 'true' }, 'chevron_left')),

          h('img', {
            src: item.highResUrl || item.imageUrl,
            alt: item.title,
            className: 'max-h-[58vh] sm:max-h-[64vh] w-auto object-contain rounded-xl p-2 sm:p-4'
          }),

          hasNext && h('button', {
            onClick: () => onNavigate(items[currentIdx + 1]),
            'aria-label': 'Imagen siguiente',
            className: 'btn-touch absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center z-10 transition-all hover:scale-110'
          }, h('span', { className: 'material-symbols-outlined text-xl sm:text-2xl', 'aria-hidden': 'true' }, 'chevron_right'))
        ),

        /* Footer del modal */
        h('div', { className: 'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-border-subtle bg-surface-bright flex-shrink-0' },
          h('div', { className: 'text-xs text-on-surface-variant flex items-center gap-2' },
            h('span', { className: 'material-symbols-outlined text-base text-primary', 'aria-hidden': 'true' }, 'keyboard'),
            h('span', { className: 'hidden sm:inline' }, 'Navega con teclas ← →. ESC para cerrar.')
          ),
          h('a', {
            href: waUrl, target: '_blank', rel: 'noopener noreferrer',
            className: 'btn-touch w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1eb256] text-white text-xs font-bold shadow-md transition-all'
          },
            h('span', { className: 'material-symbols-outlined text-base', 'aria-hidden': 'true' }, 'chat'),
            'Consultar disponibilidad en WhatsApp'
          )
        )
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     COMPONENTE PRINCIPAL: VISUAL CATALOG APP
  ════════════════════════════════════════════════════════════════════ */
  function VisualCatalogApp() {
    const carouselData  = window.VENEMEDICAL_CARROUSEL_LENTES   || [];
    const allItems      = window.VENEMEDICAL_PAGINAS_CATALOGO   || [];

    const [page,        setPage]        = useState(1);
    const [perPage,     setPerPage]     = useState(12);
    const [collection,  setCollection]  = useState('TODOS');
    const [query,       setQuery]       = useState('');
    const [sortBy,      setSortBy]      = useState('default');
    const [viewMode,    setViewMode]    = useState('grid');
    const [selected,    setSelected]    = useState(null);

    const catalogRef = useRef(null);

    const COLLECTIONS = [
      'TODOS',
      'Palazzo Dama & Finezza',
      'Palazzo Caballeros',
      'Portada & Colección Principal',
      'Monturas Titán & Ultralivianas',
      'Lentes de Sol & Acetato Italia',
      'Cristales Anti-Reflejo Blue-Cut'
    ];

    /* Filtrado + Ordenamiento */
    const processed = useMemo(() => {
      let r = allItems.filter(i => {
        const matchCol = collection === 'TODOS' || i.collection === collection || i.category === collection;
        const q = query.toLowerCase();
        const matchQ  = !q ||
          i.title.toLowerCase().includes(q) ||
          i.refCode.toLowerCase().includes(q) ||
          String(i.pageNumber).includes(q);
        return matchCol && matchQ;
      });

      if      (sortBy === 'page-asc')  r.sort((a, b) => a.pageNumber - b.pageNumber);
      else if (sortBy === 'page-desc') r.sort((a, b) => b.pageNumber - a.pageNumber);
      else if (sortBy === 'ref-asc')   r.sort((a, b) => a.refCode.localeCompare(b.refCode));

      return r;
    }, [allItems, collection, query, sortBy]);

    const totalPages = Math.max(1, Math.ceil(processed.length / perPage));

    const pageItems = useMemo(() => {
      const s = (page - 1) * perPage;
      return processed.slice(s, s + perPage);
    }, [processed, page, perPage]);

    const scrollToCatalog = useCallback(() => {
      setTimeout(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }, []);

    const changePage = (n) => {
      if (n >= 1 && n <= totalPages) {
        setPage(n);
        setTimeout(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    };

    const changePerPage = (n) => { setPerPage(n); setPage(1); };

    const filterCollection = (cat) => {
      if (cat === 'Cristales Especializados') setCollection('TODOS');
      else setCollection(cat);
      setPage(1);
    };

    const resetFilters = () => { setCollection('TODOS'); setQuery(''); setSortBy('default'); setPage(1); };

    return h('div', { className: 'w-full flex-1 flex flex-col' },

      /* ── Hero Carrusel ── */
      h(HeroCarousel, {
        slides: carouselData,
        onScrollToCatalog: scrollToCatalog,
        onFilterCollection: filterCollection
      }),

      /* ── Sección Catálogo ── */
      h('section', {
        ref: catalogRef,
        'aria-label': 'Catálogo de monturas y lentes',
        className: 'flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10'
      },

        /* ── Encabezado + Controles ── */
        h('div', { className: 'mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-border-subtle' },

          /* Título */
          h('div', { className: 'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4' },
            h('div', null,
              h('span', { className: 'inline-flex items-center gap-1.5 text-[11px] font-extrabold text-primary uppercase tracking-widest bg-primary-fixed px-3 py-1 rounded-full' },
                h('span', { className: 'material-symbols-outlined text-sm', 'aria-hidden': 'true' }, 'auto_stories'),
                'Catálogo Visual Interactivo'
              ),
              h('h1', { className: 'text-xl sm:text-2xl md:text-3xl font-black text-on-surface mt-2 leading-tight' }, 'Monturas y Lentes Palazzo'),
              h('p', { className: 'text-on-surface-variant text-xs sm:text-sm mt-1 max-w-xl' },
                allItems.length + ' imágenes reales de los catálogos Palazzo Dama & Finezza y Palazzo Caballeros.'
              )
            ),

            /* Acciones: Búsqueda + Sort + Vista */
            h('div', { className: 'flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto' },

              /* Buscador */
              h('div', { className: 'relative flex-1 sm:w-60' },
                h('span', { className: 'material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none', 'aria-hidden': 'true' }, 'search'),
                h('input', {
                  type: 'search',
                  placeholder: 'Buscar modelo, ref...',
                  value: query,
                  'aria-label': 'Buscar en el catálogo',
                  onChange: (e) => { setQuery(e.target.value); setPage(1); },
                  className: 'w-full h-10 pl-10 pr-3 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm'
                })
              ),

              /* Sort */
              h('select', {
                value: sortBy,
                'aria-label': 'Ordenar catálogo',
                onChange: (e) => setSortBy(e.target.value),
                className: 'h-10 px-2.5 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm'
              },
                h('option', { value: 'default'   }, 'Orden estándar'),
                h('option', { value: 'page-asc'  }, 'Pág. (↑ menor)'),
                h('option', { value: 'page-desc' }, 'Pág. (↓ mayor)'),
                h('option', { value: 'ref-asc'   }, 'Ref. (A-Z)')
              ),

              /* Toggle Grid/List */
              h('div', {
                className: 'flex items-center bg-surface-container-low border border-border-subtle rounded-xl p-1 gap-1 flex-shrink-0',
                role: 'group',
                'aria-label': 'Modo de vista'
              },
                h('button', {
                  onClick: () => setViewMode('grid'),
                  'aria-pressed': viewMode === 'grid',
                  title: 'Vista cuadrícula',
                  className: cx('btn-touch p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface')
                }, h('span', { className: 'material-symbols-outlined text-lg', 'aria-hidden': 'true' }, 'grid_view')),
                h('button', {
                  onClick: () => setViewMode('list'),
                  'aria-pressed': viewMode === 'list',
                  title: 'Vista lista',
                  className: cx('btn-touch p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface')
                }, h('span', { className: 'material-symbols-outlined text-lg', 'aria-hidden': 'true' }, 'format_list_bulleted'))
              )
            )
          ),

          /* Chips de Colecciones */
          h('div', {
            className: 'chips-scroll flex items-center gap-2 overflow-x-auto pb-1',
            role: 'list',
            'aria-label': 'Filtrar por colección'
          },
            COLLECTIONS.map(c =>
              h('button', {
                key: c,
                role: 'listitem',
                onClick: () => { setCollection(c); setPage(1); },
                'aria-pressed': collection === c,
                className: cx('flex-shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all border whitespace-nowrap btn-touch',
                  collection === c
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface-pure text-on-surface-variant border-border-subtle hover:bg-surface-container hover:text-primary'
                )
              }, c)
            )
          )
        ),

        /* ── Grid / Lista ── */
        pageItems.length > 0
          ? h('div', { className: viewMode === 'grid' ? 'catalog-grid' : 'flex flex-col gap-3' },
              pageItems.map(item => h(CatalogCard, { key: item.id, item, viewMode, onSelect: setSelected }))
            )
          : h('div', {
              className: 'py-16 sm:py-20 flex flex-col items-center justify-center text-center bg-surface-bright rounded-2xl border border-border-subtle',
              role: 'status'
            },
              h('span', { className: 'material-symbols-outlined text-5xl sm:text-6xl mb-3 text-primary', 'aria-hidden': 'true' }, 'find_in_page'),
              h('h3', { className: 'text-sm sm:text-base font-extrabold text-on-surface mb-1' }, 'Sin resultados'),
              h('p', { className: 'text-xs sm:text-sm text-text-muted max-w-xs' }, 'No hay modelos que coincidan con tu búsqueda o filtros seleccionados.'),
              h('button', {
                onClick: resetFilters,
                className: 'mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all btn-touch'
              }, 'Limpiar filtros')
            ),

        /* ── Paginador ── */
        processed.length > 0 && h(Pagination, {
          currentPage: page,
          totalPages,
          totalItems: processed.length,
          itemsPerPage: perPage,
          onPageChange: changePage,
          onPerPageChange: changePerPage
        })
      ),

      /* ── Lightbox Modal ── */
      h(Lightbox, {
        item: selected,
        items: processed,
        onClose: () => setSelected(null),
        onNavigate: setSelected
      })
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     PUNTO DE ENTRADA
  ════════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    const loadingEl = document.getElementById('cv-loading');
    const rootEl    = document.getElementById('cv-root');
    if (!rootEl || !window.React || !window.ReactDOM) return;

    const root = ReactDOM.createRoot(rootEl);
    root.render(h(VisualCatalogApp));

    // Reemplazar el skeleton de carga
    if (loadingEl) loadingEl.style.display = 'none';
  });

})();
