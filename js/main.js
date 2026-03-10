/* ============================================
   HÜSEYIN HAKI EFENDI — main.js
   Scroll Animations & Interactivity
   ============================================ */

(function () {
  'use strict';

  // --- Reveal on Scroll (IntersectionObserver) ---
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // --- Animated Number Counter ---
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 2000;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              el.textContent = prefix + current + suffix;

              if (progress < 1) {
                requestAnimationFrame(update);
              }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  // --- Timeline Active Dot ---
  function initTimeline() {
    const dots = document.querySelectorAll('.timeline-dot');
    if (!dots.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.closest('.timeline-item').classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    dots.forEach((dot) => observer.observe(dot));
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- QR Code Special Greeting ---
  function checkQRVisitor() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('ref') || params.has('qr')) {
      document.body.classList.add('qr-visitor');
      // Could trigger a special welcome animation here in the future
    }
  }

  // --- Dynamic Time-of-Day Background Accent ---
  function setTimeAccent() {
    const hour = new Date().getHours();
    let timeClass = 'time-day';
    if (hour >= 5 && hour < 8) timeClass = 'time-dawn';
    else if (hour >= 8 && hour < 17) timeClass = 'time-day';
    else if (hour >= 17 && hour < 20) timeClass = 'time-dusk';
    else timeClass = 'time-night';

    document.body.classList.add(timeClass);
  }

  // --- Hero Ferries (Click to show name) ---
  function initHeroFerries() {
    const ferriesContainer = document.getElementById('heroFerries');
    if (!ferriesContainer) return;

    const tooltip = document.getElementById('ferryTooltip');
    const ferries = ferriesContainer.querySelectorAll('.hero-ferry');

    // Ferry names data - Gerçek Şirket-i Hayriye vapur isimleri
    const ferryNames = {
      suhulet: 'Suhulet (1872) — Arabalı Vapur',
      sahilbent: 'Sahilbent (1854)',
      nusret: 'Nusret (1856)',
      sirket: 'Şirket (1854)',
      istanbul: 'İstanbul (1858)',
      neveser: 'Neveser (1866)',
      rehber: 'Rehber (1868)',
      selamet: 'Selamet (1870)'
    };

    let activeTooltip = null;

    ferries.forEach(ferry => {
      ferry.addEventListener('click', (e) => {
        e.stopPropagation();
        const ferryId = ferry.getAttribute('data-ferry');
        const name = ferryNames[ferryId] || ferryId;

        // Remove previous active
        ferries.forEach(f => f.classList.remove('active'));
        ferry.classList.add('active');

        // Pause animations
        ferriesContainer.classList.add('paused');

        // Position and show tooltip
        const rect = ferry.getBoundingClientRect();
        tooltip.textContent = name;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        tooltip.classList.add('visible');

        activeTooltip = ferry;
      });
    });

    // Click outside to hide tooltip and resume animations
    document.addEventListener('click', (e) => {
      if (activeTooltip && !e.target.closest('.hero-ferry') && !e.target.closest('.ferry-tooltip')) {
        tooltip.classList.remove('visible');
        ferries.forEach(f => f.classList.remove('active'));
        ferriesContainer.classList.remove('paused');
        activeTooltip = null;
      }
    });
  }

  // --- Scrollytelling Carousel & Timeline Slider ---
  function initScrollytelling() {
    const storyYears = Array.from(document.querySelectorAll('.story-year'));
    const sliderMarkers = document.querySelectorAll('.slider-marker');
    const sliderShip = document.getElementById('sliderShip');

    if (storyYears.length === 0) return;

    // Year order for carousel navigation
    const yearOrder = ['1854', '1866', '1872', '1880', '1890', '1894'];
    let currentIndex = 2; // Start at 1872 (Suhulet)

    // Update carousel card positions
    function updateCarousel(activeIndex) {
      storyYears.forEach((card, i) => {
        card.classList.remove('active', 'prev', 'next', 'visible');

        if (i === activeIndex) {
          card.classList.add('active');
          // Animate stats for active card
          animateCardStats(card);
        } else if (i === activeIndex - 1) {
          card.classList.add('prev');
        } else if (i === activeIndex + 1) {
          card.classList.add('next');
        }
      });

      currentIndex = activeIndex;

      // Update timeline marker
      const year = yearOrder[activeIndex];
      sliderMarkers.forEach(m => m.classList.remove('active'));
      const activeMarker = document.querySelector(`.slider-marker[data-year="${year}"]`);
      if (activeMarker) {
        activeMarker.classList.add('active');
        updateSliderShip(parseInt(year, 10));
      }
    }

    // Animate stats for a specific card
    function animateCardStats(card) {
      const stats = card.querySelectorAll('.stat-number-scroll');
      stats.forEach(stat => {
        if (stat.classList.contains('counted')) return;
        stat.classList.add('counted');

        const target = parseInt(stat.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        const duration = 1200;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          stat.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }

    // Timeline slider ship position - above marker circles
    function updateSliderShip(year) {
      if (!sliderShip) return;

      const activeMarker = document.querySelector(`.slider-marker[data-year="${year}"]`);
      if (activeMarker) {
        const track = document.querySelector('.timeline-slider-track');
        const trackRect = track.getBoundingClientRect();
        const markerDot = activeMarker.querySelector('.marker-dot');
        const dotRect = markerDot.getBoundingClientRect();
        // Position ship above the marker dot (100px up, 50px right offset)
        const relativeLeft = dotRect.left - trackRect.left + dotRect.width / 2;
        sliderShip.style.left = `${relativeLeft}px`;
        sliderShip.style.transform = 'translateX(calc(-50% + 25px)) translateY(calc(-50% - 50px))';
      }
    }

    // Timeline marker click handlers
    sliderMarkers.forEach(marker => {
      marker.addEventListener('click', () => {
        const year = marker.getAttribute('data-year');
        const newIndex = yearOrder.indexOf(year);
        if (newIndex !== -1 && newIndex !== currentIndex) {
          updateCarousel(newIndex);
        }
      });
    });

    // Click on prev/next cards to navigate
    storyYears.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('prev') && currentIndex > 0) {
          updateCarousel(currentIndex - 1);
        } else if (card.classList.contains('next') && currentIndex < storyYears.length - 1) {
          updateCarousel(currentIndex + 1);
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const container = document.querySelector('.scrollytelling-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          updateCarousel(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < storyYears.length - 1) {
          updateCarousel(currentIndex + 1);
        }
      }
    });

    // Navigation button click handlers
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          updateCarousel(currentIndex - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < storyYears.length - 1) {
          updateCarousel(currentIndex + 1);
        }
      });
    }

    // Initialize with 1872 (Suhulet) as default
    setTimeout(() => {
      updateCarousel(currentIndex);
      updateSliderShip(1872);
    }, 100);

    // Update ship position on resize
    window.addEventListener('resize', () => {
      const activeMarker = document.querySelector('.slider-marker.active');
      if (activeMarker) {
        updateSliderShip(parseInt(activeMarker.getAttribute('data-year'), 10));
      }
    });
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', () => {
    checkQRVisitor();
    setTimeAccent();
    initRevealAnimations();
    animateCounters();
    initTimeline();
    initSmoothScroll();
    initHeroFerries();
    initScrollytelling();
  });
})();
