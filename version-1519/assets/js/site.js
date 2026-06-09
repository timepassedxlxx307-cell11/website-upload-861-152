(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    restart();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var select = panel.querySelector('[data-filter-select]');
    var empty = panel.querySelector('[data-filter-empty]');
    var scope = panel.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

    function applyFilter() {
      var keyword = normalize(input ? input.value : '');
      var type = normalize(select ? select.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !type || haystack.indexOf(type) !== -1;
        var isVisible = matchesKeyword && matchesType;

        card.classList.toggle('is-hidden', !isVisible);

        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });

  var globalInput = document.querySelector('[data-global-search]');
  var globalResults = document.querySelector('[data-search-results]');
  var globalClear = document.querySelector('[data-global-clear]');

  function renderSearchResults(items) {
    if (!globalResults) {
      return;
    }

    globalResults.innerHTML = items.slice(0, 80).map(function (item) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + item.url + '" aria-label="观看' + escapeHtml(item.title) + '">',
        '    <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '    <span class="poster-mask"><span class="play-badge">▶</span></span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span></div>',
        '    <h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>',
        '    <p class="card-desc compact">' + escapeHtml(item.oneLine) + '</p>',
        '    <div class="tag-row"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function runGlobalSearch() {
    if (!globalInput || !globalResults || !window.SEARCH_INDEX) {
      return;
    }

    var query = normalize(globalInput.value);

    if (!query) {
      renderSearchResults(window.SEARCH_INDEX.slice(0, 40));
      return;
    }

    var words = query.split(/\s+/).filter(Boolean);
    var results = window.SEARCH_INDEX.filter(function (item) {
      var haystack = normalize([item.title, item.region, item.type, item.year, item.genre, item.category, item.tags].join(' '));
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    });

    renderSearchResults(results);
  }

  if (globalInput && globalResults) {
    globalInput.addEventListener('input', runGlobalSearch);
    runGlobalSearch();
  }

  if (globalClear && globalInput) {
    globalClear.addEventListener('click', function () {
      globalInput.value = '';
      globalInput.focus();
      runGlobalSearch();
    });
  }
})();
