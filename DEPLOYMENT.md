# Deployment Guide for Vercel

This guide will help you deploy your Trading Performance Tracker to Vercel with a PostgreSQL database.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (recommended: Vercel Postgres or Neon)

## Step-by-Step Deployment

### 1. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage tab
3. Click "Create Database" → "Postgres"
4. Select your region and plan
5. Copy the connection string

#### Option B: Neon Database (Alternative)
1. Go to https://neon.tech
2. Create a new project
3. Copy your connection string

### 2. Prepare Your Repository

Make sure your project is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 3. Deploy to Vercel

#### Method 1: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework: Next.js (auto-detected)
   - Build Command: `prisma generate && prisma migrate deploy && next build`
   - Install Command: `npm install`
   - Output Directory: `.next`

#### Method 2: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### 4. Configure Environment Variables

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-a-random-secret-key
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Update Prisma Schema for Production

Your current schema uses SQLite. For production, you need PostgreSQL:

1. Create a new branch for database migration
2. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Create and run migrations:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

### 6. Set Up Google OAuth (Optional)

If you're using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-app.vercel.app/api/auth/callback/google`
6. Copy Client ID and Secret to Vercel environment variables

### 7. Deploy and Test

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Wait for build to complete
4. Visit your deployed site
5. Test authentication and database operations

### 8. Seed Database (Optional)

To populate with initial data:

1. SSH into Vercel deployment or use local connection
2. Run seed script:
```bash
npx tsx prisma/seed.ts
```

## Troubleshooting

### Common Issues

**Error: Prisma Client not generated**
- Solution: Ensure `postinstall` script runs `prisma generate`
- Check that `DATABASE_URL` is set correctly

**Error: Database connection failed**
- Solution: Verify `DATABASE_URL` format
- Check SSL mode if required: `?sslmode=require`

**Error: Migrations failed**
- Solution: Ensure `prisma migrate deploy` is in build command
- Check Prisma schema compatibility with PostgreSQL

**Error: NextAuth issues**
- Solution: Verify `NEXTAUTH_URL` matches your domain
- Ensure `NEXTAUTH_SECRET` is set

### Build Logs

Check Vercel deployment logs:
1. Go to Deployment → Logs
2. Look for errors in build process
3. Check environment variables are set

## Post-Deployment Checklist

- [ ] Database migrations completed successfully
- [ ] Environment variables configured
- [ ] OAuth redirect URIs updated
- [ ] Authentication working
- [ ] Database queries executing
- [ ] Images/assets loading correctly
- [ ] All routes accessible
- [ ] HTTPS enforced

## Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration-name

# Deploy migrations (production)
npx prisma migrate deploy

# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Seed database
npx tsx prisma/seed.ts
```

## Performance Optimization

1. **Enable Edge Runtime** where applicable
2. **Use ISR** for static content
3. **Optimize images** with Next.js Image component
4. **Enable caching** in Vercel dashboard
5. **Monitor** performance in Vercel Analytics

## Security Checklist

- [ ] All secrets in environment variables
- [ ] Database credentials secure
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection enabled

## Support

For issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Prisma Documentation](https://www.prisma.io/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)

## Important Notes

- **Never commit `.env` files**
- **Use environment variables for all secrets**
- **Test locally before deploying**
- **Monitor error logs regularly**
- **Keep dependencies updated**
- **Backup database regularly**

