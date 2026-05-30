document.addEventListener('DOMContentLoaded', () => {

  const splash       = document.getElementById('splash-screen');
  const progressBar  = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const loadingText  = document.getElementById('loadingText');

  if (!splash) return;

  const loadingMessages = [
    'Preparando tu espacio de lectura...',
    'Cargando la Palabra...',
    'Inspirando nuevos comienzos...',
    'Conectando fe y conocimiento...',
    'Todo listo para ti...'
  ];

  let progress = 0;
  let msgIndex = 0;

  // Bloquear scroll mientras carga
  document.body.style.overflow = 'hidden';

  // ── Función que oculta el splash definitivamente ──
  function hideSplash() {
    splash.classList.add('hide');
    document.body.style.overflow = '';
    // Después de la transición lo sacamos del flujo
    setTimeout(() => {
      splash.style.display = 'none';
    }, 1100);
  }

  // ── Failsafe: máximo 5 segundos pase lo que pase ──
  const failsafe = setTimeout(() => {
    clearInterval(splashInterval);
    progressBar.style.width = '100%';
    progressText.textContent = '100%';
    hideSplash();
  }, 5000);

  const splashInterval = setInterval(() => {

    progress += Math.floor(Math.random() * 12) + 5;
    if (progress > 100) progress = 100;

    progressBar.style.width  = `${progress}%`;
    progressText.textContent = `${progress}%`;

    // Rotar mensajes
    if (
      progress > (msgIndex + 1) * 15 &&
      msgIndex < loadingMessages.length - 1
    ) {
      msgIndex++;
      loadingText.textContent = loadingMessages[msgIndex];
    }

    // Al llegar al 100%
    if (progress >= 100) {
      clearInterval(splashInterval);
      clearTimeout(failsafe);
      loadingText.textContent = loadingMessages[loadingMessages.length - 1];

      setTimeout(() => {
        hideSplash();
      }, 600);
    }

  }, 180);

});