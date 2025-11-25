# MagajiCo Sports Platform

## Overview
MagajiCo is a multi-language sports data aggregation platform with a REST API, real-time prediction integration, and a sophisticated theme system. It combines Amazon's consumer-friendly design aesthetic for its light theme with Apple's premium dark aesthetic for its dark theme, offering a visually appealing and intuitive user experience. The platform aims to provide comprehensive sports data, predictions, and betting insights, supported by robust authentication and internationalization features.

## User Preferences
- **Theme System**: Light/Dark/System with automatic detection
- **Persistence**: localStorage key: `theme` 
- **Color Priority**: Amazon Blue (#0066cc) for trust, Purple gradients for premium
- **Accessibility**: High contrast in light mode, reduced eye strain in dark mode
- **Animation**: Smooth transitions, no jarring color changes
- **Authentication**: Google login only with username-based profile system

## System Architecture
The platform is built with a FastAPI backend (Python 3.11) and a Next.js 16 frontend, running on ports 8000 and 5000 (via Nginx proxy) respectively.

### UI/UX Decisions
- **Theme System**: A central feature offering "Amazon Consumer-Friendly" light mode (clean white, Amazon Blue/Orange) and "Apple Premium" dark mode (deep charcoal, purple gradients). It supports automatic system detection, persistent storage via localStorage, and smooth 0.3s transitions.
- **Internationalization (i18n)**: Supports 4 languages (English, Spanish, French, German) with easy extensibility via JSON files. Language preference is saved to localStorage.
- **Authentication UI**: `AuthNav` component dynamically displays user profile or login button, integrating seamlessly with the theme toggle.

### Technical Implementations
- **Frontend**: Next.js 16 with React Context API for global state, `next-intl` for i18n, Tailwind CSS for styling (using `class` and `data-theme` for dark mode), and Framer Motion for animations.
- **Backend**: FastAPI for the REST API, handling sports data aggregation, platform statistics, and predictions.
- **Authentication**: Replit Auth (OpenID Connect) with **Google login only**. Username is captured during first login. Next.js API routes handle auth endpoints. Authentication headers set by Replit's reverse proxy.
- **Database**: PostgreSQL with `users` (username field) and `sessions` tables, managed by Drizzle ORM.
- **MagajiCo Secret Feature (Match Deduplication)**: Identifies and highlights matches appearing across multiple data sources (Statarea, ScorePrediction, MyBets) with a star rating system.

### Feature Specifications
- **Real-time Data**: Aggregates predictions from FlashScore, MyBetsToday, and StatArea.
- **API Endpoints**: Comprehensive set for health checks, platform statistics, live matches across various sports (NFL, NBA, MLB, Soccer), and predictions.
- **Authenticated Access**: The `/en/predictions` page is protected, requiring user authentication + valid username.

## Recent Changes

### 2025-11-25: Fixed Google Login Connection ✅
**Authentication Flow Fixed:**
- **Issue**: Login button wasn't connecting to Google
- **Root Cause**: Login button was trying to redirect to `/api/login` instead of Replit's built-in `/auth/login` endpoint
- **Solution**: 
  - Updated login button to link directly to `/auth/login` (Replit's OAuth endpoint)
  - Installed missing dependencies: `passport`, `passport-strategy`, `express-session`, `connect-pg-simple`
  - Created proper API routes for authentication handling:
    - `/api/auth/user` - Returns authenticated user info from Replit auth headers
    - `/api/auth/set-username` - Validates and sets username in httpOnly cookie
    - `/api/logout` - Clears auth and redirects to login
- **How It Works Now**:
  1. User clicks "Continue with Google" button → Links to `/auth/login`
  2. Replit Auth handles Google OAuth flow
  3. Replit's reverse proxy authenticates and sets auth headers (`x-user-id`, `x-user-email`, etc.)
  4. User redirected to `/en/login` for username setup
  5. Username validated (3-30 chars, alphanumeric + underscore)
  6. Username stored in secure httpOnly cookie
  7. User redirected to home page

### Previous: Simplified Authentication - Google + Username Only ✅
- **Schema**: Added `username` field to users table (unique, varchar)
- **Components**:
  - `src/app/[locale]/login/page.tsx` - Unified login/username page
  - `src/hooks/useAuth.ts` - Auth state management
  - `src/app/components/AuthNav.tsx` - Displays username in navbar
  - `src/app/[locale]/predictions/page.tsx` - Requires auth + username

## External Dependencies
- **Replit Auth**: OpenID Connect provider for Google authentication
- **PostgreSQL**: Database for user and session data
- **Drizzle ORM**: Database schema and migrations
- **ESPN APIs**: Free access to NFL, NBA, MLB scores
- **RapidAPI**: Premium sports data (requires API keys)
- **The Odds API**: Betting odds and spreads (requires API keys)
- **Football-Data.org**: Soccer/football match data (requires API keys)
