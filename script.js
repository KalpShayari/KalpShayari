(function () {
  "use strict";

  const FLAG = "room.unlocked";

  /* ---------- elements ---------- */
  const gate        = document.getElementById("gate");
  const gateForm    = document.getElementById("gateForm");
  const gateStatus  = document.getElementById("gateStatus");
  const unlockBtn   = document.getElementById("unlockBtn");
  const nameInput   = document.getElementById("nameInput");
  const keyInputs   = [
    document.getElementById("key1"),
    document.getElementById("key2"),
    document.getElementById("key3"),
  ];
  const riddleInput = document.getElementById("riddleInput");
  const app         = document.getElementById("app");
  const lockBtn     = document.getElementById("lockBtn");
  const clockEl     = document.getElementById("clock");
  const dateEl      = document.getElementById("dateLine");
  const greetEl     = document.getElementById("greetWord");

  /* ---------- helpers ---------- */
  const tidy = (v) => String(v || "").trim().replace(/\s+/g, " ");
  const raw  = (v) => String(v || "").trim();

  function setStatus(msg, tone) {
    gateStatus.textContent = msg;
    gateStatus.classList.toggle("is-visible", Boolean(msg));
    gateStatus.classList.toggle("is-error", tone === "error");
    gateStatus.classList.toggle("is-ok", tone === "ok");
  }

  function mark(input, state) {
    const f = input.closest(".field, .key");
    if (!f) return;
    f.classList.remove("is-wrong", "is-right");
    if (state) f.classList.add(state);
  }

  function clearMarks() {
    document.querySelectorAll(".field, .key").forEach((el) => el.classList.remove("is-wrong", "is-right"));
  }

  function shake() {
    gate.classList.remove("is-shaking");
    void gate.offsetWidth;
    gate.classList.add("is-shaking");
    window.setTimeout(() => gate.classList.remove("is-shaking"), 450);
  }

  /* ---------- local preflight ---------- */
  function preflight() {
    clearMarks();
    const name = tidy(nameInput.value);
    const keys = keyInputs.map((el) => raw(el.value));
    const word = raw(riddleInput.value);

    if (!name && keys.every((k) => !k) && !word) {
      setStatus("The waters are undisturbed. Fill the fields.", "error"); shake(); return null;
    }
    if (!name) {
      mark(nameInput, "is-wrong"); setStatus("Identity missing.", "error"); shake(); return null;
    }
    if (keys.some((k) => !k)) {
      keyInputs.forEach((el, i) => { if (!keys[i]) mark(el, "is-wrong"); });
      setStatus("Three keys are required.", "error"); shake(); return null;
    }
    if (!word) {
      mark(riddleInput, "is-wrong"); setStatus("The riddle remains unsolved.", "error"); shake(); return null;
    }
    return { name, keys, word };
  }

  /* ---------- unlock ---------- */
  async function attemptUnlock() {
    if (!window.Space || typeof window.Space.unlockRoom !== "function") {
      setStatus("System offline.", "error"); return;
    }
    const creds = preflight();
    if (!creds) return;

    unlockBtn.classList.add("is-busy");
    unlockBtn.disabled = true;
    setStatus("Parting the tide...", "ok");

    try {
      const result = await window.Space.unlockRoom(creds);

      if (result && result.success) {
        try { sessionStorage.setItem(FLAG, "1"); } catch (e) {}
        gate.classList.add("is-leaving");
        document.body.classList.remove("is-locked");
        window.setTimeout(() => {
          gate.hidden = true;
          app.hidden = false;
          unlockBtn.classList.remove("is-busy");
          unlockBtn.disabled = false;
          startApp();
        }, 600); // Faster fade out
        return;
      }

      unlockBtn.classList.remove("is-busy");
      unlockBtn.disabled = false;
      mark(nameInput, "is-wrong");
      keyInputs.forEach((el) => mark(el, "is-wrong"));
      mark(riddleInput, "is-wrong");
      setStatus("The water rejects you.", "error");
      shake();
    } catch (err) {
      unlockBtn.classList.remove("is-busy");
      unlockBtn.disabled = false;
      setStatus("Connection lost.", "error");
      shake();
    }
  }

  gateForm.addEventListener("submit", (e) => { e.preventDefault(); attemptUnlock(); });

  /* ---------- lock ---------- */
  function lock() {
    try { sessionStorage.removeItem(FLAG); } catch (e) {}
    app.hidden = true;
    gate.hidden = false;
    document.body.classList.add("is-locked");
    gate.classList.remove("is-leaving");
    gateForm.reset();
    clearMarks();
    setStatus("");
    unlockBtn.classList.remove("is-busy");
    unlockBtn.disabled = false;
    window.scrollTo({ top: 0, behavior: "auto" });
    window.setTimeout(() => nameInput.focus({ preventScroll: true }), 260);
  }
  lockBtn.addEventListener("click", lock);

  /* ---------- input cleanup ---------- */
  keyInputs.forEach((input) => {
    input.addEventListener("input", () => { const f = input.closest(".key"); if (f) f.classList.remove("is-wrong"); });
  });
  [nameInput, riddleInput].forEach((input) => {
    input.addEventListener("input", () => { const f = input.closest(".field"); if (f) f.classList.remove("is-wrong"); });
  });

  /* ---------- navigation ---------- */
  const navButtons = Array.from(document.querySelectorAll("[data-nav]"));
  const pages      = Array.from(document.querySelectorAll(".page"));

  function goTo(name) {
    const target = document.querySelector('.page[data-page="' + name + '"]');
    if (!target) return;
    pages.forEach((p) => p.classList.remove("is-active"));
    target.classList.add("is-active");
    navButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.nav === name));
    revealScan(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  navButtons.forEach((btn) => btn.addEventListener("click", () => goTo(btn.dataset.nav)));

  /* ---------- reveal on scroll ---------- */
  let observer = null;
  function revealScan(root) {
    const scope = root || document;
    const items = scope.querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in")); return;
    }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children).filter((n) => n.classList.contains("reveal"));
          const i = siblings.indexOf(el);
          window.setTimeout(() => el.classList.add("is-in"), Math.min(i, 6) * 50); // Faster stagger
          observer.unobserve(el);
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    }
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- clock + greeting ---------- */
  function paintClock() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    }
    if (greetEl) {
      const h = now.getHours();
      let w = "Evening";
      if (h < 5) w = "Night";
      else if (h < 12) w = "Morning";
      else if (h < 17) w = "Afternoon";
      greetEl.textContent = w;
    }
  }
  let clockTimer = null;
  function startClock() {
    paintClock();
    if (clockTimer) window.clearInterval(clockTimer);
    clockTimer = window.setInterval(paintClock, 15000);
  }

  /* ---------- app boot ---------- */
  let appStarted = false;
  function startApp() {
    startClock();
    revealScan(document);
    if (!appStarted) { appStarted = true; window.setTimeout(() => revealScan(document), 200); }
  }

  /* ---------- session restore ---------- */
  (function restore() {
    let open = false;
    try { open = sessionStorage.getItem(FLAG) === "1"; } catch (e) {}
    if (open) {
      gate.hidden = true;
      gate.classList.add("is-leaving");
      document.body.classList.remove("is-locked");
      app.hidden = false;
      startApp();
    } else {
      window.setTimeout(() => nameInput.focus({ preventScroll: true }), 720);
    }
  })();

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !app.hidden) lock();
  });
  keyInputs.forEach((input, i) => {
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const next = keyInputs[i + 1];
      if (next && next.value === "") { e.preventDefault(); next.focus(); }
    });
  });

})();