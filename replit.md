# PUBG Mobile Tournament Registration Website

## Overview
A professional, modern tournament registration platform for PUBG Mobile Squad Championships. Built with React, Express, and TanStack Query featuring a dark gaming-themed design with vibrant accents and smooth animations.

## Features Implemented

### Core Functionality
- **Tournament Registration**: Complete team registration form for 4-player squads
- **Payment Verification**: Upload payment screenshots with transaction ID tracking
- **Slot Management**: Real-time slot counter showing available spots (max 25 teams)
- **Team Dashboard**: View all registered teams with leader information
- **Countdown Timer**: Live countdown to tournament start date

### User Interface
- **Hero Section**: Eye-catching landing with tournament details and CTAs
- **Tournament Details**: Game mode, map, platform, entry fee, and prize information
- **Prize Pool Display**: Winner (₹1000) and Runner-up (₹400) prizes prominently shown
- **Rules Section**: Comprehensive tournament rules and regulations
- **Dark/Light Theme**: Theme toggle for user preference
- **Responsive Design**: Fully responsive across mobile and desktop devices

### Technical Features
- **Form Validation**: Zod schema validation for all inputs
- **Image Upload**: Base64 encoding for payment screenshots
- **Real-time Updates**: TanStack Query for automatic data synchronization
- **Error Handling**: Toast notifications for success/error states
- **Type Safety**: Full TypeScript implementation with shared schemas

## Architecture

### Frontend (React + Vite)
- **Components**: Modular tournament components (Hero, Details, PrizePool, Rules, Registration, Teams)
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom gaming theme
- **Animations**: Framer Motion for smooth transitions

### Backend (Express + TypeScript)
- **API Routes**: RESTful endpoints for team management
- **Storage**: In-memory storage with IStorage interface
- **Validation**: Zod schema validation on server
- **Error Handling**: Comprehensive error responses

### Data Model
```typescript
Team {
  id: string
  teamName: string
  leaderName: string
  leaderWhatsapp: string (10 digits)
  leaderPubgId: string
  player2Name: string
  player2PubgId: string
  player3Name: string
  player3PubgId: string
  player4Name: string
  player4PubgId: string
  transactionId: string
  paymentScreenshot: string (base64)
  agreedToTerms: 1
  createdAt: timestamp
}
```

## Tournament Configuration
- Entry Fee: ₹80 per team
- Prize Pool: ₹1400 total
  - Winner: ₹1000
  - Runner-up: ₹400
- Max Teams: 25 slots
- Game Mode: Squad (4 players)
- Map: Erangel (Classic)
- Platform: Mobile Only

## Design System

### Colors
- **Primary**: Orange-red (#FF6B35) - PUBG-inspired accent
- **Secondary**: Electric cyan (#00D9FF) - Highlights
- **Success**: Green - Confirmed registrations
- **Warning**: Gold - Important notices
- **Background**: Dark navy-black theme
- **Text**: Three-level hierarchy (primary, secondary, tertiary)

### Typography
- **Display Font**: Rajdhani (bold, gaming-inspired headings)
- **Body Font**: Inter (clean, professional body text)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Animations
- Fade-in on page load (0.6s)
- Slide-up scroll reveals (0.4s)
- Card hover lift effects (0.2s)
- Button scale interactions
- Countdown number flip animation
- Pulse effect for slot counter when almost full

## API Endpoints

### GET /api/teams
Returns all registered teams sorted by registration time
```json
Response: Team[]
```

### POST /api/teams
Register a new team (enforces 25-team limit)
```json
Request Body: InsertTeam
Response: Team (201 Created)
Error: 400 Bad Request | 500 Server Error
```

### GET /api/teams/count
Get current team count
```json
Response: { count: number }
```

### GET /api/teams/:id
Get specific team by ID
```json
Response: Team
Error: 404 Not Found
```

## Project Structure
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
│   │   │   ├── registration-form.tsx
│   │   │   └── footer.tsx
│   │   ├── ui/ (shadcn components)
│   │   └── theme-toggle.tsx
│   ├── pages/
│   │   ├── home.tsx
│   │   └── not-found.tsx
│   └── App.tsx
server/
├── routes.ts (API endpoints)
├── storage.ts (Data layer)
└── index.ts
shared/
└── schema.ts (TypeScript types & Zod schemas)
```

## Running the Application
The application runs automatically via the "Start application" workflow which executes:
```bash
npm run dev
```
This starts both the Express backend and Vite frontend on port 5000.

## Recent Changes (October 15, 2025)
- ✅ Implemented complete tournament registration system
- ✅ Built all frontend components with gaming-inspired design
- ✅ Created backend API with slot management
- ✅ Added payment screenshot upload functionality
- ✅ Implemented real-time slot counter
- ✅ Added dark/light theme toggle
- ✅ Comprehensive E2E testing completed
- ✅ Mobile responsive design verified

## Testing
All core features have been tested end-to-end including:
- Team registration flow with all 4 players
- Payment screenshot upload and preview
- Slot counter real-time updates
- Multi-team registration (tested up to 3 teams)
- Toast notifications
- Mobile responsive layout (375px viewport)
- Theme toggle functionality

## Future Enhancements
- Admin panel for payment verification
- Email/WhatsApp notifications
- Automated room ID distribution
- Team editing before tournament
- Prize distribution tracking
- Analytics dashboard

## User Preferences
- Prefer dark gaming theme by default
- Vibrant accent colors (orange/cyan) for gaming aesthetic
- Professional typography with clear hierarchy
- Smooth, subtle animations (no excessive motion)
- Mobile-first responsive design
