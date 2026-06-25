# DevPulse

> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🔗 Live Link

[https://your-live-link-here.com](https://your-live-link-here.com) *(will be updated after deploy)*

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (LTS)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (native `pg` driver, raw SQL only)
- **Auth:** JWT (`jsonwebtoken`) + bcrypt password hashing
- **Other:** `http-status-codes`

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/pronoyNath/DevPulse.git
cd DevPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=5000
CONNECTIONSTRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 4. Run the server

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| `contributor` | Register, login, create issues, view all issues, update own open issues |
| `maintainer` | All contributor permissions + update any issue, change status, delete issues |

---

## 🌐 API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Issues

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/issues` | Public | Get all issues (with filter & sort) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| POST | `/api/issues` | Authenticated | Create a new issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query params for `GET /api/issues`

| Param | Values | Default |
|-------|--------|---------|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

**Example:**
```
GET /api/issues?sort=oldest&type=bug&status=open
```

---

## 🔐 Authentication

Send the JWT token in the `Authorization` header:

```
Authorization: <your_token>
```

---

## 📁 Project Structure

```
src/
├── config/         # Environment config
├── db/             # PostgreSQL pool & schema init
├── middleware/     # Auth middleware, error handler
├── modules/
│   ├── auth/       # Signup & login
│   └── issues/     # Issues CRUD
├── types/          # Shared TypeScript types
├── utility/        # sendResponse helper
├── app.ts
└── server.ts
```
