# Gaming Tournament Platform

A professional, modern, and fully responsive tournament registration platform for PUBG Mobile and Free Fire tournaments with real-time slot tracking, admin dashboard, and Excel export functionality.

## 🎮 Features

### User-Facing Features

#### PUBG Mobile Tournament
- **Max Teams**: 25 Teams
- **Entry Fee**: ₹80 per team
- **Prize Pool**: 
  - Winner: ₹1000
  - Runner-up: ₹400
- **Game Mode**: Squad (4 Players)
- **Map**: Erangel (Classic)

#### Free Fire Tournament
- **Max Teams**: 12 Teams
- **Entry Fee**: ₹80 per team
- **Prize Pool**:
  - Winner: ₹500
  - Runner-up: ₹260
- **Game Mode**: Squad (4 Players)
- **Map**: Bermuda / Purgatory / Kalahari

### Core Features

1. **Dual Tournament System**
   - Separate pages for PUBG and Free Fire
   - Independent team registration and slot tracking
   - Different tournament configurations

2. **Real-Time Slot Tracking**
   - Live updates every 5 seconds
   - Visual progress bar showing filled slots
   - Automatic alerts when slots are almost full
   - Prevents over-registration

3. **Professional Registration Form**
   - Team information (name, leader details)
   - 4 player details with IDs
   - Payment screenshot upload (Base64)
   - Transaction ID validation
   - YouTube live streaming vote (Yes/No)
   - Terms and conditions agreement
   - Real-time form validation

4. **Modern UI/UX**
   - Responsive design for all devices
   - Animated hero sections with gaming aesthetics
   - Framer Motion animations
   - Professional color scheme (Orange/Gaming theme)
   - Custom fonts (Rajdhani for display, Inter for body)
   - Glassmorphism effects
   - Hover animations and transitions

5. **Admin Dashboard**
   - Secure login system
   - Real-time statistics for both tournaments
   - Team management (approve/reject/pending)
   - Bulk operations
   - Search and filter functionality
   - Admin notes for each team
   - Payment screenshot verification

6. **Excel Export System**
   - Separate exports for PUBG teams
   - Separate exports for Free Fire teams
   - Combined export for all teams
   - Automatic file saving to exports folder structure:
     - `exports/pubg/` - PUBG team data
     - `exports/freefire/` - Free Fire team data
     - `exports/all/` - Combined data
   - Includes all team details, payment info, and YouTube votes

### Technical Features

1. **Database (PostgreSQL)**
   - Persistent data storage
   - Two main tables: `admin_users`, `teams`
   - Real-time data synchronization
   - Drizzle ORM for type-safety

2. **Security**
   - Password hashing with bcrypt
   - Session-based authentication
   - Admin-only routes protection
   - Input validation with Zod
   - CSRF protection

3. **Performance**
   - React Query for data caching
   - Optimized re-renders
   - Lazy loading
   - 5-second polling for real-time updates

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── tournament/
│   │   │   ├── hero.tsx
│   │   │   ├── countdown-timer.tsx
│   │   │   ├── slot-counter.tsx
│   │   │   ├── tournament-details.tsx
│   │   │   ├── prize-pool.tsx
│   │   │   ├── tournament-rules.tsx
│   │   │   ├── registered-teams.tsx
│   │   │   ├── game-registration-form.tsx
│   │   │   └── footer.tsx
│   │   ├── ui/ (shadcn components)
│   │   ├── navbar.tsx
│   │   └── theme-toggle.tsx
│   ├── pages/
│   │   ├── pubg-tournament.tsx
│   │   ├── free-fire-tournament.tsx
│   │   ├── admin-login.tsx
│   │   ├── admin-dashboard.tsx
│   │   └── not-found.tsx
│   ├── lib/
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   └── App.tsx
server/
├── routes.ts (API endpoints)
├── storage.ts (Database operations)
├── db.ts (Database connection)
├── init-db.ts (Database initialization)
└── index.ts (Express server)
shared/
└── schema.ts (TypeScript types & Zod schemas)
exports/
├── pubg/ (PUBG team Excel files)
├── freefire/ (Free Fire team Excel files)
└── all/ (Combined Excel files)
```

## 🔐 Admin Access

**Default Credentials** (Change after first login):
- Username: `admin`
- Password: `admin123`

Access admin panel: Click the small "Admin" button in the footer or navigate to `/admin/login`

## 🎨 Design Guidelines

### Color Scheme
- Primary: Orange (#FF6B1A) - Gaming/Action theme
- Chart colors for different sections
- Professional dark/light mode support

### Typography
- Display Font: Rajdhani (Bold, Gaming aesthetic)
- Body Font: Inter (Clean, Modern)
- Headings use display font
- Body text uses sans font

### Animations
- Hero section gradient orbs
- Card hover effects with scale
- Framer Motion page transitions
- Pulse effects for urgent elements
- Smooth scrolling

## 📝 Key Features Implementation

### YouTube Live Streaming Vote
Every registration form includes a voting option:
- "Do you want to watch the match live on YouTube?"
- Options: Yes / No
- Stored in database for analysis
- Admin can see vote counts

### Real-Time Slot Management
- Automatically refreshes every 5 seconds
- Shows: X/Y teams registered
- Progress bar visualization
- Prevents over-booking
- Different limits for PUBG (25) and Free Fire (12)

### Payment Verification
- QR code displayed in registration form
- Screenshot upload required
- Transaction ID required
- Admin can view payment screenshots
- Approve/reject based on payment verification

### Team Status Management
- **Pending**: Newly registered, awaiting approval
- **Approved**: Payment verified, team confirmed
- **Rejected**: Payment issues or rule violations

## 🚀 Running the Application

### Development (Replit)
The workflow "Start application" runs `npm run dev` which:
1. Connects to Neon PostgreSQL cloud database
2. Initializes tables if needed
3. Creates default admin user
4. Starts Express server (backend)
5. Starts Vite server (frontend)
6. Serves on port 5000

### Production (Vercel Deployment)

#### Database Setup
This application uses **Neon PostgreSQL** for cloud database with real-time sync across all users and instances.

**✅ Database is already configured in Replit:**
- Connected to Neon serverless PostgreSQL
- DATABASE_URL is set in environment variables
- Data syncs across all users in real-time
- Works seamlessly on Vercel without changes

#### Deploying to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Set Environment Variables in Vercel:**
   Go to Project Settings → Environment Variables and add:
   
   **Required:**
   - `DATABASE_URL` - Your Neon PostgreSQL connection string (get from Replit secrets or create new Neon database)
   - `SESSION_SECRET` - Random string for session encryption (generate with `openssl rand -base64 32`)
   
   **Optional (for Pusher real-time features):**
   - `PUSHER_APP_ID` - Your Pusher app ID
   - `PUSHER_KEY` - Your Pusher key
   - `PUSHER_SECRET` - Your Pusher secret
   - `PUSHER_CLUSTER` - Your Pusher cluster (e.g., "ap2")
   - `VITE_PUSHER_KEY` - Same as PUSHER_KEY (for frontend)
   - `VITE_PUSHER_CLUSTER` - Same as PUSHER_CLUSTER (for frontend)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-app.vercel.app`

