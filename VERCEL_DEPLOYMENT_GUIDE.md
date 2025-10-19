# Complete Vercel Deployment Guide

## ⚠️ Important: Your App Requires Major Changes for Vercel

Your tournament platform needs significant restructuring to work on Vercel. Here's the complete step-by-step guide:

---

## 📋 What Needs to Change

### 1. Replace WebSockets with Pusher (Required)

**Current Problem**: Your app uses `ws` package for WebSockets. Vercel doesn't support persistent WebSocket connections.

**Solution**: Sign up for Pusher (free tier: 100 concurrent connections)

**Steps**:

1. **Sign up at Pusher**: https://pusher.com/
2. **Get your credentials** from Pusher dashboard
3. **Add environment variables** in Vercel:
   ```
   PUSHER_APP_ID=your_app_id
   PUSHER_KEY=your_key
   PUSHER_SECRET=your_secret
   PUSHER_CLUSTER=ap2
   ```

4. **Install Pusher packages** (already installed):
   - `pusher` (server-side)
   - `pusher-js` (client-side)

---

### 2. Replace Express Sessions with JWT (Required)

**Current Problem**: `express-session` with memory store doesn't work on serverless.

**Solution**: Use JWT tokens stored in HTTP-only cookies

**Implementation**: See the code changes in the next section.

---

### 3. Create Serverless API Structure

**Current Problem**: Single Express server file doesn't work with Vercel's serverless model.

**Solution**: Split routes into serverless functions.

---

## 🔨 Required Code Changes

### Step 1: Create `api/index.ts` (Main API Entry Point)

Create new file: `api/index.ts`

```typescript
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Register all API routes
registerRoutes(app);

// Export for Vercel
export default app;
```

---

### Step 2: Create `vercel.json`

Create new file in project root: `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    },
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NODE_ENV": "production",
    "SESSION_SECRET": "@session_secret",
    "PUSHER_APP_ID": "@pusher_app_id",
    "PUSHER_KEY": "@pusher_key",
    "PUSHER_SECRET": "@pusher_secret",
    "PUSHER_CLUSTER": "@pusher_cluster"
  }
}
```

---

### Step 3: Update Authentication to Use JWT

**Modify `server/routes.ts`** - Replace session-based auth:

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-this';

// Replace session middleware with JWT
function requireAuth(req: any, res: any, next: any) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Update login endpoint
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await storage.getAdminByUsername(username);
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ message: "Login successful", username: admin.username });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
```

---

### Step 4: Update Database for Serverless

**Modify `server/db.ts`** - Use connection pooling:

```typescript
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// IMPORTANT: Always use Neon serverless for Vercel
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is required");
}

// Use serverless-compatible connection
const pool = new NeonPool({ 
  connectionString: dbUrl,
  max: 1, // Vercel serverless: 1 connection per function
});

const db = drizzleNeon({ client: pool, schema: schema_exports });

export { db, pool };
```

---

### Step 5: Add Pusher for Real-Time Updates

**Create `server/pusher.ts`**:

```typescript
import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER || 'ap2',
  useTLS: true
});

// Trigger event when team registers
export async function notifyTeamRegistration(gameType: string) {
  await pusher.trigger('tournament', 'team-registered', {
    gameType,
    timestamp: new Date().toISOString()
  });
}
```

**Update `client/src/lib/pusher.ts`**:

```typescript
import Pusher from 'pusher-js';

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || '', {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'ap2',
});

export const tournamentChannel = pusher.subscribe('tournament');
```

**Update registration form** to use Pusher:

```typescript
// In client/src/components/tournament/slot-counter.tsx
import { tournamentChannel } from '@/lib/pusher';

useEffect(() => {
  tournamentChannel.bind('team-registered', () => {
    queryClient.invalidateQueries({ queryKey: [`/api/teams/count/${gameType}`] });
  });
  
  return () => {
    tournamentChannel.unbind('team-registered');
  };
}, [gameType]);
```

---

### Step 6: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "vercel-build": "npm run build",
    "start": "node api/index.js"
  }
}
```

---

### Step 7: Add Environment Variables in Vercel Dashboard

After deploying, add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://your-neon-db-url
SESSION_SECRET=your-random-secret-minimum-32-characters
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=ap2
NODE_ENV=production
```

For frontend (VITE variables):
```
VITE_PUSHER_KEY=your-pusher-key
VITE_PUSHER_CLUSTER=ap2
```

---

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects settings
5. Add environment variables (see Step 7 above)
6. Click "Deploy"

### 3. After First Deploy

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all required variables
3. Click "Redeploy" from Deployments tab

---

## ✅ Testing Checklist

After deployment:

- [ ] Homepage loads
- [ ] Forms are responsive on mobile
- [ ] Team registration works
- [ ] Admin login works (JWT)
- [ ] Real-time slot counter updates (Pusher)
- [ ] Payment screenshot upload works
- [ ] Admin dashboard loads
- [ ] Excel export works

---

## 🐛 Common Vercel Errors & Fixes

### Error: "Function execution timeout"
**Fix**: Reduce database queries, add indexes, use caching

### Error: "WebSocket connection failed"
**Fix**: You're still using `ws` package - switch to Pusher completely

### Error: "Module not found"
**Fix**: Check `package.json` includes all dependencies

### Error: "Database connection pool exhausted"
**Fix**: Set `max: 1` in Neon connection config

### Error: "CORS policy blocked"
**Fix**: Add proper CORS headers in `api/index.ts`

---

## 💰 Cost Estimate

**Vercel**:
- Free tier: Good for testing
- Pro: $20/month (recommended for production)

**Pusher**:
- Free tier: 100 concurrent connections, 200k messages/day
- Paid: $49/month for more

**Neon (Database)**:
- Free tier: 0.5 GB storage, 192 hours compute/month
- Paid: $19/month for more

**Total estimated cost**: $0-$88/month depending on traffic

---

## 🔄 Alternative: Stay on Replit

If Vercel costs are too high or changes are too complex:

**Replit Publishing**:
- ✅ No code changes needed
- ✅ WebSockets work
- ✅ Sessions work
- ✅ Database included
- ✅ One-click deployment
- 💰 $7/month

**To deploy on Replit**: Click the "Deploy" button → Configure → Deploy

---

## 📞 Support

If you get stuck:
1. Check Vercel logs in Dashboard → Deployments → [Your deployment] → Logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly

---

**Last Updated**: October 19, 2025
**Estimated Implementation Time**: 6-8 hours
**Difficulty**: Advanced
