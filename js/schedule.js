/* ============================================================
   ANGEL 96.1FM — PROGRAM SCHEDULE (real lineup)
   Shows run variable lengths, so each day is its own ordered
   list of blocks rather than a fixed grid.
   ============================================================ */
(function () {
  "use strict";
  const listEl = document.querySelector("[data-schedule-list]");
  if (!listEl) return;

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Weekday lineup (Monday–Friday)
  const WEEKDAY = [
    { start: 0, end: 5.5, name: "Overnight Devotion", host: "Guest Ministers", cat: "Faith", desc: "Preaching and prayer overnight with guest pastors and ministers from churches across the region." },
    { start: 5.5, end: 6, name: "Angel Non-Stop Mix", host: "Automated Playlist", cat: "Music", desc: "A short non-stop music mix bridging into the morning news." },
    { start: 6, end: 7, name: "News", host: "Angel Newsroom", cat: "News", desc: "The day's top headlines from Ghana and around the world." },
    { start: 7, end: 9, name: "Angel in the Morning", host: "Morning Crew", cat: "Breakfast", desc: "News, traffic, weather and the finest morning mix to start your day." },
    { start: 9, end: 12, name: "Angel Sports", host: "Sports Desk", cat: "Sports", desc: "Match previews, analysis, transfer news and sports talk." },
    { start: 12, end: 14, name: "Angel Breaking News", host: "Ali Baba Dankanbari", cat: "News", desc: "Live coverage and analysis of the biggest breaking stories of the day." },
    { start: 14, end: 16, name: "The Platform", host: "Nana Darkwa Soldier", cat: "Talk", desc: "In-depth discussion on the issues shaping the nation." },
    { start: 16, end: 18, name: "Angel Drive", host: "Drive Team", cat: "Drive Time", desc: "The perfect soundtrack and companion for your commute home." },
    { start: 18, end: 19, name: "Evening News", host: "Angel Newsroom", cat: "News", desc: "A full wrap-up of the day's top stories." },
    { start: 19, end: 24, name: "Angel Non-Stop Mix", host: "Automated Playlist", cat: "Music", desc: "Continuous music through the night." },
  ];

  // Weekend lineup (Saturday & Sunday)
  const WEEKEND = [
    { start: 0, end: 5.5, name: "Overnight Devotion", host: "Guest Ministers", cat: "Faith", desc: "Preaching and prayer overnight with guest pastors and ministers from churches across the region." },
    { start: 5.5, end: 9, name: "Angel Non-Stop Mix", host: "Automated Playlist", cat: "Music", desc: "Non-stop music through the early morning." },
    { start: 9, end: 12, name: "Angel Sports", host: "Sports Desk", cat: "Sports", desc: "Weekend sports coverage, fixtures and commentary." },
    { start: 12, end: 13, name: "News in the Afternoon", host: "Angel Newsroom", cat: "News", desc: "A concise round-up of the day's top stories." },
    { start: 13, end: 18, name: "Angel Music", host: "Angel FM", cat: "Music", desc: "Five hours of the best music across every genre." },
    { start: 18, end: 24, name: "Angel Non-Stop Mix", host: "Automated Playlist", cat: "Music", desc: "Continuous music into the night." },
  ];

  function getDaySchedule(day) {
    return day === "Saturday" || day === "Sunday" ? WEEKEND : WEEKDAY;
  }

  // Merged time boundaries across both lineups, used to build the "All Days" timetable
  function getRows() {
    const points = new Set();
    [...WEEKDAY, ...WEEKEND].forEach((item) => {
      points.add(item.start);
      points.add(item.end);
    });
    const sorted = Array.from(points).sort((a, b) => a - b);
    const rows = [];
    for (let i = 0; i < sorted.length - 1; i++) rows.push({ start: sorted[i], end: sorted[i + 1] });
    return rows;
  }
  const ROWS = getRows();

  function fmtHour(decimal) {
    const h24 = Math.floor(decimal);
    const min = decimal % 1 === 0.5 ? "30" : "00";
    const period = h24 >= 12 ? "PM" : "AM";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${min}${period}`;
  }

  function nowDecimal(date) {
    return date.getHours() + date.getMinutes() / 60;
  }

  function todayName() {
    return DAYS[(new Date().getDay() + 6) % 7]; // Monday-indexed
  }

  let selectedDay = "all";
  let currentFilter = "all";
  let currentQuery = "";

  function partOfDay(startHour) {
    if (startHour < 12) return "morning";
    if (startHour < 18) return "afternoon";
    return "evening";
  }

  const gridWrap = document.querySelector("[data-schedule-grid-wrap]");
  const gridTable = document.querySelector("[data-schedule-grid]");
  const toolbar = document.querySelector("[data-schedule-toolbar]");

  function renderGrid() {
    if (!gridTable) return;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = todayName();
    const nowH = nowDecimal(new Date());

    let thead = "<thead><tr><th>Time</th>";
    days.forEach((d) => (thead += `<th>${d.slice(0, 3)}</th>`));
    thead += "</tr></thead>";

    // For each day, figure out which row each program starts on, and its rowspan
    const dayStates = {};
    days.forEach((day) => {
      const schedule = getDaySchedule(day);
      const states = [];
      let skip = 0;
      ROWS.forEach((row) => {
        if (skip > 0) {
          states.push("skip");
          skip--;
          return;
        }
        const item = schedule.find((it) => it.start === row.start);
        if (!item) {
          states.push("skip");
          return;
        }
        const span = ROWS.filter((r) => r.start >= item.start && r.end <= item.end).length;
        states.push({ item, span });
        skip = span - 1;
      });
      dayStates[day] = states;
    });

    let tbody = "<tbody>";
    ROWS.forEach((row, rowIdx) => {
      tbody += `<tr><td class="time-col">${fmtHour(row.start)}</td>`;
      days.forEach((day) => {
        const state = dayStates[day][rowIdx];
        if (state === "skip") return;
        const { item, span } = state;
        const isLive = day === today && nowH >= item.start && nowH < item.end;
        tbody += `<td class="grid-cell${isLive ? " grid-cell-live" : ""}" rowspan="${span}" data-day="${day}" data-start="${item.start}" tabindex="0" role="button">
          <span class="grid-cell-name">${item.name}</span>
          ${isLive ? '<span class="live-badge" style="margin-top:4px;"><span class="live-dot"></span>LIVE</span>' : `<span class="grid-cell-time">${fmtHour(item.start)}–${fmtHour(item.end)}</span>`}
        </td>`;
      });
      tbody += "</tr>";
    });
    tbody += "</tbody>";

    gridTable.innerHTML = thead + tbody;

    gridTable.querySelectorAll(".grid-cell").forEach((cell) => {
      const day = cell.dataset.day;
      const start = parseFloat(cell.dataset.start);
      const item = getDaySchedule(day).find((it) => it.start === start);
      const openIt = () => openModal(item, day);
      cell.addEventListener("click", openIt);
      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openIt();
        }
      });
    });
  }

  function updateView() {
    if (selectedDay === "all") {
      gridWrap.style.display = "";
      listEl.style.display = "none";
      toolbar.style.display = "none";
      renderGrid();
    } else {
      gridWrap.style.display = "none";
      listEl.style.display = "";
      toolbar.style.display = "";
      render();
    }
  }

  function render() {
    const schedule = getDaySchedule(selectedDay);
    const isToday = selectedDay === todayName();
    const nowH = nowDecimal(new Date());

    listEl.innerHTML = "";
    let shown = 0;

    schedule.forEach((item) => {
      if (currentFilter !== "all" && partOfDay(item.start) !== currentFilter) return;
      const matchesSearch =
        !currentQuery ||
        item.name.toLowerCase().includes(currentQuery) ||
        item.host.toLowerCase().includes(currentQuery) ||
        item.cat.toLowerCase().includes(currentQuery);
      if (!matchesSearch) return;

      shown++;
      const isLive = isToday && nowH >= item.start && nowH < item.end;

      const row = document.createElement("button");
      row.type = "button";
      row.className = "schedule-item" + (isLive ? " schedule-item-live" : "");
      row.innerHTML = `
        <span class="schedule-item-time">${fmtHour(item.start)} – ${fmtHour(item.end)}</span>
        <span class="schedule-item-main">
          <span class="schedule-item-name">${item.name}${isLive ? ' <span class="live-badge" style="margin-left:8px;"><span class="live-dot"></span>LIVE</span>' : ""}</span>
          <span class="schedule-item-host">${item.host} · ${item.cat}</span>
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      `;
      row.addEventListener("click", () => openModal(item, selectedDay));
      listEl.appendChild(row);
    });

    if (!shown) {
      listEl.innerHTML = `<p class="text-muted" style="padding:24px 4px;">No programs match your search or filter for ${selectedDay}.</p>`;
    }
  }

  /* ---------- Day tabs ---------- */
  document.querySelectorAll("[data-day-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-day-tab]").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      selectedDay = tab.dataset.dayTab;
      updateView();
    });
    if (tab.dataset.dayTab === selectedDay) tab.classList.add("active");
  });

  /* ---------- Time-of-day filters ---------- */
  document.querySelectorAll("[data-schedule-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-schedule-filter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.scheduleFilter;
      render();
    });
  });

  /* ---------- Search ---------- */
  const searchInput = document.querySelector("[data-schedule-search]");
  searchInput?.addEventListener("input", () => {
    currentQuery = searchInput.value.trim().toLowerCase();
    render();
  });

  /* ---------- Modal ---------- */
  const overlay = document.querySelector("[data-program-modal]");
  function openModal(item, day) {
    if (!overlay) return;
    const hours = item.end - item.start;
    const durationText = hours === Math.floor(hours) ? `${hours} hr${hours !== 1 ? "s" : ""}` : `${hours * 60} min`;
    overlay.querySelector("[data-modal-name]").textContent = item.name;
    overlay.querySelector("[data-modal-day]").textContent = `${day}, ${fmtHour(item.start)}–${fmtHour(item.end)}`;
    overlay.querySelector("[data-modal-host]").textContent = item.host;
    overlay.querySelector("[data-modal-cat]").textContent = item.cat;
    overlay.querySelector("[data-modal-duration]").textContent = durationText;
    overlay.querySelector("[data-modal-desc]").textContent = item.desc;
    overlay.classList.add("open");
    overlay.querySelector(".modal-close")?.focus();
  }
  function closeModal() {
    overlay?.classList.remove("open");
  }
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  overlay?.querySelector(".modal-close")?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Countdown to next program (today) ---------- */
  const countdownEl = document.querySelector("[data-next-countdown]");
  const nextNameEl = document.querySelector("[data-next-name]");
  function updateCountdown() {
    if (!countdownEl) return;
    const now = new Date();
    const nowH = nowDecimal(now);
    const todaySchedule = getDaySchedule(todayName());
    let next = todaySchedule.find((item) => item.start > nowH);
    let target = new Date(now);
    if (next) {
      target.setHours(Math.floor(next.start), (next.start % 1) * 60, 0, 0);
    } else {
      // roll into tomorrow's first block
      const tomorrowName = DAYS[new Date().getDay() % 7];
      next = getDaySchedule(tomorrowName)[0];
      target.setDate(target.getDate() + 1);
      target.setHours(0, 0, 0, 0);
    }
    const diff = Math.max(0, target - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    if (nextNameEl && next) nextNameEl.textContent = next.name;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  updateView();
})();
