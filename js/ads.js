/* ============================================================
   ANGEL 96.1FM — AD SLOTS
   NOTE: Logo images are real files provided by the site owner
   (images/). Copy/pricing/links below are still placeholder
   until real ad agreements are signed — swap those before launch.
   ============================================================ */
(function () {
  "use strict";

  const ADS = [
    {
      cls: "ad-adonko",
      logo: "images/adonko.jpeg",
      tag: "Sponsored",
      title: "Adonko Bitters",
      body: "The taste that stands the test of time. Available at stores nationwide.",
      cta: "Learn More",
    },
    {
      cls: "ad-mtn",
      logo: "images/mtn.jpg",
      tag: "Sponsored",
      title: "MTN Ghana",
      body: "Everywhere you go, stay connected with the best network for you.",
      cta: "Explore Offers",
    },
    {
      cls: "ad-kasapreko",
      logo: "images/kasapreko.png",
      tag: "Sponsored",
      title: "Kasapreko",
      body: "Proudly Ghanaian since 1989 — quality drinks for every occasion.",
      cta: "Our Products",
    },
    {
      cls: "ad-taabea",
      logo: "images/taabea.jpeg",
      tag: "Sponsored",
      title: "Taabea",
      body: "Trusted herbal medicine, proudly made in Kumasi since 2008.",
      cta: "Our Products",
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
        <div class="ad-brand-mark"><img src="${ad.logo}" alt="${ad.title} logo" loading="lazy" /></div>
        <div class="ad-copy">
          <span class="ad-tag">${ad.tag}</span>
          <h4>${ad.title}</h4>
          <p>${ad.body}</p>
        </div>
        ${isSidebar ? "" : `<a href="#" class="btn btn-sm" style="background:rgba(255,255,255,.18);color:inherit;flex-shrink:0;">${ad.cta}</a>`}
      `;
      container.appendChild(slide);
    });

    // Guard against a logo image failing to load — fall back to a plain colored badge
    container.querySelectorAll(".ad-brand-mark img").forEach((img) => {
      img.addEventListener("error", function handler() {
        img.removeEventListener("error", handler);
        img.style.display = "none";
      });
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
