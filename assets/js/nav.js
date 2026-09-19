// Mobile navigation toggle.
// Replaces the old <details>/<summary> disclosure pattern, which relied on
// display: contents and rendered inconsistently across browsers (notably
// Safari). This is a plain button + nav toggle instead.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  function closeSubmenus() {
    var open = nav.querySelectorAll(".has-submenu.is-open");
    for (var j = 0; j < open.length; j++) {
      open[j].classList.remove("is-open");
      var btn = open[j].querySelector(".submenu-toggle");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  }

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    closeSubmenus();
  }

  function openNav() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  var submenuToggles = nav.querySelectorAll(".submenu-toggle");
  for (var k = 0; k < submenuToggles.length; k++) {
    submenuToggles[k].addEventListener("click", function (e) {
      e.stopPropagation();
      var item = this.parentNode;
      var isOpen = item.classList.toggle("is-open");
      this.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var links = nav.querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", closeNav);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1180) closeNav();
  });
})();
