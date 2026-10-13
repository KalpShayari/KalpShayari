(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const gridEl = $('#grid');
  const filterRow = $('#filterRow');
  const emptyEl = $('#empty');
  const toastEl = $('#toast');
  const yearEl = $('#year');
  const menuBtn = $('#menuBtn');
  const menuPanel = $('#menuPanel');
  const menuBackdrop = $('#menuBackdrop');
  const toTop = $('#toTop');

  let toastTimer = null;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- MENU ---------- */
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    menuBtn.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    menuPanel.classList.add('is-open');
    menuPanel.setAttribute('aria-hidden', 'false');
    menuBackdrop.hidden = false;
    requestAnimationFrame(() => menuBackdrop.classList.add('is-on'));
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuPanel.classList.remove('is-open');
    menuPanel.setAttribute('aria-hidden', 'true');
    menuBackdrop.classList.remove('is-on');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!menuOpen) menuBackdrop.hidden = true;
    }, 500);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    menuBackdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });
  }

  /* ---------- TO TOP ---------- */
  let toTopVisible = false;
  const SCROLL_THRESHOLD = 400;

  function checkScroll() {
    if (!toTop) return;
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;
    if (shouldShow !== toTopVisible) {
      toTopVisible = shouldShow;
      toTop.classList.toggle('is-on', shouldShow);
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        checkScroll();
        scrollTicking = false;
      });
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- READ SHER FROM DOM ---------- */
  function readSher(card) {
    const id = card.dataset.id;
    const rank = card.dataset.rank;
    const bodyEl = card.querySelector('.card-body');
    const rankEl = card.querySelector('.card-rank');

    // Plain text with line breaks preserved
    const text = bodyEl ? bodyEl.innerText.replace(/\u00a0/g, ' ').trim() : '';
    const tag = rankEl ? rankEl.textContent.trim() : '';

    return { id, rank, text, tag };
  }

  /* ---------- COPY ---------- */
  function copySher(sher, btn) {
    const output = sher.text + '\n\n— Zeeshan Khan';

    const fallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = output;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { void e; }
    };

    const done = () => {
      btn.classList.remove('is-copying');
      btn.classList.add('is-copied');
      toast('Sher copied');
      setTimeout(() => btn.classList.remove('is-copied'), 1600);
    };

    btn.classList.add('is-copying');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(output).then(() => {
        setTimeout(done, 550);
      }).catch(() => {
        fallback();
        setTimeout(done, 550);
      });
    } else {
      fallback();
      setTimeout(done, 550);
    }
  }

  /* ---------- LIKE ---------- */
  function toggleLike(sher, btn) {
    const isLiked = window.KalpStore.isLiked(sher.id);

    btn.classList.remove('is-animating');
    void btn.offsetWidth;
    btn.classList.add('is-animating');

    if (isLiked) {
      window.KalpStore.removeFav(sher.id);
      btn.classList.remove('is-liked');
      btn.setAttribute('aria-pressed', 'false');
      toast('Removed');
    } else {
      window.KalpStore.saveFav(sher);
      btn.classList.add('is-liked');
      btn.setAttribute('aria-pressed', 'true');
      toast('Saved to favourites');
    }

    setTimeout(() => btn.classList.remove('is-animating'), 750);
  }

  /* ---------- SYNC LIKE STATE FROM STORAGE ---------- */
  function syncLikeStates() {
    $$('.card', gridEl).forEach((card) => {
      const id = card.dataset.id;
      const likeBtn = card.querySelector('.like');
      if (!likeBtn) return;

      const liked = window.KalpStore.isLiked(id);
      likeBtn.classList.toggle('is-liked', liked);
      likeBtn.setAttribute('aria-pressed', String(liked));
    });
  }

  /* ---------- WIRE UP CARDS ---------- */
  function wireCards() {
    $$('.card', gridEl).forEach((card, i) => {
      card.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';

      const sher = readSher(card);
      const copyBtn = card.querySelector('.copy');
      const likeBtn = card.querySelector('.like');

      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          copySher(sher, copyBtn);
        });
      }

      if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleLike(sher, likeBtn);
        });
      }
    });

    syncLikeStates();
  }

  /* ---------- FILTER ---------- */
  let activeFilter = 'all';

  function applyFilter() {
    const cards = $$('.card', gridEl);
    let visible = 0;

    cards.forEach((card) => {
      const match = activeFilter === 'all' || card.dataset.rank === activeFilter;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (emptyEl) emptyEl.hidden = visible > 0;
  }

  function wireFilters() {
    if (!filterRow) return;
    const buttons = $$('.filter-btn', filterRow);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.filter;
        if (key === activeFilter) return;
        activeFilter = key;

        buttons.forEach((b) => {
          const isActive = b.dataset.filter === key;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });

        applyFilter();
      });
    });
  }

  /* ---------- INIT ---------- */
  wireCards();
  wireFilters();
  applyFilter();
  checkScroll();
})();