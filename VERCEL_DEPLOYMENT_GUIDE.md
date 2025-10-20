# 🚀 Vercel Deployment Guide - Step by Step

## ✅ Prerequisites Checklist

Before deploying, make sure you have:

- [ ] GitHub account created
- [ ] Vercel account created (https://vercel.com/signup)
- [ ] Supabase database PASSWORD (from Settings → Database)
- [ ] All credentials from `SUPABASE_SETUP.md`

---

## 📋 Step 1: Get Your Supabase Database Password

1. Go to: https://supabase.com/dashboard/project/ielwxcdoejxahmdsfznj/settings/database
2. Scroll to **"Database password"** section
3. **If you have the password saved**: Use it
4. **If you don't have it**: Click **"Reset database password"**
5. Set a new password (save it somewhere safe!)
6. Your complete DATABASE_URL will look like:
   ```
   postgresql://postgres.ielwxcdoejxahmdsfznj:YOUR_PASSWORD_HERE@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

**Important:** Keep this DATABASE_URL ready - you'll need it in Step 4!

---

## 📋 Step 2: Push Code to GitHub

Open terminal in Replit and run these commands:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Tournament platform with Supabase integration"

# Create main branch
git branch -M main

# Add your GitHub repository
# (Create a new repo on GitHub first: https://github.com/new)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Stuck?** 
- Create repo on GitHub: https://github.com/new
- Use your GitHub repo URL in the `git remote add origin` command
- You might need to authenticate with GitHub

---

## 📋 Step 3: Import to Vercel

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Vercel will detect `vercel.json` configuration automatically
5. **DON'T CLICK DEPLOY YET!** - First add environment variables

---

## 📋 Step 4: Add Environment Variables

In Vercel project settings, go to: **Settings → Environment Variables**

Add these ONE BY ONE:

### Required Variables (Copy-Paste These)

**1. SUPABASE_URL**
```
https://ielwxcdoejxahmdsfznj.supabase.co
```

**2. SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o
```

**3. SUPABASE_SERVICE_ROLE_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE
```

**4. DATABASE_URL** (⚠️ REPLACE WITH YOUR PASSWORD!)
```
postgresql://postgres.ielwxcdoejxahmdsfznj:YOUR_PASSWORD_HERE@aws-0-[region].pooler.supabase.com:6543/postgres
```
- Replace `YOUR_PASSWORD_HERE` with your Supabase database password
- Replace `[region]` with your actual region (e.g., `us-east-1`, `ap-south-1`)
- Get this from Supabase Dashboard → Settings → Database → Connection String

**5. SESSION_SECRET** (Generate a random one)

Option A - Use this command in terminal:
```bash
openssl rand -base64 32
```

Option B - Generate online:
https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

**6. NODE_ENV**
```
production
```

### How to Add Each Variable in Vercel:

1. Click **"Add New"** → **"Environment Variable"**
2. Enter **Name** (e.g., `SUPABASE_URL`)
3. Enter **Value** (paste the value from above)
4. Select **All Environments** (Production, Preview, Development)
5. Click **"Save"**
6. Repeat for all 6 variables

---

## 📋 Step 5: Deploy!

1. After adding ALL environment variables, go back to **Deployments** tab
2. Click **"Redeploy"** (or **"Deploy"** if first time)
3. Wait 2-3 minutes for build to complete
4. ✅ **Your app is LIVE!**

Your URL will be: `https://your-project-name.vercel.app`

---

## 📋 Step 6: Test Everything

Visit these URLs and verify they work:

✅ **Homepage**
```
https://your-project-name.vercel.app
```

✅ **PUBG Tournament**
```
https://your-project-name.vercel.app/pubg
```

✅ **Free Fire Tournament**
```
https://your-project-name.vercel.app/free-fire
```

✅ **Admin Login**
```
https://your-project-name.vercel.app/admin/login
```

**Test these specifically:**
- Click on each page
- **Refresh the page** (should NOT show 404 error)
- Register a test team
- Login to admin panel (username: `admin`, password: `admin123`)
- Open site in multiple browsers/devices - everyone should see same data

---

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] All pages load correctly
- [ ] Page refresh works (no 404 errors)
- [ ] Team registration works
- [ ] Admin login works
- [ ] **CHANGE ADMIN PASSWORD** immediately!
- [ ] Test from multiple devices - data should sync
- [ ] Share link with others to test real-time sync

---

## ❌ Common Issues & Fixes

### Issue 1: "Page Not Found" on Refresh

**Cause:** Environment variables not set  
**Fix:** Make sure you added ALL 6 environment variables in Step 4

### Issue 2: "Database Connection Error"

**Cause:** Wrong DATABASE_URL  
**Fix:** 
- Verify you replaced `YOUR_PASSWORD_HERE` with actual password
- Verify you replaced `[region]` with actual region
- Check Supabase dashboard if database is paused (wake it up)

### Issue 3: Different Users See Different Data

**Cause:** Using local database instead of Supabase  
**Fix:** 
- Verify DATABASE_URL in Vercel points to Supabase
- Must start with `postgresql://postgres.ielwxcdoejxahmdsfznj:`

### Issue 4: Build Fails

**Cause:** Missing dependencies or wrong Node version  
**Fix:**
- Check build logs in Vercel
- Ensure all files are pushed to GitHub
- Verify `package.json` and `vercel.json` are in repository

### Issue 5: Admin Login Doesn't Work

**Cause:** SESSION_SECRET not set  
**Fix:** Make sure SESSION_SECRET is added in environment variables

---

## 🔄 Redeploying After Changes

Made changes to your code? Here's how to update:

```bash
# In Replit terminal
git add .
git commit -m "Your change description"
git push

# Vercel will automatically detect and redeploy!
```

Vercel automatically redeploys when you push to GitHub main branch.

---

## 📞 Need Help?

**Vercel Logs:**
- Go to: https://vercel.com/dashboard
- Click your project
- Click latest deployment
- Click "View Build Logs" or "View Function Logs"

**Supabase Logs:**
- Go to: https://supabase.com/dashboard/project/ielwxcdoejxahmdsfznj/logs

**Database Connection Issues:**
- Verify DATABASE_URL format is exactly right
- Test connection string locally first
- Make sure Supabase project is active (not paused)

---

## ✅ Success Checklist

Your deployment is successful when:

- ✅ All pages load without errors
- ✅ Page refresh works on every route
- ✅ Teams can register successfully
- ✅ Admin panel accessible
- ✅ Multiple users see the same data
- ✅ Data persists after closing browser
- ✅ No console errors in browser dev tools

---

## 🎊 You're Live!

Congratulations! Your tournament platform is now live and accessible worldwide!

**Share your link:**
- Share `https://your-project-name.vercel.app` with participants
- Everyone will see real-time updates
- Data syncs automatically across all users
- No manual configuration needed!

**Custom Domain (Optional):**
- Go to Vercel → Settings → Domains
- Add your custom domain
- Follow Vercel's instructions to configure DNS

---

**Created:** October 20, 2025  
**Status:** Production Ready ✅
