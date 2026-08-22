/* ==========================================================================
   KINETRA - INTERACTIVE JAVASCRIPT ENGINE
   Updated with Kinetra AI Assistant, Sports Diet Plan Generator,
   and Browser Web Notification Reminders
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

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 2. TOAST NOTIFICATION SYSTEM ---
  const toastEl = document.getElementById('toastNotification');
  const toastMsgText = document.getElementById('toastMsgText');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    if (toastMsgText) toastMsgText.textContent = message;
    else toastEl.textContent = message;
    
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
      const duration = 2000;
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
    
    const dataPoints = [
      { month: 'Jan', val: 15, label: '15,000 Downloads' },
      { month: 'Feb', val: 32, label: '32,000 Downloads' },
      { month: 'Mar', val: 58, label: '58,000 Downloads' },
      { month: 'Apr', val: 82, label: '82,000 Downloads' },
      { month: 'May', val: 105, label: '100,000+ Downloads' }
    ];

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

      const points = dataPoints.map((dp, i) => {
        const x = paddingLeft + (i / (dataPoints.length - 1)) * graphWidth;
        const currentVal = dp.val * progress;
        const y = height - paddingBottom - (currentVal / maxVal) * graphHeight;
        return { x, y, month: dp.month, label: dp.label };
      });

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const yGrid = paddingTop + (i / 4) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, yGrid);
        ctx.lineTo(width - paddingRight, yGrid);
        ctx.stroke();
      }

      // Area Fill
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

        // Line
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

        // Dots & Labels
        points.forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#06B6D4';
          ctx.shadowColor = '#06B6D4';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          ctx.fillStyle = '#94A3B8';
          ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(pt.month, pt.x, height - 12);
        });
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

  // --- 8. MODAL CONTROLS & ONBOARDING ---
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

  window.addEventListener('click', (e) => {
    if (e.target === onboardingModal) closeOnboarding();
    if (e.target === videoModal) videoModal.classList.remove('open');
    if (e.target === dietModal) closeDietModal();
  });

  // --- 9. KINETRA AI ASSISTANT CHATBOX ENGINE ---
  const aiFloatingTrigger = document.getElementById('aiFloatingTrigger');
  const aiChatDrawer = document.getElementById('aiChatDrawer');
  const closeAiDrawer = document.getElementById('closeAiDrawer');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const modeGeneralTab = document.getElementById('modeGeneralTab');
  const modeDietTab = document.getElementById('modeDietTab');

  function openAiChat() {
    if (aiChatDrawer) aiChatDrawer.classList.add('open');
  }

  function closeAiChat() {
    if (aiChatDrawer) aiChatDrawer.classList.remove('open');
  }

  if (aiFloatingTrigger) aiFloatingTrigger.addEventListener('click', openAiChat);
  if (closeAiDrawer) closeAiDrawer.addEventListener('click', closeAiChat);

  // Mode Switchers
  if (modeGeneralTab && modeDietTab) {
    modeGeneralTab.addEventListener('click', () => {
      modeGeneralTab.classList.add('active');
      modeDietTab.classList.remove('active');
      appendAiBubble("Switched to General AI mode. Ask me anything about sports, matches, teams, or coaching!");
    });

    modeDietTab.addEventListener('click', () => {
      modeDietTab.classList.add('active');
      modeGeneralTab.classList.remove('active');
      openDietModal();
    });
  }

  // Quick Chips
  const chipBtns = document.querySelectorAll('.chip-btn');
  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q === 'Get My Diet Plan') {
        openDietModal();
      } else {
        handleUserQuery(q);
      }
    });
  });

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = aiChatInput.value.trim();
      if (!q) return;
      handleUserQuery(q);
      aiChatInput.value = '';
    });
  }

  function handleUserQuery(userText) {
    appendUserBubble(userText);
    openAiChat();

    // Intent-based AI responses
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let response = "";

      if (lower.includes('diet') || lower.includes('food') || lower.includes('meal') || lower.includes('nutrition') || lower.includes('protein')) {
        response = "🥗 I can generate a customized daily sports diet plan tailored to your sport, goal, and dietary preference! Click 'Get My Diet Plan' below to create yours.";
        appendAiBubble(response);
        setTimeout(() => openDietModal(), 1200);
        return;
      } else if (lower.includes('match') || lower.includes('pickup') || lower.includes('game')) {
        response = "⚽ Kinetra Smart Discovery matches you with verified players and pickup games near you. Go to the Discover section or click on the smartphone mockup event to reserve your spot!";
      } else if (lower.includes('coach') || lower.includes('academy') || lower.includes('train')) {
        response = "🎓 Kinetra connects athletes directly with top certified coaches across 120+ sports. You can book 1-on-1 coaching or join specialized sports academies.";
      } else if (lower.includes('team') || lower.includes('recruit') || lower.includes('roster')) {
        response = "🏆 Team managers can recruit verified players, track skill ratings, and host tournaments effortlessly using Kinetra Team Roster Manager.";
      } else if (lower.includes('cricket')) {
        response = "🏏 For Cricket players, Kinetra offers match scheduling, pitch venue bookings, and tailored carb-loading diet plans for all-day stamina.";
      } else if (lower.includes('football')) {
        response = "⚽ Football players can discover local 5-a-side or 11-a-side matches, track sprint metrics, and receive hydration & protein recovery meal plans!";
      } else {
        response = `⚡ Kinetra is the ultimate sports networking platform uniting 25,000+ athletes across 120+ sports. How else can I assist you with your athletic journey?`;
      }

      appendAiBubble(response);
    }, 600);
  }

  function appendUserBubble(text) {
    const b = document.createElement('div');
    b.className = 'chat-bubble user';
    b.textContent = text;
    aiChatMessages.appendChild(b);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function appendAiBubble(text) {
    const b = document.createElement('div');
    b.className = 'chat-bubble ai';
    b.textContent = text;
    aiChatMessages.appendChild(b);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  // --- 10. AI SPORTS DIET PLAN GENERATOR & NOTIFICATIONS ---
  const dietModal = document.getElementById('dietModal');
  const closeDietModalBtn = document.getElementById('closeDietModal');
  const navDietBtn = document.getElementById('navDietBtn');
  const heroDietBtn = document.getElementById('heroDietBtn');
  const dietForm = document.getElementById('dietForm');
  const dietResultsContainer = document.getElementById('dietResultsContainer');
  const mealCardsGrid = document.getElementById('mealCardsGrid');
  const dietPlanHeadline = document.getElementById('dietPlanHeadline');
  const notifyPermBtn = document.getElementById('notifyPermBtn');
  const testNotificationBtn = document.getElementById('testNotificationBtn');

  function openDietModal() {
    if (dietModal) dietModal.classList.add('open');
  }

  function closeDietModal() {
    if (dietModal) dietModal.classList.remove('open');
  }

  if (navDietBtn) navDietBtn.addEventListener('click', openDietModal);
  if (heroDietBtn) heroDietBtn.addEventListener('click', openDietModal);
  if (closeDietModalBtn) closeDietModalBtn.addEventListener('click', closeDietModal);

  // Diet Plan Generation Logic
  if (dietForm) {
    dietForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sport = document.getElementById('dietSport').value;
      const goal = document.getElementById('dietGoal').value;
      const age = document.getElementById('dietAge').value;
      const gender = document.getElementById('dietGender').value;
      const restriction = document.getElementById('dietRestriction').value;

      generateDietPlan(sport, goal, age, gender, restriction);
    });
  }

  function generateDietPlan(sport, goal, age, gender, restriction) {
    const plans = {
      "Breakfast": {
        time: "08:00 AM",
        title: restriction === "Vegan" ? "Chia & Oat Protein Smoothie Bowl" : (restriction === "Vegetarian" ? "Paneer/Tofu Scramble & Avocado Toast" : "Egg White Omelette & Whole Grain Toast"),
        desc: `High nutrient breakfast to prime your metabolism for ${sport} training.`,
        protein: restriction === "Keto" ? "28g Protein" : "32g Protein",
        carbs: restriction === "Keto" ? "8g Carbs" : "55g Complex Carbs",
        hydration: "💧 500ml Electrolyte Water"
      },
      "Lunch": {
        time: "01:00 PM",
        title: restriction === "Vegan" ? "Quinoa & Black Bean Buddha Bowl" : (restriction === "Vegetarian" ? "Lentil Dal, Brown Rice & Grilled Paneer" : "Grilled Chicken Breast with Sweet Potato & Broccoli"),
        desc: `Sustained macro fuel designed for ${goal.toLowerCase()} and quick muscle recovery.`,
        protein: "42g High Quality Protein",
        carbs: restriction === "Keto" ? "12g Carbs" : "65g Complex Carbs",
        hydration: "💧 750ml Hydration & BCAA"
      },
      "Snacks": {
        time: "05:00 PM",
        title: restriction === "Keto" ? "Almonds, Walnut & Pumpkin Seeds Mix" : "Greek Yogurt / Plant Protein Shake with Banana & Almonds",
        desc: `Pre-workout energy booster tailored for high-intensity ${sport} sessions.`,
        protein: "22g Protein",
        carbs: "30g Fast Carbs",
        hydration: "💧 400ml Coconut Water"
      },
      "Dinner": {
        time: "08:30 PM",
        title: restriction === "Vegan" ? "Tofu & Chickpea Stir-fry with Steamed Veggies" : (restriction === "Vegetarian" ? "Cottage Cheese & Spinach Curry with Millets" : "Baked Salmon / Lean Fish with Asparagus & Quinoa"),
        desc: "Overnight muscle repair meal rich in essential omega-3s and zinc.",
        protein: "38g Protein",
        carbs: restriction === "Keto" ? "10g Carbs" : "40g Slow Carbs",
        hydration: "💧 500ml Magnesium Hydration"
      }
    };

    // Save to LocalStorage
    const dietData = { sport, goal, age, gender, restriction, plans };
    localStorage.setItem('kinetra_user_diet', JSON.stringify(dietData));

    // Render Cards
    if (mealCardsGrid) {
      mealCardsGrid.innerHTML = '';

      const icons = { Breakfast: "🥣", Lunch: "🥗", Snacks: "🥑", Dinner: "🍲" };

      Object.keys(plans).forEach(mealKey => {
        const meal = plans[mealKey];
        const card = document.createElement('div');
        card.className = 'meal-card';
        card.innerHTML = `
          <div class="meal-header">
            <div class="meal-type-title">
              <span>${icons[mealKey]}</span> ${mealKey}
            </div>
            <span class="meal-time-badge">⏰ ${meal.time}</span>
          </div>
          <h4 class="meal-name">${meal.title}</h4>
          <p class="meal-desc">${meal.desc}</p>
          <div class="macro-tags">
            <span class="macro-tag macro-protein">💪 ${meal.protein}</span>
            <span class="macro-tag macro-carbs">⚡ ${meal.carbs}</span>
            <span class="macro-tag macro-hydration">${meal.hydration}</span>
          </div>
        `;
        mealCardsGrid.appendChild(card);
      });

      if (dietPlanHeadline) {
        dietPlanHeadline.textContent = `Daily Diet Plan for ${sport} (${restriction})`;
      }

      if (dietResultsContainer) {
        dietResultsContainer.style.display = 'block';
      }
    }

    showToast(`Personalized ${sport} Diet Plan generated!`);
  }

  // Web Notification Reminders Engine
  if (notifyPermBtn) {
    notifyPermBtn.addEventListener('click', () => {
      if (!("Notification" in window)) {
        showToast("Web Notifications are not supported in this browser.");
        return;
      }

      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showToast("🔔 Meal Reminders enabled! You will receive daily meal alerts.");
          notifyPermBtn.textContent = "✓ Reminders Active";
          notifyPermBtn.style.borderColor = "#10B981";
        } else {
          showToast("Notification permission denied. In-app alerts will be used.");
        }
      });
    });
  }

  if (testNotificationBtn) {
    testNotificationBtn.addEventListener('click', () => {
      const msg = "🥗 Kinetra Diet Alert: Time for Breakfast! Oats & Berry Protein Smoothie at 8:00 AM";
      
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Kinetra Sports Diet Reminder", {
          body: msg,
          icon: "assets/arjun.png"
        });
      }

      showToast(msg);
    });
  }

  // Check saved diet plan on load
  const savedDiet = localStorage.getItem('kinetra_user_diet');
  if (savedDiet) {
    try {
      const d = JSON.parse(savedDiet);
      generateDietPlan(d.sport, d.goal, d.age, d.gender, d.restriction);
    } catch(e) {}
  }

  // --- 11. NEWSLETTER FORM SUBMISSION ---
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
