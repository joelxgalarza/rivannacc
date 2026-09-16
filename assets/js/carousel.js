/**
 * Rivanna Home Cleaning: review carousel controller
 * Dependency-free. Reads /data/reviews.json, renders cards into a
 * CSS scroll-snap track, and wires prev/next arrows, dot pagination,
 * autoplay (pausing on hover/focus/touch and prefers-reduced-motion),
 * and full keyboard arrow support.
 *
 * NOTE ON REVIEW SCHEMA MARKUP: this carousel intentionally does NOT
 * emit Review / AggregateRating JSON-LD while every review in
 * reviews.json carries "placeholder": true. Adding that structured
 * data for sample reviews would be structured-data spam under
 * Google's guidelines. Once real reviews replace the placeholders,
 * add Review/AggregateRating JSON-LD in a <script type="application/ld+json">
 * block in the <head> of index.html and reviews.html. See the TODO
 * comment left near the carousel markup on each page.
 */
(function () {
  "use strict";

  var STAR_PATH = "M10 1.5l2.47 5.36 5.9.58-4.44 4.03 1.27 5.83L10 14.98l-5.2 3.32 1.27-5.83L1.63 7.44l5.9-.58L10 1.5z";

  function starSVG(filled) {
    return (
      '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="' +
      (filled ? "currentColor" : "none") +
      '" stroke="currentColor" stroke-width="1"><path d="' +
      STAR_PATH +
      '"/></svg>'
    );
  }

  function starsMarkup(rating) {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += starSVG(i <= rating);
    }
    return out;
  }

  var AVATAR_COLORS = ["#0F6E6A", "#E3A73B", "#3B7A8C", "#8C5E3B", "#5E7A3B", "#7A3B6E"];

  function colorForName(name) {
    var sum = 0;
    for (var i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildCard(review) {
    var card = document.createElement("article");
    card.className = "review-card";
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", review.name + ", rated " + review.rating + " out of 5");

    var sampleBadge = review.placeholder
      ? '<span class="sample-badge">Sample review</span>'
      : "";

    card.innerHTML =
      '<div class="review-head">' +
      '<div class="avatar-bubble" style="background:' +
      colorForName(review.name) +
      '" aria-hidden="true">' +
      escapeHTML(review.initial) +
      "</div>" +
      '<div class="review-who">' +
      '<span class="name">' +
      escapeHTML(review.name) +
      "</span>" +
      '<span class="review-meta">' +
      '<span class="source-badge">' +
      escapeHTML(review.source) +
      "</span>" +
      "<span>" +
      escapeHTML(review.date) +
      "</span>" +
      sampleBadge +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="stars" role="img" aria-label="Rated ' +
      review.rating +
      ' out of 5">' +
      starsMarkup(review.rating) +
      "</div>" +
      '<p class="review-text">' +
      escapeHTML(review.text) +
      "</p>" +
      '<span class="review-service-tag">' +
      escapeHTML(review.service) +
      "</span>";

    return card;
  }

  function initCarousel(root) {
    var viewport = root.querySelector("[data-carousel-viewport]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    var dataUrl = root.getAttribute("data-reviews-src") || "data/reviews.json";
    var maxItems = parseInt(root.getAttribute("data-max-items") || "0", 10);

    if (!viewport) return;

    viewport.setAttribute("aria-live", "polite");
    viewport.setAttribute("tabindex", "0");
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", "Customer reviews carousel");

    fetch(dataUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load reviews (" + res.status + ")");
        return res.json();
      })
      .then(function (reviews) {
        if (maxItems > 0) reviews = reviews.slice(0, maxItems);
        renderCards(reviews);
      })
      .catch(function (err) {
        viewport.innerHTML =
          '<p style="padding:1rem;color:#4B5768;">Reviews are temporarily unavailable. (' +
          escapeHTML(err.message) +
          ")</p>";
        // Local file:// testing note: fetch() of a local JSON file is blocked by
        // browser CORS rules under the file:// protocol. Serve the site over
        // any static HTTP server (e.g. `python3 -m http.server`) to test locally.
      });

    function renderCards(reviews) {
      viewport.innerHTML = "";
      reviews.forEach(function (r) {
        viewport.appendChild(buildCard(r));
      });
      buildDots(reviews.length);
      updateDots();
      wireControls();
      wireAutoplay();
    }

    function cardWidth() {
      var first = viewport.querySelector(".review-card");
      if (!first) return viewport.clientWidth;
      var style = window.getComputedStyle(first);
      var gap = parseFloat(window.getComputedStyle(viewport).columnGap || "20") || 20;
      return first.getBoundingClientRect().width + gap;
    }

    function scrollByCards(n) {
      viewport.scrollBy({ left: n * cardWidth(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }

    function prefersReducedMotion() {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function wireControls() {
      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          scrollByCards(-1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          scrollByCards(1);
        });
      }
      viewport.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollByCards(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollByCards(-1);
        }
      });
      viewport.addEventListener(
        "scroll",
        debounce(function () {
          updateDots();
        }, 100)
      );
    }

    function buildDots(count) {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      var visible = visibleCardCount();
      var dotCount = Math.max(1, count - visible + 1);
      for (var i = 0; i < dotCount; i++) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to review " + (i + 1));
        b.addEventListener("click", (function (idx) {
          return function () {
            viewport.scrollTo({ left: idx * cardWidth(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
          };
        })(i));
        dotsWrap.appendChild(b);
      }
    }

    function visibleCardCount() {
      var w = viewport.clientWidth;
      var cw = cardWidth();
      return Math.max(1, Math.round(w / cw));
    }

    function updateDots() {
      if (!dotsWrap) return;
      var dots = dotsWrap.querySelectorAll("button");
      if (!dots.length) return;
      var idx = Math.round(viewport.scrollLeft / cardWidth());
      dots.forEach(function (d, i) {
        if (i === idx) {
          d.setAttribute("aria-current", "true");
        } else {
          d.removeAttribute("aria-current");
        }
      });
    }

    function debounce(fn, wait) {
      var t;
      return function () {
        clearTimeout(t);
        var args = arguments;
        t = setTimeout(function () {
          fn.apply(null, args);
        }, wait);
      };
    }

    function wireAutoplay() {
      if (prefersReducedMotion()) return; // never autoplay for reduced-motion users
      var timer = null;
      var paused = false;

      function tick() {
        if (paused) return;
        var atEnd = Math.ceil(viewport.scrollLeft + viewport.clientWidth) >= viewport.scrollWidth;
        if (atEnd) {
          viewport.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollByCards(1);
        }
      }

      function start() {
        stop();
        timer = setInterval(tick, 6000);
      }
      function stop() {
        if (timer) clearInterval(timer);
      }

      root.addEventListener("mouseenter", function () {
        paused = true;
      });
      root.addEventListener("mouseleave", function () {
        paused = false;
      });
      root.addEventListener("focusin", function () {
        paused = true;
      });
      root.addEventListener("focusout", function () {
        paused = false;
      });
      root.addEventListener("touchstart", function () {
        paused = true;
      }, { passive: true });
      root.addEventListener("touchend", function () {
        setTimeout(function () {
          paused = false;
        }, 3000);
      });

      // Also respect a live change of the OS-level reduced-motion setting.
      var mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mql.addEventListener) {
        mql.addEventListener("change", function (e) {
          if (e.matches) stop();
          else start();
        });
      }

      start();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var carousels = document.querySelectorAll("[data-review-carousel]");
    carousels.forEach(initCarousel);
  });
})();
