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

  // --- Parallax Lite (Hero only) ---
  function initParallax() {
    const hero = document.querySelector('.hero');
    const ship = document.querySelector('.hero-ship');
    if (!hero || !ship) return;

    // Only on desktop
    if (window.innerWidth < 768) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroH = hero.offsetHeight;
          if (scrolled < heroH) {
            const ratio = scrolled / heroH;
            ship.style.transform = `translateX(${ratio * -40}px) translateY(${ratio * -10}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Interactive Bosphorus Map ---
  function initInteractiveMap() {
    const mapContainer = document.querySelector('.interactive-map-container');
    if (!mapContainer) return;

    const infoPanel = document.getElementById('mapInfoPanel');
    const infoTitle = infoPanel.querySelector('.info-title');
    const infoDesc = infoPanel.querySelector('.info-desc');
    const infoStats = infoPanel.querySelector('.info-stats');
    const closeBtn = infoPanel.querySelector('.info-close');

    // Data for piers
    const pierData = {
      besiktas: {
        title: 'Beşiktaş İskelesi',
        desc: 'Boğaz\'ın en işlek iskelelerinden biri. Şirket-i Hayriye döneminde ana hatların başlangıç noktası.',
        stats: [
          { value: '1850', label: 'Kuruluş' },
          { value: '12+', label: 'Günlük Sefer' }
        ]
      },
      kabatas: {
        title: 'Kabataş İskelesi',
        desc: 'Dolmabahçe Sarayı yakınında konumlanan stratejik iskele. Saray görevlilerinin ve halkın buluşma noktası.',
        stats: [
          { value: '1851', label: 'Kuruluş' },
          { value: '8+', label: 'Günlük Sefer' }
        ]
      },
      eminonu: {
        title: 'Eminönü İskelesi',
        desc: 'İstanbul\'un kalbi. Suhulet arabalı vapurunun ana kalkış noktası. Ticaretin ve ulaşımın merkezi.',
        stats: [
          { value: '1844', label: 'Kuruluş' },
          { value: '20+', label: 'Günlük Sefer' }
        ]
      },
      uskudar: {
        title: 'Üsküdar İskelesi',
        desc: 'Anadolu yakasının tarihi kapısı. Suhulet hattının varış noktası. Haki Efendi döneminde modernize edildi.',
        stats: [
          { value: '1844', label: 'Kuruluş' },
          { value: '15+', label: 'Günlük Sefer' }
        ]
      },
      kadikoy: {
        title: 'Kadıköy İskelesi',
        desc: 'Anadolu yakasının ticaret merkezi. Şirket-i Hayriye\'nin en kârlı hatlarından birinin uç noktası.',
        stats: [
          { value: '1858', label: 'Kuruluş' },
          { value: '10+', label: 'Günlük Sefer' }
        ]
      },
      haydarpasa: {
        title: 'Haydarpaşa İskelesi',
        desc: 'Demiryolu bağlantısıyla önem kazanan iskele. Suhulet\'in araba ve yük taşımacılığı için kritik nokta.',
        stats: [
          { value: '1872', label: 'Kuruluş' },
          { value: '6+', label: 'Günlük Sefer' }
        ]
      }
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
    initParallax();
    initInteractiveMap();
  });
})();
