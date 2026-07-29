/* ═══════════════════════════════════════════════════════════════════
   VENEMEDICAL — Dataset del Subportal de Catálogo Visual (Lentes + 117+ Hojas)
   ════════════════════════════════════════════════════════════════════ */

window.VENEMEDICAL_CARROUSEL_LENTES = [
  {
    id: 'lens-slide-1',
    title: 'Lentes Antirreflejos Digitales Blue-Cut',
    subtitle: 'Protección avanzada contra luz azul de pantallas, fatiga visual y rayos UV. Ideal para uso diario en oficina y dispositivos.',
    tag: 'Tecnología Óptica 2026',
    category: 'Protección Digital',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Consultar en WhatsApp',
    badgeColor: 'bg-primary-fixed text-primary'
  },
  {
    id: 'lens-slide-2',
    title: 'Colección Palazzo Dama & Finezza',
    subtitle: 'Diseños exclusivos en acero inoxidable y acetato italiano con acabados de alta gama y ligereza extrema.',
    tag: 'Colección Exclusiva',
    category: 'Monturas Dama',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Ver Catálogo Dama',
    badgeColor: 'bg-secondary-fixed text-secondary'
  },
  {
    id: 'lens-slide-3',
    title: 'Lentes Progresivos HD FreeForm',
    subtitle: 'Campos visuales ampliados con transición imperceptible entre visión de cerca, intermedia y lejana.',
    tag: 'Alta Definición',
    category: 'Lentes Multifocales',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Agendar Examen Visual',
    badgeColor: 'bg-tertiary-fixed text-tertiary'
  },
  {
    id: 'lens-slide-4',
    title: 'Fotocromáticos Intelishade SunSens',
    subtitle: 'Oscurecimiento ultra-rápido bajo el sol y transparencia total en interiores. Máxima adaptabilidad.',
    tag: 'Adaptación Solar',
    category: 'Fotocromáticos',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Cotizar Cristales',
    badgeColor: 'bg-primary-fixed text-primary'
  }
];

// Función para generar un placeholder SVG visual de alta calidad estilizado por página de catálogo
function generateCatalogPageSvg(pageNum, category, collection) {
  const isDama = collection.includes('Dama');
  const accentColor = isDama ? '#006877' : '#003f87';
  const secondaryBg = isDama ? '#e6f7fa' : '#eef4fc';
  
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <rect width="600" height="800" fill="#ffffff" rx="16"/>
    <rect x="20" y="20" width="560" height="760" fill="${secondaryBg}" rx="12" stroke="#e1e3e4" stroke-width="2"/>
    <!-- Header band -->
    <rect x="40" y="40" width="520" height="60" fill="${accentColor}" rx="8"/>
    <text x="60" y="78" font-family="Inter, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">VENEMEDICAL — CATÁLOGO</text>
    <text x="520" y="78" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="end">PÁG. ${pageNum}</text>
    
    <!-- Decorative Frame Art -->
    <rect x="60" y="130" width="480" height="520" fill="#ffffff" rx="10" stroke="#d7e2ff" stroke-width="2"/>
    <circle cx="300" cy="330" r="140" fill="${secondaryBg}" opacity="0.6"/>
    
    <!-- Glasses Icon / Frame Mock -->
    <g transform="translate(160, 270) scale(1.4)">
      <path d="M20 30 C 20 10, 70 10, 70 30 C 70 50, 20 50, 20 30 Z" fill="none" stroke="${accentColor}" stroke-width="5"/>
      <path d="M130 30 C 130 10, 180 10, 180 30 C 180 50, 130 50, 130 30 Z" fill="none" stroke="${accentColor}" stroke-width="5"/>
      <path d="M70 30 Q 100 20 130 30" fill="none" stroke="${accentColor}" stroke-width="4"/>
      <path d="M20 30 L 2 20" stroke="${accentColor}" stroke-width="3"/>
      <path d="M180 30 L 198 20" stroke="${accentColor}" stroke-width="3"/>
    </g>

    <text x="300" y="470" font-family="Inter, sans-serif" font-size="22" font-weight="bold" fill="#191c1d" text-anchor="middle">${collection}</text>
    <text x="300" y="505" font-family="Inter, sans-serif" font-size="16" font-weight="500" fill="#003f87" text-anchor="middle">${category}</text>
    <text x="300" y="535" font-family="Inter, sans-serif" font-size="14" fill="#6C757D" text-anchor="middle">Modelo Ref. VM-2026-${String(pageNum).padStart(3, '0')}</text>
    
    <line x1="100" y1="570" x2="500" y2="570" stroke="#e1e3e4" stroke-width="1.5" stroke-dasharray="6 4"/>
    
    <!-- Technical Specs Box -->
    <rect x="80" y="595" width="440" height="40" fill="${secondaryBg}" rx="6"/>
    <text x="300" y="620" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#424752" text-anchor="middle">Material: Acetato Premium • Calibre: 54-18-140 • Flex Spring</text>

    <!-- Footer info -->
    <text x="300" y="720" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#003f87" text-anchor="middle">Venemedical Care — Caracas, Venezuela</text>
    <text x="300" y="745" font-family="Inter, sans-serif" font-size="12" fill="#6C757D" text-anchor="middle">Atención WhatsApp: +58 424-1288247</text>
  </svg>`;
  
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}

// Generador de 117+ imágenes de hojas de catálogo
window.VENEMEDICAL_PAGINAS_CATALOGO = Array.from({ length: 117 }, (_, index) => {
  const pageNum = index + 1;
  const isDama = pageNum <= 60;
  const collection = isDama ? 'Palazzo Dama & Finezza' : 'Palazzo Caballeros';
  
  let category = 'Monturas Ejecutivas';
  if (pageNum % 5 === 1) category = 'Monturas Titán & Ultralivianas';
  else if (pageNum % 5 === 2) category = 'Lentes de Sol Polarizados';
  else if (pageNum % 5 === 3) category = 'Cristales Anti-Reflejo Blue-Cut';
  else if (pageNum % 5 === 4) category = 'Monturas Flexibles Acetato';

  const svgDataUrl = generateCatalogPageSvg(pageNum, category, collection);

  return {
    id: `cat-sheet-${pageNum}`,
    pageNumber: pageNum,
    title: `Página ${pageNum} — ${collection}`,
    collection: collection,
    category: category,
    refCode: `VM-2026-${String(pageNum).padStart(3, '0')}`,
    imageUrl: svgDataUrl,
    highResUrl: svgDataUrl
  };
});
