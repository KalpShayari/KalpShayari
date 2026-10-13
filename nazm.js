(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const yearEl = $('#year');
  const menuBtn = $('#menuBtn');
  const menuPanel = $('#menuPanel');
  const menuBackdrop = $('#menuBackdrop');
  const toTop = $('#toTop');
  const toastEl = $('#toast');

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

  /* ---------- NAZM: read text from DOM ---------- */
  function readNazm(card) {
    const title = card.querySelector('.nazm-title')?.textContent.trim() || '';
    const subtitle = card.querySelector('.nazm-sub')?.textContent.trim() || '';
    const lines = $$('.nazm-line', card).map((el) => el.textContent.trim());
    return { title, subtitle, lines };
  }

  function plainText(nazm) {
    return nazm.lines.join('\n');
  }

  /* ---------- COPY ---------- */
  function copyNazm(card, btn) {
    const nazm = readNazm(card);
    const output = nazm.title + '\n\n' + plainText(nazm) + '\n\n— Zeeshan Khan';

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
      toast('Nazm copied');
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

  /* ---------- WIRE UP CARDS ---------- */
  function init() {
    $$('.nazm-card').forEach((card, i) => {
      card.style.animationDelay = Math.min(i * 0.08, 0.4) + 's';

      const toggleBtn = card.querySelector('.nazm-toggle');
      const toggleText = card.querySelector('.nazm-toggle-text');
      const copyBtn = card.querySelector('.nazm-copy');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const isExpanded = card.classList.toggle('is-expanded');
          toggleBtn.setAttribute('aria-expanded', String(isExpanded));
          if (toggleText) toggleText.textContent = isExpanded ? 'Collapse' : 'Read full';
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          copyNazm(card, copyBtn);
        });
      }
    });

    checkScroll();
  }

  init();
})();