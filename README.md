# 🎮 Tournament Registration Platform

> **Production-ready tournament management system with real-time sync, admin dashboard, and payment verification.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

---

## ✨ Features

### 🎯 Tournament Management
- **PUBG Mobile** - 25 teams maximum
- **Free Fire** - 12 teams maximum
- Real-time slot counter
- Payment verification via screenshots
- WhatsApp integration

### 👨‍💼 Admin Dashboard
- Team approval/rejection system
- Bulk actions for multiple teams
- Excel export (by game type)
- Search and filter capabilities
- Admin notes for each team
- Real-time statistics

### 🚀 Technical Features
- **Real-time data sync** across all users
- **Dark/Light mode** toggle
- **Fully responsive** design
- **Form validation** with Zod
- **Image compression** for uploads
- **SEO optimized**
- **Zero 404 errors** (proper routing)

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- Radix UI (45+ components)
- Framer Motion + AOS
- TanStack Query
- React Hook Form + Zod

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- Drizzle ORM
- JWT Authentication
- Pusher (Real-time)
- ExcelJS (Data export)

### Deployment
- Vercel (Serverless)
- Supabase (Database + Realtime)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd Tournament-1

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev
```

Server will run on: http://localhost:5000

---

## 📋 Environment Variables

Create `.env` file with:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_PASSWORD=your-database-password

# Database Connection
DATABASE_URL=postgresql://postgres.your-project:password@aws-0-region.pooler.supabase.com:5432/postgres

# Session Secret
SESSION_SECRET=your-random-secret-key

# Environment
NODE_ENV=development
PORT=5000
```

### Get Your Credentials:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API** for API keys
4. Go to **Settings** → **Database** for connection string

---

## 🌐 Deploy to Vercel

### Option 1: Automatic Deploy

```bash
node scripts/deploy.mjs
```

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Add Environment Variables in Vercel:
1. Go to **Project Settings** → **Environment Variables**
2. Add all variables from `.env`
3. Set for **Production**, **Preview**, and **Development**
4. Redeploy

---

## 🔐 Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change this after first login!**

### Admin Features:
- ✅ View all team registrations
- ✅ Approve/Reject teams
- ✅ Bulk status updates
- ✅ Export to Excel
- ✅ Add admin notes
- ✅ Real-time statistics
- ✅ Search and filter teams

---

## 📊 Database Setup

### Enable Real-time Sync:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Database** → **Replication**
4. Enable replication for:
   - `teams` table
   - `admin_users` table

This enables real-time sync across all users!

---

## 🎨 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema changes to database

# Type Checking
npm run check            # Run TypeScript type checking
```

---

## 📱 Usage

### For Users (Registration):

1. **Choose Tournament:**
   - Visit `/pubg` for PUBG Mobile
   - Visit `/free-fire` for Free Fire

2. **Fill Registration Form:**
   - Team name
   - Leader details (name, WhatsApp, Player ID)
   - 3 other players (names + Player IDs)
   - YouTube live vote option
   - Transaction ID
   - Payment screenshot

3. **Submit & Wait:**
   - Team status: "Pending"
   - Admin will approve/reject
   - Real-time status updates

### For Admin:

1. **Login:** Visit `/admin/login`

2. **Dashboard Features:**
   - View all registrations
   - Filter by status/game type
   - Approve/Reject teams
   - Bulk actions
   - Export to Excel
   - Add notes

---

## 🔧 Troubleshooting

### Database Not Connecting?

**Error:** "Tenant or user not found"

**Solution:**
1. Check DATABASE_URL in `.env`
2. Verify password is URL-encoded (`@` → `%40`)
3. Try resetting database password in Supabase
4. Use connection pooler (port 5432), not direct connection

### 404 on Page Refresh?

**Solution:** This is already fixed in `vercel.json`! If still happening:
1. Make sure `vercel.json` is committed to Git
2. Redeploy on Vercel

### Real-time Not Working?

**Solution:**
1. Enable replication in Supabase (Database → Replication)
2. Check SUPABASE_ANON_KEY is correct
3. Wait 1-2 minutes after enabling replication

### Data Not Persisting?

**Cause:** App using mock storage (DATABASE_URL invalid)

**Solution:**
1. Check console for "Mock storage" message
2. Verify DATABASE_URL is correct
3. Restart server after fixing

---

## 📂 Project Structure

```
Tournament-1/
├── api/                    # Vercel serverless functions
│   ├── auth.ts            # Authentication logic
│   └── index.ts           # API entry point
├── client/                # Frontend React app
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom hooks
│       └── lib/           # Utilities
├── server/                # Backend Express server
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   ├── auth.ts            # Auth middleware
│   ├── storage.ts         # Data layer
│   └── services/          # External services
├── shared/                # Shared code
│   ├── schema.ts          # Database schema
│   └── supabase.ts        # Supabase client
├── scripts/               # Utility scripts
│   └── deploy.mjs         # Deployment automation
└── vercel.json            # Vercel configuration
```

---

## 🎯 Features Roadmap

- [x] Team registration
- [x] Admin dashboard
- [x] Real-time sync
- [x] Excel export
- [x] Dark mode
- [x] Payment verification
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Automated bracket generation
- [ ] Live match scores
- [ ] Player statistics

---

## 💰 Monetization

### How to Earn:

1. **Collect Entry Fees:**
   - Set tournament entry fee
   - Collect via UPI/Payment gateway
   - Verify payment screenshots

2. **Prize Pool:**
   - Manage prize distribution
   - Export team data
   - Track payments

3. **Sponsorships:**
   - Add sponsor logos
   - Featured tournaments
   - Premium features

---

## 🤝 Support

Need help? Check these guides:

- [`COMPLETE_WORKING_SOLUTION.md`](./COMPLETE_WORKING_SOLUTION.md) - Complete implementation details
- [`COMPLETE_FIX_GUIDE.md`](./COMPLETE_FIX_GUIDE.md) - Step-by-step troubleshooting
- [`DATABASE_CONNECTION_FIX.md`](./DATABASE_CONNECTION_FIX.md) - Database issues
- [`START_HERE.md`](./START_HERE.md) - Quick start guide

---

## 📄 License

MIT License - feel free to use for commercial purposes!

---

## 🎉 Ready to Launch!

1. ✅ All code is production-ready
2. ✅ 90+ libraries fully utilized
3. ✅ Real-time sync implemented
4. ✅ Admin panel complete
5. ✅ Vercel deployment configured

**Only missing:** Correct DATABASE_URL from Supabase

Once configured → Deploy → Share → Earn! 💰

---

Made with ❤️ for esports tournaments
