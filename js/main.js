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

  // --- Interactive Bosphorus Map with Leaflet ---
  function initInteractiveMap() {
    const mapElement = document.getElementById('bosphorusMap');
    if (!mapElement) return;

    const yearSelect = document.getElementById('yearSelect');
    const yearBadge = document.getElementById('mapYearBadge');

    // Initialize Leaflet map centered on Bosphorus
    const map = L.map('bosphorusMap', {
      center: [41.085, 29.05],
      zoom: 12,
      minZoom: 11,
      maxZoom: 15,
      zoomControl: true,
      attributionControl: true
    });

    // Add CartoDB Positron tiles (vintage-friendly, free, no API key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Store markers and routes for year filtering
    const pierMarkers = {};
    const routeLines = {};

    // Data for piers with real coordinates (lat, lng)
    const pierData = {
      // Avrupa Yakası (Kuzeyden Güneye)
      bebek: {
        title: 'Bebek İskelesi',
        desc: 'Boğaz\'ın en şık semtlerinden birinde yer alan iskele. Yalıları ve mesireleriyle tanınır.',
        year: 1856,
        lat: 41.0775,
        lng: 29.0437,
        major: false
      },
      arnavutkoy: {
        title: 'Arnavutköy İskelesi',
        desc: 'Ahşap evleri ve balıkçı barınaklarıyla ünlü tarihi semt.',
        year: 1860,
        lat: 41.0680,
        lng: 29.0345,
        major: false
      },
      ortakoy: {
        title: 'Ortaköy İskelesi',
        desc: 'Boğaz\'ın en güzel manzaralı iskelelerinden biri. Camii ve çarşısıyla ünlü.',
        year: 1856,
        lat: 41.0475,
        lng: 29.0270,
        major: false
      },
      besiktas: {
        title: 'Beşiktaş İskelesi',
        desc: 'Boğaz\'ın en işlek iskelelerinden biri. Şirket-i Hayriye döneminde ana hatların başlangıç noktası.',
        year: 1854,
        lat: 41.0430,
        lng: 29.0050,
        major: true
      },
      kabatas: {
        title: 'Kabataş İskelesi',
        desc: 'Dolmabahçe Sarayı yakınında konumlanan stratejik iskele. Saray görevlilerinin ve halkın buluşma noktası.',
        year: 1854,
        lat: 41.0335,
        lng: 29.0245,
        major: true
      },
      karakoy: {
        title: 'Karaköy İskelesi',
        desc: 'Galata Köprüsü\'nün yanında, ticaret merkezi. Levanten tüccarların uğrak noktası.',
        year: 1854,
        lat: 41.0215,
        lng: 28.9750,
        major: false
      },
      eminonu: {
        title: 'Eminönü İskelesi',
        desc: 'İstanbul\'un kalbi. Suhulet arabalı vapurunun ana kalkış noktası. Ticaretin ve ulaşımın merkezi.',
        year: 1854,
        lat: 41.0175,
        lng: 28.9715,
        major: true
      },
      sirkeci: {
        title: 'Sirkeci İskelesi',
        desc: 'Tren garına yakınlığıyla önemli bir kavşak noktası. Avrupa ile bağlantıyı sağlayan iskele.',
        year: 1854,
        lat: 41.0130,
        lng: 28.9785,
        major: false
      },
      // Anadolu Yakası (Kuzeyden Güneye)
      beykoz: {
        title: 'Beykoz İskelesi',
        desc: 'Boğaz\'ın kuzeydoğusunda, deri ve cam sanayisinin merkezi.',
        year: 1854,
        lat: 41.1315,
        lng: 29.0945,
        major: false
      },
      pasabahce: {
        title: 'Paşabahçe İskelesi',
        desc: 'Cam fabrikasıyla ünlü sanayi bölgesi. İşçi taşımacılığı için önemli.',
        year: 1866,
        lat: 41.1095,
        lng: 29.0755,
        major: false
      },
      anadoluhisari: {
        title: 'Anadolu Hisarı İskelesi',
        desc: 'Tarihi kale ve Göksu Deresi\'nin mansabında. Boğaz\'ın en dar noktasına yakın.',
        year: 1858,
        lat: 41.0835,
        lng: 29.0660,
        major: false
      },
      kandilli: {
        title: 'Kandilli İskelesi',
        desc: 'Rasathane ile ünlü sakin bir semt. Boğaz\'ın tam da en dar noktasında konumlu.',
        year: 1854,
        lat: 41.0695,
        lng: 29.0575,
        major: false
      },
      beylerbeyi: {
        title: 'Beylerbeyi İskelesi',
        desc: 'Beylerbeyi Sarayı\'nın hemen önünde. Padişah ve saray erkânının kullandığı iskele.',
        year: 1860,
        lat: 41.0475,
        lng: 29.0380,
        major: false
      },
      uskudar: {
        title: 'Üsküdar İskelesi',
        desc: 'Anadolu yakasının tarihi kapısı. Şirket-i Hayriye\'nin en işlek iskelelerinden biri.',
        year: 1854,
        lat: 41.0260,
        lng: 29.0155,
        major: true
      },
      salacak: {
        title: 'Salacak İskelesi',
        desc: 'Kız Kulesi\'nin karşısında, küçük ama manzaralı iskele.',
        year: 1866,
        lat: 41.0205,
        lng: 29.0105,
        major: false
      },
      haydarpasa: {
        title: 'Haydarpaşa İskelesi',
        desc: 'Demiryolu bağlantısıyla önem kazanan iskele. Suhulet\'in araba ve yük taşımacılığı için kritik nokta.',
        year: 1872,
        lat: 40.9985,
        lng: 29.0170,
        major: true
      },
      kadikoy: {
        title: 'Kadıköy İskelesi',
        desc: 'Anadolu yakasının ticaret merkezi. Şirket-i Hayriye\'nin en kârlı hatlarından birinin uç noktası.',
        year: 1858,
        lat: 40.9915,
        lng: 29.0235,
        major: true
      }
    };

    // Ferry routes with real coordinates
    const routeData = [
      {
        id: 'bebek-beykoz',
        name: 'Bebek-Beykoz Hattı',
        year: 1856,
        coords: [[41.0775, 29.0437], [41.1315, 29.0945]],
        isSuhulet: false
      },
      {
        id: 'ortakoy-kandilli',
        name: 'Ortaköy-Kandilli Hattı',
        year: 1856,
        coords: [[41.0475, 29.0270], [41.0695, 29.0575]],
        isSuhulet: false
      },
      {
        id: 'besiktas-uskudar',
        name: 'Beşiktaş-Üsküdar Hattı',
        year: 1854,
        coords: [[41.0430, 29.0050], [41.0260, 29.0155]],
        isSuhulet: false
      },
      {
        id: 'kabatas-uskudar',
        name: 'Kabataş-Üsküdar Hattı',
        year: 1854,
        coords: [[41.0335, 29.0245], [41.0260, 29.0155]],
        isSuhulet: false
      },
      {
        id: 'eminonu-haydarpasa',
        name: 'Eminönü-Haydarpaşa Hattı (Suhulet)',
        year: 1872,
        coords: [[41.0175, 28.9715], [40.9985, 29.0170]],
        isSuhulet: true
      },
      {
        id: 'sirkeci-kadikoy',
        name: 'Sirkeci-Kadıköy Hattı',
        year: 1858,
        coords: [[41.0130, 28.9785], [40.9915, 29.0235]],
        isSuhulet: false
      },
      {
        id: 'karakoy-uskudar',
        name: 'Karaköy-Üsküdar Hattı',
        year: 1860,
        coords: [[41.0215, 28.9750], [41.0260, 29.0155]],
        isSuhulet: false
      }
    ];

    // Create custom pier icon
    function createPierIcon(major, hidden) {
      const size = major ? 18 : 14;
      const className = `pier-marker${major ? ' major' : ''}${hidden ? ' hidden' : ''}`;
      return L.divIcon({
        className: className,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    }

    // Add pier markers to map
    Object.entries(pierData).forEach(([id, pier]) => {
      const marker = L.marker([pier.lat, pier.lng], {
        icon: createPierIcon(pier.major, false)
      }).addTo(map);

      marker.bindTooltip(pier.title, {
        className: 'pier-tooltip',
        direction: 'top',
        offset: [0, -10]
      });

      marker.on('click', () => {
        L.popup()
          .setLatLng([pier.lat, pier.lng])
          .setContent(`
            <div style="text-align:center;">
              <strong style="color:var(--gold);font-size:1rem;">${pier.title}</strong>
              <p style="margin:8px 0;color:var(--cream);font-size:0.85rem;">${pier.desc}</p>
              <span style="color:var(--gold-light);font-size:0.75rem;">Kuruluş: ${pier.year}</span>
            </div>
          `)
          .openOn(map);
      });

      pierMarkers[id] = { marker, year: pier.year, major: pier.major };
    });

    // Add route lines to map
    routeData.forEach(route => {
      const polyline = L.polyline(route.coords, {
        color: route.isSuhulet ? '#6b1c23' : '#c9a84c',
        weight: route.isSuhulet ? 4 : 3,
        dashArray: '8, 5',
        opacity: 0.8
      }).addTo(map);

      polyline.bindTooltip(route.name, {
        className: 'pier-tooltip',
        sticky: true
      });

      routeLines[route.id] = { polyline, year: route.year, isSuhulet: route.isSuhulet };
    });

    // Fleet data by year
    const fleetByYear = {
      1854: { ships: 6, piers: 8, routes: 2 },
      1866: { ships: 16, piers: 9, routes: 3 },
      1872: { ships: 26, piers: 10, routes: 4 },
      1880: { ships: 32, piers: 10, routes: 4 },
      1890: { ships: 40, piers: 10, routes: 4 },
      1894: { ships: 46, piers: 10, routes: 4 }
    };

    // Update map based on selected year
    function updateMapByYear(year) {
      const selectedYear = parseInt(year, 10);

      // Update year badge
      if (yearBadge) {
        yearBadge.textContent = selectedYear;
      }

      // Update pier markers visibility
      Object.entries(pierMarkers).forEach(([id, data]) => {
        const isVisible = data.year <= selectedYear;
        const newIcon = createPierIcon(data.major, !isVisible);
        data.marker.setIcon(newIcon);
        if (isVisible) {
          data.marker.setOpacity(1);
        } else {
          data.marker.setOpacity(0.3);
        }
      });

      // Update route lines visibility
      Object.entries(routeLines).forEach(([id, data]) => {
        const isVisible = data.year <= selectedYear;
        data.polyline.setStyle({
          opacity: isVisible ? 0.8 : 0.15
        });
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
