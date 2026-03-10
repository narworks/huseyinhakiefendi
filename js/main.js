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

  // --- Interactive Bosphorus Map with Timeline ---
  function initInteractiveMap() {
    const mapContainer = document.querySelector('.interactive-map-container');
    if (!mapContainer) return;

    const infoPanel = document.getElementById('mapInfoPanel');
    if (!infoPanel) return;

    const infoTitle = infoPanel.querySelector('.info-title');
    const infoDesc = infoPanel.querySelector('.info-desc');
    const infoStats = infoPanel.querySelector('.info-stats');
    const closeBtn = infoPanel.querySelector('.info-close');
    const yearSelect = document.getElementById('yearSelect');
    const yearBadge = document.getElementById('mapYearBadge');

    // Data for piers with opening years - Genişletilmiş iskele bilgileri
    const pierData = {
      // Avrupa Yakası
      bebek: {
        title: 'Bebek İskelesi',
        desc: 'Boğaz\'ın en şık semtlerinden birinde yer alan iskele. Yalıları ve mesireleriyle tanınır.',
        year: 1856,
        stats: [
          { value: '1856', label: 'Kuruluş' },
          { value: '6+', label: 'Günlük Sefer' }
        ]
      },
      arnavutkoy: {
        title: 'Arnavutköy İskelesi',
        desc: 'Ahşap evleri ve balıkçı barınaklarıyla ünlü tarihi semt.',
        year: 1860,
        stats: [
          { value: '1860', label: 'Kuruluş' },
          { value: '5+', label: 'Günlük Sefer' }
        ]
      },
      ortakoy: {
        title: 'Ortaköy İskelesi',
        desc: 'Boğaz\'ın en güzel manzaralı iskelelerinden biri. Camii ve çarşısıyla ünlü.',
        year: 1856,
        stats: [
          { value: '1856', label: 'Kuruluş' },
          { value: '8+', label: 'Günlük Sefer' }
        ]
      },
      besiktas: {
        title: 'Beşiktaş İskelesi',
        desc: 'Boğaz\'ın en işlek iskelelerinden biri. Şirket-i Hayriye döneminde ana hatların başlangıç noktası.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '12+', label: 'Günlük Sefer' }
        ]
      },
      kabatas: {
        title: 'Kabataş İskelesi',
        desc: 'Dolmabahçe Sarayı yakınında konumlanan stratejik iskele. Saray görevlilerinin ve halkın buluşma noktası.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '10+', label: 'Günlük Sefer' }
        ]
      },
      karakoy: {
        title: 'Karaköy İskelesi',
        desc: 'Galata Köprüsü\'nün yanında, ticaret merkezi. Levanten tüccarların uğrak noktası.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '15+', label: 'Günlük Sefer' }
        ]
      },
      eminonu: {
        title: 'Eminönü İskelesi',
        desc: 'İstanbul\'un kalbi. Suhulet arabalı vapurunun ana kalkış noktası. Ticaretin ve ulaşımın merkezi.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '20+', label: 'Günlük Sefer' }
        ]
      },
      sirkeci: {
        title: 'Sirkeci İskelesi',
        desc: 'Tren garına yakınlığıyla önemli bir kavşak noktası. Avrupa ile bağlantıyı sağlayan iskele.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '14+', label: 'Günlük Sefer' }
        ]
      },
      // Anadolu Yakası
      beykoz: {
        title: 'Beykoz İskelesi',
        desc: 'Boğaz\'ın kuzeydoğusunda, deri ve cam sanayisinin merkezi. Osmanlı\'nın ilk modern fabrikalarına ev sahipliği yaptı.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '6+', label: 'Günlük Sefer' }
        ]
      },
      pasabahce: {
        title: 'Paşabahçe İskelesi',
        desc: 'Cam fabrikasıyla ünlü sanayi bölgesi. İşçi taşımacılığı için önemli.',
        year: 1866,
        stats: [
          { value: '1866', label: 'Kuruluş' },
          { value: '4+', label: 'Günlük Sefer' }
        ]
      },
      anadoluhisari: {
        title: 'Anadolu Hisarı İskelesi',
        desc: 'Tarihi kale ve Göksu Deresi\'nin mansabında. Boğaz\'ın en dar noktasına yakın.',
        year: 1858,
        stats: [
          { value: '1858', label: 'Kuruluş' },
          { value: '5+', label: 'Günlük Sefer' }
        ]
      },
      kandilli: {
        title: 'Kandilli İskelesi',
        desc: 'Rasathane ile ünlü sakin bir semt. Boğaz\'ın tam da en dar noktasında konumlu.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '8+', label: 'Günlük Sefer' }
        ]
      },
      beylerbeyi: {
        title: 'Beylerbeyi İskelesi',
        desc: 'Beylerbeyi Sarayı\'nın hemen önünde. Padişah ve saray erkânının kullandığı iskele.',
        year: 1860,
        stats: [
          { value: '1860', label: 'Kuruluş' },
          { value: '6+', label: 'Günlük Sefer' }
        ]
      },
      uskudar: {
        title: 'Üsküdar İskelesi',
        desc: 'Anadolu yakasının tarihi kapısı. Şirket-i Hayriye\'nin en işlek iskelelerinden biri.',
        year: 1854,
        stats: [
          { value: '1854', label: 'Kuruluş' },
          { value: '18+', label: 'Günlük Sefer' }
        ]
      },
      salacak: {
        title: 'Salacak İskelesi',
        desc: 'Kız Kulesi\'nin karşısında, küçük ama manzaralı iskele.',
        year: 1866,
        stats: [
          { value: '1866', label: 'Kuruluş' },
          { value: '4+', label: 'Günlük Sefer' }
        ]
      },
      haydarpasa: {
        title: 'Haydarpaşa İskelesi',
        desc: 'Demiryolu bağlantısıyla önem kazanan iskele. Suhulet\'in araba ve yük taşımacılığı için kritik nokta.',
        year: 1872,
        stats: [
          { value: '1872', label: 'Kuruluş' },
          { value: '10+', label: 'Günlük Sefer' }
        ]
      },
      kadikoy: {
        title: 'Kadıköy İskelesi',
        desc: 'Anadolu yakasının ticaret merkezi. Şirket-i Hayriye\'nin en kârlı hatlarından birinin uç noktası.',
        year: 1858,
        stats: [
          { value: '1858', label: 'Kuruluş' },
          { value: '14+', label: 'Günlük Sefer' }
        ]
      }
    };

    // Fleet data by year
    const fleetByYear = {
      1854: { ships: 6, piers: 8, routes: 2 },
      1866: { ships: 16, piers: 9, routes: 3 },
      1872: { ships: 26, piers: 10, routes: 4 },
      1880: { ships: 32, piers: 10, routes: 4 },
      1890: { ships: 40, piers: 10, routes: 4 },
      1894: { ships: 46, piers: 10, routes: 4 }
    };

    // Data for ships
    const shipData = {
      'paddle-steamer': {
        title: 'Çarklı Yolcu Vapuru',
        desc: 'Dönemin standart yolcu vapuru. Yan çarklarla hareket eder. Yaklaşık 200-400 yolcu kapasiteli.',
        stats: [
          { value: '200-400', label: 'Yolcu' },
          { value: '10-12', label: 'Knot Hız' }
        ]
      },
      suhulet: {
        title: 'Suhulet — Dünyanın İlk Arabalı Vapuru',
        desc: '1871\'de Hüseyin Haki Efendi\'nin tasarımıyla inşa edildi. İki ucu açık rampalı tasarımıyla arabaları doğrudan gemiye alabiliyordu. Dünya denizcilik tarihinde bir ilk!',
        stats: [
          { value: '1871', label: 'İnşa Yılı' },
          { value: '555', label: 'Gros Ton' },
          { value: '12', label: 'Araba Kapasitesi' }
        ]
      },
      'small-ferry': {
        title: 'Küçük Yolcu Vapuru',
        desc: 'Kısa mesafe hatları için kullanılan kompakt vapurlar. Daha sık sefer imkanı sağlar.',
        stats: [
          { value: '100-150', label: 'Yolcu' },
          { value: '8-10', label: 'Knot Hız' }
        ]
      }
    };

    // Update map based on selected year
    function updateMapByYear(year) {
      const selectedYear = parseInt(year, 10);

      // Update year badge
      if (yearBadge) {
        yearBadge.textContent = selectedYear;
      }

      // Update piers visibility
      document.querySelectorAll('.pier[data-year]').forEach(pier => {
        const pierYear = parseInt(pier.getAttribute('data-year'), 10);
        if (pierYear <= selectedYear) {
          pier.classList.remove('hidden');
        } else {
          pier.classList.add('hidden');
        }
      });

      // Update routes visibility
      document.querySelectorAll('.ferry-route-line[data-year]').forEach(route => {
        const routeYear = parseInt(route.getAttribute('data-year'), 10);
        if (routeYear <= selectedYear) {
          route.classList.remove('hidden');
        } else {
          route.classList.add('hidden');
        }
      });

      // Update fleet stats
      const stats = fleetByYear[selectedYear] || fleetByYear[1872];
      const shipsStat = document.querySelector('#fleetStatShips .stat-value');
      const piersStat = document.querySelector('#fleetStatPiers .stat-value');
      const routesStat = document.querySelector('#fleetStatRoutes .stat-value');

      if (shipsStat) shipsStat.textContent = stats.ships;
      if (piersStat) piersStat.textContent = stats.piers;
      if (routesStat) routesStat.textContent = stats.routes;
    }

    // Initialize timeline selector (hidden select for compatibility)
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        updateMapByYear(e.target.value);
      });
      // Set initial state
      updateMapByYear(yearSelect.value);
    }

    // Initialize maritime slider markers
    const sliderMarkers = document.querySelectorAll('.slider-marker');
    const sliderShip = document.getElementById('sliderShip');

    if (sliderMarkers.length > 0) {
      // Year positions for ship indicator (percentage based)
      const yearPositions = {
        1854: 8.33,
        1866: 25,
        1872: 41.66,
        1880: 58.33,
        1890: 75,
        1894: 91.66
      };

      function updateSliderShip(year) {
        if (sliderShip) {
          const position = yearPositions[year] || 41.66;
          sliderShip.style.left = `calc(${position}% + 12px)`;
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

          // Update ship position
          updateSliderShip(parseInt(year, 10));

          // Update map
          updateMapByYear(year);
        });
      });

      // Set initial ship position
      updateSliderShip(1872);
    }

    // Show info panel
    function showInfo(data) {
      infoTitle.textContent = data.title;
      infoDesc.textContent = data.desc;

      infoStats.innerHTML = data.stats.map(stat => `
        <div class="info-stat">
          <div class="info-stat-value">${stat.value}</div>
          <div class="info-stat-label">${stat.label}</div>
        </div>
      `).join('');

      infoPanel.classList.add('visible');
    }

    // Hide info panel
    function hideInfo() {
      infoPanel.classList.remove('visible');
      // Remove active states
      document.querySelectorAll('.pier.active, .map-ship.active').forEach(el => {
        el.classList.remove('active');
      });
    }

    // Pier click handlers
    document.querySelectorAll('.pier').forEach(pier => {
      pier.addEventListener('click', (e) => {
        e.stopPropagation();
        const pierId = pier.getAttribute('data-pier');
        if (pierData[pierId]) {
          // Remove previous active
          document.querySelectorAll('.pier.active').forEach(p => p.classList.remove('active'));
          pier.classList.add('active');
          showInfo(pierData[pierId]);
        }
      });

      // Keyboard accessibility
      pier.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pier.click();
        }
      });
    });

    // Ship click handlers
    document.querySelectorAll('.map-ship').forEach(ship => {
      ship.addEventListener('click', (e) => {
        e.stopPropagation();
        const shipId = ship.getAttribute('data-ship');
        if (shipData[shipId]) {
          document.querySelectorAll('.map-ship.active').forEach(s => s.classList.remove('active'));
          ship.classList.add('active');
          showInfo(shipData[shipId]);
        }
      });

      ship.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ship.click();
        }
      });
    });

    // Close button
    closeBtn.addEventListener('click', hideInfo);

    // Click outside to close
    mapContainer.addEventListener('click', (e) => {
      if (!e.target.closest('.pier') && !e.target.closest('.map-ship') && !e.target.closest('.map-info-panel')) {
        hideInfo();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideInfo();
      }
    });

    // Create animated ships on routes
    function createAnimatedShips(selectedYear) {
      const shipsGroup = document.getElementById('shipsGroup');
      if (!shipsGroup) return;

      // Clear existing ships
      shipsGroup.innerHTML = '';

      // Route definitions with ship configurations
      const routeShips = [
        {
          route: 'bebek-beykoz',
          path: 'M172,145 Q400,115 650,90',
          year: 1856,
          ships: [
            { direction: 'forward', delay: 0, duration: 15 },
            { direction: 'reverse', delay: 7, duration: 14 }
          ]
        },
        {
          route: 'ortakoy-kandilli',
          path: 'M185,220 Q400,200 635,230',
          year: 1856,
          ships: [
            { direction: 'forward', delay: 2, duration: 12 },
            { direction: 'reverse', delay: 8, duration: 13 }
          ]
        },
        {
          route: 'besiktas-uskudar',
          path: 'M188,275 Q400,285 640,350',
          year: 1854,
          ships: [
            { direction: 'forward', delay: 0, duration: 11 },
            { direction: 'reverse', delay: 5, duration: 12 }
          ]
        },
        {
          route: 'kabatas-uskudar',
          path: 'M192,340 Q400,330 640,350',
          year: 1854,
          ships: [
            { direction: 'forward', delay: 3, duration: 10 },
            { direction: 'reverse', delay: 8, duration: 11 }
          ]
        },
        {
          route: 'eminonu-haydarpasa',
          path: 'M195,450 Q420,430 655,450',
          year: 1872,
          isSuhulet: true,
          ships: [
            { direction: 'forward', delay: 0, duration: 14 },
            { direction: 'reverse', delay: 7, duration: 14 }
          ]
        },
        {
          route: 'sirkeci-kadikoy',
          path: 'M198,500 Q420,495 648,510',
          year: 1858,
          ships: [
            { direction: 'forward', delay: 4, duration: 12 },
            { direction: 'reverse', delay: 10, duration: 11 }
          ]
        },
        {
          route: 'karakoy-uskudar',
          path: 'M190,400 Q400,380 640,350',
          year: 1860,
          ships: [
            { direction: 'forward', delay: 1, duration: 13 }
          ]
        }
      ];

      routeShips.forEach(route => {
        // Only show ships for routes that exist in selected year
        if (route.year > selectedYear) return;

        route.ships.forEach((shipConfig, index) => {
          const shipGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          shipGroup.classList.add('route-ship-group');
          shipGroup.setAttribute('data-direction', shipConfig.direction);
          shipGroup.style.setProperty('--ship-duration', `${shipConfig.duration}s`);
          shipGroup.style.animationDelay = `${shipConfig.delay}s`;
          shipGroup.style.offsetPath = `path("${route.path}")`;

          // Create ship SVG based on type
          const shipSvg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          shipSvg.classList.add('route-ship');

          if (route.isSuhulet) {
            // Arabalı vapur (Suhulet) ikonu
            shipSvg.classList.add('ship-suhulet');
            shipSvg.innerHTML = `
              <path d="M-12,4 L-10,7 L10,7 L12,4 L8,4 L7,6 L-7,6 L-8,4 Z"/>
              <rect x="-9" y="0" width="18" height="5" rx="0.5"/>
              <rect x="-3" y="-3" width="6" height="4" rx="0.5"/>
              <rect x="-1" y="-6" width="2" height="4"/>
            `;
          } else {
            // Yolcu vapuru (çarklı) ikonu
            shipSvg.innerHTML = `
              <path d="M-10,4 Q-12,2 -9,1 L-6,1 L-6,4 L6,4 L6,1 L9,1 Q12,2 10,4 L10,6 L-10,6 Z"/>
              <ellipse cx="-6" cy="2.5" rx="2" ry="2"/>
              <ellipse cx="6" cy="2.5" rx="2" ry="2"/>
              <rect x="-4" y="-1" width="8" height="3" rx="0.5"/>
              <rect x="-2" y="-4" width="4" height="4" rx="0.5"/>
              <rect x="-0.5" y="-6" width="1" height="3"/>
            `;
          }

          // Flip ship for reverse direction
          if (shipConfig.direction === 'reverse') {
            shipSvg.setAttribute('transform', 'scale(-1, 1)');
          }

          shipGroup.appendChild(shipSvg);
          shipsGroup.appendChild(shipGroup);
        });
      });
    }

    // Initialize ships
    createAnimatedShips(parseInt(yearSelect?.value || 1872, 10));

    // Update ships when year changes
    const originalUpdateMapByYear = updateMapByYear;
    updateMapByYear = function(year) {
      originalUpdateMapByYear(year);
      createAnimatedShips(parseInt(year, 10));
    };

    // Route card interaction
    document.querySelectorAll('.route-card').forEach(card => {
      card.addEventListener('click', () => {
        const routeType = card.getAttribute('data-route-card');
        if (routeType === 'suhulet') {
          const suhuletShip = document.querySelector('.ship-suhulet');
          if (suhuletShip) {
            suhuletShip.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              suhuletShip.click();
            }, 500);
          }
        }
      });
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
    initInteractiveMap();
  });
})();
