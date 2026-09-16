/**
 * Rivanna Home Cleaning: FAQ accordion
 * Dependency-free toggle. Each question button controls one answer
 * panel via aria-expanded / hidden. Multiple panels may be open at once.
 */
(function () {
  "use strict";

  function toggle(button) {
    var expanded = button.getAttribute("aria-expanded") === "true";
    var panelId = button.getAttribute("aria-controls");
    var panel = panelId ? document.getElementById(panelId) : null;
    button.setAttribute("aria-expanded", String(!expanded));
    if (panel) {
      if (expanded) {
        panel.setAttribute("hidden", "");
      } else {
        panel.removeAttribute("hidden");
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".faq-question");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggle(btn);
      });
    });
  });
})();
