# Secure Task Management API (Node.js + MongoDB, native driver)

## Requirements satisfied
- REST API with CRUD for Tasks
- MongoDB is the only DB, using native operations: find, insertOne, findOneAndUpdate, deleteOne
- Authentication: register/login/logout + GET /api/me
- Password hashing: bcrypt (salted)
- Authorization:
  - Only authenticated users can create tasks
  - Only owner or admin can update/delete task
  - GET /api/tasks/:id is public readable
  - GET /api/tasks returns tasks created by the logged-in user
- Security:
  - JWT access token (short-lived) + refresh token stored as server-side session in MongoDB
  - HttpOnly cookies are set (and token is also returned for Postman convenience)
  - Generic login error: "Invalid credentials"
  - Rate limiting on /api/auth endpoints
  - Input validation via express-validator
  - Sanitization using mongo-sanitize + safe error handler (no sensitive leaks)
  - Helmet enabled

## Setup (local)
1. Install deps:
```bash
npm install
```

2. Create `.env` from `.env.example` and fill secrets.
3. Run MongoDB (example using docker):

```bash
docker run --rm -p 27017:27017 --name mongo mongo:7
```
4. Start API:

```bash
npm run dev
```

API: [http://localhost:3000](http://localhost:3000)

## Setup (Docker Compose)

```bash
docker compose up --build
```

## Endpoints (all under /api)

### Auth

* POST `/api/auth/register` { username, password }
* POST `/api/auth/login`    { username, password } -> { status, token, user } + cookies
* POST `/api/auth/logout`   -> clears cookies + invalidates refresh session
* GET  `/api/me`            -> current user (auth required)

### Tasks

* POST   `/api/tasks`       (auth) { title, description, category? }
* GET    `/api/tasks`       (auth) -> tasks owned by logged-in user
* GET    `/api/tasks/:id`   (public) -> read a task
* PATCH  `/api/tasks/:id`   (auth, owner/admin) { status: "pending" | "completed" }
* DELETE `/api/tasks/:id`   (auth, owner/admin)

## Auth flow

1. Register
2. Login -> receive JWT access token (also stored in HttpOnly cookie)
3. Use `Authorization: Bearer <token>` for protected endpoints (Postman-friendly)
4. Logout -> server deletes refresh session and clears cookies

## Postman

Import `postman_collection.json`. Run:

* Register
* Login (stores token automatically)
* Create Task (stores taskId automatically)
* List / Get One / Patch / Delete

---

## Quick run commands

### Option A: local (Mongo already running)
```bash
npm install
# config .env based on .env.example
npm run dev
```

### Option B: Docker Compose

```bash
docker compose up --build
```
