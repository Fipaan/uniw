# Task Tracker (Todo Website)

A simple full-stack task tracker:
- **Backend:** Node.js + Express (TypeScript, ESM) + MongoDB (Mongoose)
- **Auth:** JWT access token stored in an **HTTP-only cookie**
- **Frontend:** Static HTML + Bootstrap + jQuery (served from `/public`)

---

## Features

- Register with **email or username** (at least one is required)
- Login with **email or username + password**
- View profile (full name / username / email)
- Create tasks (title required, description optional, done required)
- List tasks (newest first)
- Update a single task (title/desc/done)
- Delete a task

---

## Setup & Installation

### 1) Prerequisites
- Node.js (ESM capable; Node 18+ recommended)
- MongoDB Atlas (or compatible MongoDB URI)
- A `.env` with credentials (see below)

### 2) Install dependencies
```bash
npm install
```

### 3) Environment variables

The server expects these environment variables:

* `MONGODB_USER` – MongoDB username
* `MONGODB_PASS` – MongoDB password (**required**, server exits if missing)
* `JWT_SECRET` – secret used to sign/verify JWTs (**required**)

Example `.env`:

```env
MONGODB_USER=your_user
MONGODB_PASS=your_password
JWT_SECRET=super_secret_string
```

> Notes:
>
> * The code connects using an Atlas-style connection string in `src/app.ts`
> * Atlas requires URI-encoded password, you don't need to encode manually (handled by `encodeURIComponent()`)

### 4) Build & run

Build TypeScript:

```bash
npm run build
```

Start compiled server:

```bash
npm start
```

Dev mode (auto rebuild/restart on TS changes):

```bash
npm run dev
```

Server runs on:

* `http://localhost:3000`

The frontend is served statically from `public/`.
Visiting `/` redirects to `/login`.

---

## Project Structure (high level)

* `src/app.ts` – express app itself, middleware wiring, routes, MongoDB connect/disconnect, error handling
* `src/router/*` – route definitions
* `src/controller/*` – endpoint logic
* `src/middleware/*` – logging, request validation, JWT cookie validation, and etc.
* `src/models/*` – Mongoose models (`User`, `Task`)
* `src/data/index.ts` – shared parsing/validation helpers for task fields and password hashing
* `public/*` – static frontend (login/register/tasks)

---

## API

Base prefix used by the frontend:

* `http://localhost:3000/api`

All API responses are JSON unless stated otherwise.

### Error format

Errors are returned as:

```json
{ "name": "SomeErrorName", "error": "human readable message" }
```

HTTP status codes follow the custom error classes in `src/utils/error.ts`:

* 400 BadRequestError
* 401 UnauthorizedError
* 403 ForbiddenError (RestrictedError)
* 404 NotFoundError
* 409 ConflictError
* 500 InternalServerError (or unknown errors)
* <status> <StatusName> (in general)

---

## Authentication & Session

### What happens on login

1. Client `POST /api/login` with `{ email, username, pass }`
2. Server finds a matching user and compares password with bcrypt
3. Server signs a JWT access token with payload:

   * `username`, `email`
4. Server sets cookie:

   * name: `access_token`
   * `httpOnly: true`
   * `secure: true` (**HTTPS only**)
   * `sameSite: "strict"`
   * `maxAge`: 15 minutes

### How protected endpoints work

Protected routes use `jwt.check` middleware:

* reads `req.cookies["access_token"]`
* verifies JWT using `JWT_SECRET`
* extracts `username` or `email` from token payload
* stores extracted identifier back into `req.cookies["username"]` or `req.cookies["email"]`
* controllers call `reqUser(req)` which resolves the user from those values

### Important note about `secure: true`

Because cookies are set with `secure: true`, the browser **will not store/send the cookie over plain HTTP**.

That means:

* On `http://localhost:3000` in a typical browser, your login cookie may not persist and protected endpoints will act like you’re logged out.
* For local development, you usually want either:

  * run the app behind HTTPS (reverse proxy), or
  * set `secure: false` in dev only.

It might be done using:

```ts
secure: process.env.NODE_ENV === "production"
```

---

## Endpoints

### `POST /api/register`

Registers a new user.

**Body (form or JSON):**

```json
{
  "full_name": "John Smith",
  "email": "john@example.com",
  "username": "johnsmith",
  "pass": "password123"
}
```

