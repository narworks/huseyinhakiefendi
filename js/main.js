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

  // --- Interactive Leaflet Bosphorus Map ---
  function initInteractiveMap() {
    const mapContainer = document.getElementById('bosphorusMap');
    if (!mapContainer || typeof L === 'undefined') return;

    const yearSelect = document.getElementById('yearSelect');
    const yearBadge = document.getElementById('mapYearBadge');

    // Bosphorus center coordinates
    const bosphorusCenter = [41.085, 29.035];
    const defaultZoom = 12;

    // Initialize map
    const map = L.map('bosphorusMap', {
      center: bosphorusCenter,
      zoom: defaultZoom,
      minZoom: 11,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Use CartoDB Positron for a clean, minimal look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Pier data with coordinates - European Side (west)
    const piersEurope = [
      { id: 'sariyer', name: 'Sarıyer', lat: 41.1672, lng: 29.0497, year: 1851, major: false },
      { id: 'yenikoy', name: 'Yeniköy', lat: 41.1339, lng: 29.0583, year: 1851, major: false },
      { id: 'emirgan', name: 'Emirgân', lat: 41.1075, lng: 29.0544, year: 1851, major: false },
      { id: 'bebek', name: 'Bebek', lat: 41.0767, lng: 29.0433, year: 1851, major: false },
      { id: 'arnavutkoy', name: 'Arnavutköy', lat: 41.0683, lng: 29.0344, year: 1851, major: false },
      { id: 'ortakoy', name: 'Ortaköy', lat: 41.0472, lng: 29.0269, year: 1851, major: false },
      { id: 'besiktas', name: 'Beşiktaş', lat: 41.0422, lng: 29.0064, year: 1851, major: true },
      { id: 'kabatas', name: 'Kabataş', lat: 41.0333, lng: 29.0239, year: 1851, major: true },
      { id: 'karakoy', name: 'Karaköy', lat: 41.0217, lng: 28.9753, year: 1851, major: false },
      { id: 'eminonu', name: 'Eminönü', lat: 41.0175, lng: 28.9714, year: 1851, major: true }
    ];

    // Pier data - Asian Side (east)
    const piersAsia = [
      { id: 'beykoz', name: 'Beykoz', lat: 41.1317, lng: 29.0986, year: 1851, major: false },
      { id: 'pasabahce', name: 'Paşabahçe', lat: 41.1083, lng: 29.0897, year: 1866, major: false },
      { id: 'cubuklu', name: 'Çubuklu', lat: 41.0953, lng: 29.0711, year: 1851, major: false },
      { id: 'kanlica', name: 'Kanlıca', lat: 41.0833, lng: 29.0583, year: 1851, major: false },
      { id: 'anadoluhisari', name: 'A. Hisarı', lat: 41.0811, lng: 29.0650, year: 1851, major: false },
      { id: 'kandilli', name: 'Kandilli', lat: 41.0697, lng: 29.0589, year: 1851, major: false },
      { id: 'beylerbeyi', name: 'Beylerbeyi', lat: 41.0439, lng: 29.0378, year: 1851, major: false },
      { id: 'uskudar', name: 'Üsküdar', lat: 41.0261, lng: 29.0158, year: 1851, major: true },
      { id: 'haydarpasa', name: 'Haydarpaşa', lat: 40.9972, lng: 29.0186, year: 1872, major: true },
      { id: 'kadikoy', name: 'Kadıköy', lat: 40.9911, lng: 29.0236, year: 1851, major: true }
    ];

    const allPiers = [...piersEurope, ...piersAsia];

    // Pier descriptions
    const pierDescriptions = {
      sariyer: 'Boğaz\'ın kuzeyinde, yazlık konak bölgesi.',
      yenikoy: 'Varlıklı ailelerin tercih ettiği sakin semt.',
      emirgan: 'Cami önünde ahşap olarak yapılan tarihi iskele.',
      bebek: 'Boğaz\'ın en şık semti.',
      arnavutkoy: 'Ahşap evleri ve balıkçı barınaklarıyla ünlü.',
      ortakoy: 'Boğaz\'ın en güzel manzarası.',
      besiktas: 'Şirket-i Hayriye\'nin ana merkezi.',
      kabatas: 'Dolmabahçe Sarayı yakınında stratejik iskele.',
      karakoy: 'Galata Köprüsü yanında, ticaret merkezi.',
      eminonu: 'İstanbul\'un kalbi. Ticaretin merkezi.',
      beykoz: '"Hünkar İskelesi" adıyla yapıldı.',
      pasabahce: 'Cam fabrikasıyla ünlü sanayi bölgesi.',
      cubuklu: 'Boğazın sembolü olarak nitelendirilen iskele.',
      kanlica: 'Ünlü yoğurt bölgesinde hizmet veren iskele.',
      anadoluhisari: 'Boğaz\'ın en dar noktası.',
      kandilli: 'Rasathane ile ünlü sakin semt.',
      beylerbeyi: 'Beylerbeyi Sarayı\'nın hemen önünde.',
      uskudar: 'Anadolu yakasının tarihi kapısı.',
      haydarpasa: 'Suhulet için kritik iskele.',
      kadikoy: 'Fevaid-i Osmaniye tarafından kuruldu.'
    };

    // Ferry routes data
    const routesData = [
      {
        id: 'eminonu-kadikoy',
        name: 'Eminönü - Kadıköy',
        year: 1851,
        coords: [[41.0175, 28.9714], [41.005, 29.000], [40.9911, 29.0236]],
        color: '#0d1b2a',
        isSuhulet: false
      },
      {
        id: 'kabatas-uskudar',
        name: 'Kabataş - Üsküdar',
        year: 1851,
        coords: [[41.0333, 29.0239], [41.030, 29.020], [41.0261, 29.0158]],
        color: '#0d1b2a',
        isSuhulet: false
      },
      {
        id: 'besiktas-beylerbeyi',
        name: 'Beşiktaş - Beylerbeyi',
        year: 1851,
        coords: [[41.0422, 29.0064], [41.043, 29.022], [41.0439, 29.0378]],
        color: '#0d1b2a',
        isSuhulet: false
      },
      {
        id: 'suhulet',
        name: 'Suhulet Hattı (Arabalı Vapur)',
        year: 1872,
        coords: [[41.0333, 29.0239], [41.028, 29.018], [41.0261, 29.0158]],
        color: '#8b2030',
        isSuhulet: true
      }
    ];

    // Store references
    const pierMarkers = [];
    const routeLines = [];

    // Create custom pier label icon
    function createPierIcon(pier) {
      const size = pier.major ? 'major' : 'normal';
      return L.divIcon({
        className: `pier-label-icon ${size}`,
        html: `<span class="pier-name">${pier.name}</span>`,
        iconSize: null,
        iconAnchor: [0, 0]
      });
    }

    // Add pier markers
    allPiers.forEach(pier => {
      const marker = L.marker([pier.lat, pier.lng], {
        icon: createPierIcon(pier)
      });

      // Popup content
      const popupContent = `
        <div class="pier-popup-content">
          <h4>${pier.name} İskelesi</h4>
          <p>${pierDescriptions[pier.id] || ''}</p>
          <span class="pier-year">Kuruluş: ${pier.year}</span>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'pier-popup',
        maxWidth: 250
      });

      marker.pierData = pier;
      pierMarkers.push(marker);
    });

    // Add route polylines
    routesData.forEach(route => {
      const polyline = L.polyline(route.coords, {
        color: route.color,
        weight: route.isSuhulet ? 4 : 3,
        opacity: route.isSuhulet ? 0.9 : 0.7,
        dashArray: route.isSuhulet ? '10, 6' : '8, 5',
        lineCap: 'round'
      });

      // Route tooltip
      polyline.bindTooltip(route.name, {
        permanent: false,
        direction: 'center',
        className: 'route-tooltip'
      });

      polyline.routeData = route;
      routeLines.push(polyline);
    });

    // Fleet data by year
    const fleetByYear = {
      1854: { ships: 6, piers: 12, routes: 2 },
      1866: { ships: 16, piers: 15, routes: 3 },
      1872: { ships: 26, piers: 18, routes: 4 },
      1880: { ships: 32, piers: 19, routes: 4 },
      1890: { ships: 40, piers: 20, routes: 4 },
      1894: { ships: 46, piers: 20, routes: 4 }
    };

    const yearMapping = {
      1854: 1851,
      1866: 1866,
      1872: 1872,
      1880: 1880,
      1890: 1890,
      1894: 1894
    };

    // Update map based on selected year
    function updateMapByYear(year) {
      const selectedYear = parseInt(year, 10);
      const visibilityYear = yearMapping[selectedYear] || selectedYear;

      // Update year badge
      if (yearBadge) {
        yearBadge.textContent = selectedYear;
      }

      // Update pier visibility
      pierMarkers.forEach(marker => {
        const pierYear = marker.pierData.year;
        if (pierYear <= visibilityYear) {
          if (!map.hasLayer(marker)) {
            marker.addTo(map);
          }
        } else {
          if (map.hasLayer(marker)) {
            map.removeLayer(marker);
          }
        }
      });

      // Update route visibility
      routeLines.forEach(line => {
        const routeYear = line.routeData.year;
        if (routeYear <= visibilityYear) {
          if (!map.hasLayer(line)) {
            line.addTo(map);
          }
        } else {
          if (map.hasLayer(line)) {
            map.removeLayer(line);
          }
        }
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

          // Update Leaflet map
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
