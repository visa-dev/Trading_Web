# Migration Guide: SQLite to PostgreSQL

This guide will help you migrate from SQLite (development) to PostgreSQL (production) for Vercel deployment.

## Prerequisites

- Your project already set up with SQLite
- PostgreSQL database ready (Vercel Postgres or Neon)
- Prisma installed and configured

## Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres
1. Go to Vercel Dashboard → Storage
2. Create new Postgres database
3. Copy connection string

### Option B: Neon Database
1. Go to https://neon.tech
2. Create new project
3. Copy connection string

## Step 2: Update Environment Variables

Add PostgreSQL connection string to your `.env`:

```env
# Development (keep this)
DATABASE_URL="file:./dev.db"

# Production PostgreSQL (add this)
DATABASE_URL_PROD="postgresql://user:password@host:5432/database?schema=public"
```

## Step 3: Create Production Schema File

Create a new schema file for PostgreSQL:

```bash
cp prisma/schema.prisma prisma/schema.prod.prisma
```

Or temporarily update your main schema:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

## Step 4: Generate Migrations

```bash
# Set production database URL
export DATABASE_URL="postgresql://..."

# Generate Prisma Client for PostgreSQL
npx prisma generate

# Create migration
npx prisma migrate dev --name init_postgres

# Apply migration
npx prisma migrate deploy
```

## Step 5: Seed Production Database

```bash
# Make sure DATABASE_URL points to PostgreSQL
export DATABASE_URL="postgresql://..."

# Run seed script
npx tsx prisma/seed.ts
```

## Step 6: Configure for Different Environments

Create separate schema files and use environment variables:

### Development Setup

`prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Production Setup

Update schema before deployment or use script:

```json
// package.json
{
  "scripts": {
    "schema:switch": "node scripts/switch-schema.js"
  }
}
```

## Alternative: Environment-Based Schema

Use a single schema that switches based on environment:

```prisma
datasource db {
  provider = "postgresql"  // Use PostgreSQL for all environments
  url      = env("DATABASE_URL")
}
```

Then use connection pooling for development:
```env
DATABASE_URL="postgresql://dev-database-url"
```

## Step 7: Update Vercel Configuration

In `vercel.json`, ensure build commands are correct:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

## Step 8: Test Production Build Locally

```bash
# Set production database
export DATABASE_URL="postgresql://..."

# Build for production
npm run build

# Test production build
npm start
```

## Common Issues and Solutions

### Issue 1: Enum Values Not Compatible

**SQLite** allows any string in enum
**PostgreSQL** is strict about enum values

**Solution**: Ensure all enum values in data match schema exactly

```prisma
enum UserRole {
  USER
  TRADER
}
```

### Issue 2: JSON Field Handling

Both SQLite and PostgreSQL support JSON, but syntax may differ.

**Solution**: Use `Json` type consistently in Prisma

```prisma
performanceMetrics   Json?
```

### Issue 3: Date/Time Formats

**Solution**: Use Prisma DateTime which works the same in both

```prisma
createdAt    DateTime  @default(now())
updatedAt    DateTime  @updatedAt
```

### Issue 4: Auto-increment IDs

SQLite: INTEGER PRIMARY KEY
PostgreSQL: SERIAL or UUID

**Solution**: Use `@default(cuid())` which works in both

```prisma
id String @id @default(cuid())
```

## Verification Checklist

- [ ] PostgreSQL database created and accessible
- [ ] Connection string verified
- [ ] Schema updated to use postgresql provider
- [ ] Migration created and applied
- [ ] Data seeded successfully
- [ ] All queries working in PostgreSQL
- [ ] Build completes without errors
- [ ] Vercel deployment successful

## Rollback Plan

If issues occur, you can rollback:

```bash
# Revert schema
git checkout prisma/schema.prisma

# Use SQLite again
export DATABASE_URL="file:./dev.db"

# Regenerate
npx prisma generate
npx prisma db push
```

## Recommended Workflow

1. **Development**: Continue using SQLite locally
2. **Staging**: Use PostgreSQL for testing
3. **Production**: Use PostgreSQL on Vercel

Use environment-specific DATABASE_URL:
- `.env.local`: SQLite
- `.env.staging`: PostgreSQL (staging)
- `.env.production`: PostgreSQL (production)

## Additional Resources

- [Prisma Migration Guide](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-sqlite)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon Documentation](https://neon.tech/docs)

## Support

If you encounter issues:
1. Check Prisma logs: `npx prisma migrate status`
2. Verify DATABASE_URL format
3. Check PostgreSQL logs
4. Review migration history

