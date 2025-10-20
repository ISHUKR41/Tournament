# ✅ Deployment Checklist

## Pre-Deployment

### 1. Environment Setup
- [ ] `.env` file created with correct Supabase credentials
- [ ] DATABASE_URL tested locally (no "Mock storage" error)
- [ ] Server starts successfully with `npm run dev`
- [ ] Can register a team locally
- [ ] Real-time sync working (test in 2 browsers)

### 2. Supabase Configuration
- [ ] Database password confirmed (login to Supabase dashboard)
- [ ] Realtime replication enabled for `teams` table
- [ ] Realtime replication enabled for `admin_users` table
- [ ] Connection string copied from "Connection pooling" → "Session mode"
- [ ] Password URL-encoded in DATABASE_URL (`@` → `%40`)

### 3. Admin Access
- [ ] Admin login works (`admin` / `admin123`)
- [ ] Can view registered teams
- [ ] Can approve/reject teams
- [ ] Excel export working
- [ ] Bulk actions working

### 4. Local Testing
- [ ] PUBG page loads (`/pubg`)
- [ ] Free Fire page loads (`/free-fire`)
- [ ] Team registration works
- [ ] Payment screenshot uploads
- [ ] Data persists after page refresh
- [ ] Real-time counter updates
- [ ] Dark/Light mode toggle works

---

## Deployment to Vercel

### 5. Code Preparation
- [ ] All changes committed to Git
- [ ] `.gitignore` configured (`.env` not committed)
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors (`npm run check`)

### 6. GitHub Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub:
  ```bash
  git remote add origin https://github.com/your-username/your-repo.git
  git push -u origin main
  ```

### 7. Vercel Deployment
- [ ] Vercel account created (https://vercel.com)
- [ ] New project created from GitHub repo
- [ ] Framework preset: **Vite** (auto-detected)
- [ ] Build command: `vite build` (auto-configured)
- [ ] Output directory: `dist/public` (from vercel.json)

### 8. Environment Variables in Vercel
Add these in **Project Settings** → **Environment Variables**:

- [ ] `SUPABASE_URL` ✅
- [ ] `SUPABASE_ANON_KEY` ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ✅
- [ ] `SUPABASE_DB_PASSWORD` ✅
- [ ] `DATABASE_URL` ✅
- [ ] `SESSION_SECRET` ✅
- [ ] `NODE_ENV=production` ✅

**Set for:** Production, Preview, Development ✅

### 9. First Deployment
- [ ] Click "Deploy" button
- [ ] Wait 2-3 minutes for build
- [ ] Deployment successful (no errors)
- [ ] Preview URL generated

---

## Post-Deployment Verification

### 10. Functionality Testing
- [ ] Visit Vercel URL (e.g., `your-app.vercel.app`)
- [ ] Homepage loads correctly
- [ ] Navigation works (PUBG, Free Fire, Admin)
- [ ] PUBG registration page loads
- [ ] Free Fire registration page loads
- [ ] Admin login page loads

### 11. Registration Flow
- [ ] Fill in team registration form
- [ ] Upload payment screenshot (image compresses)
- [ ] Form validation works
- [ ] Submit registration
- [ ] Success message appears
- [ ] Team appears in list

### 12. Real-time Sync Test
- [ ] Open site on **Device 1** (computer)
- [ ] Open site on **Device 2** (phone/incognito)
- [ ] Register team on Device 1
- [ ] **Team appears on Device 2 IMMEDIATELY** ✅
- [ ] Team counter updates on both devices
- [ ] No delay in sync (< 2 seconds)

### 13. Admin Panel Test
- [ ] Login at `/admin/login`
- [ ] Username: `admin` / Password: `admin123`
- [ ] Dashboard shows statistics
- [ ] All registered teams visible
- [ ] Can change team status (Approve/Reject)
- [ ] Status updates reflect immediately on public pages
- [ ] Can add admin notes
- [ ] Excel export downloads successfully
- [ ] Bulk actions work

### 14. Page Refresh Test (404 Fix)
- [ ] Go to `/pubg` → Press F5 → No 404 ✅
- [ ] Go to `/free-fire` → Press F5 → No 404 ✅
- [ ] Go to `/admin/login` → Press F5 → No 404 ✅
- [ ] Go to `/admin/dashboard` → Press F5 → No 404 ✅

### 15. Mobile Responsiveness
- [ ] Open on mobile device
- [ ] All pages display correctly
- [ ] Forms are usable
- [ ] Buttons are clickable
- [ ] Images load properly
- [ ] Navigation menu works

### 16. Performance
- [ ] Pages load in < 3 seconds
- [ ] No console errors
- [ ] Images compressed and optimized
- [ ] Real-time updates instant
- [ ] No memory leaks

---

## Production Readiness

### 17. Security
- [ ] Admin password changed from default
- [ ] HTTPS enabled (Vercel default)
- [ ] API keys not exposed in client
- [ ] JWT tokens secure
- [ ] Session management working

### 18. Data Management
- [ ] All registrations saved to database
- [ ] Data visible in Supabase dashboard
- [ ] Can query teams directly in Supabase
- [ ] Backup/export capability tested
- [ ] Admin notes persist

### 19. Monitoring
- [ ] Check Vercel Analytics (if enabled)
- [ ] Monitor Supabase usage
- [ ] Set up error tracking (optional)
- [ ] Check server logs regularly

### 20. Final Checks
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All environment variables correct
- [ ] No hardcoded secrets in code
- [ ] README.md updated with your deployment URL

---

## Multi-User Testing

### 21. Share with Friends
- [ ] Share Vercel URL with 3+ friends
- [ ] **All friends see SAME data** ✅
- [ ] **All friends see SAME team count** ✅
- [ ] When Friend 1 registers → Friends 2 & 3 see it immediately
- [ ] No data discrepancies
- [ ] No one sees "0 teams" while others see "5 teams"

### 22. Load Testing
- [ ] Multiple simultaneous registrations work
- [ ] No data loss under load
- [ ] Real-time sync handles multiple users
- [ ] Admin panel responsive with many teams

---

## Troubleshooting

### If Real-time Sync Not Working:
1. Check Supabase Dashboard → Database → Replication
2. Ensure `teams` table replication is **ON**
3. Wait 2 minutes after enabling
4. Restart Vercel deployment

### If "Mock Storage" Message Appears:
1. DATABASE_URL is wrong in Vercel env vars
2. Go to Vercel → Settings → Environment Variables
3. Update DATABASE_URL with correct connection string
4. Redeploy

### If Different Users See Different Data:
1. Database not connected (using mock storage)
2. Fix DATABASE_URL
3. Redeploy
4. Clear browser cache on all devices

### If 404 Errors on Refresh:
1. Check `vercel.json` is in repository
2. Verify it's committed to Git
3. Redeploy from Vercel dashboard

---

## Success Criteria

Your deployment is **100% successful** when:

✅ Homepage loads on Vercel URL  
✅ All pages accessible  
✅ Registration works  
✅ Data persists after refresh  
✅ **All users see same data in real-time**  
✅ Admin panel fully functional  
✅ No 404 errors  
✅ Mobile responsive  
✅ Real-time sync < 2 seconds  
✅ 3+ friends tested and confirmed working  

---

## 🎉 You're Live!

Once all checkboxes are ✅:

1. **Share your link** with your target audience
2. **Monitor registrations** in admin panel
3. **Manage tournaments** efficiently
4. **Export data** as needed
5. **Earn from entry fees** 💰

---

**Deployment Date:** _________________

**Vercel URL:** _________________

**Status:** _________________

**Notes:** _________________
