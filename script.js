/* ==========================================================================
   KINETRA - MASTER FULL-STACK FRONTEND ENGINE
   Connected to Node.js / Python Express REST API Backend (http://localhost:5000)
   Hackathon Polish Edition
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE_URL = 'http://localhost:5000/api';

  // ==========================================================================
  // 1. MULTILINGUAL TRANSLATION SYSTEM (PHASE 28)
  // ==========================================================================
  const translations = {
    en: {
      discover: "Discover",
      connect: "Connect",
      events: "Events",
      matchmaking: "AI Matchmaking",
      scout: "Scout Discovery",
      why: "Why Kinetra",
      reviews: "Reviews",
      heroTitle: "ONE NETWORK.<br><span class=\"gradient-text\">EVERY SPORT.</span> EVERY ATHLETE.",
      heroSubtext: "Kinetra unites athletes, teams, coaches and events from every sport on a single platform. Connect. Compete. Grow."
    },
    te: {
      discover: "కనుగొనండి",
      connect: "కనెక్ట్ అవ్వండి",
      events: "ఈవెంట్లు",
      matchmaking: "AI మ్యాచ్‌మేకింగ్",
      scout: "స్కాౌట్ శోధన",
      why: "ఎందుకు కినెత్రా",
      reviews: "సమీక్షలు",
      heroTitle: "ఒకే నెట్‌వర్క్.<br><span class=\"gradient-text\">ప్రతి క్రీడ.</span> ప్రతి క్రీడాకారుడు.",
      heroSubtext: "కినెత్రా ప్రతి క్రీడ నుండి క్రీడాకారులు, జట్లు, కోచ్‌లను ఒకే ప్లాట్‌ఫామ్‌పై అనుసంధానిస్తుంది."
    },
    hi: {
      discover: "खोजें",
      connect: "जुड़ें",
      events: "कार्यक्रम",
      matchmaking: "एआई मैचमेकिंग",
      scout: "स्काउट खोज",
      why: "काइनेट्रा क्यों",
      reviews: "समीक्षाएं",
      heroTitle: "एक नेटवर्क.<br><span class=\"gradient-text\">हर खेल.</span> हर एथलीट.",
      heroSubtext: "काइनेट्रा हर खेल के एथलीटों, टीमों, कोचों को एक ही प्लेटफॉर्म पर जोड़ता है।"
    }
  };

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      const dict = translations[lang] || translations.en;

      if (document.getElementById('navDiscoverText')) document.getElementById('navDiscoverText').textContent = dict.discover;
      if (document.getElementById('navConnectText')) document.getElementById('navConnectText').textContent = dict.connect;
      if (document.getElementById('navEventsText')) document.getElementById('navEventsText').textContent = dict.events;
      if (document.getElementById('navMatchText')) document.getElementById('navMatchText').textContent = dict.matchmaking;
      if (document.getElementById('navScoutText')) document.getElementById('navScoutText').textContent = dict.scout;
      if (document.getElementById('navWhyText')) document.getElementById('navWhyText').textContent = dict.why;
      if (document.getElementById('navReviewsText')) document.getElementById('navReviewsText').textContent = dict.reviews;
      if (document.getElementById('heroTitle')) document.getElementById('heroTitle').innerHTML = dict.heroTitle;
      if (document.getElementById('heroSubtext')) document.getElementById('heroSubtext').textContent = dict.heroSubtext;

      showToast(`Language switched to ${lang.toUpperCase()}`);
    });
  }

  // ==========================================================================
  // 2. CENTRALIZED DATA STORAGE & BACKEND SERVICE ADAPTER (KinetraDB)
  // ==========================================================================
  const KinetraDB = {
    athletes: [
      { id: 'ath-1', name: 'Arjun R.', sport: 'Cricket', role: 'Captain', city: 'Mumbai', matchScore: 98, skill: 'Advanced Pro', score: 840, avatar: 'assets/arjun.png', connected: false, shortlisted: false },
      { id: 'ath-2', name: 'Sneha P.', sport: 'Badminton', role: 'Enthusiast', city: 'Bangalore', matchScore: 95, skill: 'Intermediate', score: 790, avatar: 'assets/sneha.png', connected: false, shortlisted: false },
      { id: 'ath-3', name: 'Rohit M.', sport: 'Football', role: 'Coach', city: 'Delhi', matchScore: 92, skill: 'Advanced Pro', score: 880, avatar: 'assets/rohit.png', connected: false, shortlisted: false },
      { id: 'ath-4', name: 'Maya S.', sport: 'Basketball', role: 'Point Guard', city: 'New York', matchScore: 89, skill: 'Advanced Pro', score: 810, avatar: 'assets/arjun.png', connected: false, shortlisted: false },
      { id: 'ath-5', name: 'Alex K.', sport: 'Tennis', role: 'Player', city: 'London', matchScore: 87, skill: 'Intermediate', score: 750, avatar: 'assets/sneha.png', connected: false, shortlisted: false },
      { id: 'ath-6', name: 'David L.', sport: 'Swimming', role: 'Freestyler', city: 'Sydney', matchScore: 85, skill: 'Advanced Pro', score: 860, avatar: 'assets/rohit.png', connected: false, shortlisted: false }
    ],

    events: [
      { id: 'evt-1', title: 'City Football Cup', sport: 'Football', status: 'live', date: 'Sun 21 May, 5:00 PM', location: 'Central Park, New York', players: '18/22 Attending', joined: false },
      { id: 'evt-2', title: 'Brooklyn Tennis Open', sport: 'Tennis', status: 'upcoming', date: 'Sat 27 May, 10:00 AM', location: 'Brooklyn Courts, NY', players: '12/16 Attending', joined: false },
      { id: 'evt-3', title: 'Manhattan Hoops League', sport: 'Basketball', status: 'upcoming', date: 'Wed 31 May, 6:30 PM', location: 'Downtown Gym, NY', players: '8/10 Attending', joined: false },
      { id: 'evt-4', title: 'Metropolitan Badminton Championship', sport: 'Badminton', status: 'completed', date: 'Sun 4 Jun, 9:00 AM', location: 'Metro Sports Arena', players: '24/32 Attending', joined: true }
    ],

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

  // --- AUTH SESSION MANAGEMENT ---
  let currentUser = null;

  async function loadAuthSession() {
    const token = localStorage.getItem('kinetra_jwt_token');
    const savedUser = localStorage.getItem('kinetra_current_user');

    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            currentUser = data.user;
            localStorage.setItem('kinetra_current_user', JSON.stringify(currentUser));
            updateNavbarAuthState();
            return;
          }
        }
      } catch (e) {
        console.warn('Backend offline, loading cached session');
      }
    }

    if (savedUser) {
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
      if (pill) pill.addEventListener('click', () => navigateTo('profile'));
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
  // 3. SINGLE PAGE APPLICATION (SPA) VIEW ROUTER
  // ==========================================================================
  const viewPages = document.querySelectorAll('.view-page');
  const navRouterLinks = document.querySelectorAll('.nav-router-link');

  function navigateTo(viewName) {
    if (viewName === 'why-kinetra' || viewName === 'reviews') {
      switchView('homeView');
      const sectionId = viewName === 'why-kinetra' ? 'whyKinetraSection' : 'reviewsSection';
      const sec = document.getElementById(sectionId);
      if (sec) {
        setTimeout(() => sec.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      return;
    }

    const targetViewId = viewName + 'View';
    const targetView = document.getElementById(targetViewId);

    if (targetView) {
      switchView(targetViewId);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (viewName === 'discover') renderDiscoverView();
      if (viewName === 'connect') renderConnectView();
      if (viewName === 'events') renderEventsView();
      if (viewName === 'matchmaking') renderMatchmakingView();
      if (viewName === 'scout') renderScoutView();
      if (viewName === 'profile') renderProfileView();
    }
  }

  function switchView(viewId) {
    viewPages.forEach(page => {
      if (page.id === viewId) page.classList.add('active');
      else page.classList.remove('active');
    });

    const activeRouteName = viewId.replace('View', '');
    navRouterLinks.forEach(link => {
      const target = link.getAttribute('data-view');
      if (target === activeRouteName) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  navRouterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      if (targetView) navigateTo(targetView);
    });
  });

  // ==========================================================================
  // 4. CANVAS DIGITAL SPORTS ID QR CODE RENDERER (PHASE 8)
  // ==========================================================================
  function renderSportsIdQrCode(codeString) {
    const canvas = document.getElementById('sportsIdQrCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 130;
    canvas.height = 130;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 130, 130);

    ctx.fillStyle = '#0F172A';
    const gridSize = 10;
    const cellSize = 13;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((r < 3 && c < 3) || (r < 3 && c > 6) || (r > 6 && c < 3)) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        } else {
          const charCode = codeString.charCodeAt((r * gridSize + c) % codeString.length);
          if (charCode % 2 === 0) {
            ctx.fillRect(c * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);
          }
        }
      }
    }
  }

  // ==========================================================================
  // 5. VIEW RENDERERS & LIVE SEARCH/FILTERS
  // ==========================================================================
  function renderDiscoverView(filterText = '') {
    const grid = document.getElementById('discoverGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const filtered = KinetraDB.sportsCategories.filter(cat => 
      cat.name.toLowerCase().includes(filterText.toLowerCase()) || 
      cat.desc.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'persona-card';
      card.innerHTML = `
        <div>
          <h3 class="persona-title">${cat.name}</h3>
          <p class="persona-desc">${cat.desc}</p>
        </div>
        <div style="margin-top: 16px;">
          <div style="font-size: 0.85rem; color: var(--primary-cyan-light); font-weight: 700;">${cat.count}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${cat.venues}</div>
          <button class="btn btn-secondary" style="margin-top: 14px; width: 100%; font-size: 0.82rem;" onclick="showToast('Showing ${cat.name} venues')">Explore Venues</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Discover Live Search Input Listener
  const discoverSearchInput = document.getElementById('discoverSearchInput');
  if (discoverSearchInput) {
    discoverSearchInput.addEventListener('input', (e) => {
      renderDiscoverView(e.target.value.trim());
    });
  }

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
          Skill Rating: <strong style="color: var(--primary-cyan);">${ath.skill}</strong> • Kinetra Score: <strong>${ath.score}</strong>
        </div>
        <button class="connect-btn ${ath.connected ? 'connected' : ''}" data-ath-id="${ath.id}">
          ${ath.connected ? '✓ Connected Friend' : '+ Connect Athlete'}
        </button>
      `;
      grid.appendChild(card);
    });

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

  // Match Center Filter Tabs Handler
  let currentMatchTab = 'all';
  const matchTabBtns = document.querySelectorAll('.match-tab-btn');
  matchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      matchTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMatchTab = btn.getAttribute('data-tab');
      renderEventsView();
    });
  });

  function renderEventsView() {
    const grid = document.getElementById('eventsListGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filteredEvents = KinetraDB.events.filter(evt => {
      if (currentMatchTab === 'all') return true;
      return evt.status === currentMatchTab;
    });

    filteredEvents.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'event-schedule-card';
      const statusBadge = evt.status === 'live' ? '<span class="status-badge-live">🔴 LIVE MATCH</span>' : 
                          evt.status === 'completed' ? '<span class="status-badge-joined">🏆 COMPLETED</span>' : '';

      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div class="event-sport-badge">🏆 ${evt.sport}</div>
            ${statusBadge}
          </div>
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
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-evt-id');
        const targetEvt = KinetraDB.events.find(e => e.id === id);
        if (targetEvt) {
          targetEvt.joined = !targetEvt.joined;
          const token = localStorage.getItem('kinetra_jwt_token');

          if (targetEvt.joined) {
            btn.textContent = '✓ RSVP Confirmed';
            btn.classList.add('btn-accent');
            showToast(`RSVP Confirmed for ${targetEvt.title}!`);

            if (token) {
              try {
                await fetch(`${API_BASE_URL}/events/${id}/join`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
              } catch (e) {}
            }
          } else {
            btn.textContent = 'Join Event Now';
            btn.classList.remove('btn-accent');
            showToast(`RSVP Cancelled for ${targetEvt.title}`);

            if (token) {
              try {
                await fetch(`${API_BASE_URL}/events/${id}/leave`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
              } catch (e) {}
            }
          }
        }
      });
    });
  }

  function renderMatchmakingView() {
    const grid = document.getElementById('matchmakingResultsGrid');
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
          <span class="match-percentage-badge">${ath.matchScore}% MATCH</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
          Skill Rating: <strong style="color: var(--primary-cyan);">${ath.skill}</strong> • Kinetra Score: <strong>${ath.score}</strong>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="flex: 1; padding: 8px; font-size: 0.78rem;" onclick="showToast('Viewing ${ath.name}\\'s profile')">View Profile</button>
          <button class="btn btn-primary" style="flex: 1; padding: 8px; font-size: 0.78rem;" onclick="showToast('Connection request sent to ${ath.name}')">Request Join</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  const btnFindMyMatch = document.getElementById('btnFindMyMatch');
  if (btnFindMyMatch) {
    btnFindMyMatch.addEventListener('click', () => {
      showToast('⚡ AI Matchmaking: Calculating compatibility...');
      setTimeout(() => {
        renderMatchmakingView();
        showToast('Top matches found!');
      }, 500);
    });
  }

  function renderScoutView() {
    const grid = document.getElementById('scoutAthletesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    KinetraDB.athletes.forEach(ath => {
      const card = document.createElement('div');
      card.className = 'persona-card';
      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
          <img src="${ath.avatar}" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--primary-purple); object-fit: cover;">
          <div>
            <h4 style="font-size: 1.1rem; font-weight: 800; color: #FFF;">${ath.name}</h4>
            <div style="font-size: 0.82rem; color: var(--primary-cyan-light);">${ath.sport} • ${ath.skill}</div>
          </div>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
          Kinetra Score: <strong style="font-size: 1.2rem; color: #FFF;">${ath.score}</strong> / 1000<br>
          Verification: <span style="color: #34D399; font-weight: 700;">✓ KINETRA VERIFIED</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary scout-shortlist-btn ${ath.shortlisted ? 'btn-accent' : ''}" data-ath-id="${ath.id}" style="flex: 1; padding: 8px; font-size: 0.78rem;">
            ${ath.shortlisted ? '★ Shortlisted' : '☆ Shortlist'}
          </button>
          <button class="btn btn-primary" style="flex: 1; padding: 8px; font-size: 0.78rem;" onclick="showToast('Contacting ${ath.name}...')">Contact</button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.scout-shortlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ath-id');
        const targetAth = KinetraDB.athletes.find(a => a.id === id);
        if (targetAth) {
          targetAth.shortlisted = !targetAth.shortlisted;
          if (targetAth.shortlisted) {
            btn.textContent = '★ Shortlisted';
            btn.classList.add('btn-accent');
            showToast(`Shortlisted ${targetAth.name} for scouting!`);
          } else {
            btn.textContent = '☆ Shortlist';
            btn.classList.remove('btn-accent');
            showToast(`Removed ${targetAth.name} from shortlist.`);
          }
        }
      });
    });
  }

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
    const idCodeEl = document.getElementById('sportsIdCode');
    const idNameEl = document.getElementById('idCardName');
    const idSportEl = document.getElementById('idCardSport');
    const scoreValEl = document.getElementById('kinetraScoreVal');

    const sportsIdCode = currentUser.sportsIdCode || ('KT-IND-' + Math.floor(100000 + Math.random() * 900000));
    currentUser.sportsIdCode = sportsIdCode;

    if (nameEl) nameEl.textContent = currentUser.name;
    if (idNameEl) idNameEl.textContent = currentUser.name;
    if (roleEl) roleEl.textContent = `⚡ ${currentUser.role || 'Pro Athlete'}`;
    if (sportEl) sportEl.textContent = `Primary Sport: ${currentUser.primarySport || currentUser.sport || 'Football'}`;
    if (idSportEl) idSportEl.textContent = `${currentUser.primarySport || currentUser.sport || 'Football'} • ${currentUser.skillLevel || 'Advanced'}`;
    if (skillEl) skillEl.textContent = `Skill Level: ${currentUser.skillLevel || 'Advanced'}`;
    if (ageEl) ageEl.textContent = `Age: ${currentUser.age || 24} (${currentUser.gender || 'Male'})`;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (matchesEl) matchesEl.textContent = currentUser.matchesCount || 12;
    if (friendsEl) friendsEl.textContent = currentUser.friendsCount || 48;
    if (idCodeEl) idCodeEl.textContent = sportsIdCode;
    if (scoreValEl) scoreValEl.innerHTML = `${currentUser.kinetraScore || 742} <span style="font-size: 1.5rem; color: var(--text-muted);">/ 1000</span>`;

    renderSportsIdQrCode(sportsIdCode);
  }

  // --- KINETRA SCORE BREAKDOWN MODAL ---
  const btnOpenScoreBreakdown = document.getElementById('btnOpenScoreBreakdown');
  const scoreBreakdownModal = document.getElementById('scoreBreakdownModal');
  const closeScoreBreakdownModal = document.getElementById('closeScoreBreakdownModal');

  if (btnOpenScoreBreakdown && scoreBreakdownModal) {
    btnOpenScoreBreakdown.addEventListener('click', () => scoreBreakdownModal.classList.add('open'));
  }
  if (closeScoreBreakdownModal && scoreBreakdownModal) {
    closeScoreBreakdownModal.addEventListener('click', () => scoreBreakdownModal.classList.remove('open'));
  }

  // --- NOTIFICATIONS BELL CLICK ---
  const notifBellBtn = document.getElementById('notifBellBtn');
  if (notifBellBtn) {
    notifBellBtn.addEventListener('click', () => {
      showToast('🔔 Notifications: 3 new match connection requests received!');
    });
  }

  // --- PROFILE BUTTONS ---
  const btnShareSportsId = document.getElementById('btnShareSportsId');
  const btnOpenTrainingCoach = document.getElementById('btnOpenTrainingCoach');
  const btnOpenTeamBuilder = document.getElementById('btnOpenTeamBuilder');

  if (btnShareSportsId) {
    btnShareSportsId.addEventListener('click', () => {
      const link = `https://kinetra.vercel.app/id/${currentUser ? currentUser.sportsIdCode : 'KT-IND-849201'}`;
      navigator.clipboard.writeText(link).catch(() => {});
      showToast('Digital Sports ID link copied to clipboard!');
    });
  }

  const trainingCoachModal = document.getElementById('trainingCoachModal');
  const closeTrainingCoachModal = document.getElementById('closeTrainingCoachModal');

  if (btnOpenTrainingCoach && trainingCoachModal) {
    btnOpenTrainingCoach.addEventListener('click', () => trainingCoachModal.classList.add('open'));
  }
  if (closeTrainingCoachModal && trainingCoachModal) {
    closeTrainingCoachModal.addEventListener('click', () => trainingCoachModal.classList.remove('open'));
  }

  const drillCheckboxes = document.querySelectorAll('.drill-checkbox');
  drillCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      const total = drillCheckboxes.length;
      const checked = document.querySelectorAll('.drill-checkbox:checked').length;
      const pct = Math.round((checked / total) * 100);
      const bar = document.getElementById('trainingProgressBar');
      const text = document.getElementById('trainingProgressPercent');
      if (bar) bar.style.width = pct + '%';
      if (text) text.textContent = pct + '% Completed';

      if (currentUser) {
        currentUser.kinetraScore = Math.min(1000, 742 + checked * 15);
        const scoreValEl = document.getElementById('kinetraScoreVal');
        if (scoreValEl) scoreValEl.innerHTML = `${currentUser.kinetraScore} <span style="font-size: 1.5rem; color: var(--text-muted);">/ 1000</span>`;
      }

      showToast(`Drill status updated! Progress: ${pct}%`);
    });
  });

  const teamBuilderModal = document.getElementById('teamBuilderModal');
  const closeTeamBuilderModal = document.getElementById('closeTeamBuilderModal');
  const btnRegenerateTeams = document.getElementById('btnRegenerateTeams');

  if (btnOpenTeamBuilder && teamBuilderModal) {
    btnOpenTeamBuilder.addEventListener('click', () => teamBuilderModal.classList.add('open'));
  }
  if (closeTeamBuilderModal && teamBuilderModal) {
    closeTeamBuilderModal.addEventListener('click', () => teamBuilderModal.classList.remove('open'));
  }

  if (btnRegenerateTeams) {
    btnRegenerateTeams.addEventListener('click', () => {
      showToast('⚡ Smart Team Builder: Reshuffling balanced squads...');
      setTimeout(() => {
        const rating = Math.floor(90 + Math.random() * 8);
        const balanceEl = document.getElementById('teamBalanceRating');
        if (balanceEl) balanceEl.textContent = `TEAM BALANCE: ${rating}%`;
        showToast('Squads re-balanced with 92% parity rating!');
      }, 400);
    });
  }

  const btnProfileCheckStatus = document.getElementById('btnProfileCheckStatus');
  const btnProfileAddGame = document.getElementById('btnProfileAddGame');
  const btnProfileAddFriends = document.getElementById('btnProfileAddFriends');
  const btnProfileLogout = document.getElementById('btnProfileLogout');
  const statusModal = document.getElementById('statusModal');
  const addGameModal = document.getElementById('addGameModal');
  const addFriendsModal = document.getElementById('addFriendsModal');
  const closeStatusModal = document.getElementById('closeStatusModal');
  const closeAddGameModal = document.getElementById('closeAddGameModal');
  const closeAddFriendsModal = document.getElementById('closeAddFriendsModal');

  if (btnProfileCheckStatus && statusModal) btnProfileCheckStatus.addEventListener('click', () => statusModal.classList.add('open'));
  if (closeStatusModal && statusModal) closeStatusModal.addEventListener('click', () => statusModal.classList.remove('open'));

  if (btnProfileAddGame && addGameModal) btnProfileAddGame.addEventListener('click', () => addGameModal.classList.add('open'));
  if (closeAddGameModal && addGameModal) closeAddGameModal.addEventListener('click', () => addGameModal.classList.remove('open'));

  const addGameForm = document.getElementById('addGameForm');
  if (addGameForm) {
    addGameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newSport = document.getElementById('newSportSelect').value;
      const token = localStorage.getItem('kinetra_jwt_token');

      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/profile/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ sport: newSport })
          });
          const data = await res.json();
          if (data.success) {
            showToast(`REST API: Added ${newSport} to SQLite Database!`);
          }
        } catch (err) {
          console.warn('API error, saving locally');
        }
      }

      if (currentUser) {
        currentUser.primarySport = `${currentUser.primarySport || currentUser.sport || 'Football'}, ${newSport}`;
        KinetraDB.updateUser(currentUser);
        renderProfileView();
      }
      if (addGameModal) addGameModal.classList.remove('open');
    });
  }

  if (btnProfileAddFriends && addFriendsModal) {
    btnProfileAddFriends.addEventListener('click', () => {
      renderAddFriendsModalList();
      addFriendsModal.classList.add('open');
    });
  }
  if (closeAddFriendsModal && addFriendsModal) closeAddFriendsModal.addEventListener('click', () => addFriendsModal.classList.remove('open'));

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
          }
        }
      });
    });
  }

  if (btnProfileLogout) btnProfileLogout.addEventListener('click', logout);

  // ==========================================================================
  // 6. AUTHENTICATION CONTROLLER (SIGNUP & LOGIN MODALS VIA REST API)
  // ==========================================================================
  const onboardingModal = document.getElementById('onboardingModal');
  const loginModal = document.getElementById('loginModal');
  const closeOnboardingModal = document.getElementById('closeOnboardingModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const onboardingForm = document.getElementById('onboardingForm');
  const loginForm = document.getElementById('loginForm');

  function openSignupModal() { if (onboardingModal) onboardingModal.classList.add('open'); }
  function closeSignupModal() { if (onboardingModal) onboardingModal.classList.remove('open'); }
  function openLoginModal() { if (loginModal) loginModal.classList.add('open'); }
  function closeLoginModal() { if (loginModal) loginModal.classList.remove('open'); }

  if (closeOnboardingModal) closeOnboardingModal.addEventListener('click', closeSignupModal);
  if (closeLoginModal) closeLoginModal.addEventListener('click', closeLoginModal);

  if (onboardingForm) {
    onboardingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const sport = document.getElementById('signupSport').value;
      const skill = document.getElementById('signupSkill').value;
      const age = document.getElementById('signupAge').value;
      const gender = document.getElementById('signupGender').value;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, sport, skillLevel: skill, age: parseInt(age, 10), gender })
        });

        const data = await response.json();
        if (!response.ok || data.error) {
          showToast(data.error || 'Signup failed. Please try again.');
          return;
        }

        saveAuthSession(data.user, data.token);
        closeSignupModal();
        showToast(`Welcome to Kinetra, ${data.user.name}! Your Digital Sports ID is ready.`);
        navigateTo('profile');
      } catch (err) {
        console.warn('Backend API connection failed, using local auth');
        const token = 'KT-JWT-TOKEN-' + Math.random().toString(36).substr(2);
        const newUser = { id: 'usr_' + Date.now(), name, email, password, primarySport: sport, skillLevel: skill, age, gender, sportsIdCode: 'KT-IND-' + Math.floor(100000 + Math.random() * 900000) };
        saveAuthSession(newUser, token);
        closeSignupModal();
        navigateTo('profile');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok || data.error) {
          showToast(data.error || 'Invalid email or password.');
          return;
        }

        saveAuthSession(data.user, data.token);
        closeLoginModal();
        showToast(`Welcome back, ${data.user.name}!`);
        navigateTo('profile');
      } catch (err) {
        console.warn('Backend API connection failed, using local auth');
        const user = KinetraDB.getUserByEmail(email);
        if (!user || user.password !== password) {
          showToast('Invalid email or password.');
          return;
        }
        const token = 'KT-JWT-TOKEN-' + Math.random().toString(36).substr(2);
        saveAuthSession(user, token);
        closeLoginModal();
        navigateTo('profile');
      }
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === onboardingModal) closeSignupModal();
    if (e.target === loginModal) closeLoginModal();
    if (e.target === statusModal) statusModal.classList.remove('open');
    if (e.target === addGameModal) addGameModal.classList.remove('open');
    if (e.target === addFriendsModal) addFriendsModal.classList.remove('open');
    if (e.target === trainingCoachModal) trainingCoachModal.classList.remove('open');
    if (e.target === teamBuilderModal) teamBuilderModal.classList.remove('open');
    if (e.target === scoreBreakdownModal) scoreBreakdownModal.classList.remove('open');
    if (e.target === videoModal) videoModal.classList.remove('open');
    if (e.target === dietModal) closeDietModal();
  });

  // --- TOAST NOTIFICATIONS ---
  const toastEl = document.getElementById('toastNotification');
  const toastMsgText = document.getElementById('toastMsgText');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    if (toastMsgText) toastMsgText.textContent = message;
    else toastEl.textContent = message;
    
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  document.querySelectorAll('.toast-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(el.getAttribute('data-msg') || 'Action completed successfully!');
    });
  });

  document.querySelectorAll('.download-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`Redirecting to Kinetra on ${btn.getAttribute('data-store')}...`);
    });
  });

  // --- STAT COUNTERS & ANIMATIONS ---
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
        if (count >= target) { count = target; clearInterval(timer); }
        stat.textContent = target >= 1000 ? Math.floor(count / 1000) + 'K+' : count + '+';
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

  // --- INITIALIZE SESSION ON LOAD ---
  loadAuthSession();

});
