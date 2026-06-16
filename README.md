# Maison Chronos — Luxury Watch Store (MERN)

A full-stack e-commerce web application for a luxury watch boutique. Built with **MongoDB**, **Express**, **React**, and **Node.js**, organized as a monorepo with separate `backend/` and `frontend/` folders.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React 19, Vite, React Router, CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Deployment** | Vercel (frontend + serverless API) |

---

## Project structure

```
Mid Project/
├── backend/                    # Express API + MongoDB
│   ├── api/
│   │   └── index.js            # Vercel serverless entry
│   ├── data/
│   │   └── products.json       # Seed catalog (8 watches)
│   ├── src/
│   │   ├── app.js              # Express application
│   │   ├── server.js           # Local dev server
│   │   ├── seed.js             # CLI seed script
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth, admin, error handling
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic (cart)
│   │   └── utils/              # JWT, seed helpers
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, CartItem, Modal…
│   │   ├── context/            # Auth, Cart, Products providers
│   │   ├── pages/              # Home, Products, Cart, About, Contact…
│   │   └── services/           # API client (fetch)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                # Root scripts (run both apps)
├── vercel.json                 # Vercel deploy config
└── README.md
```

---

## Features

### Frontend (6 pages)

- **Home** — Hero section, featured watches, call-to-action buttons
- **Products** — Dynamic grid from API, search + filter (category, price)
- **Product Details** — Full specs, add to cart
- **Cart** — Add, remove, update quantity, live total
- **About** — Brand story
- **Contact** — Form with validation (saved to MongoDB)

Additional: **Login**, **Register**, **Admin seed** page.

### Backend

- REST API with layered architecture (routes → controllers → services/models)
- JWT authentication (register, login, protected routes)
- Server-side cart synced to MongoDB for logged-in users
- Guest cart in browser `localStorage` (merges on login)
- One-click admin seed endpoint + UI at `/admin`

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

A `backend/.env` file is included. For **local development**, you can leave `MONGODB_URI` empty — the app will use an in-memory MongoDB automatically.

For **production (Vercel)** or persistent data, connect **MongoDB Atlas**:

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. **Database Access** → Add user (username + password).
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere) for dev/Vercel.
4. **Database** → Connect → Drivers → copy the connection string.
5. Paste into `backend/.env`:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/maison-chronos?retryWrites=true&w=majority
JWT_SECRET=your-long-random-secret
ADMIN_SECRET=your-admin-seed-password
PORT=5000
```

Replace `USER`, `PASSWORD`, and the cluster hostname with your Atlas values.

**Test the connection:**

```bash
npm run db:test
```

You should see `✅ MongoDB connected` and `Connection successful.`

### 3. Seed the database

```bash
npm run seed
```

### 4. Run locally

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

Vite proxies `/api` requests to the backend automatically.

---

## NPM scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for root, backend, and frontend |
| `npm run dev` | Run backend + frontend together |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |
| `npm run build` | Production build (frontend) |
| `npm run seed` | Populate MongoDB with watch catalog |
| `npm run db:test` | Test MongoDB connection |
| `npm run lint` | Lint backend and frontend |
| `npm run start` | Start backend in production mode |

---

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/products` | — | List all watches |
| GET | `/api/products/:id` | — | Single watch by ID |
| POST | `/api/contact` | — | Submit contact form |
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/cart` | JWT | Get user cart |
| POST | `/api/cart/items` | JWT | Add to cart |
| PATCH | `/api/cart/items/:id` | JWT | Update quantity |
| DELETE | `/api/cart/items/:id` | JWT | Remove item |
| POST | `/api/admin/seed` | Admin secret | Seed catalog |

**Admin seed** — send header `x-admin-secret: YOUR_ADMIN_SECRET`, or use the UI at `/admin`.

---

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Add environment variables in **Project → Settings → Environment Variables**:

   | Variable | Value |
   |----------|--------|
   | `MONGODB_URI` | Atlas connection string |
   | `JWT_SECRET` | Long random string |
   | `ADMIN_SECRET` | Admin seed password |

4. Deploy. Vercel uses `vercel.json` to:
   - Build the React app from `frontend/`
   - Serve the Express API from `backend/api` at `/api/*`

5. After first deploy, seed production data:
   - Visit `https://your-app.vercel.app/admin` and enter `ADMIN_SECRET`, **or**
   - Run `npm run seed` locally with the same `MONGODB_URI`

6. Verify: `https://your-app.vercel.app/api/health`

---

## Environment variables

| Variable | Where | Required |
|----------|--------|----------|
| `MONGODB_URI` | Backend / Vercel | Yes |
| `JWT_SECRET` | Backend / Vercel | Yes |
| `ADMIN_SECRET` | Backend / Vercel | Yes (for seed) |
| `PORT` | Backend (local) | No (default 5000) |
| `VITE_API_URL` | Frontend | No (empty = same origin `/api`) |

---

## Authors

Web Development — Mid Project  
Maison Chronos © 2026
