(function() {
    'use strict';

    const PAGE_SIZE = 24;
    let allExams = [];
    let filteredExams = [];
    let renderedCount = 0;
    let currentCategory = 'TODOS';
    let currentSearch = '';
    let currentLetter = '';

    const grid = document.getElementById('catalogo-grid');
    const chipsContainer = document.getElementById('catalogo-chips');
    const searchInput = document.getElementById('catalogo-search');
    const loader = document.getElementById('catalogo-loader');
    const emptyState = document.getElementById('catalogo-empty');
    const alphabetContainer = document.getElementById('catalogo-alphabet');
    const countEl = document.getElementById('catalogo-count');
    const moreWrap = document.getElementById('catalogo-more-wrap');
    const moreBtn = document.getElementById('catalogo-more-btn');

    if (!grid || !chipsContainer || !searchInput) return;

    function esc(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

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
        const categories = ['TODOS'];
        allExams.forEach(exam => {
            if (!categories.includes(exam.categoria)) categories.push(exam.categoria);
        });

        renderChips(categories);
        renderAlphabet();
        applyAndRender();

        let searchTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                currentSearch = e.target.value.toLowerCase().trim();
                if (currentSearch.length > 0 && currentLetter !== '') {
                    currentLetter = '';
                    renderAlphabet();
                }
                applyAndRender();
            }, 200);
        });

        if (moreBtn) {
            moreBtn.addEventListener('click', appendNextBatch);
        }
    }

    function renderChips(categories) {
        chipsContainer.innerHTML = '';
        const frag = document.createDocumentFragment();
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = cat;
            btn.className = `px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all border ${cat === currentCategory ? 'bg-primary-container text-on-primary border-primary-container shadow-md' : 'bg-surface-pure text-on-surface-variant border-border-subtle hover:bg-surface-container hover:text-primary'}`;
            btn.onclick = () => {
                currentCategory = cat;
                renderChips(categories);
                applyAndRender();
            };
            frag.appendChild(btn);
        });
        chipsContainer.appendChild(frag);
    }

    function renderAlphabet() {
        if (!alphabetContainer) return;
        alphabetContainer.innerHTML = '';
        const letters = ['ALL', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        const frag = document.createDocumentFragment();
        letters.forEach(letter => {
            const btn = document.createElement('button');
            btn.type = 'button';
            const isActive = (letter === 'ALL' && currentLetter === '') || (letter === currentLetter);
            btn.textContent = letter === 'ALL' ? 'Todos' : letter;
            btn.className = `flex-shrink-0 flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md font-label-sm text-sm transition-colors cursor-pointer ${
                isActive
                ? 'bg-primary text-on-primary shadow-sm font-bold'
                : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`;
            btn.onclick = () => {
                currentLetter = letter === 'ALL' ? '' : letter;
                if (currentLetter !== '') {
                    currentSearch = '';
                    searchInput.value = '';
                }
                renderAlphabet();
                applyAndRender();
            };
            frag.appendChild(btn);
        });
        alphabetContainer.appendChild(frag);
    }

    function formatPrice(price) {
        return Number(price || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function createCard(exam) {
        const card = document.createElement('div');
        card.className = 'vm-card flex flex-col justify-between hover:border-primary-fixed-dim transition-colors group cursor-default';
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-3">
                    <span class="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded tracking-wider">
                        COD: ${esc(exam.id)}
                    </span>
                </div>
                <h3 class="font-headline-md text-[18px] leading-tight text-on-surface mb-2 group-hover:text-primary transition-colors">
                    ${esc(exam.nombre)}
                </h3>
                <p class="font-label-sm text-on-surface-variant uppercase mb-4">${esc(exam.categoria)}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-border-subtle flex justify-between items-end">
                <div>
                    <p class="text-xs text-text-muted mb-1">Precio Referencial</p>
                    <p class="font-headline-md text-primary">$${formatPrice(exam.precio)}</p>
                </div>
                <a href="/citas/?examen=${encodeURIComponent(exam.nombre)}" aria-label="Agendar ${esc(exam.nombre)}" class="w-10 h-10 rounded-full bg-surface-container-low flex justify-center items-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                    <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
            </div>
        `;
        return card;
    }

    function updateCounterAndButton() {
        const total = filteredExams.length;
        if (countEl) {
            if (total > 0) {
                countEl.textContent = `Mostrando ${renderedCount} de ${total} exámenes`;
                countEl.classList.remove('hidden');
            } else {
                countEl.classList.add('hidden');
            }
        }
        if (moreWrap && moreBtn) {
            const remaining = total - renderedCount;
            if (remaining > 0) {
                moreBtn.textContent = `Ver más exámenes (${remaining} restantes)`;
                moreWrap.classList.remove('hidden');
            } else {
                moreWrap.classList.add('hidden');
            }
        }
    }

    function appendNextBatch() {
        const slice = filteredExams.slice(renderedCount, renderedCount + PAGE_SIZE);
        if (!slice.length) return;
        const frag = document.createDocumentFragment();
        slice.forEach(exam => frag.appendChild(createCard(exam)));
        grid.appendChild(frag);
        renderedCount += slice.length;
        updateCounterAndButton();
    }

    function applyAndRender() {
        let filtered = allExams;
        if (currentCategory !== 'TODOS') {
            filtered = filtered.filter(e => e.categoria === currentCategory);
        }
        if (currentSearch) {
            filtered = filtered.filter(e => e.nombre.toLowerCase().includes(currentSearch));
        }
        if (currentLetter !== '') {
            filtered = filtered.filter(e => e.nombre.toUpperCase().startsWith(currentLetter));
        }

        filteredExams = filtered;
        renderedCount = 0;
        grid.innerHTML = '';

        if (filteredExams.length === 0) {
            grid.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            updateCounterAndButton();
        } else {
            grid.classList.remove('hidden');
            if (emptyState) emptyState.classList.add('hidden');
            appendNextBatch();
        }
    }

})();
