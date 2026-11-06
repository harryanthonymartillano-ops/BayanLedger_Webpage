(function () {
  "use strict";

  // 1. Wire up configurable links from config.js
  var links = window.BAYANLEDGER_LINKS || {};
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var url = links[key];
    var label = el.querySelector("[data-url-text]");

    if (url && url.trim().length > 0) {
      el.setAttribute("href", url);
      if (!/^#/.test(url)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      if (label) {
        label.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      }
    } else {
      el.setAttribute("aria-disabled", "true");
      el.removeAttribute("href");
      el.setAttribute("role", "link");
      if (label) {
        label.textContent = "Link not set yet";
      }
    }
  });

  // 2. Screenshot lightbox modal viewer (1 view image only, no label)
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var closeBtn = document.getElementById("lb-close");

  if (box && typeof box.showModal === "function") {
    var buttons = Array.from(document.querySelectorAll(".shot-btn"));
    buttons.forEach(function (btn) {
      function openView() {
        var fullSrc = btn.getAttribute("data-full");
        var altText = btn.getAttribute("data-alt") || "Enlarged screenshot capture";

        if (img) {
          img.src = fullSrc;
          img.alt = altText;
        }
        box.showModal();
      }

      btn.addEventListener("click", openView);
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openView();
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        box.close();
      });
    }

    // Close when clicking outside image (on dialog backdrop or stage)
    box.addEventListener("click", function (e) {
      if (e.target === box || (e.target && e.target.classList && e.target.classList.contains("lb-stage"))) {
        box.close();
      }
    });

    // Clean up src on close so no placeholder or ghost image remains
    box.addEventListener("close", function () {
      if (img) {
        img.removeAttribute("src");
      }
    });
  }

  // 3. Highlight active nav link on scroll
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links-wrap a[href^='#'], .nav a[href^='#'], a.nav-item");

  function onScroll() {
    var scrollPos = window.scrollY + 140;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
