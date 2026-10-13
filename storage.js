window.KalpStore = (function () {
  'use strict';

  const KEY = 'kalp.favs';
  const VERSION_KEY = 'kalp.cache.v';
  const VERSION = '4';

  // Purge stale caches on version bump
  try {
    if (localStorage.getItem(VERSION_KEY) !== VERSION) {
      localStorage.removeItem('kalp.liked');
      localStorage.removeItem(KEY);
      localStorage.setItem(VERSION_KEY, VERSION);
    }
  } catch (e) { void e; }

  /* Returns array of { id, text, rank, tag } */
  function getFavs() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function setFavs(arr) {
    try {
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (e) { void e; }
  }

  function isLiked(id) {
    return getFavs().some((f) => f.id === id);
  }

  function saveFav(sher) {
    const list = getFavs();
    if (!list.some((f) => f.id === sher.id)) {
      list.push({
        id: sher.id,
        text: sher.text,
        rank: sher.rank,
        tag: sher.tag
      });
      setFavs(list);
    }
  }

  function removeFav(id) {
    setFavs(getFavs().filter((f) => f.id !== id));
  }

  return {
    getFavs: getFavs,
    setFavs: setFavs,
    isLiked: isLiked,
    saveFav: saveFav,
    removeFav: removeFav
  };
})();