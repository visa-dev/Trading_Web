# Deployment Notes

## ✅ Production Ready (PostgreSQL)

The project is now configured for PostgreSQL deployment on Vercel:

### Current Setup
- ✅ Schema: `provider = "postgresql"`
- ✅ Migration files created in `prisma/migrations/`
- ✅ Vercel build command configured
- ✅ Environment variables template ready

## Vercel Deployment

### 1. Environment Variables

Set these in your Vercel project settings:

```
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-api-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NODE_ENV="production"
```

### 2. Build Command

The `vercel.json` is configured with:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

This will:
1. Generate Prisma Client
2. Apply database migrations
3. Build the Next.js application

### 3. First Deployment

On first deployment, Prisma will:
- Apply the initial migration
- Create all tables and relationships
- Set up the database schema

### 4. Seed Database (Optional)

After first deployment, you can seed the database by:
1. Running the seed script locally with production DATABASE_URL
2. Or using Vercel CLI: `vercel env pull` then `npm run db:seed`

## Local Development

### Option 1: Use PostgreSQL (Recommended)

1. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/trading_performance"
   ```

2. Run migrations:
   ```bash
   npm run migrate
   ```

3. Seed database:
   ```bash
   npm run db:seed
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

### Option 2: Use SQLite (Quick Start)

If you want to use SQLite for local development:

1. Change `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Push schema:
   ```bash
   npm run db:push
   ```

4. Seed database:
   ```bash
   npm run db:seed
   ```

**Note:** Remember to change back to PostgreSQL before deploying!

## Migration Management

### Create New Migration
```bash
npm run migrate
```

### Apply Migrations (Production)
```bash
npm run migrate:deploy
```

### View Database
```bash
npm run studio
```

## Troubleshooting

### Error: "the URL must start with the protocol `postgresql://`"
- Make sure `DATABASE_URL` in Vercel starts with `postgresql://` or `postgres://`
- Check that the schema provider is set to `"postgresql"`

### Error: "Migration not found"
- Ensure `prisma/migrations/` folder is committed to Git
- Check that migration files exist in the repository

### Error: "Database connection failed"
- Verify DATABASE_URL is correct in Vercel environment variables
- Check database credentials and network access
- Ensure SSL mode is set if required: `?sslmode=require`

## Current Status

- ✅ Schema configured for PostgreSQL
- ✅ Initial migration created
- ✅ Build scripts updated
- ✅ Vercel configuration ready
- ✅ Ready for deployment
