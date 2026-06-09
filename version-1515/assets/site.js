(function() {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function() {
      menu.classList.toggle('is-open');
    });
  }

  function normalized(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initSearch() {
    var input = document.querySelector('.js-search-input');
    var grid = document.querySelector('[data-movie-grid]');
    if (!input || !grid) {
      return;
    }
    var cards = all('.movie-card', grid);
    var chips = all('[data-filter-value]');
    var empty = document.querySelector('[data-empty-state]');
    var activeFilter = 'all';

    function cardText(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-category'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' ').toLowerCase();
    }

    function matchFilter(card) {
      if (activeFilter === 'all') {
        return true;
      }
      return cardText(card).indexOf(normalized(activeFilter)) !== -1;
    }

    function applySearch() {
      var term = normalized(input.value);
      var visible = 0;
      cards.forEach(function(card) {
        var ok = cardText(card).indexOf(term) !== -1 && matchFilter(card);
        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    input.addEventListener('input', applySearch);
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(item) {
          item.classList.remove('is-active');
        });
        chip.classList.add('is-active');
        activeFilter = chip.getAttribute('data-filter-value') || 'all';
        applySearch();
      });
    });
    applySearch();
  }

  function initHero() {
    var slides = all('[data-hero-slide]');
    if (!slides.length) {
      return;
    }
    var dots = all('[data-hero-dot]');
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener('click', function() {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function() {
        show(index + 1);
        restart();
      });
    }
    restart();
  }

  document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    initSearch();
    initHero();
  });
})();
