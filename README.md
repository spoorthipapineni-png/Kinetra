# KINETRA — One Network. Every Sport. Every Athlete.

> **National Sports Ecosystem & AI Platform**
> A unified digital sports platform for athletes, coaches, teams, and tournament organizers across 120+ sports.

---

## ⚡ Quick Start & Running Commands

### 1. Requirements
- **Python 3.8+** or **Node.js 18+**
- Modern Web Browser (Chrome, Firefox, Edge, Safari)

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Configuration in `.env`:
```env
PORT=5000
JWT_SECRET=kinetra_super_secret_jwt_key_2026
NODE_ENV=development
DATABASE_URL=database.sqlite
API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Full-Stack Application

### Start the REST API Backend Server (Port 5000)
```bash
python server.py
```
*Alternative Node.js Express server:*
```bash
node server.js
```

### Start the Frontend Application (Port 8000)
```bash
python -m http.server 8000
```
Then open **`http://localhost:8000`** in your browser.

---

## 🔌 API Endpoints & Health Check

### Health Check Endpoint
- **GET** `http://localhost:5000/api/health`
```json
{
  "success": true,
  "service": "KINETRA REST API",
  "status": "operational",
  "version": "1.0.0"
}
```

### Core REST Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/signup` | Registers athlete, hashes password, saves to DB, returns JWT token | ❌ |
| **POST** | `/api/auth/login` | Verifies credentials against DB, returns JWT token | ❌ |
| **GET** | `/api/profile` | Returns authenticated user profile, Sports ID, and achievements | ✅ |
| **PUT** | `/api/profile` | Updates profile information in database | ✅ |
| **POST** | `/api/profile/games` | Appends secondary sport/game to user record | ✅ |
| **GET** | `/api/events` | Lists all sports tournaments | ❌ |
| **POST** | `/api/events/:id/join` | RSVPs user to event | ✅ |
| **POST** | `/api/events/:id/leave` | Cancels event RSVP | ✅ |

---

## 🏆 Hackathon Judge Live Demonstration Flow (2 Minutes)

1. **Landing Page (`http://localhost:8000`)**: Overview of the sports ecosystem, stats bar, and hero CTAs.
2. **Create Account / Login**: Click *Get Started* or *Log In* (or use Demo Account: `demo@kinetra.com` / `password123`).
3. **Profile Dashboard**: View athlete profile details, **Kinetra Score** (`742 / 1000`), and **Sporting Journey** milestone timeline.
4. **Digital Sports ID (`KT-IND-XXXXXX`)**: Show unique Sports ID badge and scannable HTML5 Canvas QR code.
5. **AI Matchmaking**: Navigate to *AI Matchmaking*, select filters, click *Find My Match* to view sorted compatibility cards (`94% MATCH`).
6. **Discover & Live Search**: Type "Football" into the search bar to filter sports categories in real time.
7. **Events & Match Center**: Filter matches by `🔴 Live Matches`, `📅 Upcoming`, and `🏆 Completed`. Click *Join Event Now*.
8. **Log Out**: Click *Log Out* to clear the JWT token and return cleanly to the landing page.

---

## 🔐 Security & Database Persistence
- **Database Engine**: `database.sqlite` (SQLite3 Engine) managing relational tables for `users`, `games`, `connections`, `events`, and `event_participants`.
- **Security**: Passwords salted & hashed with `pbkdf2_hmac`. JWT bearer tokens issued with verification middleware. Secrets excluded from source code; `database.sqlite` ignored in `.gitignore`.
- **Hosting**: Connected to GitHub repository [`https://github.com/spoorthipapineni-png/Kinetra`](https://github.com/spoorthipapineni-png/Kinetra) for Vercel deployment.
