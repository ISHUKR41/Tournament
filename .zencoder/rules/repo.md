# Tournament Management System - Repository Information

## Project Overview

This is a comprehensive tournament management system built for PUBG and Free Fire gaming tournaments. The system provides real-time team registration, admin management, and data persistence using Supabase PostgreSQL database.

## Technology Stack

### Backend

- **Node.js** with **Express.js** for API server
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **Supabase** for PostgreSQL database and real-time subscriptions
- **JWT** for authentication
- **bcryptjs** for password hashing
- **ExcelJS** for data export functionality

### Frontend

- **React 18** with **TypeScript**
- **Vite** for build system and development server
- **Tailwind CSS** for styling
- **Radix UI** components for UI elements
- **React Hook Form** for form management
- **Zod** for validation
- **Framer Motion** for animations

### Database & Deployment

- **Supabase PostgreSQL** for data persistence
- **Vercel** for deployment
- **Real-time subscriptions** for live data updates

## Project Structure

```
Tournament/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   └── pages/            # Application pages
│   └── index.html
├── server/                   # Express.js backend
│   ├── auth.ts              # Authentication middleware
│   ├── db.ts                # Database connection
│   ├── ensure-db.ts         # Database setup
│   ├── init-db.ts           # Database initialization
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Database operations
│   └── services/            # External services
│       └── pusher.ts        # Real-time notifications
├── shared/                  # Shared code between client/server
│   ├── schema.ts            # Database schema & validation
│   └── supabase.ts          # Supabase client configuration
├── api/                     # Vercel serverless API
│   └── index.ts            # API entry point for deployment
└── migrations/             # Database migrations
```

## Key Features

### 1. Tournament Registration

- **Multi-game support**: PUBG and Free Fire tournaments
- **Team registration**: 4-player team structure
- **Payment verification**: Screenshot upload and transaction ID
- **Tournament limits**: PUBG (25 teams), Free Fire (12 teams)
- **Form validation**: Comprehensive client and server-side validation

### 2. Admin Panel

- **Authentication**: JWT-based admin login
- **Team management**: Approve/reject/update team registrations
- **Status tracking**: Pending, approved, rejected states
- **Data export**: Excel export functionality
- **Bulk operations**: Mass status updates
- **Search & filter**: Advanced team search capabilities

### 3. Real-time Features

- **Live updates**: Teams see updates instantly
- **Supabase subscriptions**: Database change notifications
- **Sync across users**: All users see the same data
- **Automatic refresh**: Fallback polling every 30 seconds

### 4. Data Persistence

- **Supabase PostgreSQL**: Cloud database with automatic backups
- **Data integrity**: Foreign key constraints and validation
- **Migration support**: Database schema versioning
- **Connection pooling**: Optimized for serverless deployment

## Environment Configuration

### Required Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres.project:key@pooler.supabase.co:6543/postgres

# Authentication
JWT_SECRET=your-secret-key

# Real-time (Optional)
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=ap2
```

## Database Schema

### Teams Table

- **id**: Primary key (UUID)
- **gameType**: "pubg" or "freefire"
- **teamName**: Team display name
- **leaderName**: Team leader name
- **leaderWhatsapp**: Contact number
- **leaderPlayerId**: Game ID
- **player2-4Name/PlayerId**: Other team members
- **youtubeVote**: YouTube live voting participation
- **transactionId**: Payment reference
- **paymentScreenshot**: Payment proof URL
- **status**: "pending", "approved", "rejected"
- **adminNotes**: Admin comments
- **createdAt/updatedAt**: Timestamps

### Admin Users Table

- **id**: Primary key
- **username**: Login username
- **password**: Hashed password
- **createdAt**: Registration timestamp

## API Endpoints

### Public Endpoints

- `GET /api/health` - System health check
- `GET /api/teams` - Get all teams
- `GET /api/teams/count` - Get team counts
- `GET /api/teams/count/:gameType` - Count by game type
- `POST /api/teams` - Register new team
- `GET /api/teams/:id` - Get specific team
- `GET /api/teams/search` - Search teams

### Admin Endpoints (Auth Required)

- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get admin profile
- `GET /api/admin/stats` - Tournament statistics
- `PATCH /api/admin/teams/:id/status` - Update team status
- `PATCH /api/admin/teams/:id/notes` - Update admin notes
- `POST /api/admin/teams/bulk-status` - Bulk status update
- `GET /api/admin/teams/export` - Export team data

## Deployment Configuration

### Vercel Settings

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **API Routes**: Serverless functions in `/api`

### Build Process

1. **Static Assets**: Frontend built to `dist/public`
2. **API Functions**: Server code deployed as serverless functions
3. **Environment Variables**: Set in Vercel dashboard
4. **Database**: Automatic connection to Supabase

## Common Issues & Solutions

### 1. Deployment Refresh Error

- **Issue**: Page not found on refresh in production
- **Solution**: Proper SPA routing in `vercel.json`

### 2. Database Connection

- **Issue**: Connection timeouts in serverless
- **Solution**: Connection pooling with `max: 1` connections

### 3. Real-time Updates Not Working

- **Issue**: Users not seeing live updates
- **Solution**: Supabase subscriptions + fallback polling

### 4. CORS Issues

- **Issue**: API calls blocked in production
- **Solution**: Proper CORS headers in `vercel.json`

## Development Workflow

### Local Development

```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run check       # Type checking
npm run db:push     # Push database schema
```

### Production Deployment

1. **Environment Setup**: Configure all environment variables
2. **Database Migration**: Run schema updates
3. **Build & Deploy**: Automatic via Vercel
4. **Health Check**: Verify `/api/health` endpoint

## Security Considerations

- **JWT Tokens**: Secure authentication
- **Input Validation**: Both client and server validation
- **SQL Injection**: Protected by Drizzle ORM
- **CORS**: Properly configured for production
- **Environment Variables**: Sensitive data in environment files

## Performance Optimizations

- **Connection Pooling**: Single connection for serverless
- **Caching**: Proper cache headers
- **Compression**: Gzip compression enabled
- **CDN**: Static assets served via Vercel CDN
- **Database**: Optimized queries with proper indexing

## Real-time Architecture

- **Supabase Subscriptions**: PostgreSQL change events
- **WebSocket Fallback**: Automatic reconnection
- **Polling Backup**: 30-second intervals
- **Event Broadcasting**: Custom team update events
- **State Management**: Real-time React hooks
