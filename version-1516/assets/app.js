(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var opened = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  var carousel = document.querySelector(".js-hero-carousel");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var index = 0;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll(".js-search-form")).forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var query = input ? input.value.trim() : "";
      var url = "./search.html";
      if (query) {
        url += "?q=" + encodeURIComponent(query);
      }
      window.location.href = url;
    });
  });

  var cardSearch = document.querySelector(".js-card-search");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid .movie-card, .searchable-grid .movie-card-wide"));
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".js-filter-btn"));
  var activeFilter = "all";

  function paramsQuery() {
    try {
      return new URLSearchParams(window.location.search).get("q") || "";
    } catch (error) {
      return "";
    }
  }

  function applyFilters() {
    var query = cardSearch ? cardSearch.value.trim().toLowerCase() : "";

    cards.forEach(function (card) {
      var searchable = (card.getAttribute("data-search") || "").toLowerCase();
      var type = card.getAttribute("data-type") || "";
      var matchesQuery = !query || searchable.indexOf(query) !== -1;
      var matchesFilter = activeFilter === "all" || type === activeFilter;
      card.classList.toggle("is-hidden", !(matchesQuery && matchesFilter));
    });
  }

  if (cardSearch && cards.length) {
    var initialQuery = paramsQuery();
    if (initialQuery) {
      cardSearch.value = initialQuery;
    }
    cardSearch.addEventListener("input", applyFilters);
    applyFilters();
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter") || "all";
      buttons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      applyFilters();
    });
  });
})();
