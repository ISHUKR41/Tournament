# 🚀 Supabase Integration Guide - Complete Setup

## ✅ Your Supabase Project Details

**Project Reference**: `ielwxcdoejxahmdsfznj`  
**Project URL**: https://ielwxcdoejxahmdsfznj.supabase.co  
**Region**: Auto-detected by Supabase

---

## 🔐 Your Credentials (Already Configured in Replit)

All these credentials are securely stored in Replit Secrets and automatically available:

### 1. Supabase URL
```
SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co
```

### 2. Anonymous/Public Key (Safe for Frontend)
```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o
```

### 3. Service Role Key (Backend Only - Keep Secret!)
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE
```

### 4. Session Secret (For Admin Authentication)
```
SESSION_SECRET=[Auto-generated secure random string]
```

### 5. Database URL (PostgreSQL Connection String)
```
DATABASE_URL=[Your Supabase PostgreSQL connection string]
```

**How to get your DATABASE_URL:**

1. Go to: https://supabase.com/dashboard/project/ielwxcdoejxahmdsfznj/settings/database
2. Find "Connection string" section
3. Select **"Connection pooling"** (recommended for serverless)
4. Copy the URI format - it looks like:
   ```
   postgresql://postgres.ielwxcdoejxahmdsfznj:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Database Password:**
- If you saved it during project creation, use that
- If not, click "Reset database password" in the Database settings and set a new one

---

## 📊 Database Tables

Your application uses these PostgreSQL tables in Supabase:

### `admin_users` Table
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `teams` Table
```sql
CREATE TABLE teams (
  id VARCHAR PRIMARY KEY,
  game_type TEXT NOT NULL DEFAULT 'pubg',
  team_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_whatsapp TEXT NOT NULL,
  leader_player_id TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  player2_player_id TEXT NOT NULL,
  player3_name TEXT NOT NULL,
  player3_player_id TEXT NOT NULL,
  player4_name TEXT NOT NULL,
  player4_player_id TEXT NOT NULL,
  youtube_vote TEXT NOT NULL DEFAULT 'no',
  transaction_id TEXT NOT NULL,
  payment_screenshot TEXT NOT NULL,
  agreed_to_terms INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Note:** These tables will be automatically created when you first run the application!

---

## 🌐 Deploying to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Tournament platform with Supabase integration"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`

### Step 3: Add Environment Variables in Vercel

Go to: **Project Settings → Environment Variables**

Add these EXACT variables:

```env
# Supabase Configuration
SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres.ielwxcdoejxahmdsfznj:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres

# Session Security
SESSION_SECRET=[Generate with: openssl rand -base64 32]

# Environment
NODE_ENV=production
```

**Important Notes:**
- Replace `[YOUR-PASSWORD]` in DATABASE_URL with your actual Supabase database password
- Generate SESSION_SECRET using: `openssl rand -base64 32` or use https://randomkeygen.com
- Set all variables as **"Production"** environment type
- These same variables work for **Preview** and **Development** environments too

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://your-project.vercel.app`

### Step 5: Verify Everything Works

After deployment, test these:

✅ Homepage loads correctly  
✅ PUBG page: `https://your-project.vercel.app/pubg`  
✅ Free Fire page: `https://your-project.vercel.app/free-fire`  
✅ Admin login: `https://your-project.vercel.app/admin/login`  
✅ Page refresh works (no 404 errors)  
✅ Team registration works  
✅ Data syncs across all users in real-time

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change admin password immediately after first login!

---

## 🔄 Real-Time Data Sync

With Supabase PostgreSQL:
- ✅ All users see the same data
- ✅ Changes reflect in real-time (5-second polling)
- ✅ No data loss between deployments
- ✅ Works perfectly on Vercel serverless
- ✅ Multiple browser windows/users stay synced

---

## 🐛 Troubleshooting

### Issue: "Page Not Found" on Refresh

**Solution:** Already fixed in `vercel.json` with proper rewrites!

### Issue: Different users see different data

**Solution:** Ensure DATABASE_URL points to Supabase (not local PostgreSQL)

### Issue: Database connection error

**Possible causes:**
1. DATABASE_URL not set in Vercel environment variables
2. Wrong database password in connection string
3. Supabase database paused (free tier auto-pauses after 1 week inactivity)

**Fix:**
- Verify DATABASE_URL is correct
- Check Supabase dashboard - wake up database if paused
- Reset database password if needed

### Issue: Deployment fails

**Common fixes:**
1. Ensure all environment variables are set in Vercel
2. Check build logs for specific errors
3. Verify `vercel.json` and `package.json` are committed to Git

---

## 📝 External Data Sources (Optional)

You mentioned having data in these sources:

### OneDrive Excel Files
- Password: `ISHUkr21@`
- Links provided in attached files

### Google Sheets
- Public access (no password needed)
- Link: https://docs.google.com/spreadsheets/d/1B31pDhZOULFIIX9I9JWSN630YMQbu9XQczZTlaHlZeA/edit

### Google Drive Folder
- Public access
- Link: https://drive.google.com/drive/folders/1W3vTEuU2g_RfZulxAAWfI0nOAQzb_OsT

**Note:** These are currently NOT integrated into the app. The tournament platform uses Supabase PostgreSQL as the primary database. If you want to import data from these sources, we can create a migration script.

---

## 🎯 What's Already Done

✅ Supabase credentials configured in Replit Secrets  
✅ Environment variables documented  
✅ Database schema defined  
✅ Vercel deployment configuration ready  
✅ Page routing fixed (no more 404 on refresh)  
✅ Real-time data sync enabled  

---

## 🚀 Next Steps

1. **Get your Database PASSWORD** from Supabase dashboard
2. **Update DATABASE_URL** in Replit Secrets
3. **Test locally** - restart the Replit app to connect to Supabase
4. **Deploy to Vercel** - follow steps above
5. **Share with users** - everyone will see the same data!

---

**Last Updated:** October 20, 2025  
**Status:** Ready for deployment with Supabase PostgreSQL
