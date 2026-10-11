(function () {
  'use strict';

  const SHAYARI = [
    {
      id: 's01',
      rank: 'gold',
      tag: 'Gold',
      text: 'In your eyes I found a madness,\nthe kind no wine could ever give.\nEvery moment spent beside you,\nwas a heaven I got to live.',
      em: 'a heaven I got to live'
    },
    {
      id: 's02',
      rank: 'platinum',
      tag: 'Platinum',
      text: 'When the heart broke, it made no sound,\nonly silence said it all.\nThe ones who laugh the loudest,\nare the ones who quietly fall.',
      em: 'only silence said it all'
    },
    {
      id: 's03',
      rank: 'silver',
      tag: 'Silver',
      text: 'Life is just a book of pages,\nevery leaf a lesson learned.\nWhoever reads with open eyes,\nwill never feel alone or burned.',
      em: 'every leaf a lesson learned'
    },
    {
      id: 's04',
      rank: 'bronze',
      tag: 'Bronze',
      text: 'In friendship there is no distance,\nno reason and no bound.\nThe one who stands through every storm,\nis the truest friend I have found.',
      em: 'the truest friend I have found'
    },
    {
      id: 's05',
      rank: 'gold',
      tag: 'Gold',
      text: 'What love gives you in return,\nno other place can ever hold.\nWalking with your hand in mine,\nfeels like I have won the world.',
      em: 'won the world'
    },
    {
      id: 's06',
      rank: 'platinum',
      tag: 'Platinum',
      text: 'In the silence of the night,\nyour memories come to me.\nSleep arrives but peace does not,\nthe heart still longs to be free.',
      em: 'your memories come to me'
    },
    {
      id: 's07',
      rank: 'silver',
      tag: 'Silver',
      text: 'After every hardship comes\na morning bright and new.\nJust keep your courage close,\nevery moment turns gold for you.',
      em: 'every moment turns gold'
    },
    {
      id: 's08',
      rank: 'bronze',
      tag: 'Bronze',
      text: 'What is a friend who is not there\nwhen laughter fills the air?\nThe one who stands beside your tears,\nis the truest soul you will find.',
      em: 'the truest soul you will find'
    },
    {
      id: 's09',
      rank: 'gold',
      tag: 'Gold',
      text: 'Without you this heart is\nlike a courtyard left alone.\nWhen you return it feels\nlike I have finally found home.',
      em: 'finally found home'
    },
    {
      id: 's10',
      rank: 'platinum',
      tag: 'Platinum',
      text: 'I learned to smile through the pain,\nhiding grief became an art.\nWhat stays inside and never speaks,\nis the heaviest thing in the heart.',
      em: 'the heaviest thing in the heart'
    },
    {
      id: 's11',
      rank: 'silver',
      tag: 'Silver',
      text: 'The road did not lead to the end,\nbut that is quite alright.\nWhat the journey taught me on the way,\nno book could ever write.',
      em: 'no book could ever write'
    },
    {
      id: 's12',
      rank: 'bronze',
      tag: 'Bronze',
      text: 'A friend is not the one who stays\nbeside you every hour.\nA friend is one who lives inside\nyour heart with all its power.',
      em: 'lives inside your heart'
    },
    {
      id: 's13',
      rank: 'gold',
      tag: 'Gold',
      text: 'Aine me khudko dekho,\ngulab nazar aye.\nTumhara naam likhu,\nto najane kyu sharab nazar aaye.',
      em: 'sharab nazar aaye'
    },
    {
      id: 's14',
      rank: 'silver',
      tag: 'Silver',
      text: 'Dil ke darwaze par dastak di,\nab dastak jaha di he,\nwaha dil hi nahi milta.',
      em: 'waha dil hi nahi milta'
    },
    {
      id: 's15',
      rank: 'platinum',
      tag: 'Platinum',
      text: 'Kahti he tujh garib ko,\nmeri gali ka rasta kya pata.\nKambakht teri gali guzar guzar ke,\nhi garib hua hu.',
      em: 'hi garib hua hu'
    },
    {
      id: 's16',
      rank: 'gold',
      tag: 'Gold',
      text: 'Unki akho ki gehraiyo me,\nmera dil kho chuka he.\nAb ye dil unka,\npar unka kisi aur ka ho chuka he.',
      em: 'kisi aur ka ho chuka he'
    },
    {
      id: 's17',
      rank: 'silver',
      tag: 'Silver',
      text: 'Haqeeqat ne hade par kardi he,\nkhwab di.\nTumhe dekhke hamne bhi pi li,\nakhkhi bottle sharab di.',
      em: 'akhkhi bottle sharab di'
    },
    {
      id: 's18',
      rank: 'platinum',
      tag: 'Platinum',
      text: 'Duniya me aye ho,\naur kahte ho me mohabbat se,\napna dil nahi sita.\nAre mekhane me khade ho,\naur kahte ho me sharab nahi pita.',
      em: 'me sharab nahi pita'
    },
    {
      id: 's19',
      rank: 'gold',
      tag: 'Gold',
      text: 'Tumhare hatho me mahandi dekhu,\nto rang surkh lal nazar aata he.\nTumhari aakho me jab chand dekhu,\nto chand me chand nazar aata he.',
      em: 'chand me chand nazar aata he'
    },
    {
      id: 's20',
      rank: 'silver',
      tag: 'Silver',
      text: 'Tumse akhe milau to,\nhar baat bhul jata hu.\nTumhare hath ka bana khana khau,\nto bakiyo ka swad bhul jata hu.',
      em: 'bakiyo ka swad bhul jata hu'
    }
  ];

  const RANKS = [
    { key: 'all', label: 'All' },
    { key: 'gold', label: 'Gold' },
    { key: 'silver', label: 'Silver' },
    { key: 'bronze', label: 'Bronze' },
    { key: 'platinum', label: 'Platinum' }
  ];

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

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
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
  }

  function persistLikes() {
    try {
      localStorage.setItem('kalp.liked', JSON.stringify(Array.from(liked)));
    } catch (e) {
      void e;
    }
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

  menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  menuBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

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

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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

  function copySher(item, btn) {
    const plain = item.text.replace(/<[^>]*>/g, '');
    const output = plain + '\n\n— Zeeshan Khan';

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
      } catch (e) {
        void e;
      }
    };

    const done = () => {
      btn.classList.remove('is-copying');
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', 'Copied');
      toast('Sher copied');
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', 'Copy sher');
      }, 1600);
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
      const card = document.createElement('article');
      card.className = 'card';
      card.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';
      card.dataset.id = item.id;

      const indexLabel = String(SHAYARI.indexOf(item) + 1).padStart(2, '0');
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
            '<button class="like' + (isLiked ? ' is-liked' : '') + '" type="button" ' +
              'aria-label="Like this shayari" aria-pressed="' + isLiked + '">' +
              '<span class="heart">' + (isLiked ? '♥' : '♡') + '</span>' +
            '</button>' +
          '</div>' +
        '</div>';

      const likeBtn = card.querySelector('.like');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(item, likeBtn);
      });

      const copyBtn = card.querySelector('.copy');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copySher(item, copyBtn);
      });

      fragment.appendChild(card);
    });

    gridEl.appendChild(fragment);
  }

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
      toast('Saved');
    }
    persistLikes();
  }

  function init() {
    yearEl.textContent = new Date().getFullYear();
    renderFilters();
    renderGrid();
    checkScroll();

    const ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://kalpshayari.vercel.app/#website',
          url: 'https://kalpshayari.vercel.app/',
          name: 'Kalp Shayari',
          description: 'Original shers written by Zeeshan Khan.',
          inLanguage: 'en',
          publisher: { '@id': 'https://kalpshayari.vercel.app/#person' }
        },
        {
          '@type': 'Person',
          '@id': 'https://kalpshayari.vercel.app/#person',
          name: 'Zeeshan Khan',
          alternateName: 'Zeeshan40u',
          email: 'zeeshan40u@gmail.com',
          url: 'https://relaytalk.vercel.app',
          jobTitle: 'Writer & Poet',
          knowsAbout: ['Shayari', 'Poetry', 'Urdu Literature', 'Hindi Literature']
        },
        {
          '@type': 'CollectionPage',
          '@id': 'https://kalpshayari.vercel.app/#collection',
          url: 'https://kalpshayari.vercel.app/',
          name: 'Kalp Shayari — Words That Stay',
          description: 'Original shers written by Zeeshan Khan. A quiet collection on love, life, loss, and friendship.',
          inLanguage: 'en',
          isPartOf: { '@id': 'https://kalpshayari.vercel.app/#website' },
          author: { '@id': 'https://kalpshayari.vercel.app/#person' },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: SHAYARI.length,
            itemListElement: SHAYARI.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'CreativeWork',
                name: 'Sher ' + (i + 1),
                text: s.text.replace(/\n/g, ' '),
                genre: 'Poetry',
                keywords: s.tag,
                inLanguage: 'en',
                author: { '@id': 'https://kalpshayari.vercel.app/#person' }
              }
            }))
          }
        }
      ]
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