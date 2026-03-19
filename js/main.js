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
        sliderShip.style.transform = 'translateX(calc(-50% + 15px)) translateY(calc(-50% - 35px))';
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

  // --- Video Gallery - Local Video Experience ---
  function initVideoGallery() {
    // Video configuration - local video files
    const GALLERY_VIDEOS = [
      {
        id: 'video-1',
        src: 'assets/videos/video-1.mp4',
        title: 'İstanbul Boğazı',
        subtitle: 'Tarihi Bir Yolculuk'
      },
      {
        id: 'video-2',
        src: 'assets/videos/video-2.mp4',
        title: 'Şirket-i Hayriye',
        subtitle: 'Osmanlı Denizcilik Mirası'
      }
    ];

    // State
    const state = {
      isOpen: true,
      hasStarted: false,
      currentIndex: 0,
      isPlaying: false,
      isMuted: false,
      progress: 0,
      controlsVisible: true,
      isPortrait: false
    };

    // Timers
    let progressInterval = null;
    let mouseTimer = null;

    // DOM Elements
    const gallery = document.getElementById('videoGallery');
    if (!gallery) return;

    const welcomeScreen = gallery.querySelector('.video-welcome');
    const soundBtn = gallery.querySelector('.welcome-sound-btn');
    const clickArea = gallery.querySelector('.welcome-click-area');
    const videoElement = document.getElementById('videoPlayer');
    const videoOverlay = gallery.querySelector('.video-overlay');
    const videoControls = gallery.querySelector('.video-controls');
    const muteBtn = gallery.querySelector('.mute-btn');
    const closeBtn = gallery.querySelector('.close-btn');
    const progressDotsContainer = gallery.querySelector('.progress-dots');
    const videoCounter = gallery.querySelector('.video-counter');
    const loadingSpinner = gallery.querySelector('.video-loading');

    // URL params for skipping gallery
    const urlParams = new URLSearchParams(window.location.search);
    const skipVideo = urlParams.has('skip') || urlParams.has('novideo');

    // Skip gallery if URL param present
    if (skipVideo) {
      closeGallery(true);
      return;
    }

    // Show gallery on load
    gallery.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Check orientation
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Build progress dots with ring animation
    buildProgressDots();

    // Update video counter
    updateVideoCounter();

    function checkOrientation() {
      state.isPortrait = window.innerHeight > window.innerWidth;
      // CSS handles object-fit via media query, but we track state for potential use
    }

    function buildProgressDots() {
      if (!progressDotsContainer) return;
      progressDotsContainer.innerHTML = '';

      // SVG circumference for ring (r=24, C = 2*PI*r ≈ 150.8)
      const circumference = 150.8;

      GALLERY_VIDEOS.forEach((_, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'progress-dot-wrapper';
        wrapper.dataset.index = i;

        // Ring SVG for active video
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'progress-ring');
        svg.setAttribute('viewBox', '0 0 56 56');
        svg.innerHTML = `
          <circle class="progress-ring-bg" cx="28" cy="28" r="24" />
          <circle class="progress-ring-fill" cx="28" cy="28" r="24"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${circumference}" />
        `;

        const dot = document.createElement('span');
        dot.className = 'progress-dot';

        wrapper.appendChild(svg);
        wrapper.appendChild(dot);
        progressDotsContainer.appendChild(wrapper);

        // Click to navigate
        wrapper.addEventListener('click', () => {
          if (state.hasStarted && i !== state.currentIndex) {
            goToVideo(i);
          }
        });
      });
    }

    function updateVideoCounter() {
      if (videoCounter) {
        videoCounter.textContent = `${state.currentIndex + 1}/${GALLERY_VIDEOS.length}`;
      }
    }

    function updateProgressRing(progress) {
      const circumference = 150.8;
      const wrappers = progressDotsContainer.querySelectorAll('.progress-dot-wrapper');

      wrappers.forEach((wrapper, i) => {
        const dot = wrapper.querySelector('.progress-dot');
        const ring = wrapper.querySelector('.progress-ring');
        const ringFill = wrapper.querySelector('.progress-ring-fill');

        dot.classList.remove('active', 'completed');
        ring.style.display = 'none';

        if (i === state.currentIndex) {
          dot.classList.add('active');
          ring.style.display = 'block';
          // Update ring progress
          const offset = circumference - (circumference * progress) / 100;
          ringFill.style.strokeDashoffset = offset;
        } else if (i < state.currentIndex) {
          dot.classList.add('completed');
        }
      });
    }

    // Sound button click - Start with sound
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.hasStarted = true;
      state.isMuted = false;
      startPlayback();
    });

    // Click area - Start muted (for mobile autoplay compliance)
    clickArea.addEventListener('click', () => {
      state.hasStarted = true;
      state.isMuted = true;
      startPlayback();
    });

    function startPlayback() {
      welcomeScreen.classList.add('hidden');
      if (loadingSpinner) loadingSpinner.style.display = 'block';
      loadVideo(0);
    }

    // Close button
    closeBtn.addEventListener('click', () => {
      closeGallery();
    });

    // Mute button
    muteBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      videoElement.muted = state.isMuted;
      updateMuteIcon();
    });

    // Mouse movement for controls visibility
    gallery.addEventListener('mousemove', () => {
      showControls();
      clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        if (state.isPlaying) {
          hideControls();
        }
      }, 3000);
    });

    // Touch support
    gallery.addEventListener('touchstart', () => {
      if (state.controlsVisible) {
        hideControls();
      } else {
        showControls();
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
          if (state.isPlaying) {
            hideControls();
          }
        }, 3000);
      }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!state.isOpen || !state.hasStarted) return;

      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextVideo();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevVideo();
      } else if (e.key === 'm' || e.key === 'M') {
        state.isMuted = !state.isMuted;
        videoElement.muted = state.isMuted;
        updateMuteIcon();
      }
    });

    function loadVideo(index) {
      const video = GALLERY_VIDEOS[index];
      if (!video) return;

      state.currentIndex = index;
      state.progress = 0;

      // Update counter
      updateVideoCounter();

      // Update progress dots
      updateProgressRing(0);

      // Set video source
      videoElement.src = video.src;
      videoElement.currentTime = 0;
      videoElement.muted = state.isMuted;

      // Mobile autoplay requires muted start
      videoElement.play().then(() => {
        state.isPlaying = true;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        startProgressTracking();
      }).catch((err) => {
        // Autoplay blocked - try muted
        console.log('Autoplay blocked, trying muted:', err);
        videoElement.muted = true;
        state.isMuted = true;
        updateMuteIcon();
        videoElement.play().then(() => {
          state.isPlaying = true;
          if (loadingSpinner) loadingSpinner.style.display = 'none';
          startProgressTracking();
        });
      });
    }

    // Video events
    videoElement.addEventListener('canplay', () => {
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    });

    videoElement.addEventListener('playing', () => {
      state.isPlaying = true;
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    });

    videoElement.addEventListener('ended', () => {
      nextVideo();
    });

    videoElement.addEventListener('waiting', () => {
      if (loadingSpinner) loadingSpinner.style.display = 'block';
    });

    function startProgressTracking() {
      clearInterval(progressInterval);

      progressInterval = setInterval(() => {
        if (!videoElement || videoElement.paused) return;

        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;

        if (duration > 0) {
          state.progress = Math.min((currentTime / duration) * 100, 100);
          updateProgressRing(state.progress);
        }
      }, 100);
    }

    function goToVideo(index) {
      clearInterval(progressInterval);
      state.progress = 0;

      if (index >= 0 && index < GALLERY_VIDEOS.length) {
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        loadVideo(index);
      }
    }

    function nextVideo() {
      clearInterval(progressInterval);
      state.progress = 0;

      if (state.currentIndex < GALLERY_VIDEOS.length - 1) {
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        loadVideo(state.currentIndex + 1);
      } else {
        // Last video finished, close gallery
        closeGallery();
      }
    }

    function prevVideo() {
      clearInterval(progressInterval);
      state.progress = 0;

      if (state.currentIndex > 0) {
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        loadVideo(state.currentIndex - 1);
      }
    }

    function closeGallery(immediate = false) {
      state.isOpen = false;
      state.isPlaying = false;
      clearInterval(progressInterval);
      clearTimeout(mouseTimer);

      // Stop video
      if (videoElement) {
        videoElement.pause();
        videoElement.src = '';
      }

      if (immediate) {
        gallery.classList.remove('active');
        gallery.style.display = 'none';
        document.body.style.overflow = '';
      } else {
        gallery.classList.add('closing');
        setTimeout(() => {
          gallery.classList.remove('active', 'closing');
          gallery.style.display = 'none';
          document.body.style.overflow = '';
        }, 500);
      }
    }

    function showControls() {
      state.controlsVisible = true;
      if (videoOverlay) videoOverlay.classList.remove('hidden');
      if (videoControls) videoControls.classList.remove('hidden');
    }

    function hideControls() {
      state.controlsVisible = false;
      if (videoOverlay) videoOverlay.classList.add('hidden');
      if (videoControls) videoControls.classList.add('hidden');
    }

    function updateMuteIcon() {
      const volumeOnIcon = muteBtn.querySelector('.icon-volume-on');
      const volumeOffIcon = muteBtn.querySelector('.icon-volume-off');

      if (state.isMuted) {
        if (volumeOnIcon) volumeOnIcon.style.display = 'none';
        if (volumeOffIcon) volumeOffIcon.style.display = 'block';
      } else {
        if (volumeOnIcon) volumeOnIcon.style.display = 'block';
        if (volumeOffIcon) volumeOffIcon.style.display = 'none';
      }
    }
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
    initVideoGallery();
  });
})();
