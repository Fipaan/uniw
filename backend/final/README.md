# Todo / Project Management Web App

## Project Overview

This project is a full-stack web application built using **Node.js, Express.js, MongoDB, and TypeScript**.
It provides authentication, task management, project organization, tagging, and role-based administration.

The system supports:

* User registration and login (JWT authentication)
* Task management per user
* Project organization
* Tagging system
* Admin dashboard with elevated permissions
* Secure password hashing
* Role-Based Access Control (RBAC)
* Input validation and global error handling
* Bootstrap-based frontend pages

---

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* JWT Authentication
* bcrypt password hashing
* Joi validation

### Frontend

* HTML + Bootstrap
* Vanilla JavaScript (AJAX / Fetch / JQuery)

### Security

* Helmet
* CORS
* Cookie Parser
* JWT + Refresh Token support

---

## Project Structure

- Backend
```
src/
 ├ config/
 ├ controllers/
 ├ middleware/
 ├ models/
 ├ routes/
 ├ utils/
 ├ validators/
 └ server.ts
```

- Frontend
```
public/
 ├ login/
 ├ register/
 ├ dashboard/
 ├ profile/
 └ common files
```

---

## Database Collections

### 1. Users

Fields:

* username
* email
* password (hashed)
* role (Admin / User)

---

### 2. Tasks

Fields:

* title
* description
* status
* dueDate
* owner (User reference)

---

### 3. Projects

Fields:

* name
* description
* owner
* related tasks

---

### 4. Tags

Fields:

* name
* owner
* related tasks/projects

---

### 5. RefreshTokens

Fields:

* token
* userId
* expiration

---

## Setup Instructions

### 1. Clone Project

```sh
$ git clone https://github.com/Fipaan/uniw.git
$ cd backend/final
```
> Note: it's a part of whole Uni course, so it required to clone the whole repository

---

### 2. Install Dependencies

```sh
$ npm install
```

---

### 3. Configure Environment Variables

Create `.env` file using `.env.example`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
...
```

---

### 4. Run Development Server

```
npm run dev
```

---

### 5. Build Production

```
npm run build
npm start
```

---

## Authentication

### Password Security

* Passwords hashed using **bcrypt**

### Token System

* JWT used for authentication
* Refresh tokens stored in DB
* Private routes protected by middleware

---

## RBAC (Role Based Access Control)

Roles:

* `User`
* `Admin`

Admin abilities:

* View all users
* View all tasks

---

## API Documentation

Base URL:

```
http://localhost:PORT/api
```

---

## Auth Endpoints (Public)

### Register

```
POST /api/auth/register
```

Body:

```
{
  "username": "user",
  "email": "user@email.com",
  "password": "password"
}
```

---

### Login

```
POST /api/auth/login
```

Returns:

* JWT token
* Refresh token (cookie / response)

---

## Auth Endpoints (Private)

### Status

```
GET /api/auth/status
```

---

### Logout

```
POST /api/auth/logout
```

---

## User Management (Private)

### Get Profile

```
GET /api/users/profile
```

---

### Update Profile

```
PUT /api/users/profile
```

---

## Task Management (Private)

### Create Task

```
POST /api/tasks
```

---

### Get All Tasks

```
GET /api/tasks
```

---

### Get Task By ID

```
GET /api/tasks/:id
```

---

### Update Task

```
PUT /api/tasks/:id
```

---

### Delete Task

```
DELETE /api/tasks/:id
```

---

## Project Management (Private)

Same CRUD pattern as tasks:

```
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

---

## Tag Management (Private)

```
POST   /api/tags
GET    /api/tags
GET    /api/tags/:id
PUT    /api/tags/:id
DELETE /api/tags/:id
```

---

## Admin Endpoints

Require Admin role.

### List All Users

```
GET /api/admin/users
```

---

### List All Tasks

```
GET /api/admin/tasks
```

---

## Validation & Error Handling

* Joi schema validation
* Centralized error middleware
* Standard HTTP error codes:

  * 400 Bad Request
  * 401 Unauthorized
  * 403 Forbidden
  * 404 Not Found
  * 500 Server Error

---

## Frontend Pages

5 Bootstrap pages included:

* Login Page
* Register Page
* Dashboard Page
* Profile Page
* Admin Page

---

## Security Features

* Helmet security headers
* CORS protection
* JWT authentication
* Password hashing
* RBAC authorization
* Input validation

---

## Future Improvements

* Email verification
* Password reset
* Real-time updates
* Mobile UI
* File uploads
* Notifications
* Extend Admin abilities
> Note: currently admins can only inspect other people tasks. Endpoints already support deleting any task by admins, it just needed to be implemented.

## Repo

- [https://github.com/Fipaan/uniw](https://github.com/Fipaan/uniw)
