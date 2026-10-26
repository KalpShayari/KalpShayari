/* KalpShayari — PWA install prompt helper
 * Detects: (1) already installed → hide button; (2) Chrome/Edge install → wire native prompt;
 *          (3) iOS Safari → show manual instructions toast.
 */
(function () {
  'use strict';

  // --- Detect if we're already running as an installed PWA ---
  function isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.navigator.standalone === true
    );
  }

  // --- Detect iOS (no beforeinstallprompt support) ---
  function isIOS() {
    const ua = window.navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) return true;
    // iPad on iOS 13+ reports as "Mac" — check touch support
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
    return false;
  }

  // --- Grab the button (created in the menu HTML) ---
  const btn = document.getElementById('installAppBtn');
  if (!btn) return;

  // If already installed as PWA → hide button completely
  if (isStandalone()) {
    btn.hidden = true;
    return;
  }

  // --- Chrome / Edge ---
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.classList.add('is-available');
    btn.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    btn.classList.remove('is-available');
    btn.hidden = true;
  });

  // --- iOS fallback (Safari gives no prompt) ---
  if (isIOS()) {
    btn.classList.add('is-available');
    btn.hidden = false;
  }

  // --- Button click ---
  btn.addEventListener('click', async () => {
    // If we have the real prompt, use it
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (e) { /* ignore */ }
      deferredPrompt = null;
      btn.classList.remove('is-available');
      btn.hidden = true;
      return;
    }

    // iOS Safari → show manual instructions
    if (isIOS()) {
      if (typeof window.KalpShowInstallHint === 'function') {
        window.KalpShowInstallHint();
      } else {
        alert('To install: tap Share, then "Add to Home Screen".');
      }
      return;
    }

    // Some other browser without install support
    if (typeof window.KalpShowInstallHint === 'function') {
      window.KalpShowInstallHint();
    }
  });
})();