#### Post-Deployment
- Access admin panel at: `https://your-app.vercel.app/admin/login`
- Default credentials: `admin` / `admin123`
- **IMPORTANT:** Change the admin password immediately after first login!

#### Database Migration on Vercel
The app automatically runs database initialization on first deployment:
- Creates `admin_users` table
- Creates `teams` table
- Creates default admin user
- All data is stored in Neon PostgreSQL cloud database

## 📊 Database Schema

### Teams Table
```typescript
{
  id: string (UUID)
  gameType: "pubg" | "freefire"
  teamName: string
  leaderName: string
  leaderWhatsapp: string (10 digits)
  leaderPlayerId: string
  player2Name: string
  player2PlayerId: string
  player3Name: string
  player3PlayerId: string
  player4Name: string
  player4PlayerId: string
  youtubeVote: "yes" | "no"
  transactionId: string
  paymentScreenshot: string (Base64)
  agreedToTerms: 1
  status: "pending" | "approved" | "rejected"
  adminNotes: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Admin Users Table
```typescript
{
  id: number (serial)
  username: string (unique)
  password: string (bcrypt hashed)
  createdAt: timestamp
}
```

## 🎯 User Flow

### Team Registration
1. Visit `/pubg` or `/free-fire`
2. View tournament details, rules, prize pool
3. Check available slots
4. Click "Register Your Squad"
5. Fill team and player information
6. Make payment via QR code
7. Upload payment screenshot
8. Vote for YouTube live streaming
9. Agree to terms
10. Submit registration
11. Wait for admin approval

### Admin Workflow
1. Login at `/admin/login`
2. View dashboard with real-time stats
3. See all pending registrations
4. View payment screenshots
5. Approve or reject teams
6. Add admin notes if needed
7. Export data to Excel
8. Monitor both tournaments separately

## 🔒 Security Features

- Bcrypt password hashing
- Session-based authentication
- Protected admin routes
- Input validation (Zod)
- SQL injection prevention (Drizzle ORM)
- XSS protection
- Payment screenshot verification

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Touch-friendly buttons
- Optimized images
- Smooth scrolling

## 🎨 Professional Features

- Custom gradient text effects
- Glassmorphism cards
- Animated background orbs
- Smooth page transitions
- Hover scale effects
- Loading states
- Error handling
- Toast notifications
- Skeleton loaders

## 📦 Technologies Used

**Frontend:**
- React 18
- TypeScript
- TanStack Query (React Query)
- Wouter (Routing)
- Tailwind CSS
- shadcn/ui Components
- Framer Motion
- Lucide Icons

**Backend:**
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Bcrypt
- ExcelJS
- Express Session

**Development:**
- Vite
- Drizzle Kit
- TSX

## 🎯 Future Enhancements (Optional)

- [ ] Email notifications
- [ ] SMS notifications via Twilio
- [ ] WhatsApp integration
- [ ] Live match updates
- [ ] Tournament brackets
- [ ] Player statistics
- [ ] Multiple tournaments support
- [ ] Team profile pages
- [ ] Leaderboards

## 📋 Testing Checklist

✅ PUBG page loads correctly
✅ Free Fire page loads correctly
✅ Navigation works
✅ Slot counter updates in real-time
✅ Registration form validates correctly
✅ Payment screenshot upload works
✅ YouTube vote saves correctly
✅ Admin login works
✅ Admin dashboard shows correct stats
✅ Team approval/rejection works
✅ Excel export works (PUBG/Free Fire/All)
✅ Excel files save to correct folders
✅ Search and filter work
✅ Bulk operations work
✅ Responsive on all devices
✅ No console errors
✅ No LSP errors
✅ Database persists data correctly

## 🎮 Tournament Rules Implemented

- Squad mode (4 players per team)
- Mobile-only platform
- Fair play policy
- No refunds
- Punctuality requirements
- Code of conduct
- Streaming allowed
- Disconnect policy
- Prize distribution via UPI

---

**Built with ❤️ for Gaming Community**
**Last Updated**: October 19, 2025
