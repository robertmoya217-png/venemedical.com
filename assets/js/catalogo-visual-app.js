/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — App React de Catálogo Visual (Lentes + 117+ Hojas)
   Sin requerir build bundler (ejecuta directamente en GitHub Pages con React 18)
   ════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const { useState, useEffect, useMemo, useRef, createElement: e } = React;

  // ── 1. COMPONENTE: Carrusel de Lentes (Autoplay + Touch) ─────────────
  function LensesCarousel({ slides = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);

    useEffect(() => {
      if (isPaused || !slides.length) return;
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4500);
      return () => clearInterval(timer);
    }, [slides.length, isPaused]);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

    const handleTouchStart = (evt) => {
      touchStartX.current = evt.touches[0].clientX;
    };
    const handleTouchEnd = (evt) => {
      const diff = touchStartX.current - evt.changedTouches[0].clientX;
      if (diff > 50) handleNext();
      if (diff < -50) handlePrev();
    };

    if (!slides.length) return null;
    const currentSlide = slides[currentIndex];

    return e('section', {
      className: 'relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low to-surface py-6 px-4 md:px-8',
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    },
      e('div', { className: 'max-w-[1200px] mx-auto relative rounded-2xl overflow-hidden shadow-xl border border-border-subtle bg-surface-pure' },
        e('div', {
          className: 'flex transition-transform duration-700 ease-out min-h-[380px] md:min-h-[460px]',
          style: { transform: `translateX(-${currentIndex * 100}%)` }
        },
          slides.map((slide, idx) =>
            e('div', { key: slide.id || idx, className: 'min-w-full h-full flex flex-col md:flex-row items-center' },
              // Imagen del slide
              e('div', { className: 'w-full md:w-3/5 h-[240px] md:h-[460px] relative overflow-hidden bg-slate-900' },
                e('img', {
                  src: slide.image,
                  alt: slide.title,
                  className: 'w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000',
                  loading: idx === 0 ? 'eager' : 'lazy'
                }),
                e('div', { className: 'absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent md:to-surface-pure' })
              ),
              // Contenido informativo
              e('div', { className: 'w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center items-start bg-surface-pure' },
                e('span', { className: `inline-block px-3.5 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-full ${slide.badgeColor}` }, slide.tag),
                e('h2', { className: 'text-2xl md:text-3xl font-extrabold text-on-surface leading-tight mb-3' }, slide.title),
                e('p', { className: 'text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed' }, slide.subtitle),
                e('a', {
                  href: `https://wa.me/584241288247?text=${encodeURIComponent('Hola Venemedical, quisiera consultar sobre: ' + slide.title)}`,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'vm-btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-container hover:bg-on-primary-fixed-variant text-white font-semibold text-sm transition-all shadow-md hover:-translate-y-0.5'
                },
                  e('span', null, slide.ctaText),
                  e('span', { className: 'material-symbols-outlined text-lg' }, 'arrow_forward')
                )
              )
            )
          )
        ),
        // Botones de Navegación Flechas
        e('button', {
          onClick: handlePrev,
          'aria-label': 'Slide anterior',
          className: 'absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-pure/90 hover:bg-white text-on-surface border border-border-subtle shadow-lg backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95'
        }, e('span', { className: 'material-symbols-outlined' }, 'chevron_left')),
        e('button', {
          onClick: handleNext,
          'aria-label': 'Siguiente slide',
          className: 'absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-pure/90 hover:bg-white text-on-surface border border-border-subtle shadow-lg backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95'
        }, e('span', { className: 'material-symbols-outlined' }, 'chevron_right')),

        // Dots indicadores
        e('div', { className: 'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-on-surface-fixed/30 backdrop-blur-sm px-3 py-1.5 rounded-full' },
          slides.map((_, idx) =>
            e('button', {
              key: idx,
              onClick: () => setCurrentIndex(idx),
              'aria-label': `Ir al slide ${idx + 1}`,
              className: `h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-7 bg-primary' : 'w-2.5 bg-surface-pure/60 hover:bg-surface-pure'}`
            })
          )
        )
      )
    );
  }

  // ── 2. COMPONENTE: Tarjeta Individual de Catálogo (Minimalista) ──────
  function CatalogCard({ item, onSelect }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return e('div', {
      className: 'group relative bg-surface-pure border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer',
      onClick: () => onSelect(item)
    },
      e('div', { className: 'relative w-full aspect-[3/4] bg-surface-container-low overflow-hidden' },
        !isLoaded && !hasError && e('div', { className: 'absolute inset-0 animate-pulse bg-gradient-to-r from-surface-container-low via-surface-container-high to-surface-container-low' }),
        e('img', {
          src: item.imageUrl,
          alt: item.title,
          loading: 'lazy',
          onLoad: () => setIsLoaded(true),
          onError: () => setHasError(true),
          className: `w-full h-full object-contain p-2 transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`
        }),
        hasError && e('div', { className: 'absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-text-muted bg-surface-container' },
          e('span', { className: 'material-symbols-outlined text-3xl mb-1 text-error' }, 'broken_image'),
          e('span', { className: 'text-xs' }, 'No se pudo cargar la imagen')
        ),
        e('div', { className: 'absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center' },
          e('span', { className: 'inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-pure/95 text-primary font-semibold text-xs rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300' },
            e('span', { className: 'material-symbols-outlined text-sm' }, 'zoom_in'),
            'Ver Hoja'
          )
        )
      ),
      e('div', { className: 'p-3 border-t border-border-subtle bg-surface-bright flex items-center justify-between text-xs' },
        e('span', { className: 'font-semibold text-on-surface-variant' }, `Pág. ${item.pageNumber}`),
        e('span', { className: 'text-[11px] font-medium text-text-muted truncate max-w-[120px]' }, item.collection)
      )
    );
  }

  // ── 3. COMPONENTE: Paginación Inteligente ─────────────────────────────
  function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, totalItems }) {
    const pageNumbers = useMemo(() => {
      const pages = [];
      const delta = 1;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
      }
      return pages;
    }, [currentPage, totalPages]);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return e('div', { className: 'w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border-subtle' },
      e('div', { className: 'text-xs text-on-surface-variant' },
        'Mostrando ',
        e('span', { className: 'font-semibold text-on-surface' }, startItem),
        ' - ',
        e('span', { className: 'font-semibold text-on-surface' }, endItem),
        ' de ',
        e('span', { className: 'font-semibold text-on-surface' }, totalItems),
        ' hojas del catálogo'
      ),
      e('div', { className: 'flex items-center gap-1.5' },
        e('button', {
          onClick: () => onPageChange(currentPage - 1),
          disabled: currentPage === 1,
          'aria-label': 'Página anterior',
          className: 'inline-flex items-center justify-center h-9 px-3 rounded-lg border border-border-subtle bg-surface-pure text-on-surface text-xs font-medium hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
        },
          e('span', { className: 'material-symbols-outlined text-base' }, 'navigate_before'),
          e('span', { className: 'hidden sm:inline ml-1' }, 'Anterior')
        ),
        pageNumbers.map((page, idx) => {
          if (page === '...') return e('span', { key: `ell-${idx}`, className: 'px-2 text-text-muted text-xs' }, '...');
          const isActive = page === currentPage;
          return e('button', {
            key: page,
            onClick: () => onPageChange(page),
            className: `h-9 min-w-[36px] px-3 rounded-lg text-xs font-semibold transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'bg-surface-pure text-on-surface border border-border-subtle hover:bg-surface-container-low'}`
          }, page);
        }),
        e('button', {
          onClick: () => onPageChange(currentPage + 1),
          disabled: currentPage === totalPages,
          'aria-label': 'Página siguiente',
          className: 'inline-flex items-center justify-center h-9 px-3 rounded-lg border border-border-subtle bg-surface-pure text-on-surface text-xs font-medium hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
        },
          e('span', { className: 'hidden sm:inline mr-1' }, 'Siguiente'),
          e('span', { className: 'material-symbols-outlined text-base' }, 'navigate_next')
        )
      ),
      e('div', { className: 'flex items-center gap-2 text-xs text-on-surface-variant' },
        e('span', null, 'Mostrar por pág:'),
        e('select', {
          value: itemsPerPage,
          onChange: (evt) => onItemsPerPageChange(Number(evt.target.value)),
          className: 'h-9 px-2.5 rounded-lg border border-border-subtle bg-surface-pure text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary'
        },
          e('option', { value: 12 }, '12'),
          e('option', { value: 24 }, '24'),
          e('option', { value: 36 }, '36')
        )
      )
    );
  }

  // ── 4. COMPONENTE: Modal Lightbox ─────────────────────────────────────
  function ImageLightboxModal({ item, onClose }) {
    useEffect(() => {
      if (item) document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }, [item]);

    if (!item) return null;

    return e('div', {
      className: 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in',
      onClick: onClose
    },
      e('div', {
        className: 'relative max-w-4xl max-h-[90vh] w-full bg-surface-pure rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border-subtle',
        onClick: (evt) => evt.stopPropagation()
      },
        e('div', { className: 'flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-bright' },
          e('div', null,
            e('h3', { className: 'text-base font-bold text-on-surface' }, item.title),
            e('p', { className: 'text-xs text-text-muted' }, `${item.collection} • ${item.category}`)
          ),
          e('button', {
            onClick: onClose,
            className: 'w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors'
          }, e('span', { className: 'material-symbols-outlined text-xl' }, 'close'))
        ),
        e('div', { className: 'flex-1 overflow-auto p-4 flex items-center justify-center bg-surface-container-low' },
          e('img', {
            src: item.highResUrl || item.imageUrl,
            alt: item.title,
            className: 'max-h-[72vh] w-auto object-contain rounded-lg shadow-md'
          })
        ),
        e('div', { className: 'p-4 border-t border-border-subtle bg-surface-pure flex flex-col sm:flex-row items-center justify-between gap-3' },
          e('span', { className: 'text-xs font-semibold text-on-surface-variant' }, `Ref: ${item.refCode}`),
          e('a', {
            href: `https://wa.me/584241288247?text=${encodeURIComponent('Hola Venemedical, me interesa la montura/hoja del catálogo: ' + item.title + ' (Ref: ' + item.refCode + ')')}`,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'vm-btn-cta inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-semibold shadow-sm'
          },
            e('span', null, 'Consultar Disponibilidad en WhatsApp'),
            e('span', { className: 'material-symbols-outlined text-base' }, 'chat')
          )
        )
      )
    );
  }

  // ── 5. COMPONENTE PRINCIPAL DE APLICACIÓN ─────────────────────────────
  function VisualCatalogApp() {
    const carouselData = window.VENEMEDICAL_CARROUSEL_LENTES || [];
    const allPagesData = window.VENEMEDICAL_PAGINAS_CATALOGO || [];

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [selectedCategory, setSelectedCategory] = useState('TODOS');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const catalogRef = useRef(null);

    // Filtro de items por categoría y búsqueda
    const filteredItems = useMemo(() => {
      return allPagesData.filter(item => {
        const matchesCategory = selectedCategory === 'TODOS' || item.collection === selectedCategory || item.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(item.pageNumber).includes(searchQuery);
        return matchesCategory && matchesSearch;
      });
    }, [allPagesData, selectedCategory, searchQuery]);

    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Items de la página actual
    const currentPaginatedItems = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const handleItemsPerPageChange = (newSize) => {
      setItemsPerPage(newSize);
      setCurrentPage(1);
    };

    const categories = ['TODOS', 'Palazzo Dama & Finezza', 'Palazzo Caballeros', 'Lentes de Sol Polarizados', 'Cristales Anti-Reflejo Blue-Cut'];

    return e('div', { className: 'w-full' },
      // SECCIÓN SUPERIOR: Carrusel de Lentes
      e(LensesCarousel, { slides: carouselData }),

      // SECCIÓN INFERIOR: Catálogo Pasivo
      e('main', { ref: catalogRef, className: 'max-w-[1200px] w-full mx-auto px-4 md:px-8 py-10' },
        
        // Header del catálogo + Barra de Filtros
        e('div', { className: 'mb-8 border-b border-border-subtle pb-6 flex flex-col gap-6' },
          e('div', { className: 'flex flex-col md:flex-row md:items-end justify-between gap-4' },
            e('div', null,
              e('span', { className: 'inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider' },
                e('span', { className: 'material-symbols-outlined text-base' }, 'auto_stories'),
                'Catálogo Visual Interactivo'
              ),
              e('h1', { className: 'text-2xl md:text-3xl font-extrabold text-on-surface mt-1' }, 'Catálogo de Monturas y Lentes'),
              e('p', { className: 'text-on-surface-variant text-sm mt-1 max-w-[650px]' },
                `Explora más de ${allPagesData.length} hojas extraídas del catálogo institucional Venemedical con visor en alta calidad.`
              )
            ),
            // Buscador por página o código
            e('div', { className: 'relative w-full md:w-72' },
              e('span', { className: 'material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg' }, 'search'),
              e('input', {
                type: 'text',
                placeholder: 'Buscar pág. o modelo...',
                value: searchQuery,
                onChange: (evt) => {
                  setSearchQuery(evt.target.value);
                  setCurrentPage(1);
                },
                className: 'w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm'
              })
            )
          ),

          // Chips de categorías
          e('div', { className: 'flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none' },
            categories.map(cat => {
              const isActive = selectedCategory === cat;
              return e('button', {
                key: cat,
                onClick: () => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                },
                className: `px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${isActive ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface-pure text-on-surface-variant border-border-subtle hover:bg-surface-container hover:text-primary'}`
              }, cat);
            })
          )
        ),

        // Grid del Catálogo Paginado
        currentPaginatedItems.length > 0
          ? e('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6' },
              currentPaginatedItems.map(item =>
                e(CatalogCard, { key: item.id, item: item, onSelect: setSelectedItem })
              )
            )
          : e('div', { className: 'py-16 text-center text-text-muted bg-surface-bright rounded-2xl border border-border-subtle' },
              e('span', { className: 'material-symbols-outlined text-4xl mb-2 text-primary' }, 'find_in_page'),
              e('p', { className: 'text-sm font-semibold' }, 'No se encontraron hojas del catálogo que coincidan con tu búsqueda.'),
              e('button', {
                onClick: () => { setSelectedCategory('TODOS'); setSearchQuery(''); setCurrentPage(1); },
                className: 'mt-3 text-xs font-bold text-primary underline'
              }, 'Restablecer Filtros')
            ),

        // Paginador
        totalItems > 0 && e(Pagination, {
          currentPage: currentPage,
          totalPages: totalPages,
          onPageChange: handlePageChange,
          itemsPerPage: itemsPerPage,
          onItemsPerPageChange: handleItemsPerPageChange,
          totalItems: totalItems
        })
      ),

      // Modal Lightbox
      e(ImageLightboxModal, { item: selectedItem, onClose: () => setSelectedItem(null) })
    );
  }

  // Montar la app de React cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    const rootEl = document.getElementById('catalogo-visual-root');
    if (rootEl && window.React && window.ReactDOM) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(e(VisualCatalogApp));
    }
  });

})();
