# Gaming Tournament Platform

## Overview
This project is a professional, modern, and fully responsive web platform designed for managing PUBG Mobile and Free Fire gaming tournaments. It facilitates team registration, provides real-time slot tracking, features a secure admin dashboard for management, and allows for data export in Excel format. The platform aims to streamline tournament operations, enhance user experience with a modern UI, and ensure data integrity and security.

## User Preferences
The user prefers detailed explanations and wants to be asked before making major changes. The user does not want any changes to be made to the folder `Z` or the file `Y`.

## System Architecture

### UI/UX Decisions
- **Design Language**: Modern, professional, gaming-themed UI/UX with a focus on responsiveness.
- **Color Scheme**: Primary orange (`#FF6B1A`) for a gaming/action theme, complemented by professional dark/light mode support.
- **Typography**: `Rajdhani` for display fonts (headings) for a bold, gaming aesthetic, and `Inter` for body text for a clean, modern look.
- **Animations**: Utilizes Framer Motion for smooth page transitions, animated hero sections with gradient orbs, card hover effects with scaling, and pulse effects for urgent elements. Glassmorphism effects are used for cards.
- **Responsiveness**: Mobile-first approach with breakpoints for mobile (<768px), tablet (768px-1024px), and desktop (>1024px).

### Technical Implementations
- **Frontend**: Built with React 18, TypeScript, TanStack Query (React Query) for data caching, Wouter for routing, Tailwind CSS and shadcn/ui for components, Framer Motion for animations, and Lucide Icons.
- **Backend**: Developed using Express.js with TypeScript, PostgreSQL as the database, and Drizzle ORM for type-safe database interactions. Bcrypt is used for password hashing, and Express Session for session management. ExcelJS handles Excel export functionality.
- **Development Tools**: Vite for fast development, Drizzle Kit for database schema management, and TSX.

### Feature Specifications
- **Dual Tournament System**: Separate sections and configurations for PUBG Mobile and Free Fire tournaments, each with independent team registration and slot tracking.
  - **PUBG Mobile**: Max 25 teams, ₹80 entry, ₹1000 winner, ₹400 runner-up. Squad mode, Erangel map.
  - **Free Fire**: Max 12 teams, ₹80 entry, ₹500 winner, ₹260 runner-up. Squad mode, Bermuda/Purgatory/Kalahari map.
- **Real-Time Slot Tracking**: Live updates every 5 seconds, visual progress bar, automatic alerts for nearly full slots, and prevention of over-registration.
- **Registration Form**: Captures team and player details (including player IDs), supports payment screenshot upload (Base64), transaction ID validation, YouTube live streaming voting, and terms & conditions agreement. Features real-time form validation.
- **Admin Dashboard**: Secure login, real-time statistics, team management (approve/reject/pending with bulk operations), search, filter, admin notes, and payment screenshot verification.
- **Excel Export System**: Exports team data separately for PUBG, Free Fire, or combined, saved to organized folders (`exports/pubg/`, `exports/freefire/`, `exports/all/`).

### System Design Choices
- **Database**: PostgreSQL for persistent data storage, managed by Drizzle ORM. Key tables include `admin_users` and `teams`. Supports real-time data synchronization.
- **Security**: Implements password hashing with bcrypt, session-based authentication, protected admin routes, input validation with Zod, and CSRF protection.
- **Performance**: Utilizes React Query for data caching and optimization, lazy loading, and 5-second polling for real-time updates.
- **Project Structure**: Organized into `client/` (frontend), `server/` (backend), and `shared/` (shared types and schemas).

## External Dependencies
- **PostgreSQL**: Primary database for data storage.
- **Supabase PostgreSQL**: Used for cloud database in production environments (e.g., Vercel deployments), providing real-time synchronization.
- **Vercel**: Deployment platform for hosting the application.
- **Pusher**: (Optional) For real-time features, requiring `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, and `PUSHER_CLUSTER` environment variables.