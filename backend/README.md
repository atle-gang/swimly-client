# Swimly API Documentation (Straightforward Guide)

## Local Setup For Testing and Development

_**It is recommended that you use WSL or Linux for this setup, and have a Neon (a serverless PostgreSQL database) account.**_

### 1. Install required (dev) dependencies

```bash
npm install
```

### 2. Migrate schemas

**Note: This requires you have set up a PSQL database on Neon.**

```bash
npx prisma migrate dev --name init;
npx prisma generate;
npx prisma db seed;
npm run dev;
```

### 3. Add the port number and Neon connection string to the `.env` file

### 4. Run the server

```bash
npm run dev
```

---
