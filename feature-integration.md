# feature/integration — PR Description

Big one. This branch connects the frontend to the backend and restructures a lot of things. Read through before you pull.

---

## What changed on the backend

### Schema — full rework

The old `Transaction` model was doing too much — it was storing child data, health concerns, nap times, booking info and payment info all in one row. It has been replaced with proper separate models:

- `Child` — stores the intake form data per user
- `NapTime` — each child can have up to 3 nap windows, stored as separate rows
- `Lesson` — available swim class slots (seeded, see below)
- `Booking` — joins a child to a lesson, enforces the Rule of 4
- `Payment` — records credit pack and single lesson purchases

`User` and `Balance` are mostly unchanged except `name` and `surname` no longer have `@unique` on them — two parents can share a first name, that constraint never made sense.

### Fix — `DIRECT_URL` → `DATABASE_URL`

The `prisma.config.ts` had `url: env('DIRECT_URL')` which was breaking migrations for anyone who didn't have that variable set. Changed it back to `DATABASE_URL`. Make sure your `.env` only has `DATABASE_URL` — you don't need `DIRECT_URL`.

### New routes

| Route                             | What it does                              |
| --------------------------------- | ----------------------------------------- |
| `POST /swimly-api/children`       | Save a child profile from the intake form |
| `GET /swimly-api/children`        | Get all children for the logged in user   |
| `GET /swimly-api/children/:id`    | Get a single child                        |
| `PATCH /swimly-api/children/:id`  | Update experience, flags and nap times    |
| `GET /swimly-api/lessons`         | Get available lesson slots                |
| `POST /swimly-api/bookings`       | Book a lesson — Rule of 4 enforced here   |
| `DELETE /swimly-api/bookings/:id` | Cancel a booking, refunds 1 credit        |
| `POST /swimly-api/payments`       | Record a purchase and add credits         |
| `GET /swimly-api/payments`        | Get payment history                       |

The old `transactionRoutes.ts` has been removed.

### Lesson seed

Added `prisma/seed.ts` — seeds 14 days of lesson slots across all 4 age groups so the booking page has real data to show.

---

## Commands to run on your end

Pull the branch first:

```bash
git fetch origin
git checkout feature/integration
cd backend
npm install
```

Then reset your local database and apply the new schema from scratch — the old migrations have been deleted and replaced with one clean one:

```bash
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run dev
```

`migrate reset` will wipe your local data — that's fine, nothing worth keeping. After `db seed` you should have lessons in the database and the server should start clean.

---

## What changed on the frontend

### Auth

- Added `AuthContext`, `AuthProvider` and `useAuth` hook — JWT token stored in localStorage, user state shared across the app
- Login and Register pages wired to the backend
- `ProtectedRoute` component — unauthenticated users get redirected to `/login`

### Services layer

All API calls go through service files now, nothing is hardcoded in pages:

- `authService.js` — register, login, token helpers
- `childService.js` — create, get, update child profiles
- `lessonService.js` — fetch available slots
- `bookingService.js` — create and cancel bookings
- `paymentService.js` — purchase packs and single lessons
- `balanceService.js` — fetch and update credit balance

`transactionService.js` has been removed.

### New pages

- `RegistrationPage` — matches the backend User model fields (name, surname, username, email, password)
- `LoginPage` — email + password, redirects back to wherever the user was trying to go
- `ProfilePage` — shows account info, children list and upcoming bookings. Tap a child to edit. Cancel bookings inline.
- `EditChildPage` — edit experience level, medical flags, notes and nap times. Name and DOB are read-only.

### Navigation

- `BottomNav` — Book, Pricing, Profile tabs shown on all protected pages
- `AppLayout` — wraps protected pages with the nav so we don't have to add it to every page manually
- Intake and Edit Child are full screen flows with no nav bar

### Flow

```
Login / Register → Intake Form → Booking → Profile
                                          ↕
                                        Pricing
```

### Skeleton loaders

Replaced the "Loading…" text on the booking page and profile page with shimmer skeleton loaders that match the shape of the real content.

---

## Env variable needed on frontend

Make sure you have a `.env` in the frontend root:

```
VITE_API_BASE_URL=http://localhost:3000
```

---

If anything breaks on your end after pulling, most likely cause is the migrations not being run or `prisma generate` not being run. Do the commands above in order and it should be fine.
