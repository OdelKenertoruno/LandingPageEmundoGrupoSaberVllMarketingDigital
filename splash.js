(function () {

  /* ── PALETA ── */
  const BOOKS = [
    ['#00608B', '#0092BA'],
    ['#0092BA', '#A0C5CF'],
    ['#C9A84C', '#E8D5A0'],
    ['#A0C5CF', '#66C9D3'],
    ['#005577', '#0092BA'],
    ['#66C9D3', '#A0C5CF'],
    ['#00608B', '#66C9D3'],
    ['#C9A84C', '#0092BA'],
    ['#0092BA', '#66C9D3'],
    ['#A0C5CF', '#00608B'],
    ['#E8D5A0', '#C9A84C'],
    ['#005577', '#66C9D3'],
    ['#0092BA', '#E8D5A0'],
    ['#66C9D3', '#00608B'],
    ['#C9A84C', '#A0C5CF'],
  ];

  const H1 = [78, 108, 92, 118, 86, 104, 112, 88, 98, 110, 84, 106, 96, 114, 90];
  const H2 = [94, 84, 114, 88, 106, 98, 86, 118, 104, 90, 110, 96, 114, 80, 104];

  function buildShelf(el, heights, delay) {
    heights.forEach(function (h, i) {
      var c = BOOKS[i % BOOKS.length];
      var book = document.createElement('div');
      book.className = 'splash-book';
      book.style.height = h + 'px';
      book.style.background = c[0];
      book.style.animationDelay = (delay + i * 55) + 'ms';

      var spine = document.createElement('div');
      spine.className = 'splash-book-spine';
      spine.style.background = c[1];

      book.appendChild(spine);
      el.appendChild(book);
    });
  }

  buildShelf(document.getElementById('shelf1'), H1, 100);
  buildShelf(document.getElementById('shelf2'), H2, 950);

  /* ── PROGRESO ── */
  var bar      = document.getElementById('progressBar');
  var pctLabel = document.getElementById('progressText');
  var loadText = document.getElementById('loadingText');
  var splash   = document.getElementById('splash-screen');

  var messages = [
    'Preparando conocimiento...',
    'Cargando colección...',
    'Ordenando estantes...',
    'Casi listo...',
  ];

  var totalMs   = 3500;
  var startTime = performance.now();

  function tick() {
    var elapsed  = performance.now() - startTime;
    var progress = Math.min(100, Math.round((elapsed / totalMs) * 100));

    bar.style.width      = progress + '%';
    pctLabel.textContent = progress + '%';

    var msgIndex = Math.min(
      Math.floor((progress / 100) * messages.length),
      messages.length - 1
    );
    loadText.textContent = messages[msgIndex];

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      pctLabel.textContent = 'listo';
      setTimeout(function () {
        if (splash) splash.classList.add('hidden');
      }, 500);
    }
  }

  requestAnimationFrame(tick);

})();