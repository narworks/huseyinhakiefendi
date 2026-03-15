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

  // --- Video Gallery - Fullscreen Video Experience ---
  function initVideoGallery() {
    // Video configuration - actual videos
    const GALLERY_VIDEOS = [
      {
        id: 'video-1',
        title: 'Boğaz\'da Yolculuk',
        subtitle: 'İstanbul Boğazı\'nın Eşsiz Güzelliği',
        youtubeId: 'Pl1sG6AontQ'
      },
      {
        id: 'video-2',
        title: 'Şirket-i Hayriye',
        subtitle: 'Osmanlı Denizcilik Mirası',
        youtubeId: 'f1tcRcxX_5c'
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
      skipVisible: false,
      videoDuration: 0
    };

    // YouTube Player instance
    let player = null;
    let progressInterval = null;
    let skipTimeout = null;
    let mouseTimer = null;

    // DOM Elements
    const gallery = document.getElementById('videoGallery');
    if (!gallery) return;

    const welcomeScreen = gallery.querySelector('.video-welcome');
    const startBtn = gallery.querySelector('.welcome-start-btn');
    const iframeWrapper = gallery.querySelector('.video-iframe-wrapper');
    const videoOverlay = gallery.querySelector('.video-overlay');
    const videoControls = gallery.querySelector('.video-controls');
    const muteBtn = gallery.querySelector('.mute-btn');
    const closeBtn = gallery.querySelector('.close-btn');
    const skipBtn = gallery.querySelector('.skip-btn');
    const progressBar = gallery.querySelector('.progress-bar');
    const progressDots = gallery.querySelectorAll('.progress-dot');
    const titleOverlay = gallery.querySelector('.video-title-overlay');
    const currentTitle = gallery.querySelector('.video-current-title');
    const currentSubtitle = gallery.querySelector('.video-current-subtitle');
    const loadingSpinner = gallery.querySelector('.video-loading');

    // URL params for skipping gallery
    const urlParams = new URLSearchParams(window.location.search);
    const skipVideo = urlParams.has('skip') || urlParams.has('novideo');

    // Skip gallery if URL param present
    if (skipVideo) {
      closeGallery(true);
      return;
    }

    // Load YouTube IFrame API
    loadYouTubeAPI();

    // Show gallery on load
    gallery.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update progress dots count based on video count
    updateProgressDotsCount();

    function loadYouTubeAPI() {
      if (window.YT && window.YT.Player) {
        return; // Already loaded
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function updateProgressDotsCount() {
      const dotsContainer = gallery.querySelector('.progress-dots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        GALLERY_VIDEOS.forEach((_, i) => {
          const dot = document.createElement('span');
          dot.className = 'progress-dot';
          dotsContainer.appendChild(dot);
        });
      }
    }

    // Start button click - User gesture for autoplay with sound
    startBtn.addEventListener('click', () => {
      state.hasStarted = true;
      welcomeScreen.classList.add('hidden');
      if (loadingSpinner) loadingSpinner.style.display = 'block';

      // Wait for YouTube API to be ready
      if (window.YT && window.YT.Player) {
        startVideo(0);
      } else {
        window.onYouTubeIframeAPIReady = () => {
          startVideo(0);
        };
      }
    });

    // Close button
    closeBtn.addEventListener('click', () => {
      closeGallery();
    });

    // Mute button
    muteBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      updateMuteIcon();
      if (player) {
        if (state.isMuted) {
          player.mute();
        } else {
          player.unMute();
        }
      }
    });

    // Skip button
    skipBtn.addEventListener('click', () => {
      nextVideo();
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
      } else if (e.key === 'm' || e.key === 'M') {
        state.isMuted = !state.isMuted;
        updateMuteIcon();
        if (player) {
          state.isMuted ? player.mute() : player.unMute();
        }
      }
    });

    function startVideo(index) {
      state.currentIndex = index;
      state.isPlaying = true;
      loadVideo(index);
      showVideoTitle();

      // Show skip button after 3 seconds
      clearTimeout(skipTimeout);
      skipTimeout = setTimeout(() => {
        state.skipVisible = true;
        skipBtn.classList.add('visible');
      }, 3000);
    }

    function loadVideo(index) {
      const video = GALLERY_VIDEOS[index];
      if (!video) return;

      // Update title
      if (currentTitle) currentTitle.textContent = video.title;
      if (currentSubtitle) currentSubtitle.textContent = video.subtitle;

      // Update progress dots
      updateProgressDots();

      // Create player container if needed
      let playerDiv = iframeWrapper.querySelector('#ytPlayer');
      if (!playerDiv) {
        playerDiv = document.createElement('div');
        playerDiv.id = 'ytPlayer';
        iframeWrapper.appendChild(playerDiv);
      }

      // Destroy existing player
      if (player) {
        player.destroy();
      }

      // Create new YouTube player
      player = new YT.Player('ytPlayer', {
        videoId: video.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          fs: 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    }

    function onPlayerReady(event) {
      // Hide loading
      if (loadingSpinner) loadingSpinner.style.display = 'none';

      // Get video duration
      state.videoDuration = player.getDuration();

      // Set mute state
      if (state.isMuted) {
        player.mute();
      } else {
        player.unMute();
      }

      // Start progress tracking
      startProgressTracking();
    }

    function onPlayerStateChange(event) {
      // YT.PlayerState.ENDED = 0
      if (event.data === 0) {
        nextVideo();
      }
      // YT.PlayerState.PLAYING = 1
      if (event.data === 1) {
        state.isPlaying = true;
        // Update duration if not set
        if (!state.videoDuration || state.videoDuration === 0) {
          state.videoDuration = player.getDuration();
        }
      }
      // YT.PlayerState.PAUSED = 2
      if (event.data === 2) {
        state.isPlaying = false;
      }
    }

    function startProgressTracking() {
      clearInterval(progressInterval);

      progressInterval = setInterval(() => {
        if (!player || !state.isPlaying) return;

        try {
          const currentTime = player.getCurrentTime();
          const duration = state.videoDuration || player.getDuration();

          if (duration > 0) {
            state.progress = Math.min((currentTime / duration) * 100, 100);
            if (progressBar) {
              progressBar.style.width = `${state.progress}%`;
            }
          }
        } catch (e) {
          // Player might not be ready
        }
      }, 100);
    }

    function nextVideo() {
      // Hide skip button
      state.skipVisible = false;
      skipBtn.classList.remove('visible');
      clearTimeout(skipTimeout);
      clearInterval(progressInterval);

      // Reset progress
      state.progress = 0;
      if (progressBar) progressBar.style.width = '0%';

      // Move to next video or close gallery
      if (state.currentIndex < GALLERY_VIDEOS.length - 1) {
        state.currentIndex++;
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        loadVideo(state.currentIndex);
        showVideoTitle();

        // Show skip button after 3 seconds
        skipTimeout = setTimeout(() => {
          state.skipVisible = true;
          skipBtn.classList.add('visible');
        }, 3000);
      } else {
        // Last video finished, close gallery
        closeGallery();
      }
    }

    function closeGallery(immediate = false) {
      state.isOpen = false;
      state.isPlaying = false;
      clearInterval(progressInterval);
      clearTimeout(skipTimeout);
      clearTimeout(mouseTimer);

      // Destroy player
      if (player) {
        try {
          player.destroy();
        } catch (e) {}
        player = null;
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

    function showVideoTitle() {
      if (titleOverlay) {
        titleOverlay.classList.add('visible');
        setTimeout(() => {
          titleOverlay.classList.remove('visible');
        }, 4000);
      }
    }

    function updateProgressDots() {
      const dots = gallery.querySelectorAll('.progress-dot');
      dots.forEach((dot, i) => {
        dot.classList.remove('active', 'completed');
        if (i === state.currentIndex) {
          dot.classList.add('active');
        } else if (i < state.currentIndex) {
          dot.classList.add('completed');
        }
      });
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
