# swimly-client

Frontend for **Swimly** — a booking and management web app for children's swim schools. Built with React + Vite.

---

## Tech Stack

- **Framework:** React (Vite)
- **Styling:** TBD
- **State Management:** TBD
- **Routing:** React Router
- **Backend:** [`swimly-api`](https://github.com/atle-gang/swimly-api) — Express + Node.js

---

## Branch Structure

```
main
└── development
    ├── feature/your-feature-name
    ├── feature/another-feature
    └── fix/bug-description
```

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only. Never commit directly. |
| `development` | Integration branch. All features merge here first. |
| `feature/*` | One branch per feature or task. Branched off `development`. |
| `fix/*` | Bug fixes. Branched off `development` (or `main` if hotfix). |

---

## Getting Started

```bash
# Clone the repo
git clone git@github.com:atle-gang/swimly-client.git
cd swimly-client

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## Development Workflow

### 1. Always start from `development`

Before starting any new work, make sure you are on `development` and it is up to date.

```bash
git checkout development
git pull origin development
```

### 2. Create a feature branch

Branch names should be lowercase, hyphenated, and descriptive.

```bash
git checkout -b feature/booking-page
```

**Naming conventions:**

| Prefix | When to use |
|---|---|
| `feature/` | New page, component, or functionality |
| `fix/` | Bug fix |
| `chore/` | Config, dependencies, tooling |
| `refactor/` | Code cleanup with no behaviour change |

Examples:
- `feature/booking-page`
- `feature/intake-form-nap-times`
- `fix/slot-card-overflow`
- `chore/eslint-setup`

### 3. Commit regularly with clear messages

Follow this commit message format:

```
type: short description of what changed
```

Examples:
```bash
git commit -m "feat: add booking page slot cards"
git commit -m "fix: correct nap time picker overflow on mobile"
git commit -m "chore: add react-router-dom"
git commit -m "refactor: extract SlotCard into its own component"
```

Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`

### 4. Push your feature branch

```bash
git push -u origin feature/booking-page
```

### 5. Open a Pull Request into `development`

- Go to the repo on GitHub
- Open a PR from your feature branch **into `development`** (not `main`)
- Give the PR a clear title — e.g. `feat: booking page`
- Leave a short description of what was built or changed
- Request a review from your teammate if applicable
- Do not merge your own PR without a second pair of eyes if working with a teammate

### 6. Merging into `main`

Once `development` is stable and a feature set is complete:

- Open a PR from `development` into `main`
- Both teammates should review before merging
- Merge using **Squash and merge** or **Merge commit** — pick one and stay consistent
- After merging, do not delete `development`

---

## Rules

- **Never push directly to `main`**
- **Never push directly to `development`** — always go through a feature branch and PR
- **Delete feature branches after merging** — keep the branch list clean
- **Pull `development` before starting new work** — avoid merge conflicts
- **One feature per branch** — do not bundle unrelated changes

---

## Project Structure (planned)

```
swimly-client/
├── public/
├── src/
│   ├── assets/
│   ├── components/       # Reusable UI components
│   ├── pages/            # One folder per page/route
│   │   ├── Booking/
│   │   ├── Pricing/
│   │   ├── About/
│   │   ├── Profile/
│   │   └── Home/
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API call functions
│   ├── context/          # React context / global state
│   ├── utils/            # Helper functions
│   ├── App.jsx
│   └── main.jsx
<!-- ├── .env.example -->
├── .gitignore
├── index.html
├── vite.config.js
└── README.md
```

---

<!-- ## Environment Variables

Copy `.env.example` to `.env` and fill in your values. Never commit `.env`.

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

--- -->

## Contributors

- Atlegang Sethono — [@atle-gang](https://github.com/atle-gang)
- Sinethemba Tompelo — [@Snax777](https://github.com/Snax777)