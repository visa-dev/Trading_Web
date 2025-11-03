# Quick Start Checklist for Vercel Deployment

Use this checklist to deploy your Trading Performance Tracker to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] No sensitive data in code (use environment variables)
- [ ] `.env` in `.gitignore`
- [ ] `prisma/dev.db` in `.gitignore`
- [ ] No hardcoded credentials

### 2. Database Setup
- [ ] PostgreSQL database created (Vercel Postgres or Neon)
- [ ] Connection string copied
- [ ] Database credentials stored securely

### 3. Environment Variables Ready
```env
DATABASE_URL="postgresql://..." (your production database)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generated-secret-32-chars"
GOOGLE_CLIENT_ID="your-client-id" (if using OAuth)
GOOGLE_CLIENT_SECRET="your-client-secret" (if using OAuth)
NODE_ENV="production"
```

### 4. Google OAuth (Optional)
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Credentials created
- [ ] Redirect URIs added:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://your-app.vercel.app/api/auth/callback/google`

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import GitHub repository
4. Configure settings (auto-detected)
5. Add environment variables
6. Deploy

**Option B: CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 3: Configure Database
1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Commit and push changes:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL"
git push origin main
```

### Step 4: Run Migrations
Vercel will automatically run migrations on build, but verify:
1. Go to Vercel deployment logs
2. Check for "prisma migrate deploy" success
3. Or SSH and run manually:
```bash
npx prisma migrate deploy
```

### Step 5: Seed Database
```bash
# Option 1: Via Vercel dashboard terminal
npx tsx prisma/seed.ts

# Option 2: Via local connection
export DATABASE_URL="postgresql://..."
npx tsx prisma/seed.ts
```

## ✅ Post-Deployment Verification

### Functional Tests
- [ ] Site loads at deployed URL
- [ ] Homepage displays correctly
- [ ] Navigation works
- [ ] Authentication works
- [ ] Database queries succeed
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Videos play
- [ ] Chat works (if applicable)

### Performance Checks
- [ ] Page loads in < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enforced

### Security Checks
- [ ] All environment variables set
- [ ] No secrets exposed
- [ ] Database credentials secure
- [ ] OAuth redirects working
- [ ] HTTPS only
- [ ] CORS configured

## 🔧 Common Issues & Fixes

### Issue: Build Failed - Prisma Error
**Fix:** Verify DATABASE_URL is set correctly in Vercel environment variables

### Issue: Database Connection Failed
**Fix:** Check PostgreSQL connection string format and SSL requirements

### Issue: Migrations Failed
**Fix:** Run manually via Vercel dashboard terminal or local connection

### Issue: 404 Errors
**Fix:** Check `vercel.json` configuration and routing

### Issue: OAuth Not Working
**Fix:** Verify redirect URIs match deployment URL

## 📊 Monitoring

After deployment, monitor:
- Vercel Analytics
- Error logs in dashboard
- Database performance
- User feedback
- API response times

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main branch
- Pull request opened
- Manual deployment trigger

Configure in:
- Vercel → Project Settings → Git

## 📞 Support Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [PostgreSQL Migration](./MIGRATION_TO_POSTGRES.md)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## ⚠️ Important Reminders

1. **Never commit `.env` files**
2. **Always test migrations locally first**
3. **Backup database before major changes**
4. **Use staging environment for testing**
5. **Monitor error logs regularly**
6. **Keep dependencies updated**
7. **Rotate secrets periodically**

## 🎉 Success!

Once all checks pass, your app is live! Share the URL and monitor for any issues.

**Next Steps:**
- Set up custom domain (optional)
- Configure Vercel Analytics
- Enable performance monitoring
- Set up error tracking (Sentry, etc.)
- Configure CDN caching
- Add backup strategies

