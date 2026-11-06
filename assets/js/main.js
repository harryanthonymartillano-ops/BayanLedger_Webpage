(function () {
  "use strict";

  // 1. Wire up configurable external links from config.js
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

  // 2. Interactive System Showcase Tab Switcher
  var tabs = document.querySelectorAll(".module-tab-btn");
  var panels = document.querySelectorAll(".module-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetId = tab.getAttribute("data-tab");

      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach(function (p) {
        p.classList.remove("active");
        p.hidden = true;
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      var targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
        targetPanel.hidden = false;
      }
    });
  });

  // 3. Screenshot Lightbox Modal
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var caption = document.getElementById("lb-caption");

  if (box && typeof box.showModal === "function") {
    document.querySelectorAll(".shot-btn, .zoom-trigger").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
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

    box.addEventListener("click", function (e) {
      if (e.target === box) {
        box.close();
      }
    });

    box.addEventListener("close", function () {
      if (img) {
        img.removeAttribute("src");
      }
    });
  }

  // 4. Contract Address Copy Button with Tooltip
  var copyBtn = document.getElementById("copy-contract-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var addr = copyBtn.getAttribute("data-address");
      if (navigator.clipboard && addr) {
        navigator.clipboard.writeText(addr).then(function () {
          var original = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span class="copied-indicator">✓ Copied!</span>';
          setTimeout(function () {
            copyBtn.innerHTML = original;
          }, 2000);
        });
      }
    });
  }

  // 5. ScrollSpy & Sticky Navbar Styling
  var header = document.querySelector(".site-header");
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link[href^='#']");

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

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
  onScroll();
})();
