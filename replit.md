# MagajiCo Sports Platform

## Overview
MagajiCo is a multi-language sports data aggregation platform with a REST API, real-time prediction integration, and a sophisticated theme system. It combines Amazon's consumer-friendly design aesthetic for its light theme with Apple's premium dark aesthetic for its dark theme, offering a visually appealing and intuitive user experience. The platform aims to provide comprehensive sports data, predictions, and betting insights, supported by robust authentication and internationalization features.

## User Preferences
- **Theme System**: Light/Dark/System with automatic detection
- **Persistence**: localStorage key: `theme` 
- **Color Priority**: Amazon Blue (#0066cc) for trust, Purple gradients for premium
- **Accessibility**: High contrast in light mode, reduced eye strain in dark mode
- **Animation**: Smooth transitions, no jarring color changes
- **Authentication**: Integrated Google login with username-based profile system

## System Architecture
The platform is built with a FastAPI backend (Python 3.11) and a Next.js 16 frontend, running on ports 8000 and 5000 (via Nginx proxy) respectively.

### UI/UX Decisions
- **Theme System**: A central feature offering "Amazon Consumer-Friendly" light mode (clean white, Amazon Blue/Orange) and "Apple Premium" dark mode (deep charcoal, purple gradients). It supports automatic system detection, persistent storage via localStorage, and smooth 0.3s transitions.
- **Internationalization (i18n)**: Supports 4 languages (English, Spanish, French, German) with easy extensibility via JSON files. Language preference is saved to localStorage.
- **Authentication UI**: `AuthNav` component dynamically displays user profile or login button, integrating seamlessly with the theme toggle.

### Technical Implementations
- **Frontend**: Next.js 16 with React Context API for global state, `next-intl` for i18n, Tailwind CSS for styling (using `class` and `data-theme` for dark mode), and Framer Motion for animations.
- **Backend**: FastAPI for the REST API, handling sports data aggregation, platform statistics, and predictions.
- **Authentication**: Replit Auth (OpenID Connect) with **Google login only**. Username is captured during first login. Next.js API routes handle auth endpoints. React Query manages client-side auth state.
- **Database**: PostgreSQL with `users` (with username field) and `sessions` tables, managed by Drizzle ORM.
- **MagajiCo Secret Feature (Match Deduplication)**: Identifies and highlights matches appearing across multiple data sources (Statarea, ScorePrediction, MyBets) with a star rating system.

### Feature Specifications
- **Real-time Data**: Aggregates predictions from FlashScore, MyBetsToday, and StatArea.
- **API Endpoints**: Comprehensive set for health checks, platform statistics, live matches across various sports (NFL, NBA, MLB, Soccer), and predictions.
- **Authenticated Access**: The `/en/predictions` page is protected, requiring user authentication + valid username.

## Recent Changes

### 2025-11-25: Simplified Authentication - Google + Username Only ✅
**Complete Authentication Redesign:**
- **Schema**: Added `username` field to users table (unique, varchar)
- **Login Flow**:
  1. User clicks "Login" → Redirects to `/en/login` page
  2. If not authenticated → Shows "Continue with Google" button only
  3. After Google auth → Redirects to username setup page
  4. User enters username (3-30 chars, alphanumeric + underscore)
  5. Username stored in localStorage and backend API
  6. Redirects to home page as authenticated user
- **Files Changed**:
  - `shared/schema.ts` - Added username field
  - `src/app/[locale]/login/page.tsx` - New unified login/username page
  - `src/app/api/auth/set-username/route.ts` - Username validation
  - `src/hooks/useAuth.ts` - Support for username in localStorage
  - `src/app/components/AuthNav.tsx` - Displays username
  - `src/app/[locale]/predictions/page.tsx` - Checks for username before access
- **User Experience**:
  - Minimal, clean login interface (Google only, no other providers)
  - Username setup with real-time validation
  - "Use a different account" option on username page
  - Navbar displays username when logged in
  - Private predictions page redirects if username not set

## External Dependencies
- **Replit Auth**: OpenID Connect provider for Google authentication
- **PostgreSQL**: Database for user and session data
- **Drizzle ORM**: Database schema and migrations
- **ESPN APIs**: Free access to NFL, NBA, MLB scores
- **RapidAPI**: Premium sports data (requires API keys)
- **The Odds API**: Betting odds and spreads (requires API keys)
- **Football-Data.org**: Soccer/football match data (requires API keys)
