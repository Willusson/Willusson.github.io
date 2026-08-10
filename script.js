/* ===== KUGOO WISH 2 PRO — Презентация для родителей ===== */
(function () {
  'use strict';

  // ----- DOM references -----
  var stage = document.getElementById('stage');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var header = document.getElementById('appHeader');
  var nav = document.getElementById('navControls');
  var backBtn = document.getElementById('backBtn');
  var nextBtn = document.getElementById('nextBtn');
  var startBtn = document.getElementById('startBtn');
  var restartBtn = document.getElementById('restartBtn');
  var progressFill = document.getElementById('progressFill');
  var progressBar = document.getElementById('progressBar');
  var progressLabel = document.getElementById('progressLabel');

  var modalOverlay = document.getElementById('modalOverlay');
  var modalBox = document.getElementById('modalBox');
  var modalClose = document.getElementById('modalClose');
  var modalOkBtn = document.getElementById('modalOkBtn');
  var lastFocused = null;

  // ----- State -----
  var current = 0;
  var total = steps.length;
  var transitioning = false;

  // ----- Step management -----
  function setActive(index) {
    steps.forEach(function (el, i) {
      el.classList.toggle('step--active', i === index);
      el.classList.toggle('step--prev', i < index);
      el.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
  }

  function goToStep(index) {
    if (transitioning) return;
    if (index < 0 || index >= total || index === current) return;
    transitioning = true;
    current = index;
    setActive(current);
    updateProgress();
    updateNav();
    // unlock after the step transition animation window
    window.setTimeout(function () { transitioning = false; }, 520);
  }

  function next() { goToStep(current + 1); }
  function prev() { goToStep(current - 1); }

  // ----- Progress -----
  function updateProgress() {
    var pct = Math.round((current / (total - 1)) * 100);
    progressFill.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', String(pct));
    progressLabel.textContent = 'Шаг ' + (current + 1) + ' из ' + total;
  }

  function updateNav() {
    backBtn.disabled = current === 0;
    nextBtn.style.visibility = current >= total - 1 ? 'hidden' : 'visible';
  }

  // ----- Start / restart -----
  function startShow() {
    header.hidden = false;
    nav.hidden = false;
    // first navigation step is index 1 (the intro screen is index 0)
    if (current === 0) {
      goToStep(1);
    }
  }

  function restart() {
    current = 0;
    setActive(0);
    updateProgress();
    updateNav();
  }

  // ----- Modal -----
  var modalTitle = document.getElementById('modalTitle');
  var modalBody = document.getElementById('modalBody');
  var modalHighlight = document.getElementById('modalHighlight');
  var noBtn = document.getElementById('noBtn');

  function openModal(title, body, highlight) {
    if (title) modalTitle.textContent = title;
    if (body) modalBody.textContent = body;
    modalHighlight.hidden = !highlight;
    if (highlight) modalHighlight.textContent = highlight;
    lastFocused = document.activeElement;
    modalOverlay.hidden = false;
    window.setTimeout(function () {
      modalClose.focus();
    }, 30);
  }

  function closeModal() {
    modalOverlay.hidden = true;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // ----- Events -----
  startBtn.addEventListener('click', startShow);
  restartBtn.addEventListener('click', restart);

  backBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // keyboard navigation
  window.addEventListener('keydown', function (e) {
    if (!modalOverlay.hidden) {
      if (e.key === 'Escape') {
        closeModal();
      }
      return;
    }
    if (nav.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      if (current < total - 1) next();
    } else if (e.key === 'ArrowLeft') {
      if (current > 0) prev();
    }
  });

  // modal close via background click
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  modalClose.addEventListener('click', closeModal);
  modalOkBtn.addEventListener('click', closeModal);

  // all CTA "buy" buttons open the modal
  var ctaButtons = document.querySelectorAll('.cta-buy');
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal('Спасибо за интерес', 'Уточним наличие и детали покупки при обсуждении.', 'Если вы увидели этот текст — это один из самых лучших моментов за последние 14 лет.');
    });
  });

  // "Все же нет" button opens its own message
  if (noBtn) {
    noBtn.addEventListener('click', function () {
      openModal('Все же нет', 'Мы готовы к любым переговорам и обсуждениям');
    });
  }

  // ----- Init -----
  setActive(current);
  updateProgress();
  updateNav();
})();
