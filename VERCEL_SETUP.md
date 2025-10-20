# Vercel Deployment Guide

## Step 1: Prepare Your Database

Vercel pe deployment ke liye aapko **Neon PostgreSQL** database chahiye (free tier available).

1. **Neon Account Setup**:
   - Visit: https://neon.tech
   - Sign up for free account
   - Create a new project
   - Copy the DATABASE_URL (it will look like: `postgresql://...@...neon.tech/...`)

## Step 2: Get Pusher Credentials

Real-time sync ke liye Pusher required hai:

1. **Pusher Setup**:
   - Visit: https://pusher.com
   - Sign up (100 connections free)
   - Create new Channels app
   - Note down:
     - app_id
     - key
     - secret
     - cluster (usually "ap2" for Asia)

## Step 3: Deploy to Vercel

1. **Connect Repository**:
   - Visit: https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub/GitLab repository

2. **Environment Variables**:
   Add these in Vercel Dashboard → Settings → Environment Variables:

   ```
   DATABASE_URL=your_neon_database_url_here
   SESSION_SECRET=any_random_long_string_here
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=ap2
   VITE_PUSHER_KEY=your_pusher_key (same as PUSHER_KEY)
   VITE_PUSHER_CLUSTER=ap2 (same as PUSHER_CLUSTER)
   NODE_ENV=production
   ```

3. **Build Settings**:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `your-project.vercel.app`

## Step 4: Verify Deployment

1. Check that the home page loads
2. Try registering a team
3. Check admin panel login (username: admin, password: admin123)
4. Verify real-time updates are working

## Troubleshooting

### Issue: "DATABASE_URL not found"
**Solution**: Make sure DATABASE_URL is added in Vercel environment variables

### Issue: "Real-time sync not working"
**Solution**: Check that all Pusher credentials are correct and match on both PUSHER_* and VITE_PUSHER_* variables

### Issue: "500 Internal Server Error"
**Solution**: 
- Check Vercel function logs
- Verify database connection
- Make sure all environment variables are set

### Issue: "Build failed"
**Solution**:
- Check build logs in Vercel
- Make sure package.json has correct scripts
- Verify all dependencies are in package.json

## Important Notes

1. **Database Migration**: On first deployment, database tables will be created automatically
2. **Admin Account**: Default admin (username: admin, password: admin123) will be created
3. **Real-time Sync**: All users will see updates instantly through Pusher
4. **Custom Domain**: You can add custom domain in Vercel settings

## Support

If you face any issues:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
