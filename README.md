# DevPulse

A RESTful issue-tracking API built with Node.js, Express, and PostgreSQL. Supports role-based access control for contributors and maintainers.

**Live URL:** https://devpulse-ten-blue.vercel.app

---

## Features

- User registration and login with JWT authentication
- Role-based access control (`contributor` / `maintainer`)
- Full CRUD for issues with status lifecycle management
- Contributors can create and update issues; only maintainers can delete or change status
- PostgreSQL with auto-created tables on first run
- Global error handling with consistent JSON responses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | PostgreSQL (via `pg`) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcryptjs` |
| Build Tool | `tsup` |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites

- Node.js 18+
- A running PostgreSQL instance

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/pronoyNath/DevPulse.git
cd DevPulse

# 2. Install dependencies
npm install

# 3. Create a .env file
cp .env.example .env   # or create manually (see below)

# 4. Start in development mode
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=5000
CONNECTIONSTRING=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

> Tables are created automatically on server startup — no manual migrations needed.

---

## API Endpoints

Base URL: `https://devpulse-ten-blue.vercel.app`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | None | Register a new user |
| `POST` | `/api/auth/login` | None | Login and receive a JWT |

#### `POST /api/auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "contributor"
}
```

> `role` is optional — defaults to `"contributor"`. Accepted values: `contributor`, `maintainer`.

#### `POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Returns a JWT token to use as `Authorization: Bearer <token>` on protected routes.

---

### Issues

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/issues` | None | — |
| `GET` | `/api/issues/:id` | None | — |
| `POST` | `/api/issues` | Required | `contributor`, `maintainer` |
| `PATCH` | `/api/issues/:id` | Required | `contributor`, `maintainer` |
| `DELETE` | `/api/issues/:id` | Required | `maintainer` only |

#### `POST /api/issues` — Create Issue

```json
{
  "title": "Login button unresponsive on Safari",
  "description": "The login button does nothing when clicked on Safari 17.",
  "type": "bug"
}
```

> `type` accepted values: `bug`, `feature_request`

#### `PATCH /api/issues/:id` — Update Issue

```json
{
  "title": "Updated title",
  "description": "Updated description with more detail.",
  "type": "feature_request",
  "status": "in_progress"
}
```

> All fields are optional. `status` can only be updated by a `maintainer`. Contributors cannot update issues that are not `open`.
>
> `status` accepted values: `open`, `in_progress`, `resolved`

---

## Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": { ... }
}
```

On error:

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": { ... }
}
```

---

## Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | Primary Key |
| `name` | `VARCHAR(100)` | NOT NULL |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE |
| `password` | `TEXT` | NOT NULL |
| `role` | `VARCHAR(20)` | DEFAULT `contributor`, CHECK (`contributor` \| `maintainer`) |
| `created_at` | `TIMESTAMP` | DEFAULT `NOW()` |
| `updated_at` | `TIMESTAMP` | DEFAULT `NOW()` |

### `issues`

| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | Primary Key |
| `title` | `VARCHAR(150)` | NOT NULL |
| `description` | `TEXT` | NOT NULL |
| `type` | `VARCHAR(20)` | NOT NULL, CHECK (`bug` \| `feature_request`) |
| `status` | `VARCHAR(20)` | DEFAULT `open`, CHECK (`open` \| `in_progress` \| `resolved`) |
| `reporter_id` | `INT` | NOT NULL (references user id) |
| `created_at` | `TIMESTAMP` | DEFAULT `NOW()` |
| `updated_at` | `TIMESTAMP` | DEFAULT `NOW()` |

---

## Scripts

```bash
npm run dev      # Start with hot reload (tsx watch)
npm run build    # Bundle with tsup → dist/
npm run start    # Run production build
```
