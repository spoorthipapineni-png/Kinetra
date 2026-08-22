/* ==========================================================================
   KINETRA - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR & MOBILE MENU TOGGLE ---
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 2. TOAST NOTIFICATION SYSTEM ---
  const toastEl = document.getElementById('toastNotification');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3500);
  }

  // Bind toast triggers
  document.querySelectorAll('.toast-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = el.getAttribute('data-msg') || 'Action completed successfully!';
      showToast(msg);
    });
  });

  // Download App Store & Google Play links
  document.querySelectorAll('.download-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const storeName = btn.getAttribute('data-store') || 'App Store';
      showToast(`Redirecting to Kinetra on ${storeName}...`);
    });
  });

  // --- 3. ANIMATED COUNTERS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      if (!target) return;

      let count = 0;
      const duration = 2000; // ms
      const increment = Math.ceil(target / (duration / 16));

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }

        if (target >= 1000) {
          stat.textContent = Math.floor(count / 1000) + 'K+';
        } else {
          stat.textContent = count + '+';
        }
      }, 16);
    });
  }

  // Trigger counters when scrolled into view
  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsBar);
  }

  // --- 4. SPORTS TICKER PILLS INTERACTIVITY ---
  const sportsPills = document.querySelectorAll('.sport-pill');
  sportsPills.forEach(pill => {
    pill.addEventListener('click', () => {
      sportsPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const sportName = pill.getAttribute('data-sport');
      if (sportName === 'all') {
        showToast('Showing events for All Sports');
      } else {
        showToast(`Filtered feed for ${sportName.toUpperCase()}`);
      }
    });
  });

  // --- 5. "WHY KINETRA?" FEATURES ACCORDION & PHONE MOCKUP ---
  const featureItems = document.querySelectorAll('.feature-item');
  const phoneRsvpBtn = document.getElementById('phoneRsvpBtn');

  featureItems.forEach(item => {
    item.addEventListener('click', () => {
      featureItems.forEach(f => f.classList.remove('active'));
      item.classList.add('active');
      const featureKey = item.getAttribute('data-feature');
      
      if (featureKey === 'discovery') {
        showToast('Smart Discovery: AI matching active');
      } else if (featureKey === 'play') {
        showToast('Play Anytime: Venues synced');
      } else if (featureKey === 'verified') {
        showToast('Verified Community: Player badges active');
      } else if (featureKey === 'track') {
        showToast('Track & Improve: Performance logs updated');
      } else if (featureKey === 'allone') {
        showToast('All Sports One Home: Multi-sport profile active');
      }
    });
  });

  // Phone Mockup Event RSVP Interactive Toggle
  if (phoneRsvpBtn) {
    let rsvpState = false;
    phoneRsvpBtn.addEventListener('click', () => {
      rsvpState = !rsvpState;
      if (rsvpState) {
        phoneRsvpBtn.textContent = '✓ Spot Reserved!';
        phoneRsvpBtn.classList.add('joined');
        showToast('Successfully registered for City Football Cup!');
      } else {
        phoneRsvpBtn.textContent = 'Join Event Now';
        phoneRsvpBtn.classList.remove('joined');
        showToast('Reservation cancelled.');
      }
    });
  }

  // --- 6. TRUSTED BY THOUSANDS - HTML5 CANVAS GRAPH ---
  const canvas = document.getElementById('growthCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Growth Data (Jan to May)
    const dataPoints = [
      { month: 'Jan', val: 15, label: '15,000 Downloads' },
      { month: 'Feb', val: 32, label: '32,000 Downloads' },
      { month: 'Mar', val: 58, label: '58,000 Downloads' },
      { month: 'Apr', val: 82, label: '82,000 Downloads' },
      { month: 'May', val: 105, label: '100,000+ Downloads' }
    ];

    let animProgress = 0;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function drawChart(progress) {
      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, width, height);

      const paddingLeft = 50;
      const paddingRight = 30;
      const paddingTop = 30;
      const paddingBottom = 40;

      const graphWidth = width - paddingLeft - paddingRight;
      const graphHeight = height - paddingTop - paddingBottom;

      const maxVal = 120;

      // Calculate Coordinates
      const points = dataPoints.map((dp, i) => {
        const x = paddingLeft + (i / (dataPoints.length - 1)) * graphWidth;
        const currentVal = dp.val * progress;
        const y = height - paddingBottom - (currentVal / maxVal) * graphHeight;
        return { x, y, month: dp.month, label: dp.label };
      });

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const yGrid = paddingTop + (i / 4) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, yGrid);
        ctx.lineTo(width - paddingRight, yGrid);
        ctx.stroke();
      }

      // Draw Area Fill Gradient
      if (points.length > 0) {
        const areaGradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
        areaGradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
        areaGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
        areaGradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, height - paddingBottom);
        points.forEach((pt, idx) => {
          if (idx === 0) {
            ctx.lineTo(pt.x, pt.y);
          } else {
            const prev = points[idx - 1];
            const cpX1 = prev.x + (pt.x - prev.x) / 2;
            const cpY1 = prev.y;
            const cpX2 = prev.x + (pt.x - prev.x) / 2;
            const cpY2 = pt.y;
            ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, pt.x, pt.y);
          }
        });
        ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
        ctx.closePath();
        ctx.fillStyle = areaGradient;
        ctx.fill();

        // Draw Curve Line
        const lineGradient = ctx.createLinearGradient(paddingLeft, 0, width - paddingRight, 0);
        lineGradient.addColorStop(0, '#8B5CF6');
        lineGradient.addColorStop(0.5, '#A855F7');
        lineGradient.addColorStop(1, '#06B6D4');

        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            const prev = points[idx - 1];
            const cpX1 = prev.x + (pt.x - prev.x) / 2;
            const cpY1 = prev.y;
            const cpX2 = prev.x + (pt.x - prev.x) / 2;
            const cpY2 = pt.y;
            ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, pt.x, pt.y);
          }
        });
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw Data Points & Labels
        points.forEach(pt => {
          // Glow Outer Dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#06B6D4';
          ctx.shadowColor = '#06B6D4';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner Dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // Month Label
          ctx.fillStyle = '#94A3B8';
          ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(pt.month, pt.x, height - 12);
        });
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animate Chart on Scroll
    let graphAnimated = false;
    const graphCard = document.getElementById('events');

    function startGraphAnimation() {
      let start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 1500, 1);
        drawChart(progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    if (graphCard) {
      const graphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !graphAnimated) {
            graphAnimated = true;
            startGraphAnimation();
          }
        });
      }, { threshold: 0.2 });
      graphObserver.observe(graphCard);
    }
  }

  // --- 7. TESTIMONIALS CAROUSEL SLIDER ---
  const sliderTrack = document.getElementById('sliderTrack');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const sliderDots = document.getElementById('sliderDots');
  const slides = document.querySelectorAll('.slide');

  if (sliderTrack && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval = null;

    // Build Dots
    if (sliderDots) {
      sliderDots.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
      }
    }

    function updateSlider() {
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      if (sliderDots) {
        const dots = sliderDots.querySelectorAll('.dot');
        dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === currentSlide);
        });
      }
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateSlider();
      resetAutoSlide();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4500);
    }

    function resetAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    startAutoSlide();
  }

  // --- 8. MODAL CONTROLS ---
  // Onboarding Modal
  const onboardingModal = document.getElementById('onboardingModal');
  const navGetStartedBtn = document.getElementById('navGetStartedBtn');
  const heroGetStartedBtn = document.getElementById('heroGetStartedBtn');
  const closeOnboardingModal = document.getElementById('closeOnboardingModal');

  function openOnboarding() {
    if (onboardingModal) onboardingModal.classList.add('open');
  }

  function closeOnboarding() {
    if (onboardingModal) onboardingModal.classList.remove('open');
  }

  if (navGetStartedBtn) navGetStartedBtn.addEventListener('click', openOnboarding);
  if (heroGetStartedBtn) heroGetStartedBtn.addEventListener('click', openOnboarding);
  if (closeOnboardingModal) closeOnboardingModal.addEventListener('click', closeOnboarding);

  // Role Options inside Onboarding
  const roleOptions = document.querySelectorAll('.role-option');
  roleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      roleOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  const onboardingForm = document.getElementById('onboardingForm');
  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeOnboarding();
      showToast('Welcome to Kinetra! Account created successfully.');
    });
  }

  // Video Modal
  const videoModal = document.getElementById('videoModal');
  const heroWatchVideoBtn = document.getElementById('heroWatchVideoBtn');
  const closeVideoModal = document.getElementById('closeVideoModal');

  if (heroWatchVideoBtn && videoModal) {
    heroWatchVideoBtn.addEventListener('click', () => {
      videoModal.classList.add('open');
    });
  }

  if (closeVideoModal && videoModal) {
    closeVideoModal.addEventListener('click', () => {
      videoModal.classList.remove('open');
    });
  }

  // Close modals when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === onboardingModal) closeOnboarding();
    if (e.target === videoModal) videoModal.classList.remove('open');
  });

  // --- 9. NEWSLETTER FORM SUBMISSION ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      if (emailInput && emailInput.value) {
        showToast(`Thank you for subscribing, ${emailInput.value}!`);
        emailInput.value = '';
      }
    });
  }

});
