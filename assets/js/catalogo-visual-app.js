/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — App React de Catálogo Visual (Versión Senior Pro)
   Integración completa con las 135 imágenes reales de Palazzo Dama y Caballeros
   ════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const { useState, useEffect, useMemo, useRef, useCallback, createElement: e } = React;

  // ── 1. COMPONENTE: Carrusel de Lentes Destacado (Autoplay + Progress Bar + Touch) ─────────────
  function LensesCarousel({ slides = [], onSelectCollection }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const touchStartX = useRef(0);
    const SLIDE_DURATION = 5000; // 5 segundos por slide

    // Animación de barra de progreso e intervalo de autoplay
    useEffect(() => {
      if (isPaused || !slides.length) return;

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const currentProgress = Math.min((elapsedTime / SLIDE_DURATION) * 100, 100);
        setProgress(currentProgress);

        if (elapsedTime >= SLIDE_DURATION) {
          setCurrentIndex((prev) => (prev + 1) % slides.length);
          setProgress(0);
        }
      }, 50);

      return () => clearInterval(interval);
    }, [slides.length, isPaused, currentIndex]);

    const handleNext = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, [slides.length]);

    const handlePrev = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setProgress(0);
    }, [slides.length]);

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
      e('div', { className: 'max-w-[1200px] mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-border-subtle bg-surface-pure' },
        
        // Barra de Progreso Superior
        e('div', { className: 'w-full h-1.5 bg-surface-container-high relative overflow-hidden' },
          e('div', {
            className: 'h-full bg-primary transition-all duration-75 ease-linear',
            style: { width: `${progress}%` }
          })
        ),

        // Slider Container
        e('div', {
          className: 'flex transition-transform duration-700 ease-out min-h-[380px] md:min-h-[480px]',
          style: { transform: `translateX(-${currentIndex * 100}%)` }
        },
          slides.map((slide, idx) =>
            e('div', { key: slide.id || idx, className: 'min-w-full h-full flex flex-col md:flex-row items-stretch' },
              
              // Lado Izquierdo: Imagen del producto/portada
              e('div', { className: 'w-full md:w-3/5 h-[260px] md:h-[480px] relative overflow-hidden bg-slate-900' },
                e('img', {
                  src: slide.image,
                  alt: slide.title,
                  className: 'w-full h-full object-contain p-4 md:p-6 transition-transform duration-1000 transform hover:scale-105',
                  loading: idx === 0 ? 'eager' : 'lazy'
                }),
                e('div', { className: 'absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent' })
              ),

              // Lado Derecho: Detalles de la Colección
              e('div', { className: 'w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center items-start bg-surface-pure z-10' },
                e('span', { className: `inline-flex items-center gap-1.5 px-3.5 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-full ${slide.badgeColor}` },
                  e('span', { className: 'material-symbols-outlined text-sm' }, 'auto_awesome'),
                  slide.tag
                ),
                e('h2', { className: 'text-2xl md:text-3xl font-extrabold text-on-surface leading-tight mb-3' }, slide.title),
                e('p', { className: 'text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed' }, slide.subtitle),
                
                e('div', { className: 'flex flex-wrap items-center gap-3' },
                  e('button', {
                    onClick: () => onSelectCollection(slide.category),
                    className: 'vm-btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-on-primary-fixed-variant text-white font-semibold text-sm transition-all shadow-md hover:-translate-y-0.5'
                  },
                    e('span', null, slide.ctaText),
                    e('span', { className: 'material-symbols-outlined text-lg' }, 'arrow_forward')
                  ),
                  e('a', {
                    href: `https://wa.me/584241288247?text=${encodeURIComponent('Hola Venemedical, me interesa información sobre: ' + slide.title)}`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border-subtle hover:bg-surface-container text-on-surface font-semibold text-sm transition-all'
                  },
                    e('span', { className: 'material-symbols-outlined text-base text-[#25D366]' }, 'chat'),
                    'WhatsApp'
                  )
                )
              )
            )
          )
        ),

        // Botones de Navegación Flechas
        e('button', {
          onClick: handlePrev,
          'aria-label': 'Slide anterior',
          className: 'absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-pure/90 hover:bg-white text-on-surface border border-border-subtle shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20'
        }, e('span', { className: 'material-symbols-outlined' }, 'chevron_left')),
        
        e('button', {
          onClick: handleNext,
          'aria-label': 'Siguiente slide',
          className: 'absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-pure/90 hover:bg-white text-on-surface border border-border-subtle shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20'
        }, e('span', { className: 'material-symbols-outlined' }, 'chevron_right')),

        // Indicadores Dots
        e('div', { className: 'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-on-surface-fixed/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full z-20' },
          slides.map((_, idx) =>
            e('button', {
              key: idx,
              onClick: () => { setCurrentIndex(idx); setProgress(0); },
              'aria-label': `Ir al slide ${idx + 1}`,
              className: `h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2.5 bg-surface-pure/60 hover:bg-surface-pure'}`
            })
          )
        )
      )
    );
  }

  // ── 2. COMPONENTE: Tarjeta Individual de Catálogo (Grid / List View) ──────
  function CatalogCard({ item, viewMode, onSelect }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const whatsappUrl = `https://wa.me/584241288247?text=${encodeURIComponent('Hola Venemedical, quisiera consultar disponibilidad de la montura: ' + item.title + ' (Ref: ' + item.refCode + ')')}`;

    if (viewMode === 'list') {
      return e('div', {
        className: 'bg-surface-pure border border-border-subtle rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group',
        onClick: () => onSelect(item)
      },
        e('div', { className: 'flex items-center gap-4' },
          e('div', { className: 'w-20 h-20 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative' },
            !isLoaded && !hasError && e('div', { className: 'absolute inset-0 animate-pulse bg-surface-container-high' }),
            e('img', {
              src: item.imageUrl,
              alt: item.title,
              loading: 'lazy',
              onLoad: () => setIsLoaded(true),
              onError: () => setHasError(true),
              className: 'w-full h-full object-contain p-1'
            })
          ),
          e('div', null,
            e('span', { className: 'inline-block text-[11px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full mb-1' }, item.refCode),
            e('h4', { className: 'text-sm font-bold text-on-surface group-hover:text-primary transition-colors' }, item.title),
            e('p', { className: 'text-xs text-text-muted mt-0.5' }, `${item.collection} • Pág. ${item.pageNumber}`)
          )
        ),
        e('div', { className: 'flex items-center gap-2' },
          e('button', {
            onClick: (evt) => { evt.stopPropagation(); onSelect(item); },
            className: 'px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors'
          },
            e('span', { className: 'material-symbols-outlined text-base' }, 'visibility'),
            'Ver'
          ),
          e('a', {
            href: whatsappUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: (evt) => evt.stopPropagation(),
            className: 'px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1 hover:brightness-105 transition-all'
          },
            e('span', { className: 'material-symbols-outlined text-base' }, 'chat'),
            'Cotizar'
          )
        )
      );
    }

    return e('div', {
      className: 'group relative bg-surface-pure border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1',
      onClick: () => onSelect(item)
    },
      // Aspect ratio de imagen
      e('div', { className: 'relative w-full aspect-[4/3] bg-surface-container-low overflow-hidden p-3' },
        
        // Badge de Referencia
        e('span', { className: 'absolute top-3 left-3 z-10 text-[10px] font-extrabold text-primary bg-surface-pure/95 border border-primary-fixed-dim px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm' },
          item.refCode
        ),

        // Skeleton Loader
        !isLoaded && !hasError && e('div', { className: 'absolute inset-0 animate-pulse bg-gradient-to-r from-surface-container-low via-surface-container-high to-surface-container-low' }),

        // Imagen Principal
        e('img', {
          src: item.imageUrl,
          alt: item.title,
          loading: 'lazy',
          onLoad: () => setIsLoaded(true),
          onError: () => setHasError(true),
          className: `w-full h-full object-contain transition-all duration-500 group-hover:scale-110 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`
        }),

        // Error Fallback
        hasError && e('div', { className: 'absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-text-muted bg-surface-container' },
          e('span', { className: 'material-symbols-outlined text-3xl mb-1 text-error' }, 'broken_image'),
          e('span', { className: 'text-xs font-medium' }, 'No disponible')
        ),

        // Hover Overlay con Botón Zoom y Cotizar
        e('div', { className: 'absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2' },
          e('button', {
            onClick: (evt) => { evt.stopPropagation(); onSelect(item); },
            className: 'px-3.5 py-2 bg-surface-pure text-primary font-bold text-xs rounded-full shadow-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 duration-300'
          },
            e('span', { className: 'material-symbols-outlined text-base' }, 'zoom_in'),
            'Ampliar'
          ),
          e('a', {
            href: whatsappUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: (evt) => evt.stopPropagation(),
            className: 'px-3.5 py-2 bg-[#25D366] text-white font-bold text-xs rounded-full shadow-lg hover:bg-[#20ba5a] transition-all flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 duration-300'
          },
            e('span', { className: 'material-symbols-outlined text-base' }, 'chat'),
            'WhatsApp'
          )
        )
      ),

      // Pie de Tarjeta
      e('div', { className: 'p-3.5 border-t border-border-subtle bg-surface-bright flex flex-col gap-1' },
        e('h4', { className: 'text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors' }, item.title),
        e('div', { className: 'flex items-center justify-between text-[11px] text-text-muted' },
          e('span', { className: 'truncate max-w-[120px]' }, item.collection),
          e('span', { className: 'font-semibold text-on-surface-variant' }, `Pág. ${item.pageNumber}`)
        )
      )
    );
  }

  // ── 3. COMPONENTE: Paginador Senior (Con Salto a Página + Configuración) ──────
  function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, totalItems }) {
    const [jumpInput, setJumpInput] = useState('');

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

    const handleJumpSubmit = (evt) => {
      evt.preventDefault();
      const pageNum = parseInt(jumpInput, 10);
      if (pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum);
        setJumpInput('');
      }
    };

    return e('div', { className: 'w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-border-subtle' },
      
      // Resumen de Registros
      e('div', { className: 'text-xs text-on-surface-variant' },
        'Mostrando ',
        e('span', { className: 'font-extrabold text-on-surface' }, startItem),
        ' - ',
        e('span', { className: 'font-extrabold text-on-surface' }, endItem),
        ' de ',
        e('span', { className: 'font-extrabold text-on-surface' }, totalItems),
        ' modelos en catálogo'
      ),

      // Números y Botones de Paginación
      e('div', { className: 'flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0' },
        e('button', {
          onClick: () => onPageChange(currentPage - 1),
          disabled: currentPage === 1,
          'aria-label': 'Página anterior',
          className: 'inline-flex items-center justify-center h-9 px-3 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm'
        },
          e('span', { className: 'material-symbols-outlined text-base' }, 'navigate_before'),
          e('span', { className: 'hidden sm:inline ml-1' }, 'Anterior')
        ),

        pageNumbers.map((page, idx) => {
          if (page === '...') return e('span', { key: `ell-${idx}`, className: 'px-2 text-text-muted text-xs font-bold' }, '...');
          const isActive = page === currentPage;
          return e('button', {
            key: page,
            onClick: () => onPageChange(page),
            className: `h-9 min-w-[36px] px-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'bg-surface-pure text-on-surface border border-border-subtle hover:bg-surface-container'}`
          }, page);
        }),

        e('button', {
          onClick: () => onPageChange(currentPage + 1),
          disabled: currentPage === totalPages,
          'aria-label': 'Página siguiente',
          className: 'inline-flex items-center justify-center h-9 px-3 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm'
        },
          e('span', { className: 'hidden sm:inline mr-1' }, 'Siguiente'),
          e('span', { className: 'material-symbols-outlined text-base' }, 'navigate_next')
        )
      ),

      // Controles Secundarios: Selector por página + Salto rápido
      e('div', { className: 'flex items-center gap-3 text-xs text-on-surface-variant' },
        e('form', { onSubmit: handleJumpSubmit, className: 'flex items-center gap-1' },
          e('span', null, 'Ir a:'),
          e('input', {
            type: 'number',
            min: 1,
            max: totalPages,
            placeholder: currentPage,
            value: jumpInput,
            onChange: (e) => setJumpInput(e.target.value),
            className: 'w-12 h-9 px-1 text-center rounded-lg border border-border-subtle bg-surface-pure text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary'
          })
        ),
        e('div', { className: 'flex items-center gap-1' },
          e('span', null, 'Por pág:'),
          e('select', {
            value: itemsPerPage,
            onChange: (evt) => onItemsPerPageChange(Number(evt.target.value)),
            className: 'h-9 px-2 rounded-lg border border-border-subtle bg-surface-pure text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary'
          },
            e('option', { value: 12 }, '12'),
            e('option', { value: 24 }, '24'),
            e('option', { value: 36 }, '36'),
            e('option', { value: 48 }, '48')
          )
        )
      )
    );
  }

  // ── 4. COMPONENTE: Modal Lightbox de Alta Resolución con Navegación tipo Revista ──────
  function ImageLightboxModal({ item, allItems = [], onClose, onNavigate }) {
    useEffect(() => {
      if (item) document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }, [item]);

    // Navegación por teclado (Flecha Izquierda / Flecha Derecha / ESC)
    useEffect(() => {
      if (!item || !allItems.length) return;

      const handleKeyDown = (evt) => {
        if (evt.key === 'Escape') onClose();
        if (evt.key === 'ArrowLeft') {
          const currentIdx = allItems.findIndex(i => i.id === item.id);
          if (currentIdx > 0) onNavigate(allItems[currentIdx - 1]);
        }
        if (evt.key === 'ArrowRight') {
          const currentIdx = allItems.findIndex(i => i.id === item.id);
          if (currentIdx < allItems.length - 1) onNavigate(allItems[currentIdx + 1]);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [item, allItems, onClose, onNavigate]);

    if (!item) return null;

    const currentIndex = allItems.findIndex(i => i.id === item.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allItems.length - 1;

    const whatsappUrl = `https://wa.me/584241288247?text=${encodeURIComponent('Hola Venemedical, me interesa la montura/hoja del catálogo: ' + item.title + ' (Ref: ' + item.refCode + ')')}`;

    return e('div', {
      className: 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in',
      onClick: onClose
    },
      e('div', {
        className: 'relative max-w-5xl max-h-[92vh] w-full bg-surface-pure rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-border-subtle',
        onClick: (evt) => evt.stopPropagation()
      },
        
        // Header del Modal
        e('div', { className: 'flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-bright' },
          e('div', { className: 'flex items-center gap-3' },
            e('span', { className: 'text-xs font-extrabold text-primary bg-primary-fixed px-3 py-1 rounded-full' }, item.refCode),
            e('div', null,
              e('h3', { className: 'text-base font-extrabold text-on-surface' }, item.title),
              e('p', { className: 'text-xs text-text-muted' }, `${item.collection} • Página ${item.pageNumber}`)
            )
          ),
          e('div', { className: 'flex items-center gap-2' },
            e('span', { className: 'text-xs font-semibold text-text-muted hidden sm:inline mr-2' }, `${currentIndex + 1} de ${allItems.length}`),
            e('button', {
              onClick: onClose,
              'aria-label': 'Cerrar visor',
              className: 'w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-all'
            }, e('span', { className: 'material-symbols-outlined text-xl' }, 'close'))
          )
        ),

        // Imagen Central + Botones Flotantes Prev/Next
        e('div', { className: 'flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-surface-container-low relative min-h-[350px]' },
          
          // Botón Anterior
          hasPrev && e('button', {
            onClick: () => onNavigate(allItems[currentIndex - 1]),
            'aria-label': 'Imagen anterior',
            className: 'absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-pure/90 hover:bg-white text-on-surface shadow-xl flex items-center justify-center border border-border-subtle transition-all hover:scale-110 z-10'
          }, e('span', { className: 'material-symbols-outlined text-2xl' }, 'chevron_left')),

          // Imagen Principal
          e('img', {
            src: item.highResUrl || item.imageUrl,
            alt: item.title,
            className: 'max-h-[68vh] w-auto object-contain rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105'
          }),

          // Botón Siguiente
          hasNext && e('button', {
            onClick: () => onNavigate(allItems[currentIndex + 1]),
            'aria-label': 'Imagen siguiente',
            className: 'absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-pure/90 hover:bg-white text-on-surface shadow-xl flex items-center justify-center border border-border-subtle transition-all hover:scale-110 z-10'
          }, e('span', { className: 'material-symbols-outlined text-2xl' }, 'chevron_right'))
        ),

        // Footer del Modal con Acciones
        e('div', { className: 'p-4 border-t border-border-subtle bg-surface-bright flex flex-col sm:flex-row items-center justify-between gap-3' },
          e('div', { className: 'text-xs text-on-surface-variant flex items-center gap-2' },
            e('span', { className: 'material-symbols-outlined text-base text-primary' }, 'info'),
            `Categoría: ${item.category} | Tip: Usa las flechas ◄ ► de tu teclado para hojear.`
          ),
          e('div', { className: 'flex items-center gap-2 w-full sm:w-auto' },
            e('a', {
              href: whatsappUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'vm-btn-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#20ba5a] transition-all'
            },
              e('span', { className: 'material-symbols-outlined text-base' }, 'chat'),
              'Consultar en WhatsApp'
            )
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
    const [sortBy, setSortBy] = useState('default'); // 'default', 'page-asc', 'page-desc', 'ref-asc'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [selectedItem, setSelectedItem] = useState(null);

    const catalogRef = useRef(null);

    // Filtrado y Ordenamiento Avanzado
    const processedItems = useMemo(() => {
      let result = allPagesData.filter(item => {
        const matchesCategory = selectedCategory === 'TODOS' || item.collection === selectedCategory || item.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(item.pageNumber).includes(searchQuery);
        return matchesCategory && matchesSearch;
      });

      if (sortBy === 'page-asc') {
        result.sort((a, b) => a.pageNumber - b.pageNumber);
      } else if (sortBy === 'page-desc') {
        result.sort((a, b) => b.pageNumber - a.pageNumber);
      } else if (sortBy === 'ref-asc') {
        result.sort((a, b) => a.refCode.localeCompare(b.refCode));
      }

      return result;
    }, [allPagesData, selectedCategory, searchQuery, sortBy]);

    const totalItems = processedItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const currentPaginatedItems = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return processedItems.slice(startIndex, startIndex + itemsPerPage);
    }, [processedItems, currentPage, itemsPerPage]);

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

    const categories = [
      'TODOS',
      'Palazzo Dama & Finezza',
      'Palazzo Caballeros',
      'Portada & Colección Principal',
      'Monturas Titán & Ultralivianas',
      'Lentes de Sol & Acetato Italia',
      'Cristales Anti-Reflejo Blue-Cut'
    ];

    return e('div', { className: 'w-full min-h-screen flex flex-col' },
      
      // SECCIÓN SUPERIOR: Hero Carrusel
      e(LensesCarousel, {
        slides: carouselData,
        onSelectCollection: (cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
          catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }),

      // SECCIÓN INFERIOR: Catálogo Principal
      e('main', { ref: catalogRef, className: 'max-w-[1200px] w-full mx-auto px-4 md:px-8 py-10 flex-1' },
        
        // Header & Controles de Filtros
        e('div', { className: 'mb-8 border-b border-border-subtle pb-6 flex flex-col gap-6' },
          
          // Fila Superior: Título + Buscador + Ordenamiento + Vista
          e('div', { className: 'flex flex-col lg:flex-row lg:items-center justify-between gap-4' },
            e('div', null,
              e('span', { className: 'inline-flex items-center gap-1.5 text-xs font-extrabold text-primary uppercase tracking-wider bg-primary-fixed px-3 py-1 rounded-full' },
                e('span', { className: 'material-symbols-outlined text-base' }, 'auto_stories'),
                'Catálogo Visual Interactivo'
              ),
              e('h1', { className: 'text-2xl md:text-3xl font-extrabold text-on-surface mt-2' }, 'Catálogo de Monturas y Lentes'),
              e('p', { className: 'text-on-surface-variant text-sm mt-1 max-w-[650px]' },
                `Explora la colección completa con ${allPagesData.length} imágenes reales de los catálogos Palazzo Dama y Caballeros.`
              )
            ),

            // Acciones a la derecha
            e('div', { className: 'flex flex-wrap items-center gap-3' },
              
              // Campo de Búsqueda
              e('div', { className: 'relative flex-1 sm:w-64' },
                e('span', { className: 'material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg' }, 'search'),
                e('input', {
                  type: 'text',
                  placeholder: 'Buscar modelo o ref...',
                  value: searchQuery,
                  onChange: (evt) => { setSearchQuery(evt.target.value); setCurrentPage(1); },
                  className: 'w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm'
                })
              ),

              // Selector de Ordenamiento
              e('select', {
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                className: 'h-10 px-3 rounded-xl border border-border-subtle bg-surface-pure text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm'
              },
                e('option', { value: 'default' }, 'Orden por Defecto'),
                e('option', { value: 'page-asc' }, 'Página (Ascendente)'),
                e('option', { value: 'page-desc' }, 'Página (Descendente)'),
                e('option', { value: 'ref-asc' }, 'Código Referencia')
              ),

              // Toggle Grid / List View
              e('div', { className: 'flex items-center bg-surface-container-low border border-border-subtle rounded-xl p-1 gap-1' },
                e('button', {
                  onClick: () => setViewMode('grid'),
                  title: 'Vista Cuadrícula',
                  className: `p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`
                }, e('span', { className: 'material-symbols-outlined text-lg' }, 'grid_view')),
                e('button', {
                  onClick: () => setViewMode('list'),
                  title: 'Vista Lista',
                  className: `p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`
                }, e('span', { className: 'material-symbols-outlined text-lg' }, 'format_list_bulleted'))
              )
            )
          ),

          // Chips de Categorías
          e('div', { className: 'flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none' },
            categories.map(cat => {
              const isActive = selectedCategory === cat;
              return e('button', {
                key: cat,
                onClick: () => { setSelectedCategory(cat); setCurrentPage(1); },
                className: `px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${isActive ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface-pure text-on-surface-variant border-border-subtle hover:bg-surface-container hover:text-primary'}`
              }, cat);
            })
          )
        ),

        // Grid o Lista del Catálogo
        currentPaginatedItems.length > 0
          ? e('div', { className: viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6' : 'flex flex-col gap-3' },
              currentPaginatedItems.map(item =>
                e(CatalogCard, { key: item.id, item: item, viewMode: viewMode, onSelect: setSelectedItem })
              )
            )
          : e('div', { className: 'py-16 text-center text-text-muted bg-surface-bright rounded-3xl border border-border-subtle' },
              e('span', { className: 'material-symbols-outlined text-5xl mb-2 text-primary' }, 'find_in_page'),
              e('h3', { className: 'text-base font-bold text-on-surface' }, 'No se encontraron resultados'),
              e('p', { className: 'text-xs text-text-muted mt-1' }, 'Prueba con otro término de búsqueda o selecciona una categoría diferente.'),
              e('button', {
                onClick: () => { setSelectedCategory('TODOS'); setSearchQuery(''); setSortBy('default'); setCurrentPage(1); },
                className: 'mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm'
              }, 'Restablecer Todos los Filtros')
            ),

        // Componente de Paginación
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
      e(ImageLightboxModal, {
        item: selectedItem,
        allItems: processedItems,
        onClose: () => setSelectedItem(null),
        onNavigate: setSelectedItem
      })
    );
  }

  // Montar la app React en el DOM
  document.addEventListener('DOMContentLoaded', function() {
    const rootEl = document.getElementById('catalogo-visual-root');
    if (rootEl && window.React && window.ReactDOM) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(e(VisualCatalogApp));
    }
  });

})();
