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

  // 2. Screenshot lightbox modal viewer
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var caption = document.getElementById("lb-caption");

  if (box && typeof box.showModal === "function") {
    document.querySelectorAll(".shot-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var fullSrc = btn.getAttribute("data-full");
        var altText = btn.getAttribute("data-alt") || "";
        var capText = btn.getAttribute("data-caption") || altText;

        if (img) {
          img.src = fullSrc;
          img.alt = altText;
        }
        if (caption) {
          caption.textContent = capText;
        }
        box.showModal();
      });
    });

    // Close when clicking outside dialog content
    box.addEventListener("click", function (e) {
      if (e.target === box) {
        box.close();
      }
    });

    // Clean up on close
    box.addEventListener("close", function () {
      if (img) {
        img.removeAttribute("src");
      }
    });
  }

  // 3. Highlight active nav link on scroll
  var sections = document.querySelectorAll("section[id], header[id]");
  var navLinks = document.querySelectorAll(".nav a[href^='#']");

  function onScroll() {
    var scrollPos = window.scrollY + 120;
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
