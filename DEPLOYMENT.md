# Deployment Guide

## ⚠️ Why Vercel Won't Work for This Application

Your gaming tournament platform **cannot be deployed to Vercel** due to these fundamental technical limitations:

### 1. WebSocket Support ❌
- **Issue**: Vercel serverless functions do not support WebSocket connections
- **Your app uses**: `ws` package for real-time communication
- **Impact**: WebSocket connections will fail immediately on Vercel

### 2. Express Sessions ❌
- **Issue**: Serverless functions are stateless - each request may hit a different server instance
- **Your app uses**: `express-session` with in-memory storage
- **Impact**: Users will be logged out randomly, sessions won't persist

### 3. Long-Running Server ❌
- **Issue**: Vercel functions timeout after 10-60 seconds
- **Your app needs**: Persistent Express server running continuously
- **Impact**: Server will be terminated mid-request

### 4. Database Connections ❌
- **Issue**: Serverless requires connection pooling or serverless-compatible DB
- **Your app uses**: Standard PostgreSQL with persistent connections
- **Impact**: Too many database connections, connection errors

---

## ✅ Recommended Deployment Platforms

### Option 1: Replit Publishing (Recommended) ⭐
**Best for your needs - designed for full-stack apps**

**Pros:**
- ✅ Supports WebSockets
- ✅ Works with Express sessions
- ✅ PostgreSQL database included
- ✅ No code changes needed
- ✅ Automatic HTTPS
- ✅ Free tier available

**How to Deploy:**
1. Click the "Deploy" button in Replit
2. Configure your domain (optional)
3. Set environment variables
4. Click "Deploy"
5. Done! ✨

**Cost**: Free tier available, paid plans from $7/month
**Link**: https://replit.com/pricing

⚠️ **Note**: Payment screenshots are stored as base64 in database, so no additional file storage needed.

---

### Option 2: Railway 🚂
**Great for full-stack Node.js apps**

**Pros:**
- ✅ Full WebSocket support
- ✅ PostgreSQL included
- ✅ Easy deployment from GitHub
- ✅ Auto-scaling
- ✅ $5 free credit monthly

**How to Deploy:**
1. Push code to GitHub
2. Connect Railway to your repo
3. Add PostgreSQL database
4. Set environment variables
5. Railway auto-deploys

**Cost**: $5/month minimum, usage-based pricing
**Link**: https://railway.app/pricing

⚠️ **Important for multi-instance deployment**: Update session store to use PostgreSQL:
```bash
npm install connect-pg-simple
```

Then in `server/index.ts`:
```javascript
import connectPgSimple from 'connect-pg-simple';
const PgSession = connectPgSimple(session);

app.use(session({
  store: new PgSession({
    pool: pool,
    createTableIfMissing: true
  }),
  // ... rest of session config
}));
```

**Setup:**
```bash
# Add to package.json
"scripts": {
  "start": "NODE_ENV=production node dist/index.js",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
}
```

---

### Option 3: Render 🎨
**Reliable platform with free tier**

**Pros:**
- ✅ WebSocket support
- ✅ Free PostgreSQL (90 days)
- ✅ Auto SSL certificates
- ✅ GitHub auto-deploy

**How to Deploy:**
1. Create account on render.com
2. New Web Service → Connect GitHub repo
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

**Cost**: Free tier (with limitations), paid from $7/month
**Link**: https://render.com/pricing

⚠️ **Session Store**: Same as Railway - use `connect-pg-simple` for persistent sessions.

---

### Option 4: Fly.io 🪰
**Global edge deployment**

**Pros:**
- ✅ WebSocket support
- ✅ Global distribution
- ✅ Docker-based (flexible)
- ✅ Built-in PostgreSQL

**Cost**: Free tier (limited), usage-based
**Link**: https://fly.io/docs/about/pricing

⚠️ **Session Store**: Same as Railway - use `connect-pg-simple` for persistent sessions.

---

## 🚫 Why Not Vercel?

**Vercel is designed for:**
- ✅ Static sites (React, Next.js)
- ✅ Serverless API functions (short-lived)
- ✅ JAMstack applications
- ✅ Edge functions

**Vercel is NOT designed for:**
- ❌ WebSocket servers
- ❌ Long-running Express apps
- ❌ Stateful applications
- ❌ Traditional backend servers

---

## 🎯 Best Choice for Your Tournament Platform

**Use Replit Publishing** because:

1. **Zero Code Changes**: Your app works as-is
2. **Built-in Database**: PostgreSQL already configured
3. **WebSocket Support**: Full support for real-time features
4. **Easy Management**: All in one dashboard
5. **Quick Deployment**: One-click deploy
6. **Cost-Effective**: Free tier available

---

## 📋 Pre-Deployment Checklist

Before deploying to any platform:

- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Set `DATABASE_URL` to your production database
- [ ] Change admin password from default
- [ ] Test payment flow
- [ ] Verify all forms work
- [ ] Test mobile responsiveness
- [ ] Check HTTPS redirects
- [ ] Set session secret: `SESSION_SECRET=your-random-secret`
- [ ] Configure CORS if frontend is separate domain
- [ ] Test file uploads (payment screenshots)

---

## 🔐 Environment Variables Needed

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/db
SESSION_SECRET=your-very-random-secret-key-here
NODE_ENV=production

# Optional
PORT=5000
```

---

## 📱 Current Deployment Status

✅ **Running on Replit**: Application is currently live and working
- URL: Your Replit URL
- Database: PostgreSQL (Replit)
- All features functional

---

## 💡 Alternative Architecture for Vercel (Not Recommended)

If you absolutely must use Vercel, you would need to:

1. **Split the application**:
   - Frontend → Vercel
   - Backend → Railway/Render/Fly.io

2. **Replace WebSockets** with:
   - Pusher/Ably (third-party service)
   - Server-Sent Events (SSE)
   - Long polling

3. **Update sessions**:
   - Use JWT tokens instead of sessions
   - Or use external session store (Redis/MongoDB)

4. **Restructure backend**:
   - Convert to serverless functions
   - Add connection pooling
   - Handle cold starts

**Estimated effort**: 20-30 hours of refactoring
**Recommended**: Use a proper platform instead ✨

---

**Last Updated**: October 19, 2025
**Recommendation**: Deploy to Replit Publishing or Railway
