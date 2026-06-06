# Madame Mu Web

Nuxt 3 app for Madame Mu — a tarot reading experience.

## Local Development

### Prerequisites

- Node.js 20+
- Docker Desktop

### Install dependencies

```bash
npm install
```

### Start the local database

```bash
npm run db:up
```

This starts PostgreSQL and Adminer via Docker Compose.

### Set up environment

Copy the example env file (or create `.env` manually):

```bash
cp .env.example .env
```

The default `.env` already has the correct local `DATABASE_URL` for Docker.

### Generate Prisma client

```bash
npm run prisma:generate
```

### Run migrations

**Local development** — creates a new migration file and applies it. You will be prompted for a migration name:

```bash
npm run prisma:migrate
# equivalent: npx prisma migrate dev --name <migration-name>
```

**Apply existing migrations without prompts** (e.g. after pulling changes from git):

```bash
npx prisma migrate deploy
```

**Seed the database** (78 tarot cards + placeholder meanings):

```bash
npm run db:seed
```

**Reset everything** — drops the database, re-applies all migrations, and re-seeds:

```bash
npm run prisma:reset
```

### Start the dev server

```bash
npm run dev
```

App runs at [http://localhost:3010](http://localhost:3010).

---

## Database Tools

### Adminer (local database UI)

After running `npm run db:up`:

| Field    | Value             |
|----------|-------------------|
| URL      | http://localhost:8080 |
| System   | PostgreSQL        |
| Server   | postgres          |
| Username | madame_mu_user    |
| Password | madame_mu_password |
| Database | madame_mu         |

### Prisma Studio

```bash
npm run db:studio
```

### Stop Docker services

```bash
npm run db:down
```
