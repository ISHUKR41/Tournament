# 🚀 COMPLETE SETUP AND DEPLOYMENT GUIDE

## ⚠️ IMPORTANT: Database Connection Setup

Your Supabase database connection is failing with "Tenant or user not found". This means we need to get the CORRECT connection string from your Supabase dashboard.

### Step 1: Get Your Database Password

1. Go to: https://supabase.com/dashboard/project/ielwxcdoejxahmdsfznj/settings/database
2. Look for **"Database Settings"** section
3. Find your **database password** or **Reset Database Password** if you don't have it

⚠️ **CRITICAL:** The password `ISHUkr21@` might not be correct or might need to be reset!

### Step 2: Get Connection String

In the same page (Database Settings), scroll to **"Connection String"** section:

1. Select **"Connection pooling"** tab
2. Select **"Session mode"**  
3. Copy the **URI** connection string - it will look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Update .env File

Open `.env` file and update the DATABASE_URL with the connection string from Step 2:

```env
DATABASE_URL=postgresql://postgres.ielwxcdoejxahmdsfznj:[YOUR-ACTUAL-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Remember to URL-encode special characters:**
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`

Example: If password is `ISHUkr21@`, use `ISHUkr21%40`

---

## 📝 Complete Environment Variables

Update your `.env` file with these values:

```env
# Supabase Configuration
SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE
SUPABASE_DB_PASSWORD=[YOUR-ACTUAL-DATABASE-PASSWORD]

# Database Connection - GET THIS FROM SUPABASE DASHBOARD!
DATABASE_URL=[PASTE-YOUR-CONNECTION-STRING-HERE]

# Session Secret
SESSION_SECRET=d8f4h6s9k2m5p7q1w3e5r8t0y2u4i6o8a1s3d5f7g9h1

# Environment
NODE_ENV=development
PORT=5000
```

---

## 🚀 Vercel Deployment

### Step 1: Push to GitHub

```bash
# If not already initialized
git init
git add .
git commit -m "Tournament platform with Supabase"
git branch -M main

# Add your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect settings from `vercel.json`

### Step 3: Add Environment Variables in Vercel

Go to **Project Settings** → **Environment Variables**

Add these variables (use the SAME values from your `.env` file):

```
SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE

SUPABASE_DB_PASSWORD=[YOUR-DATABASE-PASSWORD]

DATABASE_URL=[YOUR-CONNECTION-STRING-FROM-SUPABASE]

SESSION_SECRET=d8f4h6s9k2m5p7q1w3e5r8t0y2u4i6o8a1s3d5f7g9h1

NODE_ENV=production
```

⚠️ **IMPORTANT:** 
- Set these for **Production**, **Preview**, AND **Development** environments
- Make sure DATABASE_URL has special characters URL-encoded!

### Step 4: Deploy

Click **"Deploy"** button and wait 2-3 minutes.

---

## ✅ Enable Supabase Realtime (CRITICAL!)

For real-time data sync across all users:

1. Go to: https://supabase.com/dashboard/project/ielwxcdoejxahmdsfznj/database/replication
2. Find the `teams` table
3. **Enable replication** for the `teams` table
4. Click the toggle to turn it **ON**

Without this, team registrations won't sync in real-time!

---

## 🔧 Fix: 404 Error on Page Refresh

✅ **Already Fixed!** The `vercel.json` file is configured to handle this:
- All routes redirect to `index.html` for client-side routing
- No more 404 errors when you refresh pages!

---

## 🧪 Testing After Deployment

After deployment completes, test these:

1. ✅ **Homepage**: `https://your-app.vercel.app/`
2. ✅ **PUBG Page**: Refresh multiple times - should work!
3. ✅ **Free Fire Page**: Same test
4. ✅ **Admin Login**: `https://your-app.vercel.app/admin/login`
   - Username: `admin`
   - Password: `admin123`

### Real-time Sync Test:
1. Open your site in 2 different browsers (or incognito window)
2. Register a team in one browser
3. The team should appear IMMEDIATELY in the other browser
4. Admin dashboard should update in real-time

---

## 🔒 Default Admin Account

After first deployment, default admin is auto-created:

**Username:** `admin`  
**Password:** `admin123`

⚠️ **CHANGE THIS PASSWORD** after first login for security!

---

## 🐛 Troubleshooting

### Issue: "Tenant or user not found"

**Solution:**
1. Go to Supabase Dashboard → Database Settings
2. Reset your database password
3. Copy the NEW connection string
4. Update `.env` and Vercel environment variables
5. Redeploy

### Issue: Teams not syncing in real-time

**Solution:**
1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for `teams` table
3. Wait 1-2 minutes for changes to propagate

### Issue: Data disappearing after refresh

**Cause:** App is using mock storage instead of Supabase
**Solution:** Make sure `DATABASE_URL` is correctly set with valid credentials

### Issue: 404 on page refresh

**Status:** ✅ Already fixed in `vercel.json`!
If still happening:
1. Check if `vercel.json` is committed to Git
2. Redeploy from Vercel dashboard

---

## 📊 Database Tables

Your app uses these tables (auto-created on first run):

### `teams` table
Stores all tournament registrations

### `admin_users` table  
Stores admin login credentials (passwords are hashed)

---

## 🎯 Features After Successful Deployment

✅ PUBG and Free Fire tournament pages  
✅ Team registration with payment verification  
✅ Real-time team count updates  
✅ Admin dashboard for team management  
✅ Approve/Reject teams  
✅ WhatsApp integration  
✅ Payment screenshot uploads  
✅ Data persistence (never lost!)  
✅ Real-time sync across ALL users  
✅ No 404 errors on page refresh  
✅ Responsive design  
✅ Dark/Light mode  

---

## 📌 Quick Command Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Push database schema changes
npm run db:push

# Type checking
npm run check
```

---

## 💡 Pro Tips

1. **Always use the connection pooler** for Vercel deployment (port 6543)
2. **Enable Supabase realtime** for instant sync
3. **URL-encode passwords** in DATABASE_URL
4. **Set same env variables** in all Vercel environments
5. **Test in incognito** to verify real-time sync works

---

## 🎉 You're Done!

Once you complete these steps:
- ✅ Database connection will work
- ✅ Data will sync in real-time
- ✅ No more 404 errors
- ✅ Teams won't disappear
- ✅ Vercel deployment will be successful

**Share your tournament link and start managing registrations!** 🚀
