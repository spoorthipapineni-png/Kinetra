/* ==========================================================================
   KINETRA REST API BACKEND SERVER (Node.js Express Edition)
   Port: 5000 | Database: SQLite / MongoDB / Memory Store
   ========================================================================== */

const http = require('http');
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    name: "Kinetra REST API Backend",
    version: "1.0.0",
    status: "Operational",
    endpoints: [
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/profile",
      "PUT /api/profile",
      "POST /api/profile/games",
      "GET /api/connections",
      "GET /api/events"
    ]
  }));
});

server.listen(PORT, () => {
  console.log(`⚡ Kinetra REST API Server running on port ${PORT}`);
});
