# SkillSwap (REST + React)

**SkillSwap** is a full-stack social learning app built with a React (Vite) frontend and a Node.js + Express backend (MongoDB). It includes authentication (JWT), real-time features with Socket.io, friend requests, session requests (video session), ratings, notifications, and user profiles.

---

## 🔧 Tech Stack

- Frontend: React, Vite, Tailwind (optional) ✅
- Backend: Node.js, Express
- DB: MongoDB (Mongoose)
- Auth: JWT
- Real-time: Socket.io
- Dev tooling: Nodemon, Vite

---

## 🚀 Features

- User authentication (register, login, current user)
- Friend requests and friend management
- Session requests and active sessions (video room support)
- Inline notifications and notification details
- Rating system and rating requests
- Real-time presence/notifications via Socket.io

---

## 📦 Repo structure (top-level)

- `client/` — React app (Vite)
- `server/` — Express API and Socket.IO server

Key server folders:
- `server/controllers` — route handlers
- `server/models` — Mongoose models
- `server/routes` — API route definitions (`auth`, `user`, `friend`, `session`, `sessionRequest`, `rating`, `message`)

---

## 🧩 Environment variables

### Server
Create a `.env` in the `server/` folder with at least:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URI=http://localhost:5173   # where your client runs
PORT=5000
```

### Client
Create or edit `client/.env` (Vite uses `VITE_` prefix):

```
VITE_BACKEND_URI=http://localhost:5000
```

---

## 🧪 Run locally

Open two terminals (one for server, one for client):

1) Start server

```bash
cd server
npm install
# Then either
node server.js
# or (if you prefer auto-restart during development)
npx nodemon server.js
```

2) Start client

```bash
cd client
npm install
npm run dev
```

The client usually runs on `http://localhost:5173` and the server on `http://localhost:5000` (if `PORT` is not set).

---

## 🔭 API overview

Main route groups (see `server/routes`):

- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/auth/me` — get current user (protected)
- `GET/POST/PUT /api/users` — user endpoints
- `GET/POST /api/friends` — friend requests/management
- `POST /api/session-request` — create session requests
- `GET/POST /api/session` — sessions
- `GET/POST /api/ratings` — rating endpoints
- `POST /api/message` — chat/message endpoints

Refer to the route files in `server/routes` for full details.

---

## 🧩 Notes & Tips

- Socket.io client uses `import.meta.env.VITE_BACKEND_URI` (see `client/src/socket.js`).
- If you change the server port or host, update `VITE_BACKEND_URI` accordingly.
- Add seed data or an admin user directly in MongoDB if needed for testing.

---

## 🤝 Contributing

Contributions are welcome—please open issues or PRs for changes, feature requests, or bug fixes.


