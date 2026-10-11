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
      category: 'love',
      tag: 'Love',
      text: 'तेरी आँखों में जो नशा है,\nवो किसी शराब में कहाँ।\nतेरे साथ जो पल गुज़ारे,\nवो किसी जन्नत से कम नहीं।',
      em: 'जन्नत से कम नहीं'
    },
    {
      id: 's02',
      category: 'sad',
      tag: 'Sad',
      text: 'दिल टूटा तो आवाज़ नहीं आई,\nबस खामोशी ने सब कह दिया।\nजो लोग हँसते हैं बहुत,\nउनके अंदर कुछ टूटा होता है।',
      em: 'खामोशी'
    },
    {
      id: 's03',
      category: 'life',
      tag: 'Life',
      text: 'ज़िंदगी एक किताब है,\nहर पन्ना एक नया सबक।\nजो पढ़ लेता है ध्यान से,\nवो कभी नहीं होता उदास।',
      em: 'नया सबक'
    },
    {
      id: 's04',
      category: 'friendship',
      tag: 'Friendship',
      text: 'दोस्ती में न कोई दूरी,\nन कोई मजबूरी।\nजो साथ खड़ा हो हर हाल में,\nवही है असली यार।',
      em: 'असली यार'
    },
    {
      id: 's05',
      category: 'love',
      tag: 'Love',
      text: 'मोहब्बत में जो मिलता है,\nवो सुकून कहीं और नहीं।\nतेरा हाथ थामे चलना,\nजैसे दुनिया जीत ली हो।',
      em: 'सुकून'
    },
    {
      id: 's06',
      category: 'sad',
      tag: 'Sad',
      text: 'रात की खामोशी में,\nतेरी यादें आती हैं।\nनींद तो आती है मगर,\nदिल को चैन नहीं आता।',
      em: 'यादें'
    },
    {
      id: 's07',
      category: 'life',
      tag: 'Life',
      text: 'हर मुश्किल के बाद,\nएक नया सवेरा होता है।\nबस हौसला रखना ज़रूरी है,\nफिर हर पल सुनहरा होता है।',
      em: 'नया सवेरा'
    },
    {
      id: 's08',
      category: 'friendship',
      tag: 'Friendship',
      text: 'वो दोस्त ही क्या,\nजो हँसी में साथ न हो।\nजो आँसू में भी साथ खड़ा हो,\nवही तो सच्चा यार हो।',
      em: 'सच्चा यार'
    },
    {
      id: 's09',
      category: 'love',
      tag: 'Love',
      text: 'तेरे बिना ये दिल,\nजैसे सूना आँगन।\nतू आ जाए तो लगे,\nजैसे मिल गया जहाँ।',
      em: 'सूना आँगन'
    },
    {
      id: 's10',
      category: 'sad',
      tag: 'Sad',
      text: 'मुस्कुराना सीख लिया है,\nअब ग़म छुपाना आसान है।\nजो दिल में है वो कह न सकें,\nयही तो सबसे बड़ा नुकसान है।',
      em: 'ग़म छुपाना'
    },
    {
      id: 's11',
      category: 'life',
      tag: 'Life',
      text: 'सफ़र में मंज़िल न मिली,\nतो कोई बात नहीं।\nरास्ते ने जो सिखाया,\nवो किसी किताब में नहीं।',
      em: 'रास्ते ने जो सिखाया'
    },
    {
      id: 's12',
      category: 'friendship',
      tag: 'Friendship',
      text: 'दोस्त वो नहीं जो हर पल साथ हो,\nदोस्त वो है जो दिल के पास हो।\nदूरियाँ चाहे कितनी भी हों,\nयादों में हर पल पास हो।',
      em: 'दिल के पास'
    }
  ];

  const CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'love', label: 'Love' },
    { key: 'sad', label: 'Sad' },
    { key: 'life', label: 'Life' },
    { key: 'friendship', label: 'Friendship' }
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

  // Highlight the em phrase inside the shayari text.
  function renderText(text, em) {
    const safe = escapeHTML(text);
    if (!em) return safe;
    const safeEm = escapeHTML(em);
    // Only replace the first occurrence for a clean look.
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
      /* storage might be blocked — no big deal */
    }
  }

  /* ---------- RENDER FILTERS ---------- */
  function renderFilters() {
    filterRow.innerHTML = '';
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn' + (cat.key === activeFilter ? ' is-active' : '');
      btn.dataset.filter = cat.key;
      btn.textContent = cat.label;
      btn.setAttribute('aria-pressed', String(cat.key === activeFilter));
      btn.addEventListener('click', () => {
        if (activeFilter === cat.key) return;
        activeFilter = cat.key;
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
      : SHAYARI.filter((s) => s.category === activeFilter);

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

    // SEO: JSON-LD structured data so search engines understand the collection.
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Kalp Shayari — Words That Stay',
      description:
        'A handpicked collection of Hindi and Urdu shayari on love, life, sadness, and friendship.',
      url: 'https://kalpshayari.com/',
      inLanguage: 'hi',
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