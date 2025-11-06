# Deployment Notes

## Environment Setup

### Local Development (SQLite)
The project is currently configured for local development with SQLite:
- Database: `prisma/dev.db` (SQLite)
- Schema: `provider = "sqlite"`
- Build: Uses `prisma db push` (no migrations needed)

### Production Deployment (PostgreSQL)

When deploying to Vercel or production, you need to:

1. **Update Prisma Schema** (`prisma/schema.prisma`):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Set Environment Variables** in Vercel:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-api-key"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-production-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NODE_ENV="production"
   ```

3. **Create Migrations** (if needed):
   ```bash
   npm run migrate
   ```

4. **Vercel Build Command**:
   The `vercel.json` already uses the correct build command for PostgreSQL:
   ```json
   "buildCommand": "prisma generate && prisma migrate deploy && next build"
   ```

## Quick Switch Script

To switch between SQLite (local) and PostgreSQL (production):

### Switch to PostgreSQL:
1. Change `prisma/schema.prisma` provider to `"postgresql"`
2. Update `.env` with PostgreSQL connection string
3. Run `npm run migrate` to create migrations
4. Run `npm run build:prod` to test

### Switch back to SQLite:
1. Change `prisma/schema.prisma` provider to `"sqlite"`
2. Update `.env` with `DATABASE_URL="file:./prisma/dev.db"`
3. Remove `prisma/migrations` folder (if switching from PostgreSQL)
4. Run `npm run db:push` to sync schema
5. Run `npm run build` to test

## Current Setup

- ✅ `.env` file created with SQLite configuration
- ✅ `.env.example` created as template
- ✅ Database seeded with sample data
- ✅ Local build working
- ✅ Vercel build command configured for PostgreSQL

