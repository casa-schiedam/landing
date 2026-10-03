/* ==========================================================================
   CASA — "From my kitchen" gallery (kitchen.html only)
   Category filters and a full-screen photo viewer: arrows, keyboard
   (← → Esc) and swipe on phones. Without JavaScript every photo is still a
   plain link to its full-size image, so nothing is lost.
   ========================================================================== */
(function () {
  'use strict';

  var grid = document.querySelector('.kitchen-grid');
  if (!grid) return;
  var items = Array.prototype.slice.call(grid.querySelectorAll('.kitchen-item'));

  /* ── FILTERS ─────────────────────────────────────────────────────── */
  var filters = document.querySelectorAll('.kitchen-filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      items.forEach(function (it) {
        it.hidden = !(cat === 'all' || it.getAttribute('data-category') === cat);
      });
    });
  });

  /* ── LIGHTBOX ────────────────────────────────────────────────────── */
  var box = document.querySelector('.lightbox');
  if (!box || typeof box.showModal !== 'function') return;   // very old browser: links still work
  var img = box.querySelector('.lightbox__img');
  var count = box.querySelector('.lightbox__count');
  var current = 0, visible = [], opener = null;

  function visibleItems() { return items.filter(function (it) { return !it.hidden; }); }

  function show(i) {
    current = (i + visible.length) % visible.length;
    var link = visible[current].querySelector('.kitchen-item__link');
    var thumb = link.querySelector('img');
    img.src = link.getAttribute('data-full');
    img.alt = thumb.alt;
    count.textContent = (current + 1) + ' / ' + visible.length;
    // warm up the neighbours so the next swipe is instant
    [current + 1, current - 1].forEach(function (n) {
      var it = visible[(n + visible.length) % visible.length];
      if (it) new Image().src = it.querySelector('.kitchen-item__link').getAttribute('data-full');
    });
  }

  function open(item) {
    visible = visibleItems();
    opener = item.querySelector('.kitchen-item__link');
    show(visible.indexOf(item));
    box.showModal();
    document.body.classList.add('lightbox-open');
  }

  function close() { if (box.open) box.close(); }

  box.addEventListener('close', function () {
    document.body.classList.remove('lightbox-open');
    img.removeAttribute('src');
    if (opener) opener.focus();
  });

  items.forEach(function (it) {
    it.querySelector('.kitchen-item__link').addEventListener('click', function (e) {
      e.preventDefault();
      open(it);
    });
  });

  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });

  // a click on the dark area around the photo closes it
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.classList.contains('lightbox__figure')) close();
  });

  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
  });

  // swipe left/right on touch screens
  var startX = null, startY = null;
  box.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    startX = startY = null;
  });
})();
