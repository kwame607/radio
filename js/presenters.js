/* ============================================================
   ANGEL 96.1FM — PRESENTERS PAGE
   ============================================================ */
(function () {
  "use strict";
  const grid = document.querySelector("[data-presenter-grid]");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-presenter-name]"));
  const searchInput = document.querySelector("[data-presenter-search]");

  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach((card) => {
      const match = card.textContent.toLowerCase().includes(q);
      card.style.display = match ? "" : "none";
    });
  });

  /* ---------- Profile modal ---------- */
  const overlay = document.querySelector("[data-presenter-modal]");
  if (overlay) {
    document.querySelectorAll("[data-profile-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        overlay.querySelector("[data-modal-img]").src = btn.dataset.img;
        overlay.querySelector("[data-modal-img]").alt = btn.dataset.name;
        overlay.querySelector("[data-modal-name]").textContent = btn.dataset.name;
        overlay.querySelector("[data-modal-program]").textContent = btn.dataset.program;

        const nicknameEl = overlay.querySelector("[data-modal-nickname]");
        if (btn.dataset.nickname) {
          nicknameEl.textContent = btn.dataset.nickname;
          nicknameEl.style.display = "";
        } else {
          nicknameEl.style.display = "none";
        }

        const timeEl = overlay.querySelector("[data-modal-time]");
        if (btn.dataset.time) {
          timeEl.textContent = btn.dataset.time;
          timeEl.style.display = "";
        } else {
          timeEl.style.display = "none";
        }

        overlay.classList.add("open");
        overlay.querySelector(".modal-close")?.focus();
      });
    });

    function closeModal() {
      overlay.classList.remove("open");
    }
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    overlay.querySelector(".modal-close")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }
})();
