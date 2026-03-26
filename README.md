# swimly-client

A booking and management web app for children's swim schools (ages 0–5). Frontend and backend live in this repo.

---

## Tech Stack

**Frontend**
- React 18 (Vite)
- React Router v6
- React Hook Form + Zod
- Lucide React
- CSS Modules
- React Context (auth)
- Vitest + Testing Library

**Backend**
- Express + Node.js + TypeScript
- Prisma ORM
- PostgreSQL via [Neon](https://neon.tech)
- JWT auth (bcryptjs)

---

## Repo Structure

```
swimly-client/
├── backend/                  # Express API
│   ├── generated/prisma/     # Auto-generated Prisma client (do not edit)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── routes/
│   │   ├── userRoutes.ts
│   │   ├── balanceRoutes.ts
│   │   ├── childRoutes.ts
│   │   ├── lessonRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   └── paymentRoutes.ts
│   ├── client.ts             # Prisma client instance
│   ├── server.ts             # Express entry point
│   ├── prisma.config.ts
│   ├── .env                  # Not committed
│   └── .env.example
└── frontend/                 # React app
    ├── src/
    │   ├── components/
    │   │   ├── AppLayout/    # Wraps protected pages with BottomNav
    │   │   ├── BottomNav/    # Book, Pricing, Profile tabs
    │   │   ├── ProtectedRoute/
    │   │   └── Skeleton/     # Shimmer loading states
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   ├── AuthProvider.jsx
    │   │   └── useAuth.js
    │   ├── data/
    │   │   └── bookingData.js
    │   ├── pages/
    │   │   ├── Booking/
    │   │   ├── EditChild/
    │   │   ├── Intake/
    │   │   ├── Login/
    │   │   ├── Pricing/
    │   │   ├── Profile/
    │   │   └── Registration/
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── balanceService.js
    │   │   ├── bookingService.js
    │   │   ├── childService.js
    │   │   ├── lessonService.js
    │   │   └── paymentService.js
    │   ├── test/
    │   │   ├── setup.js
    │   │   ├── utils/
    │   │   └── validation/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── .env.example
```

---

## Pages

| Page | Route | Auth |
|---|---|---|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Intake Form | `/intake` | Protected |
| Booking | `/booking` | Protected |
| Pricing | `/pricing` | Protected |
| Profile | `/profile` | Protected |
| Edit Child | `/children/:id/edit` | Protected |

**Flow:** Register → Intake Form → Booking → Profile / Pricing

---

## Getting Started

### 1. Clone the repo

```bash
git clone git@github.com:atle-gang/swimly-client.git
cd swimly-client
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-secret-here"
PORT=3000
```

Then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run dev
```

The API runs on `http://localhost:3000`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Open `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## Setting Up Neon (for testing)

If you need your own database instance — for example to test schema changes without touching the shared dev database — here's how to set one up.

### 1. Create a Neon project

- Go to [neon.tech](https://neon.tech) and sign up or log in
- Click **New Project**, name it `swimly-test` or similar
- Once created, copy the connection string from the dashboard — it looks like:

```
postgresql://username:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require
```

### 2. Update your `.env`

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require"
```

### 3. Run migrations and seed

```bash
npx prisma migrate reset             # wipes the database cleanly
npx prisma migrate dev --name init   # creates all tables from the schema
npx prisma generate                  # builds the typed Prisma client
npx prisma db seed                   # seeds 14 days of lesson slots
```

### 4. Verify

```bash
npx prisma studio
```

Opens a browser UI at `http://localhost:5555` — you should see `Lesson` rows spread across multiple days and all 4 age groups.

---

## Running Tests

From the `frontend` directory:

```bash
npm run test
```

Covers utility functions (`bookingUtils`, `intakeUtils`, `pricingUtils`) and Zod schema validation — including the nap time end-after-start rule and Rule of 4 logic.

---

## Branch Structure

```
main
└── development
    ├── feature/your-feature-name
    ├── fix/bug-description
    └── chore/tooling-change
```

| Branch | Purpose |
|---|---|
| `main` | Production-ready only. Never commit directly. |
| `development` | Integration branch. All features merge here first. |
| `feature/*` | One branch per feature or task. Branch off `development`. |
| `fix/*` | Bug fixes. Branch off `development`. |

---

## Development Workflow

### 1. Always start from `development`

```bash
git checkout development
git pull origin development
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

**Naming conventions:**

| Prefix | When to use |
|---|---|
| `feature/` | New page, component, or functionality |
| `fix/` | Bug fix |
| `chore/` | Config, dependencies, tooling |
| `refactor/` | Code cleanup with no behaviour change |
| `docs/` | README or documentation changes |
| `test/` | Adding or updating tests |

### 3. Commit with clear messages

```
type: short description of what changed
```

Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`

### 4. Push and open a PR into `development`

```bash
git push -u origin feature/your-feature
```

- Open a PR into `development`, not `main`
- Do not merge your own PR

---

## Rules

- **Never push directly to `main` or `development`**
- **Delete feature branches after merging**
- **Pull `development` before starting new work**
- **Never commit `.env`**

---

## Contributors

- Atlegang Sethono — [@atle-gang](https://github.com/atle-gang)
- Sinethemba Tompelo — [@Snax777](https://github.com/Snax777)