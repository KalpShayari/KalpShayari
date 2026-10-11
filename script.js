(function () {
  'use strict';

  const DATA = window.KALP_DATA;
  const SHAYARI = DATA.SHAYARI;
  const RANKS = DATA.RANKS;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  const escapeHTML = (str) =>
    str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  function renderText(text, em) {
    const safe = escapeHTML(text);
    if (!em) return safe;
    const safeEm = escapeHTML(em);
    return safe.replace(safeEm, '<span class="card-em">' + safeEm + '</span>');
  }

  // Card size class based on sher length
  function sizeClass(text) {
    const lines = text.split('\n').length;
    const chars = text.replace(/\n/g, '').length;
    if (lines <= 3 && chars <= 90) return 'is-short';
    if (lines >= 5 || chars >= 180) return 'is-long';
    return 'is-med';
  }

  const liked = window.KalpStore.asSet();

  let activeFilter = 'all';

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

  function persistLikes() {
    window.KalpStore.setLiked(Array.from(liked));
  }

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

  let toTopVisible = false;
  const SCROLL_THRESHOLD = 400;

  function checkScroll() {
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

  function renderFilters() {
    if (!filterRow) return;
    filterRow.innerHTML = '';
    RANKS.forEach((rank) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn' + (rank.key === activeFilter ? ' is-active' : '');
      btn.dataset.filter = rank.key;
      btn.textContent = rank.label;
      btn.setAttribute('aria-pressed', String(rank.key === activeFilter));
      btn.addEventListener('click', () => {
        if (activeFilter === rank.key) return;
        activeFilter = rank.key;
        renderFilters();
        renderGrid();
      });
      filterRow.appendChild(btn);
    });
  }

  function copySher(item, btn) {
    const output = item.text + '\n\n— Zeeshan Khan';

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

  function buildLikeButton(isLiked) {
    return '<button class="like' + (isLiked ? ' is-liked' : '') + '" type="button" ' +
      'aria-label="Favourite this shayari" aria-pressed="' + isLiked + '">' +
      '<svg class="icon-heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
      '</svg>' +
      '<svg class="icon-heart-fill" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="4 12 10 18 20 6"/>' +
      '</svg>' +
    '</button>';
  }

  function buildCard(item, indexLabel) {
    const card = document.createElement('article');
    card.className = 'card ' + sizeClass(item.text);
    card.dataset.id = item.id;

    const isLiked = liked.has(item.id);

    card.innerHTML =
      '<span class="card-index">' + indexLabel + '</span>' +
      '<div class="card-body">' + renderText(item.text, item.em) + '</div>' +
      '<div class="card-foot">' +
        '<span class="card-rank rank-' + item.rank + '">' + escapeHTML(item.tag) + '</span>' +
        '<div class="card-actions">' +
          '<button class="copy" type="button" aria-label="Copy sher">' +
            '<svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<rect x="9" y="9" width="11" height="11" rx="2"/>' +
              '<path d="M5 15V5a2 2 0 0 1 2-2h10"/>' +
            '</svg>' +
            '<svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<polyline points="4 12 10 18 20 6"/>' +
            '</svg>' +
          '</button>' +
          buildLikeButton(isLiked) +
        '</div>' +
      '</div>';

    card.querySelector('.like').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLike(item, card.querySelector('.like'));
    });

    card.querySelector('.copy').addEventListener('click', (e) => {
      e.stopPropagation();
      copySher(item, card.querySelector('.copy'));
    });

    return card;
  }

  function renderGrid() {
    const list = activeFilter === 'all'
      ? SHAYARI
      : SHAYARI.filter((s) => s.rank === activeFilter);

    gridEl.innerHTML = '';

    if (list.length === 0) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    const fragment = document.createDocumentFragment();

    list.forEach((item, i) => {
      const indexLabel = String(SHAYARI.indexOf(item) + 1).padStart(2, '0');
      const card = buildCard(item, indexLabel);
      card.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';
      fragment.appendChild(card);
    });

    gridEl.appendChild(fragment);
  }

  function toggleLike(item, btn) {
    const isLiked = liked.has(item.id);

    btn.classList.remove('is-animating');
    void btn.offsetWidth;
    btn.classList.add('is-animating');

    if (isLiked) {
      liked.delete(item.id);
      btn.classList.remove('is-liked');
      btn.setAttribute('aria-pressed', 'false');
      toast('Removed');
    } else {
      liked.add(item.id);
      btn.classList.add('is-liked');
      btn.setAttribute('aria-pressed', 'true');
      toast('Saved to favourites');
    }

    persistLikes();

    setTimeout(() => btn.classList.remove('is-animating'), 750);
  }

  yearEl.textContent = new Date().getFullYear();
  renderFilters();
  renderGrid();
  checkScroll();
})();