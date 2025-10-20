# Complete Vercel Deployment Guide - Tournament App

## 🚀 Step-by-Step Deployment Process

### Step 1: Environment Variables Setup

In your Vercel dashboard, set these environment variables:

#### Required Variables:

```env
# Supabase Configuration
SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE

# Authentication
JWT_SECRET=tournament-app-super-secret-jwt-key-2025-production

# Database (auto-constructed from Supabase credentials)
DATABASE_URL=postgresql://postgres.ielwxcdoejxahmdsfznj:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE@aws-0-ap-south-1.pooler.supabase.co:6543/postgres

# Production Environment
NODE_ENV=production
```

### Step 2: Build Configuration

Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build",
    "start": "node api/index.js"
  }
}
```

### Step 3: Vercel Configuration

Your `vercel.json` is properly configured with:

- ✅ SPA routing (no more refresh errors)
- ✅ API routing to serverless functions
- ✅ Proper CORS headers
- ✅ Cache optimization
- ✅ Security headers

### Step 4: Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import the repository
4. Set environment variables in Vercel dashboard
5. Deploy automatically

#### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 5: Supabase Database Setup

#### Enable Row Level Security (RLS)

In your Supabase dashboard, run these SQL commands:

```sql
-- Enable RLS on tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to teams
CREATE POLICY "Enable read access for all users" ON "public"."teams"
FOR SELECT USING (true);

-- Allow public insert for team registration
CREATE POLICY "Enable insert for all users" ON "public"."teams"
FOR INSERT WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Enable all access for service role" ON "public"."teams"
FOR ALL USING (auth.role() = 'service_role');

-- Admin users - service role only
CREATE POLICY "Service role access for admin_users" ON "public"."admin_users"
FOR ALL USING (auth.role() = 'service_role');
```

#### Enable Real-time

In Supabase dashboard:

1. Go to Database > Publications
2. Enable "supabase_realtime" for tables: `teams`, `admin_users`

### Step 6: Testing Your Deployment

#### 1. Health Check

Visit: `https://your-app.vercel.app/api/health`

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-20T...",
  "totalTeams": 0
}
```

#### 2. Test Registration

- Try registering a team on the homepage
- Check if data persists after page refresh
- Verify admin panel shows the registration

#### 3. Test Real-time Updates

- Open app in multiple browser tabs
- Register a team in one tab
- Verify other tabs update automatically

## 🔧 Troubleshooting Common Issues

### Issue 1: "Page Not Found" on Refresh

**Cause**: SPA routing not configured properly
**Fix**: ✅ Already fixed in `vercel.json`

### Issue 2: Database Connection Errors

**Symptoms**:

```
Error: Database connection failed
Error: connect ETIMEDOUT
```

**Solutions**:

```bash
# Check environment variables
vercel env ls

# Update environment variables
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Redeploy
vercel --prod
```

### Issue 3: CORS Errors

**Symptoms**: API calls blocked from browser
**Fix**: ✅ Already configured in `vercel.json` headers

### Issue 4: Real-time Not Working

**Symptoms**: Users don't see live updates
**Fixes**:

1. ✅ Supabase subscriptions implemented
2. ✅ Fallback polling every 30 seconds
3. ✅ Check Supabase RLS policies

### Issue 5: Build Failures

**Common errors and fixes**:

```bash
# TypeScript errors
npm run check

# Missing dependencies
npm install

# Build path issues
rm -rf dist node_modules
npm install
npm run build
```

## 📊 Post-Deployment Checklist

### ✅ Functional Tests

- [ ] Homepage loads correctly
- [ ] Team registration form works
- [ ] Admin login functions
- [ ] Data persists between sessions
- [ ] Real-time updates work
- [ ] Excel export works
- [ ] Mobile responsive design

### ✅ Performance Tests

- [ ] Page load speed < 3 seconds
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] No console errors in production

### ✅ Security Tests

- [ ] Admin routes protected
- [ ] JWT tokens working
- [ ] Input validation active
- [ ] No sensitive data exposed

## 🎯 Performance Optimization

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_teams_game_type ON teams(game_type);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_created_at ON teams(created_at);
```

### Vercel Settings

- **Function Timeout**: 60 seconds (configured)
- **Memory**: 1024 MB (default)
- **Region**: Auto (recommended)

## 🔄 Real-time Features Verification

### Test Real-time Updates:

1. **Open multiple tabs** of your deployed app
2. **Register a team** in one tab
3. **Verify** other tabs show the update within 2-3 seconds
4. **Check admin panel** updates in real-time
5. **Test on different devices** to ensure sync

### Real-time Architecture:

- ✅ **Supabase subscriptions** for instant updates
- ✅ **WebSocket connections** with auto-reconnect
- ✅ **Fallback polling** every 30 seconds
- ✅ **Error handling** and recovery

## 📱 Mobile & Cross-Browser Testing

### Test on:

- [ ] Chrome (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Firefox (Desktop & Mobile)
- [ ] Edge (Desktop)

### Key areas to test:

- [ ] Form submission
- [ ] Image uploads
- [ ] Navigation
- [ ] Real-time updates
- [ ] Admin panel

## 🚨 Emergency Rollback

If deployment fails:

```bash
# Rollback to previous version
vercel rollback

# Or redeploy previous commit
git revert HEAD
git push origin main
```

## 📈 Monitoring & Analytics

### Set up monitoring:

1. **Vercel Analytics**: Enable in dashboard
2. **Error Tracking**: Check Vercel Functions logs
3. **Performance**: Monitor Core Web Vitals
4. **Database**: Supabase dashboard metrics

### Key metrics to watch:

- **Response time**: < 500ms
- **Error rate**: < 1%
- **Database connections**: Monitor usage
- **Real-time subscriptions**: Active connections

## 🔐 Security Best Practices

### Environment Variables:

- ✅ Never commit `.env` files
- ✅ Use different secrets for production
- ✅ Rotate keys regularly
- ✅ Use Vercel encrypted environment variables

### Database Security:

- ✅ Row Level Security enabled
- ✅ Service role for admin operations
- ✅ Input validation on all endpoints
- ✅ Parameterized queries (Drizzle ORM)

## 📞 Support & Maintenance

### Regular Tasks:

1. **Monitor error logs** weekly
2. **Update dependencies** monthly
3. **Backup database** (Supabase auto-backup)
4. **Check performance metrics** weekly
5. **Test critical paths** after updates

### Getting Help:

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: Check console logs first

---

## ✅ Deployment Success Indicators

Your app is successfully deployed when:

1. ✅ **Health endpoint** returns healthy status
2. ✅ **Homepage loads** without errors
3. ✅ **Team registration** works and persists
4. ✅ **Admin panel** accessible and functional
5. ✅ **Real-time updates** working across tabs
6. ✅ **Data sync** consistent for all users
7. ✅ **Page refresh** doesn't break the app
8. ✅ **Mobile responsive** on all devices

**Your tournament app is now fully deployed and ready for production use! 🎉**
