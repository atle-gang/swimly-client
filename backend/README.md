# Swimly API Documentation (Straightforward Guide)

## Local Setup For Testing and Development

_**It is recommended that you use WSL or Linux for this setup.**_

### 1. Install required (dev) dependencies.

```bash
npm install
```

### 2. Migrate schemas.

**Note: This requires you have set up both PSQL and pgBouncer (and both are running) and have created a database where the schemas will be migrated.**

```bash
npx prisma migrate dev; npx prisma generate
```

### 3. Run the server.

```bash
npm run dev
```

---

## API Routes (and Route Type)

1. `"/swimly-api/user"` -> User API Route:

- `/register` (POST): Registers user into database.
- `/login` (POST): Logs user into database.
- `/change-password` (PATCH): Lets user change/update password into new password.
- `/reset-password` (PATCH): Resets user password during login session.
- `/delete` (DELETE): Deletes user, and related records, from database.

2. `"/swimly-api/user/balance"` -> User Balance API Route:

- `"/data"` (GET): Retrieves logged user's balance (swimming points).
- `"/update"` (PATCH): Updates user's balance.

3. `"/swimly-api/user/transactions"` -> User Transactions API Route:

- `"/"` (POST): Logs transaction of lesson, along with details of scheduled lesson.
- `"/data"` (GET): Retrieves recorded transactions.