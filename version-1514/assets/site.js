(function () {
  const ready = function (callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  ready(function () {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mainNav = document.querySelector('[data-main-nav]');

    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', function () {
        mainNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
      const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
      const dots = Array.from(carousel.querySelectorAll('[data-slide-dot]'));
      let current = 0;
      let timer = null;

      const showSlide = function (index) {
        if (slides.length === 0) {
          return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      };

      const start = function () {
        if (slides.length <= 1) {
          return;
        }

        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5000);
      };

      const restart = function () {
        if (timer) {
          window.clearInterval(timer);
        }
        start();
      };

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          const index = Number(dot.getAttribute('data-slide-dot')) || 0;
          showSlide(index);
          restart();
        });
      });

      showSlide(0);
      start();
    });

    document.querySelectorAll('[data-filter-form]').forEach(function (form) {
      const input = form.querySelector('[data-filter-input]');
      const cards = Array.from(document.querySelectorAll('[data-card]'));
      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get('q') || '';

      const applyFilter = function () {
        const query = (input.value || '').trim().toLowerCase();
        cards.forEach(function (card) {
          const keywords = (card.getAttribute('data-keywords') || card.textContent || '').toLowerCase();
          card.classList.toggle('is-hidden', query.length > 0 && keywords.indexOf(query) === -1);
        });
      };

      if (input && initialQuery) {
        input.value = initialQuery;
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        applyFilter();
      });

      if (input) {
        input.addEventListener('input', applyFilter);
        applyFilter();
      }
    });
  });
})();