Rules:

* `full_name` required, min length 4
* must provide at least one of: `email` or `username`
* password length: 8..20
* email validated by simple regex <word>@<word>
* email and username must be unique (checked manually before save)

**Success:**

* `200 OK`

```json
{ "message": "user registered successfully" }
```

---

### `POST /api/login`

Logs in and sets an `access_token` cookie.

**Body (form or JSON):**

```json
{
  "email": "john@example.com",
  "username": "johnsmith",
  "pass": "password123"
}
```

Rules:

* must provide at least one of `email` or `username`
* password required

**Success:**

* `200 OK`

```json
{ "message": "successfully logged in" }
```

**Cookie:**

* `access_token` is set on success

---

### `GET /api/profile` (protected)

Returns the logged in user profile.

**Auth:**

* Requires valid `access_token` cookie

**Success:**

* `200 OK`

```json
{
  "full_name": "John Smith",
  "username": "johnsmith",
  "email": "john@example.com"
}
```

---

### `GET /api/tasks` (protected)

Returns current user's tasks, newest first.

**Auth:**

* Requires valid `access_token` cookie

**Success:**

* `200 OK`

```json
[
  {
    "_id": "...",
    "userId": "...",
    "title": "Do something",
    "desc": "Optional",
    "done": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### `POST /api/tasks` (protected)

Creates a task for the logged in user.

**Body (form or JSON):**

```json
{
  "title": "Buy milk",
  "desc": "2 liters",
  "done": false
}
```

Validation:

* `title`: required, non-empty string, max 75 chars
* `desc`: optional, trimmed, max 400 chars
* `done`: required; accepts boolean or string-like boolean (because JQuery parses it like this for whatever reason)

**Success:**

* `201 Created`
  Returns the created task document.

---

### `POST /api/tasks/:id` (protected)

Updates an existing task by id.

**Body (JSON expected by frontend on update):**

```json
{
  "title": "New title",
  "desc": "New desc",
  "done": true
}
```

Notes:

* Must provide at least one of `title`, `desc`, `done`
* `:id` must be a valid Mongo ObjectId

**Success:**

* `201 Created`

```json
{
  "changed": {
    "title": false,
    "desc": false,
    "done": false
  }
}
```

Notes:

* Verifies ownership by comparing JWT's user id with task's user id
* Returns back which fields were altered through booleans

---

### `DELETE /api/tasks/:id` (protected)

Deletes the specified task owned by the logged in user.

**Auth:**

* Requires valid `access_token` cookie

Ownership:

* Deletes only if `{ _id: id, userId: currentUser._id }`

**Success:**

* `204 No Content`

---

## Frontend Pages

* `/login` – login form (stores cookie via browser)
* `/register` – registration form
* `/tasks` – profile + task CRUD UI

The tasks page:

* fetches `/api/profile`
* fetches `/api/tasks`
* allows inline editing of title/desc and done status
* sends update via `POST /api/tasks/:id` with JSON payload
* sends delete via `DELETE /api/tasks/:id`

---

## Key Design Decisions

### 1) Cookie-based JWT for auth

* JWT is stored in an **HTTP-only cookie**, so JS can’t read it directly (helps against token exfiltration via XSS)
* `sameSite: "strict"` reduces CSRF risk
* Short TTL (15 minutes) limits exposure if cookie leaks

### 2) Backend serves static frontend

* Express serves `/public` as static assets
* Simple deployment: one server handles API + UI

### 3) Strict validation on inputs

* Registration/login validation in middleware (`valid.check`, `auth.check`)
* Task field validation in `src/data/index.ts` parsing helper

### 4) Clear error mapping

* Custom error classes with explicit HTTP statuses (avoids confusion and harder to make an error)
* Central error handler returns `{ name, error }` JSON

---

## Improvements to Consider

* **Local dev cookie**: set `secure: false` for non-HTTPS development
* Consider adding:

  * refresh tokens
  * logout endpoint (frontend calls `/api/logout` but server code shown doesn’t include it)
  * rate limiting for login
  * password complexity rules

---

## Logging

Requests are logged to:

* console
* `server.log` (appends one line per request)

Format:
`[ISO_TIMESTAMP] IP: METHOD: URL`

---
