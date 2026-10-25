/* ════════════════════════════════════════════════════
   GRUPO SABER — carrusel.js
   Movimiento automático continuo y autónomo
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const carruselTrack     = document.getElementById('carruselTrack');
  const carruselSlides    = document.querySelectorAll('.carrusel__slide');
  const carruselPrev      = document.getElementById('carruselPrev');
  const carruselNext      = document.getElementById('carruselNext');
  const carruselDots      = document.querySelectorAll('.carrusel__dot');
  const carruselCounter   = document.getElementById('carruselCounter');
  const carruselContainer = document.getElementById('carruselPromesas');

  // Asegurar que las imágenes cargadas oculten la tarjeta de respaldo
  document.querySelectorAll('.carrusel__img').forEach(img => {
    const handleLoad = () => {
      const fallback = img.previousElementSibling;
      if (fallback && fallback.classList.contains('carrusel__card-fallback')) {
        fallback.classList.remove('is-visible');
      }
      img.classList.remove('is-hidden');
    };

    if (img.complete && img.naturalHeight !== 0) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
    }
  });

  if (!carruselTrack || carruselSlides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = carruselSlides.length;
  const slideDuration = 2800; // Se mueve solo automáticamente cada 2.8 segundos
  let autoPlayTimer = null;

  const updateCarrusel = (newIndex) => {
    currentIndex = (newIndex + totalSlides) % totalSlides;
    carruselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    carruselSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    carruselDots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    if (carruselCounter) {
      carruselCounter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }
  };

  const startAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      updateCarrusel(currentIndex + 1);
    }, slideDuration);
  };

  const restartAutoPlay = () => {
    startAutoPlay();
  };

  if (carruselPrev) {
    carruselPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarrusel(currentIndex - 1);
      restartAutoPlay();
    });
  }

  if (carruselNext) {
    carruselNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarrusel(currentIndex + 1);
      restartAutoPlay();
    });
  }

  carruselDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        updateCarrusel(idx);
        restartAutoPlay();
      }
    });
  });

  // Soporte para gestos táctiles (Swipe en móviles)
  if (carruselContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    carruselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carruselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > 35) {
        if (swipeDistance > 0) {
          updateCarrusel(currentIndex + 1);
        } else {
          updateCarrusel(currentIndex - 1);
        }
        restartAutoPlay();
      }
    }, { passive: true });
  }

  // Navegación con teclado (opcional)
  document.addEventListener('keydown', (e) => {
    const rect = carruselContainer?.getBoundingClientRect();
    if (!rect) return;
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;

    if (e.key === 'ArrowLeft') {
      updateCarrusel(currentIndex - 1);
      restartAutoPlay();
    } else if (e.key === 'ArrowRight') {
      updateCarrusel(currentIndex + 1);
      restartAutoPlay();
    }
  });

  // Iniciar automáticamente de inmediato sin requerir interacción
  updateCarrusel(0);
  startAutoPlay();
});
