// ═══════════════════════════════════════════════════════════════════════
//  GRUPO SABER — DashboardCatalago.js
//  Catálogo de Biblias + Carrusel de campañas + KPI 7 (clics + apertura)
// ═══════════════════════════════════════════════════════════════════════

const WA_NUMBER = "50578875960";

// ──────────────────────────────────────────────────────────────────────
//  DATOS DE LAS BIBLIAS
// ──────────────────────────────────────────────────────────────────────
const biblias = [
  { id:1,  categoria:"Biblias de Estudio", nombre:"Macarthur",                                      precio:3600, precioCredito:4800, prima:600, cuotas:8, montoCuota:525, imagen:"Categorias/Biblias de Estudio/Macarthur.png" },
  { id:2,  categoria:"Biblias de Estudio", nombre:"Vida Plena",                                     precio:3600, precioCredito:4800, prima:600, cuotas:8, montoCuota:525, imagen:"Categorias/Biblias de Estudio/VidaPlena.png" },
  { id:3,  categoria:"Biblias de Estudio", nombre:"Scoffield",                                      precio:3600, precioCredito:4800, prima:600, cuotas:8, montoCuota:525, imagen:"Categorias/Biblias de Estudio/Scoffield.png" },
  { id:4,  categoria:"Biblias de Estudio", nombre:"Holman Arcoiris",                                precio:3600, precioCredito:4800, prima:600, cuotas:8, montoCuota:525, imagen:"Categorias/Biblias de Estudio/Holman Arcoiris.png" },
  { id:5,  categoria:"Biblias de Estudio", nombre:"El Manual del ministro Ampliada",                precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblias de Estudio/El Manual del ministro Ampliada.png" },
  { id:6,  categoria:"Biblias de Estudio", nombre:"El Pescador edición de Liderazgo",               precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblias de Estudio/El Pescador edición de Liderazgo.png" },
  { id:7,  categoria:"Biblias de Estudio", nombre:"El Pescador edición Revisada y Ampliada",        precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblias de Estudio/El Pescador edición Revisada y Ampliada.png" },
  { id:8,  categoria:"Biblia Letra Grande 12 puntos Dama", nombre:"Holman Letra Grande 12 puntos de maletín RVR 1960",          precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Dama/Holman Letra Grande 12 puntos de maletín RVR 1960.png" },
  { id:9,  categoria:"Biblia Letra Grande 12 puntos Dama", nombre:"Holman Letra Grande 12 puntos edición limitada RVR 1960",    precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Dama/Holman Letra Grande 12 puntos edición limitada RVR 1960.png" },
  { id:10, categoria:"Biblia Letra Grande 12 puntos Dama", nombre:"Holman Letra Grande 12 puntos edición limitada RVR 1960 (2)",precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Dama/Holman Letra Grande 12 puntos edición limitada RVR 1960 (2).png" },
  { id:11, categoria:"Biblia Letra Grande 12 puntos Dama", nombre:"Letra Grande 11 puntos edición primaveral RVR 1960",         precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Dama/Letra Grande 11 puntos edición primaveral RVR 1960.png" },
  { id:12, categoria:"Biblia Letra Grande 12 puntos Caballero", nombre:"Holman Letra Grande 12 puntos edición limitada RVR 1960",    precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Caballero/Holman Letra Grande 12 puntos edición limitada RVR 1960.png" },
  { id:13, categoria:"Biblia Letra Grande 12 puntos Caballero", nombre:"Letra Grande 12 puntos Vitono RVR 1960",                     precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Caballero/Letra Grande 12 puntos Vitono RVR 1960.png" },
  { id:14, categoria:"Biblia Letra Grande 12 puntos Caballero", nombre:"Holman Letra Grande 12 puntos edición limitada RVR 1960 (2)",precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Caballero/Holman Letra Grande 12 puntos edición limitada RVR 1960 (2).png" },
  { id:15, categoria:"Biblia Letra Grande 12 puntos Caballero", nombre:"Holman Letra Grande 12 puntos edición limitada RVR 1960 (3)",precio:2700, precioCredito:3400, prima:600, cuotas:5, montoCuota:560, imagen:"Categorias/Biblia Letra Grande 12 puntos Caballero/Holman Letra Grande 12 puntos edición limitada RVR 1960 (3).png" },
  { id:16, categoria:"Biblia letra Gigante 14 puntos Dama", nombre:"Holman Letra Grande 14 puntos edición limitada RVR 1960 (4)",precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblia letra Gigante 14 puntos Dama/Holman Letra Grande 14 puntos edición limitada RVR 1960 (4).png" },
  { id:17, categoria:"Biblia letra Gigante 14 puntos Dama", nombre:"Holman Letra Grande 14 puntos edición limitada RVR 1960 (5)",precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblia letra Gigante 14 puntos Dama/Holman Letra Grande 14 puntos edición limitada RVR 1960 (5).png" },
  { id:18, categoria:"Biblia letra Gigante 14 puntos Dama", nombre:"Holman Letra Grande 14 puntos edición limitada RVR 1960 (6)",precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblia letra Gigante 14 puntos Dama/Holman Letra Grande 14 puntos edición limitada RVR 1960 (6).png" },
  { id:19, categoria:"Biblia letra Gigante 14 puntos Caballero", nombre:"Holman Letra Grande 14 puntos edición limitada RVR 1960",    precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblia letra Gigante 14 puntos Caballero/Holman Letra Grande 14 puntos edición limitada RVR 1960.png" },
  { id:20, categoria:"Biblia letra Gigante 14 puntos Caballero", nombre:"Holman Letra Grande 14 puntos edición limitada RVR 1960 (2)",precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblia letra Gigante 14 puntos Caballero/Holman Letra Grande 14 puntos edición limitada RVR 1960 (2).png" },
  { id:21, categoria:"Biblia letra Gigante 14 puntos Caballero", nombre:"Holman Letra Grande 14 puntos edición limitada RVR 1960 (3)",precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Biblia letra Gigante 14 puntos Caballero/Holman Letra Grande 14 puntos edición limitada RVR 1960 (3).png" },
  { id:22, categoria:"Biblia Letra Ultra Gigante 19 puntos", nombre:"Holman de referencias de Letra Grande 19 puntos RVR 1960", precio:3375, precioCredito:4500, prima:600, cuotas:8, montoCuota:488, imagen:"Categorias/Biblia Letra Ultra Gigante 19 puntos/Holman de referencias de Letra Grande 19 puntos RVR 1960.png" },
  { id:23, categoria:"Biblia para niños y niñas", nombre:"Biblia Letra Grande de 12 puntos con ilustraciones", precio:2080, precioCredito:2600, prima:600, cuotas:4, montoCuota:500, imagen:"Categorias/Biblia para niños y niñas/Biblia Letra Grande de 12 puntos con ilustraciones.png" },
  { id:24, categoria:"Diccionario e Enciclopedia Bíblica", nombre:"Diccionario Bíblico Wycliffe", precio:2813, precioCredito:3750, prima:600, cuotas:6, montoCuota:525, imagen:"Categorias/Diccionario e Enciclopedia Bíblica/Diccionario Bíblico Wycliffe.png" }
];

// ──────────────────────────────────────────────────────────────────────
//  ESTADO GLOBAL
// ──────────────────────────────────────────────────────────────────────
let currentFilter   = "todas";
let currentSearch   = "";
let searchDebounce  = null;

// ── ELEMENTOS DOM ──────────────────────────────────────────────────────
const catalogGrid       = document.getElementById("catalogGrid");
const rightSidebar      = document.getElementById("rightSidebar");
const creditContent     = document.getElementById("creditContent");
const overlay           = document.getElementById("overlay");
const searchInput       = document.getElementById("searchInput");
const searchClear       = document.getElementById("searchClear");
const autocompleteDD    = document.getElementById("autocompleteDropdown");
const emptyState        = document.getElementById("emptyState");
const resultsCount      = document.getElementById("resultsCount");
const activeFilterLabel = document.getElementById("activeFilterLabel");
const leftSidebar       = document.getElementById("leftSidebar");
const toggleSidebar     = document.getElementById("toggleSidebar");
const toggleIcon        = document.getElementById("toggleIcon");

const fmt = n => "C$ " + n.toLocaleString("es-NI");

// ──────────────────────────────────────────────────────────────────────
//  CATÁLOGO
// ──────────────────────────────────────────────────────────────────────
function filteredData() {
  return biblias.filter(b => {
    const matchCat    = currentFilter === "todas" || b.categoria === currentFilter;
    const matchSearch = !currentSearch ||
      b.nombre.toLowerCase().includes(currentSearch) ||
      b.categoria.toLowerCase().includes(currentSearch);
    return matchCat && matchSearch;
  });
}

function renderBiblias(data) {
  catalogGrid.innerHTML = "";
  if (data.length === 0) {
    emptyState.style.display = "block";
    resultsCount.textContent = "Sin resultados";
    return;
  }
  emptyState.style.display = "none";
  resultsCount.textContent = `${data.length} ${data.length === 1 ? "Biblia encontrada" : "Biblias encontradas"}`;
  const fragment = document.createDocumentFragment();
  data.forEach((b, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 0.06}s`;
    const shortCat = b.categoria.replace("Biblia ", "").replace("Biblias de ", "");
    card.innerHTML = `
      <span class="card-badge">${shortCat}</span>
      <div class="card-image loading" id="img-wrap-${b.id}">
        <img data-src="${b.imagen}" alt="${b.nombre}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
      </div>
      <div class="card-content">
        <p class="card-name">${b.nombre}</p>
        <div class="card-price-row"><div><span class="card-price-label">Precio contado</span><p class="card-price">${fmt(b.precio)}</p></div></div>
        <div class="card-buttons">
          <button class="btn btn-credit" data-id="${b.id}"><i class="fa-solid fa-credit-card"></i> Crédito</button>
          <a href="https://wa.me/${WA_NUMBER}?text=Hola%2C%20deseo%20información%20sobre%20la%20Biblia%3A%20${encodeURIComponent(b.nombre)}" target="_blank" style="flex:1; display:flex;"><button class="btn btn-whatsapp" style="width:100%"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button></a>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });
  catalogGrid.appendChild(fragment);
  initLazyLoad();
  catalogGrid.querySelectorAll(".btn-credit").forEach(btn => {
    btn.addEventListener("click", () => openCredit(Number(btn.dataset.id)));
  });
}

function initLazyLoad() {
  const imgs = catalogGrid.querySelectorAll("img[data-src]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img  = entry.target;
      const wrap = img.closest(".card-image");
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      img.onload  = () => { if (wrap) wrap.classList.remove("loading"); };
      img.onerror = () => { if (wrap) { wrap.classList.remove("loading"); wrap.style.background = "#dceef5"; } };
      observer.unobserve(img);
    });
  }, { rootMargin: "100px" });
  imgs.forEach(img => observer.observe(img));
}

function openCredit(id) {
  const b = biblias.find(item => item.id === id);
  if (!b) return;
  creditContent.style.opacity   = "0";
  creditContent.style.transform = "translateX(30px)";
  rightSidebar.classList.add("active");
  overlay.classList.add("active");
  setTimeout(() => {
    creditContent.innerHTML = `
      <div class="credit-img-wrap"><img src="${b.imagen}" alt="${b.nombre}" /></div>
      <p class="credit-name">${b.nombre}</p>
      <p class="credit-cat">${b.categoria}</p>
      <div class="credit-card">
        <p class="credit-card-title">Precio de crédito</p>
        <p class="credit-card-price"><span>C$</span> ${b.precioCredito.toLocaleString("es-NI")}</p>
        <div class="credit-details">
          <div class="credit-detail-item"><span class="credit-detail-label">Prima inicial</span><span class="credit-detail-value">${fmt(b.prima)}</span></div>
          <div class="credit-detail-item"><span class="credit-detail-label">N° de cuotas</span><span class="credit-detail-value">${b.cuotas} cuotas</span></div>
          <div class="credit-detail-item" style="grid-column:1/-1"><span class="credit-detail-label">Monto por cuota</span><span class="credit-detail-value">${fmt(b.montoCuota)} / mes</span></div>
        </div>
      </div>
      <a href="https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20interesa%20el%20plan%20de%20crédito%20para%20la%20Biblia%3A%20${encodeURIComponent(b.nombre)}" target="_blank" class="credit-wa-btn"><i class="fa-brands fa-whatsapp"></i> Consultar plan de crédito</a>
    `;
    creditContent.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    creditContent.style.opacity    = "1";
    creditContent.style.transform  = "translateX(0)";
  }, 120);
}

function closeCredit() {
  rightSidebar.classList.remove("active");
  overlay.classList.remove("active");
}

document.getElementById("closeCreditSidebar").addEventListener("click", closeCredit);
overlay.addEventListener("click", closeCredit);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCredit(); });

document.querySelectorAll(".filter-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentFilter = pill.dataset.cat;
    if (currentFilter === "todas") activeFilterLabel.classList.remove("visible");
    else { activeFilterLabel.textContent = currentFilter; activeFilterLabel.classList.add("visible"); }
    renderBiblias(filteredData());
  });
});

searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();
  searchClear.classList.toggle("visible", val.length > 0);
  updateAutocomplete(val);
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentSearch = val.toLowerCase();
    renderBiblias(filteredData());
  }, 280);
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.classList.remove("visible");
  autocompleteDD.classList.remove("open");
  currentSearch = "";
  renderBiblias(filteredData());
  searchInput.focus();
});

function updateAutocomplete(val) {
  if (val.length < 2) { autocompleteDD.classList.remove("open"); return; }
  const lower   = val.toLowerCase();
  const matches = biblias.filter(b =>
    b.nombre.toLowerCase().includes(lower) || b.categoria.toLowerCase().includes(lower)
  ).slice(0, 6);
  if (matches.length === 0) { autocompleteDD.classList.remove("open"); return; }
  autocompleteDD.innerHTML = matches.map(b => `
    <div class="autocomplete-item" data-id="${b.id}">
      <i class="fa-solid fa-book"></i>
      <span>${highlight(b.nombre, val)}</span>
      <span class="autocomplete-cat">${b.categoria.replace("Biblia ","").replace("Biblias de ","")}</span>
    </div>
  `).join("");
  autocompleteDD.classList.add("open");
  autocompleteDD.querySelectorAll(".autocomplete-item").forEach(item => {
    item.addEventListener("click", () => {
      const b = biblias.find(x => x.id === Number(item.dataset.id));
      if (!b) return;
      searchInput.value = b.nombre;
      searchClear.classList.add("visible");
      autocompleteDD.classList.remove("open");
      currentSearch = b.nombre.toLowerCase();
      renderBiblias(filteredData());
    });
  });
}

function highlight(text, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  return text.replace(re, '<strong style="color:var(--primary)">$1</strong>');
}

document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrapper")) autocompleteDD.classList.remove("open");
});

toggleSidebar.addEventListener("click", () => {
  const collapsed = leftSidebar.classList.toggle("collapsed");
  toggleIcon.className = collapsed ? "fa-solid fa-chevron-right" : "fa-solid fa-chevron-left";
});

document.getElementById("emptyReset").addEventListener("click", () => {
  searchInput.value = "";
  searchClear.classList.remove("visible");
  currentSearch = "";
  currentFilter = "todas";
  document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
  document.querySelector('.filter-pill[data-cat="todas"]').classList.add("active");
  activeFilterLabel.classList.remove("visible");
  renderBiblias(biblias);
});

renderBiblias(biblias);

// ── SPEED DIAL ─────────────────────────────────────────────────────────
const speedDial     = document.getElementById("speedDial");
const speedDialMain = document.getElementById("speedDialMain");
const speedDialIcon = document.getElementById("speedDialIcon");

speedDialMain.addEventListener("click", () => {
  const isOpen = speedDial.classList.toggle("open");
  speedDialIcon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-share-nodes";
});
document.addEventListener("click", e => {
  if (!e.target.closest(".speed-dial")) {
    speedDial.classList.remove("open");
    speedDialIcon.className = "fa-solid fa-share-nodes";
  }
});

// ═══════════════════════════════════════════════════════════════════════
//  CARRUSEL DE CAMPAÑAS + LIGHTBOX + KPI 7 (GA4)
//  ✅ Código único — sin duplicados
// ═══════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {

  const track         = document.getElementById('carouselTrack');
  const nextBtn       = document.getElementById('carouselNext');
  const prevBtn       = document.getElementById('carouselPrev');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track) return;

  const slideEls = Array.from(track.children);
  let currentIdx = 0;
  let autoTimer;
  const AUTO_DELAY = 5000;

  // ── Puntos indicadores ──────────────────────────────────────────────
  slideEls.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  // ── Lógica de movimiento ────────────────────────────────────────────
  function updateCarousel() {
    const w = slideEls[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIdx * w}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
  }

  function goTo(idx) {
    currentIdx = (idx + slideEls.length) % slideEls.length;
    updateCarousel();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(currentIdx + 1), AUTO_DELAY);
  }

  nextBtn.addEventListener('click', () => goTo(currentIdx + 1));
  prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
  window.addEventListener('resize', updateCarousel);
  resetAuto();

  // ── Lightbox ────────────────────────────────────────────────────────
  const modal = document.createElement('div');
  modal.className = 'modal-lightbox';
  modal.innerHTML = `
    <span class="close-modal">&times;</span>
    <img class="modal-content" id="modalImg" src="" alt="Ampliar campaña">
  `;
  document.body.appendChild(modal);

  const modalImg      = modal.querySelector('#modalImg');
  const closeModalBtn = modal.querySelector('.close-modal');

  // ── KPI 7: clic en imagen → GA4 + lightbox ─────────────────────────
  slideEls.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;

    img.style.cursor = 'pointer';

    img.addEventListener('click', (e) => {
      e.stopPropagation();

      const campaignName     = img.getAttribute('data-campaign');
      const campaignPosition = img.getAttribute('data-position');

      // ✅ Evento GA4 — disparo único y limpio
      // NOTA: usamos "nombre_campania" en lugar de "campaign_name"
      // porque "campaign_name" es palabra reservada de GA4 y se convierte a "campaign"
      if (typeof gtag === 'function' && campaignName) {
        gtag('event', 'campaign_click', {
          nombre_campania  : campaignName,
          campaign_position: parseInt(campaignPosition) || 0,
          page_location    : window.location.href,
          page_title       : document.title
        });
        console.log(`📊 GA4 ▶ campaign_click | ${campaignName} | pos ${campaignPosition}`);
      }

      // Abrir lightbox
      modalImg.src = img.src;
      modal.classList.add('active');
    });
  });

  // ── Cerrar lightbox ─────────────────────────────────────────────────
  function cerrarModal() {
    modal.classList.remove('active');
    modalImg.src = '';
  }

  closeModalBtn.addEventListener('click', cerrarModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
  });

});

// ════════════════════════════════════════════════════
//  GA4 — social_click · Catálogo (Speed Dial)
// ════════════════════════════════════════════════════

(function trackSocialClicksCatalogo() {

  const socialDial = [
    { selector: '.speed-dial__btn--fb', platform: 'facebook'  },
    { selector: '.speed-dial__btn--ig', platform: 'instagram' },
    { selector: '.speed-dial__btn--tk', platform: 'tiktok'    },
    { selector: '.speed-dial__btn--wa', platform: 'whatsapp'  },
  ];

  socialDial.forEach(({ selector, platform }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    el.addEventListener('click', () => {
      if (typeof gtag !== 'function') return;
      gtag('event', 'social_click', {
        platform:  platform,
        page:      'catalogo',
        location:  'speed_dial',
        link_url:  el.getAttribute('href') || ''
      });
    });
  });

})();