/* ------------------------------------------------------------------
   Kalp Shayari — script.js
   All shayari lives here. Render, filter, like, enjoy.
------------------------------------------------------------------ */

(function () {
  'use strict';

  /* ---------- DATA ---------- */
  const SHAYARI = [
    {
      id: 's01',
      rank: 'classic',
      tag: 'Classic',
      text: 'In your eyes I found a madness,\nthe kind no wine could ever give.\nEvery moment spent beside you,\nwas a heaven I got to live.',
      em: 'a heaven I got to live'
    },
    {
      id: 's02',
      rank: 'rare',
      tag: 'Rare',
      text: 'When the heart broke, it made no sound,\nonly silence said it all.\nThe ones who laugh the loudest,\nare the ones who quietly fall.',
      em: 'only silence said it all'
    },
    {
      id: 's03',
      rank: 'timeless',
      tag: 'Timeless',
      text: 'Life is just a book of pages,\nevery leaf a lesson learned.\nWhoever reads with open eyes,\nwill never feel alone or burned.',
      em: 'every leaf a lesson learned'
    },
    {
      id: 's04',
      rank: 'classic',
      tag: 'Classic',
      text: 'In friendship there is no distance,\nno reason and no bound.\nThe one who stands through every storm,\nis the truest friend I have found.',
      em: 'the truest friend I have found'
    },
    {
      id: 's05',
      rank: 'rare',
      tag: 'Rare',
      text: 'What love gives you in return,\nno other place can ever hold.\nWalking with your hand in mine,\nfeels like I have won the world.',
      em: 'won the world'
    },
    {
      id: 's06',
      rank: 'timeless',
      tag: 'Timeless',
      text: 'In the silence of the night,\nyour memories come to me.\nSleep arrives but peace does not,\nthe heart still longs to be free.',
      em: 'your memories come to me'
    },
    {
      id: 's07',
      rank: 'rare',
      tag: 'Rare',
      text: 'After every hardship comes\na morning bright and new.\nJust keep your courage close,\nevery moment turns gold for you.',
      em: 'every moment turns gold'
    },
    {
      id: 's08',
      rank: 'classic',
      tag: 'Classic',
      text: 'What is a friend who is not there\nwhen laughter fills the air?\nThe one who stands beside your tears,\nis the truest soul you will find.',
      em: 'the truest soul you will find'
    },
    {
      id: 's09',
      rank: 'timeless',
      tag: 'Timeless',
      text: 'Without you this heart is\nlike a courtyard left alone.\nWhen you return it feels\nlike I have finally found home.',
      em: 'finally found home'
    },
    {
      id: 's10',
      rank: 'rare',
      tag: 'Rare',
      text: 'I learned to smile through the pain,\nhiding grief became an art.\nWhat stays inside and never speaks,\nis the heaviest thing in the heart.',
      em: 'the heaviest thing in the heart'
    },
    {
      id: 's11',
      rank: 'classic',
      tag: 'Classic',
      text: 'The road did not lead to the end,\nbut that is quite alright.\nWhat the journey taught me on the way,\nno book could ever write.',
      em: 'no book could ever write'
    },
    {
      id: 's12',
      rank: 'timeless',
      tag: 'Timeless',
      text: 'A friend is not the one who stays\nbeside you every hour.\nA friend is one who lives inside\nyour heart with all its power.',
      em: 'lives inside your heart'
    }
  ];

  const RANKS = [
    { key: 'all', label: 'All Ranks' },
    { key: 'classic', label: 'Classic' },
    { key: 'rare', label: 'Rare' },
    { key: 'timeless', label: 'Timeless' }
  ];

  /* ---------- HELPERS ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  const escapeHTML = (str) =>
    str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  function renderText(text, em) {
    const safe = escapeHTML(text);
    if (!em) return safe;
    const safeEm = escapeHTML(em);
    return safe.replace(safeEm, '<span class="card-em">' + safeEm + '</span>');
  }

  /* ---------- STATE ---------- */
  const liked = new Set(
    (function () {
      try {
        const raw = localStorage.getItem('kalp.liked');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    })()
  );

  let activeFilter = 'all';

  /* ---------- DOM REFS ---------- */
  const gridEl = $('#grid');
  const filterRow = $('#filterRow');
  const emptyEl = $('#empty');
  const toastEl = $('#toast');
  const yearEl = $('#year');
  const menuBtn = $('#menuBtn');
  const menuPanel = $('#menuPanel');
  const menuBackdrop = $('#menuBackdrop');

  /* ---------- TOAST ---------- */
  let toastTimer = null;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
  }

  /* ---------- PERSIST ---------- */
  function persistLikes() {
    try {
      localStorage.setItem('kalp.liked', JSON.stringify(Array.from(liked)));
    } catch (e) {
      /* storage may be blocked — silent */
    }
  }

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

  function toggleMenu() {
    if (menuOpen) closeMenu();
    else openMenu();
  }

  menuBtn.addEventListener('click', toggleMenu);
  menuBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* ---------- RENDER FILTERS ---------- */
  function renderFilters() {
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

  /* ---------- RENDER GRID ---------- */
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

    list.forEach((item, i) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.style.animationDelay = (i * 0.05) + 's';
      card.dataset.id = item.id;

      const indexLabel = String(SHAYARI.indexOf(item) + 1).padStart(2, '0');
      const isLiked = liked.has(item.id);

      card.innerHTML =
        '<span class="card-index">' + indexLabel + '</span>' +
        '<div class="card-body">' + renderText(item.text, item.em) + '</div>' +
        '<div class="card-foot">' +
          '<span class="card-tag">' + escapeHTML(item.tag) + '</span>' +
          '<button class="like' + (isLiked ? ' is-liked' : '') + '" type="button" ' +
            'aria-label="Like this shayari" aria-pressed="' + isLiked + '">' +
            '<span class="heart">' + (isLiked ? '♥' : '♡') + '</span>' +
          '</button>' +
        '</div>';

      const likeBtn = card.querySelector('.like');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(item, likeBtn);
      });

      gridEl.appendChild(card);
    });
  }

  /* ---------- LIKE ---------- */
  function toggleLike(item, btn) {
    const isLiked = liked.has(item.id);
    if (isLiked) {
      liked.delete(item.id);
      btn.classList.remove('is-liked');
      btn.setAttribute('aria-pressed', 'false');
      btn.querySelector('.heart').textContent = '♡';
      toast('Removed');
    } else {
      liked.add(item.id);
      btn.classList.add('is-liked');
      btn.setAttribute('aria-pressed', 'true');
      btn.querySelector('.heart').textContent = '♥';
      toast('Saved ♥');
    }
    persistLikes();
  }

  /* ---------- INIT ---------- */
  function init() {
    yearEl.textContent = new Date().getFullYear();
    renderFilters();
    renderGrid();

    /* ---------- SEO: JSON-LD STRUCTURED DATA ---------- */
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Kalp Shayari — Words That Stay',
      description:
        'A handpicked collection of English shayari on love, life, loss, and friendship.',
      url: 'https://kalpshayari.com/',
      inLanguage: 'en',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: SHAYARI.length,
        itemListElement: SHAYARI.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: 'Shayari ' + (i + 1),
            text: s.text.replace(/\n/g, ' '),
            genre: 'Poetry',
            keywords: s.tag
          }
        }))
      }
    };

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(ld);
    document.head.appendChild(tag);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();