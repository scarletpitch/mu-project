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

Once you have added models to `prisma/schema.prisma`, generate the client:

```bash
npm run prisma:generate
```

The schema is currently baseline-only (no models). `npx prisma validate` confirms it is valid and ready for models to be added.

### Run migrations (when models are added)

Once database models are defined in `prisma/schema.prisma`, run:

```bash
npm run prisma:migrate
```

You will be prompted for a migration name.

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
