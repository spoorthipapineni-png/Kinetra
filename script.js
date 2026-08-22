/* ==========================================================================
   KINETRA - INTERACTIVE JAVASCRIPT ENGINE
   Featuring Centralized KinetraDB Engine, JWT Auth, SPA Router,
   Profile Dashboard & Profile Action Buttons (Check Status, Add Game, Add Friends, Logout)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CENTRALIZED DATA STORAGE & MOCK DATABASE ENGINE (KinetraDB)
  // ==========================================================================
  const KinetraDB = {
    // Initial Pre-populated Athletes
    athletes: [
      { id: 'ath-1', name: 'Arjun R.', sport: 'Cricket', role: 'Captain', city: 'Mumbai', matchScore: 98, skill: 'Advanced', avatar: 'assets/arjun.png', connected: false },
      { id: 'ath-2', name: 'Sneha P.', sport: 'Badminton', role: 'Enthusiast', city: 'Bangalore', matchScore: 95, skill: 'Intermediate', avatar: 'assets/sneha.png', connected: false },
      { id: 'ath-3', name: 'Rohit M.', sport: 'Football', role: 'Coach', city: 'Delhi', matchScore: 92, skill: 'Pro', avatar: 'assets/rohit.png', connected: false },
      { id: 'ath-4', name: 'Maya S.', sport: 'Basketball', role: 'Point Guard', city: 'New York', matchScore: 89, skill: 'Advanced', avatar: 'assets/arjun.png', connected: false },
      { id: 'ath-5', name: 'Alex K.', sport: 'Tennis', role: 'Player', city: 'London', matchScore: 87, skill: 'Intermediate', avatar: 'assets/sneha.png', connected: false },
      { id: 'ath-6', name: 'David L.', sport: 'Swimming', role: 'Freestyler', city: 'Sydney', matchScore: 85, skill: 'Pro', avatar: 'assets/rohit.png', connected: false }
    ],

    // Initial Pre-populated Events
    events: [
      { id: 'evt-1', title: 'City Football Cup', sport: 'Football', date: 'Sun 21 May, 5:00 PM', location: 'Central Park, New York', players: '18/22 Attending', joined: false },
      { id: 'evt-2', title: 'Brooklyn Tennis Open', sport: 'Tennis', date: 'Sat 27 May, 10:00 AM', location: 'Brooklyn Courts, NY', players: '12/16 Attending', joined: false },
      { id: 'evt-3', title: 'Manhattan Hoops League', sport: 'Basketball', date: 'Wed 31 May, 6:30 PM', location: 'Downtown Gym, NY', players: '8/10 Attending', joined: false },
      { id: 'evt-4', title: 'Metropolitan Badminton Championship', sport: 'Badminton', date: 'Sun 4 Jun, 9:00 AM', location: 'Metro Sports Arena', players: '24/32 Attending', joined: false }
    ],

    // Sports Categories
    sportsCategories: [
      { name: 'Football ⚽', count: '4,200+ Players', venues: '120 Courts Open', desc: 'Pickup matches & 11-a-side leagues daily.' },
      { name: 'Cricket 🏏', count: '5,800+ Players', venues: '85 Pitches Open', desc: 'T20 tournaments & weekend net practice.' },
      { name: 'Basketball 🏀', count: '3,100+ Players', venues: '95 Gyms Open', desc: 'Half-court pickup & 5v5 leagues.' },
      { name: 'Badminton 🏸', count: '2,900+ Players', venues: '110 Indoor Courts', desc: 'Singles & doubles match ladders.' },
      { name: 'Tennis 🎾', count: '1,800+ Players', venues: '64 Clay/Hard Courts', desc: 'Ranked match play & coaching sessions.' },
      { name: 'Swimming 🏊', count: '1,500+ Swimmers', venues: '40 Pools Open', desc: 'Freestyle sprint trials & lap swimming.' }
    ],

    getUsers() {
      const u = localStorage.getItem('kinetra_users_db');
      return u ? JSON.parse(u) : [];
    },

    saveUser(userObj) {
      const users = this.getUsers();
      users.push(userObj);
      localStorage.setItem('kinetra_users_db', JSON.stringify(users));
    },

    getUserByEmail(email) {
      const users = this.getUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    updateUser(userObj) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
      if (idx !== -1) {
        users[idx] = userObj;
        localStorage.setItem('kinetra_users_db', JSON.stringify(users));
      }
    }
  };

  // --- CURRENT AUTH SESSION ENGINE ---
  let currentUser = null;

  function loadAuthSession() {
    const token = localStorage.getItem('kinetra_jwt_token');
    const savedUser = localStorage.getItem('kinetra_current_user');
    if (token && savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
        updateNavbarAuthState();
      } catch (e) {
        logout();
      }
    }
  }

  function saveAuthSession(userObj, token) {
    currentUser = userObj;
    localStorage.setItem('kinetra_jwt_token', token);
    localStorage.setItem('kinetra_current_user', JSON.stringify(userObj));
    updateNavbarAuthState();
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem('kinetra_jwt_token');
    localStorage.removeItem('kinetra_current_user');
    updateNavbarAuthState();
    showToast('Logged out successfully.');
    navigateTo('home');
  }

  function updateNavbarAuthState() {
    const authContainer = document.getElementById('navAuthContainer');
    if (!authContainer) return;

    if (currentUser) {
      authContainer.innerHTML = `
        <div class="user-auth-pill" id="navProfilePill">
          <img src="${currentUser.avatar || 'assets/arjun.png'}" class="user-avatar-sm" alt="User">
          <span class="user-name-sm">${currentUser.name.split(' ')[0]}</span>
        </div>
      `;

      const pill = document.getElementById('navProfilePill');
      if (pill) {
        pill.addEventListener('click', () => navigateTo('profile'));
      }
    } else {
      authContainer.innerHTML = `
        <button class="btn btn-secondary" id="navLoginBtn">Log In</button>
        <button class="btn btn-primary" id="navGetStartedBtn">Get Started</button>
      `;

      const loginBtn = document.getElementById('navLoginBtn');
      const signupBtn = document.getElementById('navGetStartedBtn');

      if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
      if (signupBtn) signupBtn.addEventListener('click', openSignupModal);
    }
  }

  // ==========================================================================
  // 2. SINGLE PAGE APPLICATION (SPA) VIEW ROUTER
  // ==========================================================================
  const viewPages = document.querySelectorAll('.view-page');
  const navRouterLinks = document.querySelectorAll('.nav-router-link');

  function navigateTo(viewName) {
    if (viewName === 'why-kinetra' || viewName === 'reviews') {
      // Show home view first then scroll to section
      switchView('homeView');
      const sectionId = viewName === 'why-kinetra' ? 'whyKinetraSection' : 'reviewsSection';
      const sec = document.getElementById(sectionId);
      if (sec) {
        setTimeout(() => {
          sec.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      return;
    }

    const targetViewId = viewName + 'View';
    const targetView = document.getElementById(targetViewId);

    if (targetView) {
      switchView(targetViewId);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Render Dynamic Views
      if (viewName === 'discover') renderDiscoverView();
      if (viewName === 'connect') renderConnectView();
      if (viewName === 'events') renderEventsView();
      if (viewName === 'profile') renderProfileView();
    }
  }

  function switchView(viewId) {
    viewPages.forEach(page => {
      if (page.id === viewId) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Update nav active states
    const activeRouteName = viewId.replace('View', '');
    navRouterLinks.forEach(link => {
      const target = link.getAttribute('data-view');
      if (target === activeRouteName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Bind Router Link Clicks
  navRouterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      if (targetView) {
        navigateTo(targetView);
      }
    });
  });

  // ==========================================================================
  // 3. DYNAMIC VIEWS RENDERERS
  // ==========================================================================

  // Discover View Renderer
  function renderDiscoverView() {
    const grid = document.getElementById('discoverGrid');
    if (!grid) return;

    grid.innerHTML = '';
    KinetraDB.sportsCategories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'persona-card';
      card.innerHTML = `
        <div>
          <h3 class="persona-title">${cat.name}</h3>
          <p class="persona-desc">${cat.desc}</p>
        </div>
        <div style="margin-top: 16px;">
          <div style="font-size: 0.85rem; color: var(--primary-cyan-light); font-weight: 700; margin-bottom: 4px;">${cat.count}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${cat.venues}</div>
          <button class="btn btn-secondary" style="margin-top: 14px; width: 100%; font-size: 0.82rem;" onclick="showToast('Showing ${cat.name} courts near you')">Explore Venues</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Connect View Renderer
  function renderConnectView() {
    const grid = document.getElementById('connectAthletesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    KinetraDB.athletes.forEach(ath => {
      const card = document.createElement('div');
      card.className = 'connect-athlete-card';
      card.innerHTML = `
        <div class="athlete-card-header">
          <img src="${ath.avatar}" alt="${ath.name}" class="athlete-card-avatar">
          <div>
            <h4 style="font-size: 1.1rem; font-weight: 800; color: #FFF;">${ath.name}</h4>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${ath.sport} • ${ath.city}</div>
          </div>
          <span class="match-percentage-badge">${ath.matchScore}% Match</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
          Skill Rating: <strong style="color: var(--primary-cyan);">${ath.skill}</strong> • Role: <strong>${ath.role}</strong>
        </div>
        <button class="connect-btn ${ath.connected ? 'connected' : ''}" data-ath-id="${ath.id}">
          ${ath.connected ? '✓ Connected Friend' : '+ Connect Athlete'}
        </button>
      `;
      grid.appendChild(card);
    });

    // Bind connect buttons
    grid.querySelectorAll('.connect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ath-id');
        const targetAth = KinetraDB.athletes.find(a => a.id === id);
        if (targetAth) {
          targetAth.connected = !targetAth.connected;
          if (targetAth.connected) {
            btn.textContent = '✓ Connected Friend';
            btn.classList.add('connected');
            showToast(`Connected with ${targetAth.name}!`);
            if (currentUser) {
              currentUser.friendsCount = (currentUser.friendsCount || 48) + 1;
              KinetraDB.updateUser(currentUser);
            }
          } else {
            btn.textContent = '+ Connect Athlete';
            btn.classList.remove('connected');
            showToast(`Disconnected from ${targetAth.name}`);
            if (currentUser) {
              currentUser.friendsCount = Math.max(0, (currentUser.friendsCount || 48) - 1);
              KinetraDB.updateUser(currentUser);
            }
          }
        }
      });
    });
  }

  // Events View Renderer
  function renderEventsView() {
    const grid = document.getElementById('eventsListGrid');
    if (!grid) return;

    grid.innerHTML = '';
    KinetraDB.events.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'event-schedule-card';
      card.innerHTML = `
        <div>
          <div class="event-sport-badge">🏆 ${evt.sport}</div>
          <h3 class="event-title" style="font-size: 1.3rem;">${evt.title}</h3>
          <div class="event-meta" style="margin-top: 10px; margin-bottom: 16px;">
            <div class="event-meta-item">📅 <span>${evt.date}</span></div>
            <div class="event-meta-item">📍 <span>${evt.location}</span></div>
            <div class="event-meta-item">👥 <span>${evt.players}</span></div>
          </div>
        </div>
        <button class="btn btn-primary event-join-btn ${evt.joined ? 'btn-accent' : ''}" data-evt-id="${evt.id}">
          ${evt.joined ? '✓ RSVP Confirmed' : 'Join Event Now'}
        </button>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.event-join-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-evt-id');
        const targetEvt = KinetraDB.events.find(e => e.id === id);
        if (targetEvt) {
          targetEvt.joined = !targetEvt.joined;
          if (targetEvt.joined) {
            btn.textContent = '✓ RSVP Confirmed';
            btn.classList.add('btn-accent');
            showToast(`RSVP Confirmed for ${targetEvt.title}!`);
            if (currentUser) {
              currentUser.matchesCount = (currentUser.matchesCount || 12) + 1;
              KinetraDB.updateUser(currentUser);
            }
          } else {
            btn.textContent = 'Join Event Now';
            btn.classList.remove('btn-accent');
            showToast(`RSVP Cancelled for ${targetEvt.title}`);
            if (currentUser) {
              currentUser.matchesCount = Math.max(0, (currentUser.matchesCount || 12) - 1);
              KinetraDB.updateUser(currentUser);
            }
          }
        }
      });
    });
  }

  // Profile View Renderer
  function renderProfileView() {
    if (!currentUser) {
      showToast('Please log in or sign up to view your profile.');
      openLoginModal();
      return;
    }

    const nameEl = document.getElementById('profileUserName');
    const roleEl = document.getElementById('profileUserRole');
    const sportEl = document.getElementById('profileUserSport');
    const skillEl = document.getElementById('profileUserSkill');
    const ageEl = document.getElementById('profileUserAge');
    const emailEl = document.getElementById('profileUserEmail');
    const matchesEl = document.getElementById('profileActiveMatchesCount');
    const friendsEl = document.getElementById('profileFriendsCount');

    if (nameEl) nameEl.textContent = currentUser.name;
    if (roleEl) roleEl.textContent = `⚡ ${currentUser.role || 'Pro Athlete'}`;
    if (sportEl) sportEl.textContent = `Primary Sport: ${currentUser.primarySport || 'Football'}`;
    if (skillEl) skillEl.textContent = `Skill Level: ${currentUser.skillLevel || 'Advanced'}`;
    if (ageEl) ageEl.textContent = `Age: ${currentUser.age || 24} (${currentUser.gender || 'Male'})`;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (matchesEl) matchesEl.textContent = currentUser.matchesCount || 12;
    if (friendsEl) friendsEl.textContent = currentUser.friendsCount || 48;
  }

  // ==========================================================================
  // 4. PROFILE ACTION BUTTONS (Check Status, Add Game, Add Friends, Logout)
  // ==========================================================================
  const btnProfileCheckStatus = document.getElementById('btnProfileCheckStatus');
  const btnProfileAddGame = document.getElementById('btnProfileAddGame');
  const btnProfileAddFriends = document.getElementById('btnProfileAddFriends');
  const btnProfileLogout = document.getElementById('btnProfileLogout');

  // Modal Backdrops
  const statusModal = document.getElementById('statusModal');
  const addGameModal = document.getElementById('addGameModal');
  const addFriendsModal = document.getElementById('addFriendsModal');
  const closeStatusModal = document.getElementById('closeStatusModal');
  const closeAddGameModal = document.getElementById('closeAddGameModal');
  const closeAddFriendsModal = document.getElementById('closeAddFriendsModal');

  // ACTION 1: Check Status
  if (btnProfileCheckStatus) {
    btnProfileCheckStatus.addEventListener('click', () => {
      if (statusModal) statusModal.classList.add('open');
    });
  }

  if (closeStatusModal) {
    closeStatusModal.addEventListener('click', () => {
      if (statusModal) statusModal.classList.remove('open');
    });
  }

  // ACTION 2: Add Another Game
  if (btnProfileAddGame) {
    btnProfileAddGame.addEventListener('click', () => {
      if (addGameModal) addGameModal.classList.add('open');
    });
  }

  if (closeAddGameModal) {
    closeAddGameModal.addEventListener('click', () => {
      if (addGameModal) addGameModal.classList.remove('open');
    });
  }

  const addGameForm = document.getElementById('addGameForm');
  if (addGameForm) {
    addGameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSport = document.getElementById('newSportSelect').value;
      const newSkill = document.getElementById('newSportSkill').value;

      if (currentUser) {
        currentUser.primarySport = `${currentUser.primarySport}, ${newSport}`;
        KinetraDB.updateUser(currentUser);
        localStorage.setItem('kinetra_current_user', JSON.stringify(currentUser));
        renderProfileView();
        showToast(`Added ${newSport} to your profile!`);
      }

      if (addGameModal) addGameModal.classList.remove('open');
    });
  }

  // ACTION 3: Add Friends
  if (btnProfileAddFriends) {
    btnProfileAddFriends.addEventListener('click', () => {
      renderAddFriendsModalList();
      if (addFriendsModal) addFriendsModal.classList.add('open');
    });
  }

  if (closeAddFriendsModal) {
    closeAddFriendsModal.addEventListener('click', () => {
      if (addFriendsModal) addFriendsModal.classList.remove('open');
    });
  }

  function renderAddFriendsModalList() {
    const container = document.getElementById('suggestedFriendsList');
    if (!container) return;

    container.innerHTML = '';
    KinetraDB.athletes.forEach(ath => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass); border-radius: 12px;';
      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${ath.avatar}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--primary-purple);">
          <div>
            <h5 style="font-size: 0.95rem; color: #FFF;">${ath.name}</h5>
            <p style="font-size: 0.78rem; color: var(--text-muted);">${ath.sport} • ${ath.city}</p>
          </div>
        </div>
        <button class="btn btn-secondary connect-modal-btn ${ath.connected ? 'btn-accent' : ''}" data-ath-id="${ath.id}" style="padding: 6px 14px; font-size: 0.8rem;">
          ${ath.connected ? '✓ Connected' : '+ Add Friend'}
        </button>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.connect-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ath-id');
        const targetAth = KinetraDB.athletes.find(a => a.id === id);
        if (targetAth) {
          targetAth.connected = !targetAth.connected;
          if (targetAth.connected) {
            btn.textContent = '✓ Connected';
            btn.classList.add('btn-accent');
            showToast(`Added ${targetAth.name} as friend!`);
            if (currentUser) {
              currentUser.friendsCount = (currentUser.friendsCount || 48) + 1;
              KinetraDB.updateUser(currentUser);
              renderProfileView();
            }
          } else {
            btn.textContent = '+ Add Friend';
            btn.classList.remove('btn-accent');
            showToast(`Removed ${targetAth.name}`);
            if (currentUser) {
              currentUser.friendsCount = Math.max(0, (currentUser.friendsCount || 48) - 1);
              KinetraDB.updateUser(currentUser);
              renderProfileView();
            }
          }
        }
      });
    });
  }

  // ACTION 4: Log Out
  if (btnProfileLogout) {
    btnProfileLogout.addEventListener('click', () => {
      logout();
    });
  }

  // ==========================================================================
  // 5. AUTHENTICATION CONTROLLER (SIGNUP & LOGIN MODALS)
  // ==========================================================================
  const onboardingModal = document.getElementById('onboardingModal');
  const loginModal = document.getElementById('loginModal');
  const closeOnboardingModal = document.getElementById('closeOnboardingModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const onboardingForm = document.getElementById('onboardingForm');
  const loginForm = document.getElementById('loginForm');

  function openSignupModal() {
    if (onboardingModal) onboardingModal.classList.add('open');
  }

  function closeSignupModal() {
    if (onboardingModal) onboardingModal.classList.remove('open');
  }

  function openLoginModal() {
    if (loginModal) loginModal.classList.add('open');
  }

  function closeLoginModal() {
    if (loginModal) loginModal.classList.remove('open');
  }

  if (closeOnboardingModal) closeOnboardingModal.addEventListener('click', closeSignupModal);
  if (closeLoginModal) closeLoginModal.addEventListener('click', closeLoginModal);

  // Handle Signup
  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const sport = document.getElementById('signupSport').value;
      const skill = document.getElementById('signupSkill').value;
      const age = document.getElementById('signupAge').value;
      const gender = document.getElementById('signupGender').value;

      // Active Role
      let role = 'Athlete';
      const activeRoleBtn = onboardingForm.querySelector('.role-option.active');
      if (activeRoleBtn) role = activeRoleBtn.getAttribute('data-role');

      // Validation
      if (KinetraDB.getUserByEmail(email)) {
        showToast('An account with this email already exists. Please log in.');
        closeSignupModal();
        openLoginModal();
        return;
      }

      // Create User Object & JWT Token
      const token = 'kinetra_jwt_token_' + Math.random().toString(36).substr(2);
      const newUser = {
        id: 'usr_' + Date.now(),
        name,
        email,
        password, // stored locally in mock DB
        role,
        primarySport: sport,
        skillLevel: skill,
        age: parseInt(age, 10),
        gender,
        friendsCount: 1,
        matchesCount: 2,
        avatar: 'assets/arjun.png'
      };

      KinetraDB.saveUser(newUser);
      saveAuthSession(newUser, token);

      closeSignupModal();
      showToast(`Welcome to Kinetra, ${name}! Redirecting to profile...`);
      navigateTo('profile');
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      const user = KinetraDB.getUserByEmail(email);
      if (!user || user.password !== password) {
        showToast('Invalid email or password. Please try again.');
        return;
      }

      const token = 'kinetra_jwt_token_' + Math.random().toString(36).substr(2);
      saveAuthSession(user, token);

      closeLoginModal();
      showToast(`Welcome back, ${user.name}!`);
      navigateTo('profile');
    });
  }

  // Role Option Selector inside Signup Form
  const roleOptions = document.querySelectorAll('.role-option');
  roleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      roleOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Close modals backdrop clicks
  window.addEventListener('click', (e) => {
    if (e.target === onboardingModal) closeSignupModal();
    if (e.target === loginModal) closeLoginModal();
    if (e.target === statusModal) statusModal.classList.remove('open');
    if (e.target === addGameModal) addGameModal.classList.remove('open');
    if (e.target === addFriendsModal) addFriendsModal.classList.remove('open');
    if (e.target === videoModal) videoModal.classList.remove('open');
    if (e.target === dietModal) closeDietModal();
  });

  // --- 6. TOAST NOTIFICATION SYSTEM ---
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

  document.querySelectorAll('.toast-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = el.getAttribute('data-msg') || 'Action completed successfully!';
      showToast(msg);
    });
  });

  document.querySelectorAll('.download-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const storeName = btn.getAttribute('data-store') || 'App Store';
      showToast(`Redirecting to Kinetra on ${storeName}...`);
    });
  });

  // --- 7. ANIMATED COUNTERS ---
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

  // --- 8. SPORTS TICKER PILLS INTERACTIVITY ---
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

  // --- 9. "WHY KINETRA?" FEATURES ACCORDION & PHONE MOCKUP ---
  const featureItems = document.querySelectorAll('.feature-item');
  const phoneRsvpBtn = document.getElementById('phoneRsvpBtn');

  featureItems.forEach(item => {
    item.addEventListener('click', () => {
      featureItems.forEach(f => f.classList.remove('active'));
      item.classList.add('active');
      const featureKey = item.getAttribute('data-feature');
      
      if (featureKey === 'discovery') showToast('Smart Discovery: AI matching active');
      else if (featureKey === 'play') showToast('Play Anytime: Venues synced');
      else if (featureKey === 'verified') showToast('Verified Community: Player badges active');
      else if (featureKey === 'track') showToast('Track & Improve: Performance logs updated');
      else if (featureKey === 'allone') showToast('All Sports One Home: Multi-sport profile active');
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

  // --- 10. TRUSTED BY THOUSANDS - HTML5 CANVAS GRAPH ---
  const canvas = document.getElementById('growthCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dataPoints = [
      { month: 'Jan', val: 15 },
      { month: 'Feb', val: 32 },
      { month: 'Mar', val: 58 },
      { month: 'Apr', val: 82 },
      { month: 'May', val: 105 }
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
        return { x, y, month: dp.month };
      });

      // Grid
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
            ctx.bezierCurveTo(prev.x + (pt.x - prev.x) / 2, prev.y, prev.x + (pt.x - prev.x) / 2, pt.y, pt.x, pt.y);
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
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else {
            const prev = points[idx - 1];
            ctx.bezierCurveTo(prev.x + (pt.x - prev.x) / 2, prev.y, prev.x + (pt.x - prev.x) / 2, pt.y, pt.x, pt.y);
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
        if (progress < 1) requestAnimationFrame(step);
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

  // --- 11. TESTIMONIALS SLIDER ---
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
      if (autoSlideInterval) { clearInterval(autoSlideInterval); startAutoSlide(); }
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4500);
    }
    startAutoSlide();
  }

  // --- 12. KINETRA AI ASSISTANT CHATBOT ENGINE ---
  const aiFloatingTrigger = document.getElementById('aiFloatingTrigger');
  const aiChatDrawer = document.getElementById('aiChatDrawer');
  const closeAiDrawer = document.getElementById('closeAiDrawer');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const modeGeneralTab = document.getElementById('modeGeneralTab');
  const modeDietTab = document.getElementById('modeDietTab');

  function openAiChat() { if (aiChatDrawer) aiChatDrawer.classList.add('open'); }
  function closeAiChat() { if (aiChatDrawer) aiChatDrawer.classList.remove('open'); }

  if (aiFloatingTrigger) aiFloatingTrigger.addEventListener('click', openAiChat);
  if (closeAiDrawer) closeAiDrawer.addEventListener('click', closeAiChat);

  if (modeGeneralTab && modeDietTab) {
    modeGeneralTab.addEventListener('click', () => {
      modeGeneralTab.classList.add('active');
      modeDietTab.classList.remove('active');
      appendAiBubble("Switched to General AI mode. Ask me anything about sports!");
    });
    modeDietTab.addEventListener('click', () => {
      modeDietTab.classList.add('active');
      modeGeneralTab.classList.remove('active');
      openDietModal();
    });
  }

  const chipBtns = document.querySelectorAll('.chip-btn');
  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q === 'Get My Diet Plan') openDietModal();
      else handleUserQuery(q);
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

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let response = "";
      if (lower.includes('diet') || lower.includes('food') || lower.includes('meal')) {
        response = "🥗 I can generate a customized daily sports diet plan! Opening the Nutrition Generator...";
        appendAiBubble(response);
        setTimeout(() => openDietModal(), 1000);
        return;
      } else if (lower.includes('match') || lower.includes('pickup')) {
        response = "⚽ Kinetra Smart Discovery connects you with pickup matches near you! Click 'Events' or 'Connect' in the top menu to view active matches.";
      } else if (lower.includes('coach')) {
        response = "🎓 Kinetra connects athletes directly with top certified coaches across 120+ sports.";
      } else {
        response = `⚡ Kinetra is the ultimate sports networking platform. Navigate to Discover, Connect, or Events to start playing!`;
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

  // --- 13. DIET PLAN GENERATOR ---
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

  function openDietModal() { if (dietModal) dietModal.classList.add('open'); }
  function closeDietModal() { if (dietModal) dietModal.classList.remove('open'); }

  if (navDietBtn) navDietBtn.addEventListener('click', openDietModal);
  if (heroDietBtn) heroDietBtn.addEventListener('click', openDietModal);
  if (closeDietModalBtn) closeDietModalBtn.addEventListener('click', closeDietModal);

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
      "Breakfast": { time: "08:00 AM", title: "Oats, Fruit Smoothie & Avocado Toast", protein: "30g Protein", carbs: "55g Carbs", hydration: "💧 500ml Water" },
      "Lunch": { time: "01:00 PM", title: "Grilled Lean Protein, Brown Rice & Broccoli", protein: "42g Protein", carbs: "65g Carbs", hydration: "💧 750ml BCAA Hydration" },
      "Snacks": { time: "05:00 PM", title: "Greek Yogurt / Almond & Banana Mix", protein: "20g Protein", carbs: "30g Carbs", hydration: "💧 400ml Coconut Water" },
      "Dinner": { time: "08:30 PM", title: "Baked Fish/Tofu with Asparagus & Quinoa", protein: "38g Protein", carbs: "35g Carbs", hydration: "💧 500ml Magnesium Hydration" }
    };

    if (mealCardsGrid) {
      mealCardsGrid.innerHTML = '';
      Object.keys(plans).forEach(mKey => {
        const m = plans[mKey];
        const card = document.createElement('div');
        card.className = 'meal-card';
        card.innerHTML = `
          <div class="meal-header"><div class="meal-type-title">${mKey}</div><span class="meal-time-badge">⏰ ${m.time}</span></div>
          <h4 class="meal-name">${m.title}</h4>
          <div class="macro-tags">
            <span class="macro-tag macro-protein">💪 ${m.protein}</span>
            <span class="macro-tag macro-carbs">⚡ ${m.carbs}</span>
            <span class="macro-tag macro-hydration">${m.hydration}</span>
          </div>
        `;
        mealCardsGrid.appendChild(card);
      });
      if (dietPlanHeadline) dietPlanHeadline.textContent = `Daily Diet Plan for ${sport} (${restriction})`;
      if (dietResultsContainer) dietResultsContainer.style.display = 'block';
    }
    showToast(`Personalized ${sport} Diet Plan generated!`);
  }

  if (notifyPermBtn) {
    notifyPermBtn.addEventListener('click', () => {
      if ("Notification" in window) {
        Notification.requestPermission().then(p => {
          if (p === 'granted') showToast("🔔 Meal Reminders enabled!");
        });
      }
    });
  }

  if (testNotificationBtn) {
    testNotificationBtn.addEventListener('click', () => {
      const msg = "🥗 Kinetra Diet Alert: Time for Breakfast! Oats & Fruit Smoothie at 8:00 AM";
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Kinetra Sports Diet Reminder", { body: msg });
      }
      showToast(msg);
    });
  }

  // --- INITIALIZE SESSION ON LOAD ---
  loadAuthSession();

  // Video Modal Triggers
  const videoModal = document.getElementById('videoModal');
  const heroWatchVideoBtn = document.getElementById('heroWatchVideoBtn');
  const closeVideoModal = document.getElementById('closeVideoModal');
  if (heroWatchVideoBtn && videoModal) heroWatchVideoBtn.addEventListener('click', () => videoModal.classList.add('open'));
  if (closeVideoModal && videoModal) closeVideoModal.addEventListener('click', () => videoModal.classList.remove('open'));

});
