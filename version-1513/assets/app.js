(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function initMobileNav() {
    var toggle = qs("[data-mobile-toggle]");
    var nav = qs("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "×" : "☰";
    });
  }

  function initSearchForms() {
    qsa("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = qs("input", form);
        var keyword = input ? input.value.trim() : "";
        var url = "./search.html";
        if (keyword) {
          url += "?q=" + encodeURIComponent(keyword);
        }
        window.location.href = url;
      });
    });
  }

  function initHero() {
    var slider = qs("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = qsa("[data-hero-slide]", slider);
    var dots = qsa("[data-hero-dot]", slider);
    var prev = qs("[data-hero-prev]", slider);
    var next = qs("[data-hero-next]", slider);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
        dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    qsa("[data-filter-scope]").forEach(function (scope) {
      var input = qs("[data-filter-input]", scope);
      var typeSelect = qs("[data-filter-type]", scope);
      var yearSelect = qs("[data-filter-year]", scope);
      var cards = qsa("[data-card]", scope);
      var count = qs("[data-result-count]", scope);
      var empty = qs("[data-empty-state]", scope);
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";
      if (input && initial) {
        input.value = initial;
      }

      function apply() {
        var keyword = normalize(input ? input.value : "");
        var type = typeSelect ? typeSelect.value : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags")
          ].join(" "));
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchType = !type || card.getAttribute("data-type") === type;
          var matchYear = !year || card.getAttribute("data-year") === year;
          var matched = matchKeyword && matchType && matchYear;
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        if (count) {
          count.textContent = String(visible);
        }
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      }

      [input, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function initPlayers() {
    qsa("[data-player]").forEach(function (player) {
      var video = qs("video", player);
      var sourceNode = video ? qs("source", video) : null;
      var overlay = qs("[data-play-cover]", player);
      var hlsInstance = null;
      if (!video || !sourceNode || !overlay) {
        return;
      }

      function sourceUrl() {
        return sourceNode.getAttribute("src") || sourceNode.src || "";
      }

      function prepare() {
        var url = sourceUrl();
        if (!url) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          if (!video.getAttribute("src")) {
            video.src = url;
          }
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          if (!hlsInstance) {
            hlsInstance = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hlsInstance.loadSource(url);
            hlsInstance.attachMedia(video);
          }
          return;
        }
        if (!video.getAttribute("src")) {
          video.src = url;
        }
      }

      function play() {
        prepare();
        overlay.classList.add("is-hidden");
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {
            overlay.classList.remove("is-hidden");
          });
        }
      }

      overlay.addEventListener("click", play);
      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });
    });
  }

  ready(function () {
    initMobileNav();
    initSearchForms();
    initHero();
    initFilters();
    initPlayers();
  });
})();
