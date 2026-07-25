(function() {
    'use strict';

    let allExams = [];
    let currentCategory = 'TODOS';
    let currentSearch = '';
    let currentLetter = ''; // 'A', 'B', etc. Vacío = todas

    const grid = document.getElementById('catalogo-grid');
    const chipsContainer = document.getElementById('catalogo-chips');
    const searchInput = document.getElementById('catalogo-search');
    const loader = document.getElementById('catalogo-loader');
    const emptyState = document.getElementById('catalogo-empty');
    const alphabetContainer = document.getElementById('catalogo-alphabet');

    // Bottom sheet elements
    const bottomSheet = document.getElementById('search-bottom-sheet');
    const bsBackdrop = document.getElementById('search-bottom-sheet-backdrop');
    const bsContent = document.getElementById('search-bottom-sheet-content');
    const bsResults = document.getElementById('bottom-sheet-results');
    const bsCount = document.getElementById('bottom-sheet-count');
    const bsClose = document.getElementById('close-bottom-sheet');

    if (!grid || !chipsContainer || !searchInput) return;

    // Load data from global variable (avoids CORS issues on file:// protocol)
    if (window.VENEMEDICAL_CATALOGO) {
        allExams = window.VENEMEDICAL_CATALOGO;
        if (loader) loader.classList.add('hidden');
        grid.classList.remove('hidden');
        initCatalog();
    } else {
        console.error('Data del catálogo no encontrada. Asegúrate de incluir catalogo_data.js');
        if (loader) loader.innerHTML = '<p class="text-error">Error al cargar el catálogo de datos.</p>';
    }

    function initCatalog() {
        // Extract unique categories
        const categories = ['TODOS'];
        allExams.forEach(exam => {
            if (!categories.includes(exam.categoria)) {
                categories.push(exam.categoria);
            }
        });

        renderChips(categories);
        renderAlphabet();
        renderGrid();

        // Search listener
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            // Reset alphabet filter when typing
            if (currentSearch.length > 0) currentLetter = '';
            
            renderAlphabet(); // update UI for alphabet
            renderGrid();
            
            // Si está en móvil y está escribiendo, abrir bottom sheet
            if (window.innerWidth < 640 && currentSearch.length > 0) {
                openBottomSheet();
            } else if (currentSearch.length === 0) {
                closeBottomSheet();
            }
        });

        // Eventos Bottom Sheet
        if (bsClose) bsClose.addEventListener('click', closeBottomSheet);
        if (bsBackdrop) bsBackdrop.addEventListener('click', closeBottomSheet);
    }

    function openBottomSheet() {
        if (!bottomSheet) return;
        bottomSheet.classList.remove('pointer-events-none');
        bsBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        bsBackdrop.classList.add('opacity-100', 'pointer-events-auto');
        bsContent.classList.remove('translate-y-full');
        bsContent.classList.add('translate-y-0');
    }

    function closeBottomSheet() {
        if (!bottomSheet) return;
        bsBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
        bsBackdrop.classList.add('opacity-0', 'pointer-events-none');
        bsContent.classList.remove('translate-y-0');
        bsContent.classList.add('translate-y-full');
        setTimeout(() => {
            bottomSheet.classList.add('pointer-events-none');
        }, 300);
    }

    function renderChips(categories) {
        chipsContainer.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            btn.className = `px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all border ${cat === currentCategory ? 'bg-primary-container text-on-primary border-primary-container shadow-md' : 'bg-surface-pure text-on-surface-variant border-border-subtle hover:bg-surface-container hover:text-primary'}`;
            btn.onclick = () => {
                currentCategory = cat;
                renderChips(categories);
                renderGrid();
            };
            chipsContainer.appendChild(btn);
        });
    }

    function renderAlphabet() {
        if (!alphabetContainer) return;
        alphabetContainer.innerHTML = '';
        
        const letters = ['ALL', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        
        letters.forEach(letter => {
            const btn = document.createElement('button');
            const isActive = (letter === 'ALL' && currentLetter === '') || (letter === currentLetter);
            
            btn.textContent = letter === 'ALL' ? 'Todos' : letter;
            
            // Estilos para los botones del abecedario
            btn.className = `flex-shrink-0 flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md font-label-sm text-sm transition-colors cursor-pointer ${
                isActive 
                ? 'bg-primary text-on-primary shadow-sm font-bold' 
                : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`;
            
            btn.onclick = () => {
                currentLetter = letter === 'ALL' ? '' : letter;
                // Limpiar barra de búsqueda al usar el filtro de abecedario
                if (currentLetter !== '') {
                    currentSearch = '';
                    searchInput.value = '';
                }
                renderAlphabet(); // update active state
                renderGrid();
            };
            
            alphabetContainer.appendChild(btn);
        });
    }

    function formatPrice(price) {
        return price.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function renderGrid() {
        grid.innerHTML = '';
        if (bsResults) bsResults.innerHTML = '';
        
        let filtered = allExams;

        // 1. Filtrar por Categoría
        if (currentCategory !== 'TODOS') {
            filtered = filtered.filter(e => e.categoria === currentCategory);
        }

        // 2. Filtrar por Búsqueda (Texto)
        if (currentSearch) {
            filtered = filtered.filter(e => e.nombre.toLowerCase().includes(currentSearch));
        }

        // 3. Filtrar por Abecedario
        if (currentLetter !== '') {
            filtered = filtered.filter(e => e.nombre.toUpperCase().startsWith(currentLetter));
        }
        
        if (bsCount) bsCount.textContent = filtered.length;

        if (filtered.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            if (bsResults) {
                bsResults.innerHTML = '<p class="text-center text-text-muted mt-8">No se encontraron resultados.</p>';
            }
        } else {
            grid.classList.remove('hidden');
            emptyState.classList.add('hidden');

            filtered.forEach(exam => {
                // Desktop / Normal Card
                const card = document.createElement('div');
                card.className = 'vm-card flex flex-col justify-between hover:border-primary-fixed-dim transition-colors group cursor-default';
                
                card.innerHTML = `
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <span class="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded tracking-wider">
                                COD: ${exam.id}
                            </span>
                        </div>
                        <h3 class="font-headline-md text-[18px] leading-tight text-on-surface mb-2 group-hover:text-primary transition-colors">
                            ${exam.nombre}
                        </h3>
                        <p class="font-label-sm text-on-surface-variant uppercase mb-4">${exam.categoria}</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-border-subtle flex justify-between items-end">
                        <div>
                            <p class="text-xs text-text-muted mb-1">Precio Referencial</p>
                            <p class="font-headline-md text-primary">$${formatPrice(exam.precio)}</p>
                        </div>
                        <a href="../citas/index.html?examen=${encodeURIComponent(exam.nombre)}" class="w-10 h-10 rounded-full bg-surface-container-low flex justify-center items-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </a>
                    </div>
                `;
                grid.appendChild(card);

                // Mobile Bottom Sheet item
                if (bsResults) {
                    const listItem = document.createElement('a');
                    listItem.href = `../citas/index.html?examen=${encodeURIComponent(exam.nombre)}`;
                    listItem.className = 'flex items-center justify-between p-3 rounded-lg border border-border-subtle hover:bg-surface-container-low transition-colors bg-surface-pure';
                    listItem.innerHTML = `
                        <div class="flex flex-col">
                            <span class="font-headline-sm text-[15px] text-on-surface leading-tight">${exam.nombre}</span>
                            <span class="font-label-sm text-on-surface-variant text-[11px] mt-1">${exam.categoria} &bull; COD: ${exam.id}</span>
                        </div>
                        <div class="flex flex-col items-end shrink-0 ml-2">
                            <span class="font-headline-sm text-primary text-[15px]">$${formatPrice(exam.precio)}</span>
                            <span class="material-symbols-outlined text-primary text-[18px] mt-1">arrow_forward</span>
                        </div>
                    `;
                    bsResults.appendChild(listItem);
                }
            });
        }
    }

})();
