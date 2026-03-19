# swimly-api — Neon Setup


### 1. Pull remote branches

If you have just cloned the repo, fetch all remote branches first:

```bash
git fetch origin
```

### 2. Checkout the setup branch

```bash
git checkout chore/backend-neon-setup
```

### 3. Navigate to the backend directory

```bash
cd backend
```

### 4. Install dependencies

```bash
npm install
```

### 5. Set up environment variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Then open `.env` and fill in the Neon connection string your teammate will provide:

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.aws.neon.tech/swimly?sslmode=require"
```

> ⚠️ Never commit the `.env` file. It is already listed in `.gitignore`.

### 6. Generate the Prisma client

```bash
npx prisma generate
```

### 7. Verify the database connection

```bash
npx prisma migrate dev
```

You should see:

```
Datasource "db": PostgreSQL database "neondb" at "..."
Already in sync, no schema change or pending migration was found.
```

If you see this, you are connected and ready to go.

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database models
│   └── migrations/         # Migration history
├── src/
│   └── lib/
│       └── prisma.ts       # Prisma client instance
├── generated/
│   └── prisma/             # Auto-generated Prisma client (do not edit)
├── prisma.config.ts        # Prisma CLI configuration
├── .env                    # Local environment variables (not committed)
├── .env.example            # Environment variable template
└── package.json
```

---

## Useful Commands

| Command | Description |
|---|---|
| `npx prisma generate` | Regenerate the Prisma client after schema changes |
| `npx prisma migrate dev --name <name>` | Create and apply a new migration |
| `npx prisma studio` | Open Prisma Studio to browse the database |
| `npx prisma db pull` | Pull the current database schema into Prisma |

---
