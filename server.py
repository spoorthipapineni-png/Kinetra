#!/usr/bin/env python3
"""
KINETRA REST API BACKEND SERVER
Built with Python http.server & sqlite3 for zero-dependency local database persistence.
Provides REST endpoints on Port 5000 with CORS headers for Kinetra frontend.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
import hashlib
import hmac
import base64
import time
import os
import re

HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5000))
DB_FILE = os.environ.get('DATABASE_URL', 'database.sqlite')
JWT_SECRET = os.environ.get('JWT_SECRET', 'kinetra_super_secret_jwt_key_2026')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:8000')

# --- DATABASE INITIALIZATION ---
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            sport TEXT NOT NULL,
            skill_level TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            role TEXT DEFAULT 'Athlete',
            sports_id_code TEXT UNIQUE,
            kinetra_score INTEGER DEFAULT 742,
            friends_count INTEGER DEFAULT 1,
            matches_count INTEGER DEFAULT 2,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Games Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            sport_name TEXT NOT NULL,
            skill_level TEXT DEFAULT 'Intermediate',
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Connections Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            friend_id INTEGER,
            status TEXT DEFAULT 'accepted',
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Events Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            sport TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            players TEXT NOT NULL
        )
    ''')

    # Event Participants Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS event_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT,
            user_id INTEGER,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Insert/update default demo user
    pwd_hash = hash_password('password123')
    cursor.execute('SELECT id FROM users WHERE email = ?', ('demo@kinetra.com',))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, sport, skill_level, age, gender, role, sports_id_code, kinetra_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('Judge Demo Athlete', 'demo@kinetra.com', pwd_hash, 'Football', 'Advanced Pro', 24, 'Male', 'Pro Athlete', 'KT-IND-999999', 850))
    else:
        cursor.execute('UPDATE users SET password_hash = ? WHERE email = ?', (pwd_hash, 'demo@kinetra.com'))

    conn.commit()
    conn.close()

# --- UTILITY HELPERS ---
def hash_password(password):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), b'kinetra_salt_2026', 100000).hex()

def generate_jwt(user_id, email):
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip('=')
    payload = base64.urlsafe_b64encode(json.dumps({"sub": user_id, "email": email, "exp": int(time.time()) + 86400}).encode()).decode().rstrip('=')
    signature_raw = hmac.new(JWT_SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
    signature = base64.urlsafe_b64encode(signature_raw).decode().rstrip('=')
    return f"{header}.{payload}.{signature}"

def verify_jwt(token):
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header, payload, sig = parts
        payload_decoded = json.loads(base64.urlsafe_b64decode(payload + '===').decode())
        if payload_decoded.get('exp', 0) < time.time():
            return None
        return payload_decoded
    except Exception:
        return None

# --- REQUEST HANDLER ---
class KinetraApiHandler(BaseHTTPRequestHandler):

    def _set_cors_headers(self):
        client_origin = self.headers.get('Origin')
        allowed_origin = FRONTEND_URL
        if client_origin:
            if FRONTEND_URL == '*' or client_origin == FRONTEND_URL or 'localhost' in client_origin or '127.0.0.1' in client_origin:
                allowed_origin = client_origin

        self.send_header('Access-Control-Allow-Origin', allowed_origin)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def _get_auth_user(self):
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        token = auth_header.split(' ')[1]
        payload = verify_jwt(token)
        if not payload:
            return None

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, email, sport, skill_level, age, gender, role, sports_id_code, kinetra_score, friends_count, matches_count FROM users WHERE id = ?', (payload['sub'],))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return None
        return {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "sport": row[3],
            "skillLevel": row[4],
            "age": row[5],
            "gender": row[6],
            "role": row[7],
            "sportsIdCode": row[8],
            "kinetraScore": row[9],
            "friendsCount": row[10],
            "matchesCount": row[11]
        }

    def _serve_static_file(self, req_path):
        rel_path = req_path.lstrip('/')
        if not rel_path or rel_path == 'index.html':
            rel_path = 'index.html'

        file_path = os.path.join(os.getcwd(), rel_path)
        if not os.path.isfile(file_path):
            file_path = os.path.join(os.getcwd(), 'index.html')

        mime_types = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.json': 'application/json',
            '.ico': 'image/x-icon'
        }

        ext = os.path.splitext(file_path)[1].lower()
        content_type = mime_types.get(ext, 'application/octet-stream')

        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self._send_json({"error": f"File not found: {rel_path}"}, 404)

    # --- GET REQUESTS ---
    def do_GET(self):
        path = self.path.split('?')[0]

        if path.startswith('/api/'):
            if path == '/api/health':
                return self._send_json({
                    "success": True,
                    "service": "KINETRA REST API",
                    "status": "operational",
                    "version": "1.0.0"
                })

            elif path == '/api/profile':
                user = self._get_auth_user()
                if not user:
                    return self._send_json({"error": "Unauthorized / Invalid token"}, 401)
                
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute('SELECT sport_name, skill_level FROM games WHERE user_id = ?', (user['id'],))
                games = [{"sport": r[0], "skill": r[1]} for r in cursor.fetchall()]
                conn.close()

                user['games'] = games
                user['achievements'] = [
                    {"title": "City League MVP", "desc": "Top scorer in Football Cup"},
                    {"title": "10 Matches Streak", "desc": "Completed 10 consecutive matches"}
                ]
                return self._send_json({"success": True, "user": user})

            elif path == '/api/events':
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute('SELECT id, title, sport, date, location, players FROM events')
                rows = cursor.fetchall()
                conn.close()
                events = [{"id": r[0], "title": r[1], "sport": r[2], "date": r[3], "location": r[4], "players": r[5]} for r in rows]
                return self._send_json({"success": True, "events": events})

            elif path == '/api/connections':
                user = self._get_auth_user()
                if not user:
                    return self._send_json({"error": "Unauthorized"}, 401)
                return self._send_json({"success": True, "connections": []})

            else:
                self._send_json({"error": "Endpoint not found"}, 404)
        else:
            self._serve_static_file(path)

    # --- POST REQUESTS ---
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = {}
        if content_length > 0:
            try:
                body = json.loads(self.rfile.read(content_length).decode('utf-8'))
            except Exception:
                pass

        path = self.path.split('?')[0]

        # SIGNUP
        if path == '/api/auth/signup':
            name = body.get('name')
            email = body.get('email')
            password = body.get('password')
            sport = body.get('sport', 'Football')
            age = body.get('age', 24)
            gender = body.get('gender', 'Male')
            skill = body.get('skillLevel', 'Advanced Pro')

            if not name or not email or not password:
                return self._send_json({"error": "Name, email, and password required"}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM users WHERE email = ?', (email.lower(),))
            if cursor.fetchone():
                conn.close()
                return self._send_json({"error": "An account with this email already exists"}, 400)

            pwd_hash = hash_password(password)
            sports_id_code = f"KT-IND-{int(time.time() % 1000000):06d}"

            cursor.execute('''
                INSERT INTO users (name, email, password_hash, sport, skill_level, age, gender, sports_id_code)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, email.lower(), pwd_hash, sport, skill, age, gender, sports_id_code))
            user_id = cursor.lastrowid
            conn.commit()
            conn.close()

            token = generate_jwt(user_id, email)
            user_obj = {
                "id": user_id,
                "name": name,
                "email": email,
                "sport": sport,
                "skillLevel": skill,
                "age": age,
                "gender": gender,
                "sportsIdCode": sports_id_code,
                "kinetraScore": 742
            }
            return self._send_json({"success": True, "user": user_obj, "token": token}, 201)

        # LOGIN
        elif path == '/api/auth/login':
            email = body.get('email', '').lower()
            password = body.get('password', '')

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, email, password_hash, sport, skill_level, age, gender, sports_id_code, kinetra_score FROM users WHERE email = ?', (email,))
            row = cursor.fetchone()
            conn.close()

            if not row or row[3] != hash_password(password):
                return self._send_json({"error": "Invalid email or password"}, 401)

            token = generate_jwt(row[0], email)
            user_obj = {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "sport": row[4],
                "skillLevel": row[5],
                "age": row[6],
                "gender": row[7],
                "sportsIdCode": row[8],
                "kinetraScore": row[9]
            }
            return self._send_json({"success": True, "user": user_obj, "token": token})

        # ADD ANOTHER GAME
        elif path == '/api/profile/games':
            user = self._get_auth_user()
            if not user:
                return self._send_json({"error": "Unauthorized"}, 401)

            sport_name = body.get('sport')
            if not sport_name:
                return self._send_json({"error": "Sport name required"}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('INSERT INTO games (user_id, sport_name) VALUES (?, ?)', (user['id'], sport_name))
            conn.commit()
            conn.close()

            return self._send_json({"success": True, "message": f"Added {sport_name} to profile"})

        # JOIN EVENT
        elif '/join' in path:
            event_id = path.split('/')[3]
            user = self._get_auth_user()
            return self._send_json({"success": True, "message": f"Joined event {event_id}"})

        # LEAVE EVENT
        elif '/leave' in path:
            event_id = path.split('/')[3]
            return self._send_json({"success": True, "message": f"Left event {event_id}"})

        else:
            self._send_json({"error": "Endpoint not found"}, 404)

    # --- PUT REQUESTS ---
    def do_PUT(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = {}
        if content_length > 0:
            try:
                body = json.loads(self.rfile.read(content_length).decode('utf-8'))
            except Exception:
                pass

        path = self.path.split('?')[0]
        if path == '/api/profile':
            user = self._get_auth_user()
            if not user:
                return self._send_json({"error": "Unauthorized"}, 401)

            name = body.get('name', user['name'])
            sport = body.get('sport', user['sport'])

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('UPDATE users SET name = ?, sport = ? WHERE id = ?', (name, sport, user['id']))
            conn.commit()
            conn.close()

            return self._send_json({"success": True, "message": "Profile updated successfully"})

        else:
            self._send_json({"error": "Endpoint not found"}, 404)

def run_server():
    init_db()
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, KinetraApiHandler)
    print(f"[KINETRA REST API] Backend Server running on http://{HOST}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping REST API server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
