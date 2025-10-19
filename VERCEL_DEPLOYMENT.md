# Complete Vercel Deployment Guide

## Important: Your Database is Already Set Up! ✅

Your tournament platform already uses **Neon PostgreSQL** - a cloud database that works perfectly with both Replit and Vercel. All your data is stored permanently in the cloud, not in local folders.

## Database Information

- **Database Type**: Neon PostgreSQL (Serverless)
- **Storage**: Cloud-based (permanent, never deleted)
- **Access**: Available via `DATABASE_URL` environment variable
- **Multi-user**: Multiple people can access simultaneously
- **Data Persistence**: All team registrations are saved permanently

## Step 1: Get Your Database URL

Your database URL is already available in Replit's environment variables. You need to copy this to Vercel.

1. In Replit, open the **Secrets** tab (lock icon in left sidebar)
2. Find and copy the value of `DATABASE_URL`
3. It should look like: `postgresql://user:pass@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

## Step 2: Deploy to Vercel

### A. Connect Your Replit to GitHub

1. In Replit, click the version control icon (Git)
2. Click "Create a Git Repository"
3. Push your code to GitHub

### B. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### C. Add Environment Variables

Before deploying, add these environment variables in Vercel:

1. Click **"Environment Variables"** section
2. Add the following:

```
DATABASE_URL = [paste your Neon database URL here]
NODE_ENV = production
```

**IMPORTANT**: Make sure to paste the EXACT same `DATABASE_URL` from Replit. This ensures both Replit and Vercel use the same database.

### D. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Your site will be live at: `https://your-project.vercel.app`

## Step 3: Automatic Database Setup ✅

**Great News**: Your database tables and admin user are created **automatically** on first deployment!

When your application starts on Vercel, it will:
1. ✅ Connect to the Neon database using `DATABASE_URL`
2. ✅ Create all necessary tables (`admin_users`, `teams`)
3. ✅ Create a default admin account
4. ✅ Be ready to accept team registrations immediately

**No manual migration needed!** Everything happens automatically.

### Default Admin Credentials

After first deployment, you can immediately login with:
- **Username**: `admin`
- **Password**: `admin123`

**IMPORTANT**: Change this password immediately after first login for security.

## Troubleshooting

### Issue: "Database connection failed"
**Solution**: Make sure `DATABASE_URL` in Vercel exactly matches the one from Replit (including `?sslmode=require`)

### Issue: "Teams not showing in admin panel"
**Solution**: 
1. Check that `DATABASE_URL` is set correctly in Vercel
2. Check deployment logs - tables are created automatically on startup
3. Verify database connection in deployment logs
4. Try redeploying if tables weren't created

### Issue: "Build failed"
**Solution**: 
1. Make sure all dependencies are in `package.json`
2. Check build logs in Vercel dashboard
3. Ensure Node.js version is compatible (use 18.x or 20.x)

### Issue: "CORS errors"
**Solution**: Your Vite config already handles this correctly. No changes needed.

## Database Management

### View Data
- Use Neon Console: https://console.neon.tech
- Or use a database client with your `DATABASE_URL`

### Backup Data
Neon automatically backs up your data. You can also export teams via the admin panel's Excel export feature.

### Reset Database
**WARNING**: This deletes all data!

If you need to manually run migrations:
```bash
DATABASE_URL="your-url" npm run db:push
```

Or force push schema changes:
```bash
DATABASE_URL="your-url" npx drizzle-kit push --force
```

## How Data Persistence Works

1. **Registration Flow**:
   - User fills form → Data sent to backend → Saved to Neon database
   - Database is in the cloud (not in Replit or Vercel servers)
   - Data persists even if Replit/Vercel restarts

2. **Multi-User Access**:
   - Both Replit and Vercel connect to same database
   - Users on either platform see the same data
   - Real-time synchronization

3. **Excel Exports**:
   - Exports are generated on-demand from database
   - Not stored permanently, just downloaded
   - Source of truth is always the database

## Admin Login Credentials

Default credentials (change these after first login):
- **Username**: `admin`
- **Password**: `admin123`

To create additional admins, use:
```bash
npx tsx scripts/create-admin.ts
```

## Production Checklist

Before going live:
- ✅ Database URL set in Vercel environment variables
- ✅ First deployment completed successfully
- ✅ Tables created automatically (check deployment logs)
- ✅ Admin user created automatically (username: admin, password: admin123)
- ✅ Test team registration works
- ✅ Test admin panel - can see teams and approve/reject buttons
- ✅ Change default admin password immediately
- ✅ Test Excel export works

## Need Help?

Common commands:
```bash
# Check database
DATABASE_URL="your-url" npx drizzle-kit studio

# Push schema changes
npm run db:push

# Create admin
npx tsx scripts/create-admin.ts
```

Your data is safe and permanent in Neon PostgreSQL! ✅
