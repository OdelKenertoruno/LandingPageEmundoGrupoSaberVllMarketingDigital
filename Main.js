/* ════════════════════════════════════════════════════
   EDICIONES MUNDO — main.js
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR: sticky + always visible since it's transparent ─── */
  const navbar    = document.getElementById('navbar');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ─── 2. HAMBURGER — menú móvil ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  /* ─── 3. REVEAL ON SCROLL (IntersectionObserver) ─── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger dentro del mismo contenedor padre
      const siblings = Array.from(
        entry.target.closest('.section__inner, .mv__cards, .valores__grid, .sedes__grid, .redes__grid, .gallery__grid, main')
          ?.querySelectorAll('.reveal') ?? []
      );
      const idx   = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 75, 450);

      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => revealObs.observe(el));


  /* ─── 4. BOTÓN FLECHA — galería de fotos ─── */
  const toggleBtn      = document.getElementById('toggleGallery');
  const gallerySection = document.getElementById('gallerySection');

  if (toggleBtn && gallerySection) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = gallerySection.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      gallerySection.setAttribute('aria-hidden', String(!isOpen));

      if (isOpen) {
        // Scroll suave hasta la galería tras la animación
        setTimeout(() => {
          gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    });
  }


  /* ─── 5. SMOOTH SCROLL para anclas ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─── 6. HIGHLIGHT enlace activo según sección visible ─── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.navbar__links a[href^="#"]');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, {
    threshold:  0.4,
    rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px`,
  });

  sections.forEach(s => activeObs.observe(s));


  /* ─── 7. ANIMACIÓN ENTRY de la hero al cargar ─── */
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    // La hero ya tiene clase reveal; forzamos visible tras breve delay para que se aprecie
    setTimeout(() => heroContent.classList.add('visible'), 200);
  }

  /* ===================================================
   ANALYTICS - CLICK DASHBOARD
=================================================== */

const btnAnalytics = document.querySelector('.btn-analytics');

if(btnAnalytics){

    btnAnalytics.addEventListener('click', ()=>{

        gtag('event', 'click_dashboard_analytics', {

            event_category: 'Analytics',
            event_label: 'Dashboard Analytics'

        });

    });

}
const socialLinksIndex = [
    { selector: '.red__card--fb',  platform: 'facebook',   location: 'redes_section' },
    { selector: '.red__card--ig',  platform: 'instagram',  location: 'redes_section' },
    { selector: '.red__card--tk',  platform: 'tiktok',     location: 'redes_section' },
    { selector: '.red__card--wa',  platform: 'whatsapp',   location: 'redes_section' },
  ];

  socialLinksIndex.forEach(({ selector, platform, location }) => {
    // querySelectorAll porque puede haber varios (ej. dos .red__card--fb)
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', () => {
        if (typeof gtag !== 'function') return;
        gtag('event', 'social_click', {
          platform:  platform,
          page:      'index',
          location:  location,
          link_url:  el.getAttribute('href') || ''
        });
      });
    });
  });

});