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

  // --- Interactive Vintage SVG Bosphorus Map ---
  function initInteractiveMap() {
    const mapElement = document.getElementById('bosphorusMap');
    if (!mapElement) return;

    const yearSelect = document.getElementById('yearSelect');
    const yearBadge = document.getElementById('mapYearBadge');

    // Get all SVG elements
    const piers = mapElement.querySelectorAll('.pier');
    const routes = mapElement.querySelectorAll('.ferry-route');
    const ships = mapElement.querySelectorAll('.route-ship');

    // Pier descriptions (for tooltips/popups)
    const pierDescriptions = {
      sariyer: 'Boğaz\'ın kuzeyinde, yazlık konak bölgesi.',
      yenikoy: 'Varlıklı ailelerin tercih ettiği sakin semt.',
      emirgan: 'Cami önünde ahşap olarak yapılan tarihi iskele.',
      bebek: 'Humayu-u Abad Camii yakınında, Boğaz\'ın en şık semti.',
      arnavutkoy: 'Ahşap evleri ve balıkçı barınaklarıyla ünlü.',
      ortakoy: 'Abdülmecit Camii yakınında, Boğaz\'ın en güzel manzarası.',
      besiktas: 'İlk iskele (1851). Şirket-i Hayriye\'nin ana merkezi.',
      kabatas: 'Dolmabahçe Sarayı yakınında stratejik iskele.',
      karakoy: 'Galata Köprüsü yanında, ticaret merkezi.',
      eminonu: 'İstanbul\'un kalbi. Ticaretin ve ulaşımın merkezi.',
      beykoz: '"Hünkar İskelesi" adıyla yapıldı (1851).',
      pasabahce: 'Cam fabrikasıyla ünlü sanayi bölgesi.',
      cubuklu: 'Boğazın sembolü olarak nitelendirilen iskele.',
      kanlica: 'Ünlü yoğurt bölgesinde hizmet veren iskele.',
      anadoluhisari: '"Hisarönü" adıyla inşa edildi. Boğaz\'ın en dar noktası.',
      kandilli: 'Rasathane ile ünlü sakin semt.',
      beylerbeyi: 'Beylerbeyi Sarayı\'nın hemen önünde.',
      uskudar: 'Anadolu yakasının tarihi kapısı. En işlek iskelelerden biri.',
      haydarpasa: 'Mimar Vedat Tek tasarımı. Suhulet için kritik.',
      kadikoy: 'Fevaid-i Osmaniye tarafından kuruldu (1846).'
    };

    // Create tooltip element - Historical parchment style
    const tooltip = document.createElement('div');
    tooltip.className = 'svg-map-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      background: linear-gradient(135deg, #f5eee0 0%, #e8dcc8 100%);
      color: #4a3525;
      padding: 12px 16px;
      border-radius: 4px;
      border: 2px solid #6a5a48;
      font-family: 'Source Serif 4', serif;
      font-size: 12px;
      max-width: 240px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(60, 40, 20, 0.35);
      line-height: 1.5;
    `;
    document.querySelector('.vintage-map-container')?.appendChild(tooltip);

    // Add pier interactivity
    piers.forEach(pier => {
      const pierId = pier.getAttribute('data-pier');
      const pierYear = parseInt(pier.getAttribute('data-year'), 10);
      const pierText = pier.querySelector('text');
      const pierName = pierText?.textContent || pierId;

      pier.addEventListener('mouseenter', (e) => {
        const desc = pierDescriptions[pierId] || '';
        tooltip.innerHTML = `<strong style="color:#6b4030;font-size:13px;border-bottom:1px solid #c0b090;padding-bottom:4px;display:block;margin-bottom:6px;">${pierName} İskelesi</strong><span style="color:#5a4a38">${desc}</span><br><em style="font-size:10px;color:#7a6a58;margin-top:6px;display:block;">Kuruluş: ${pierYear}</em>`;
        tooltip.style.opacity = '1';
      });

      pier.addEventListener('mousemove', (e) => {
        const container = document.querySelector('.vintage-map-container');
        const rect = container.getBoundingClientRect();
        tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
      });

      pier.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    });

    // Add route interactivity
    routes.forEach(route => {
      route.addEventListener('mouseenter', () => {
        route.style.strokeWidth = '4';
        route.style.opacity = '1';
      });
      route.addEventListener('mouseleave', () => {
        route.style.strokeWidth = route.classList.contains('suhulet-route') ? '3' : '2';
        if (!route.classList.contains('hidden')) {
          route.style.opacity = route.classList.contains('suhulet-route') ? '0.9' : '0.8';
        }
      });
    });

    // Fleet data by year (for timeline - 1851 is founding year)
    const fleetByYear = {
      1854: { ships: 6, piers: 12, routes: 2 },
      1866: { ships: 16, piers: 15, routes: 3 },
      1872: { ships: 26, piers: 18, routes: 4 },
      1880: { ships: 32, piers: 19, routes: 4 },
      1890: { ships: 40, piers: 20, routes: 4 },
      1894: { ships: 46, piers: 20, routes: 4 }
    };

    // Map timeline years to founding reference year (1851)
    // Timeline years map to visibility thresholds
    const yearMapping = {
      1854: 1851,  // Show founding piers
      1866: 1866,  // Show piers opened by 1866
      1872: 1872,  // Show Haydarpaşa, Suhulet route
      1880: 1880,
      1890: 1890,
      1894: 1894
    };

    // Update map based on selected year
    function updateMapByYear(year) {
      const selectedYear = parseInt(year, 10);
      const pierVisibilityYear = yearMapping[selectedYear] || selectedYear;

      // Update year badge
      if (yearBadge) {
        yearBadge.textContent = selectedYear;
      }

      // Update pier visibility
      piers.forEach(pier => {
        const pierYear = parseInt(pier.getAttribute('data-year'), 10);
        const isVisible = pierYear <= pierVisibilityYear;
        pier.classList.toggle('hidden', !isVisible);
      });

      // Update route visibility
      routes.forEach(route => {
        const routeYear = parseInt(route.getAttribute('data-year'), 10);
        const isVisible = routeYear <= pierVisibilityYear;
        route.classList.toggle('hidden', !isVisible);
      });

      // Update ship visibility
      ships.forEach(ship => {
        const shipYear = parseInt(ship.getAttribute('data-year'), 10);
        const isVisible = shipYear <= pierVisibilityYear;
        ship.classList.toggle('hidden', !isVisible);
      });

      // Update route labels (like Suhulet label)
      const routeLabels = mapElement.querySelectorAll('.suhulet-label');
      routeLabels.forEach(label => {
        const labelYear = parseInt(label.getAttribute('data-year'), 10);
        const isVisible = labelYear <= pierVisibilityYear;
        label.classList.toggle('hidden', !isVisible);
      });

      // Update fleet stats display
      const stats = fleetByYear[selectedYear] || fleetByYear[1872];
      const shipsStat = document.querySelector('#fleetStatShips .stat-value');
      const piersStat = document.querySelector('#fleetStatPiers .stat-value');
      const routesStat = document.querySelector('#fleetStatRoutes .stat-value');

      if (shipsStat) shipsStat.textContent = stats.ships;
      if (piersStat) piersStat.textContent = stats.piers;
      if (routesStat) routesStat.textContent = stats.routes;
    }

    // Initialize timeline selector
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        updateMapByYear(e.target.value);
      });
      updateMapByYear(yearSelect.value);
    }

    // Initialize maritime slider markers
    const sliderMarkers = document.querySelectorAll('.slider-marker');
    const sliderShip = document.getElementById('sliderShip');

    if (sliderMarkers.length > 0) {
      function updateSliderShip(year) {
        if (sliderShip) {
          const activeMarker = document.querySelector(`.slider-marker[data-year="${year}"]`);
          if (activeMarker) {
            const container = document.querySelector('.slider-markers');
            const containerRect = container.getBoundingClientRect();
            const markerRect = activeMarker.getBoundingClientRect();
            const relativeLeft = markerRect.left - containerRect.left + markerRect.width / 2;
            sliderShip.style.left = `${relativeLeft}px`;
          }
        }
      }

      sliderMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
          const year = marker.getAttribute('data-year');

          // Update active state
          sliderMarkers.forEach(m => m.classList.remove('active'));
          marker.classList.add('active');

          // Update hidden select
          if (yearSelect) {
            yearSelect.value = year;
          }

          // Update ship position on timeline
          updateSliderShip(parseInt(year, 10));

          // Update SVG map
          updateMapByYear(year);
        });
      });

      // Set initial ship position
      updateSliderShip(1872);
    }

    // Initialize map with default year
    updateMapByYear(yearSelect?.value || 1872);
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
    initInteractiveMap();
  });
})();
