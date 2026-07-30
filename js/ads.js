/* ============================================================
   ANGEL 96.1FM — AD SLOTS
   NOTE: The brand names/creative below are MOCKUP PLACEHOLDERS
   to show how sponsor slots would look and rotate. Swap in real
   paid-advertiser creative (and signed agreements) before launch —
   don't ship real brand names without their sign-off.
   ============================================================ */
(function () {
  "use strict";

  const ADS = [
    {
      cls: "ad-adonko",
      mark: "AB",
      tag: "Sponsored",
      title: "Adonko Bitters",
      body: "The taste that stands the test of time. Available at stores nationwide.",
      cta: "Learn More",
    },
    {
      cls: "ad-mtn",
      mark: "MTN",
      tag: "Sponsored",
      title: "MTN Ghana",
      body: "Everywhere you go, stay connected with the best network for you.",
      cta: "Explore Offers",
    },
    {
      cls: "ad-telecel",
      mark: "T",
      tag: "Sponsored",
      title: "Telecel Ghana",
      body: "Data, talk-time and more — bundles built for how you actually live.",
      cta: "See Bundles",
    },
    {
      cls: "ad-kasapreko",
      mark: "K",
      tag: "Sponsored",
      title: "Kasapreko",
      body: "Proudly Ghanaian since 1989 — quality drinks for every occasion.",
      cta: "Our Products",
    },
    {
      cls: "ad-voltic",
      mark: "V",
      tag: "Sponsored",
      title: "Voltic Ghana",
      body: "Pure. Refreshing. Trusted. Stay hydrated with Voltic every day.",
      cta: "Find a Store",
    },
  ];

  function buildSlot(container) {
    const isSidebar = container.classList.contains("ad-sidebar-slot");
    container.innerHTML = "";
    const label = document.createElement("span");
    label.className = "ad-slot-label";
    label.textContent = "Advertisement";
    container.appendChild(label);

    ADS.forEach((ad, i) => {
      const slide = document.createElement("div");
      slide.className = `ad-slide ${ad.cls}` + (i === 0 ? " active" : "");
      slide.innerHTML = `
        <div class="ad-brand-mark">${ad.mark}</div>
        <div class="ad-copy">
          <span class="ad-tag">${ad.tag}</span>
          <h4>${ad.title}</h4>
          <p>${ad.body}</p>
        </div>
        ${isSidebar ? "" : `<a href="#" class="btn btn-sm" style="background:rgba(255,255,255,.18);color:inherit;flex-shrink:0;">${ad.cta}</a>`}
      `;
      container.appendChild(slide);
    });

    const dots = document.createElement("div");
    dots.className = "ad-dots";
    ADS.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Show ad ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dots.appendChild(dot);
    });
    container.appendChild(dots);

    let current = 0;
    const slides = container.querySelectorAll(".ad-slide");
    const dotEls = dots.querySelectorAll("button");

    function show(index) {
      slides[current].classList.remove("active");
      dotEls[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      dotEls[current].classList.add("active");
    }

    dotEls.forEach((dot, i) => dot.addEventListener("click", () => show(i)));

    let timer = setInterval(() => show((current + 1) % ADS.length), 5000);
    container.addEventListener("mouseenter", () => clearInterval(timer));
    container.addEventListener("mouseleave", () => {
      timer = setInterval(() => show((current + 1) % ADS.length), 5000);
    });
  }

  document.querySelectorAll("[data-ad-slot]").forEach(buildSlot);
})();
