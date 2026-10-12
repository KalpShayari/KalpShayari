window.KalpStore = (function () {
  'use strict';

  const KEY = 'kalp.liked';
  const VERSION_KEY = 'kalp.cache.v';
  const VERSION = '3';

  // Purge stale caches on version bump
  try {
    if (localStorage.getItem(VERSION_KEY) !== VERSION) {
      localStorage.removeItem(KEY);
      localStorage.setItem(VERSION_KEY, VERSION);
    }
  } catch (e) { void e; }

  function getLiked() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function setLiked(arr) {
    try {
      localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(arr))));
    } catch (e) { void e; }
  }

  return {
    getLiked: getLiked,
    setLiked: setLiked,
    asSet: function () { return new Set(getLiked()); }
  };
})();