(function () {
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle("is-active", itemIndex === heroIndex);
    });

    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle("is-active", itemIndex === heroIndex);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showHero(Number(dot.getAttribute("data-hero-dot")) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var typeFilter = document.querySelector("[data-type-filter]");
  var regionFilter = document.querySelector("[data-region-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid .movie-card"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(searchInput && searchInput.value);
    var type = normalize(typeFilter && typeFilter.value);
    var region = normalize(regionFilter && regionFilter.value);

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" "));
      var cardType = normalize(card.getAttribute("data-type"));
      var cardRegion = normalize(card.getAttribute("data-region"));
      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }

      if (type && cardType !== type) {
        matched = false;
      }

      if (region && cardRegion !== region) {
        matched = false;
      }

      card.classList.toggle("is-hidden", !matched);
    });
  }

  [searchInput, typeFilter, regionFilter].forEach(function (element) {
    if (element) {
      element.addEventListener("input", applyFilters);
      element.addEventListener("change", applyFilters);
    }
  });

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q) {
      searchInput.value = q;
      applyFilters();
    }
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.querySelector(".movie-video");
    var cover = document.querySelector(".player-cover");
    var ready = false;
    var hls = null;

    if (!video || !streamUrl) {
      return;
    }

    function start() {
      if (!ready) {
        ready = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }

      if (cover) {
        cover.classList.add("is-hidden");
      }

      var playAction = video.play();

      if (playAction && typeof playAction.catch === "function") {
        playAction.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };
})();
