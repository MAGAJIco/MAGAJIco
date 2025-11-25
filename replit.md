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
- **Guest Experience**: 30-minute free trial allowing guests to browse matches, explore competitions, and enjoy the app before login

## System Architecture
The platform is built with a FastAPI backend (Python 3.11) and a Next.js 16 frontend, running on ports 8000 and 5000 (via Nginx proxy) respectively.

### UI/UX Decisions
- **Theme System**: A central feature offering "Amazon Consumer-Friendly" light mode (clean white, Amazon Blue/Orange) and "Apple Premium" dark mode (deep charcoal, purple gradients). It supports automatic system detection, persistent storage via localStorage, and smooth 0.3s transitions.
- **Internationalization (i18n)**: Supports 4 languages (English, Spanish, French, German) with easy extensibility via JSON files. Language preference is saved to localStorage.
- **Authentication UI**: `AuthNav` component dynamically displays user profile or login button, integrating seamlessly with the theme toggle.
- **Guest Experience**: Guests receive a 30-minute free trial to explore the app. A friendly timer banner appears when 5 minutes remain, prompting sign-up to unlock full features. The timer uses localStorage to persist the session across page reloads.

### Technical Implementations
- **Frontend**: Next.js 16 with React Context API for global state, `next-intl` for i18n, Tailwind CSS for styling (using `class` and `data-theme` for dark mode), and Framer Motion for animations.
- **Backend**: FastAPI for the REST API, handling sports data aggregation, platform statistics, and predictions.
- **Authentication**: Replit Auth (OpenID Connect) with **Google login only**. Username is captured during first login. Next.js API routes handle auth endpoints. Authentication headers set by Replit's reverse proxy.
- **Guest Sessions**: `useGuestSession` hook manages a 30-minute free trial period. Session start time stored in localStorage. Timer banner (`GuestTimer` component) displays when time is running out.
- **Database**: PostgreSQL with `users` (username field) and `sessions` tables, managed by Drizzle ORM.
- **MagajiCo Secret Feature (Match Deduplication)**: Identifies and highlights matches appearing across multiple data sources (Statarea, ScorePrediction, MyBets) with a star rating system.

### Feature Specifications
- **Real-time Data**: Aggregates predictions from FlashScore, MyBetsToday, and StatArea.
- **API Endpoints**: Comprehensive set for health checks, platform statistics, live matches across various sports (NFL, NBA, MLB, Soccer), and predictions.
- **Guest Access**: Home page and matches are fully accessible to guests for 30 minutes.
- **Authenticated Access**: The `/en/predictions` page requires both authentication (Google login) + valid username.

## Recent Changes

### 2025-11-25: FlashScore-Style Interface + Error Handling ✅
**Complete Interface Redesign with Real Data Loading:**
- **API Proxy Routes Fixed**: Changed predictions page to use `/api/predictions/*` proxy routes instead of direct backend calls
- **Error Handling Implemented**:
  - Promise.allSettled for graceful failure handling
  - 8-second timeout per API request
  - Retry buttons on error state
  - Individual error messages per source
- **Lazy Loading with Collapsible Sections**:
  - Expandable prediction tables (Statarea, ScorePrediction)
  - Smooth transitions with ChevronDown indicator
  - Show first 15 predictions, display count of total
- **Mobile Navigation Fixed**:
  - Updated BottomNav with persistent underline indicator
  - Menu items: All Games (☰), LIVE (🔴), Premium (⭐), Leagues (🏆)
  - Gradient underline animation on active state
  - Proper mobile-only display (hidden on desktop)
- **FlashScore-Style Pages**:
  - Homepage: Blue gradient header, stats cards, competition list with live indicators
  - Live Page: Red header, sport filters, live match scores with animations
  - Matches Page: Indigo header, date filters, clean match list
  - All pages use data-focused layout, minimal design, fast-loading cards

### 2025-11-25: Guest Experience & Extended Free Trial ✅
**Guest Session System Implemented:**
- **Motivation**: Guests can now enjoy/browse the app for 30 minutes before being prompted to login
- **Implementation**:
  - Created `useGuestSession.ts` hook - manages 30-minute free trial with localStorage persistence
  - Created `GuestSessionWrapper.tsx` - wraps locale layout and displays timer banner
  - Created `GuestTimer.tsx` component - shows countdown when 5 minutes remain
  - Updated layout to include guest session wrapper
- **How It Works**:
  1. Guest visits home page → Session starts (30 minutes)
  2. Guest browses matches, competitions, live games freely
  3. Timer banner appears when 5 minutes remain
  4. Guest can dismiss banner and continue browsing (just informational)
  5. After 30 minutes: Persistent timer shown, but browsing not blocked
  6. Guest can click "Sign Up Now" to authenticate via Google
  7. After login: Set username → Full access to predictions
- **Benefits**:
  - Better UX: No forced login wall
  - Higher conversion: Users explore before committing
  - Session persistence: Survives page reloads via localStorage

### 2025-11-25: Fixed Google Login Connection ✅
**Authentication Flow Fixed:**
- Login button now links to `/auth/login` (Replit's OAuth endpoint)
- Proper API routes handle authentication lifecycle
- Username stored in secure httpOnly cookies

### Previous: Simplified Authentication - Google + Username Only ✅
- Schema: Added `username` field to users table (unique, varchar)
- Components: Login page, auth state management, navbar integration
- Protection: Predictions page requires auth + username

## External Dependencies
- **Replit Auth**: OpenID Connect provider for Google authentication
- **PostgreSQL**: Database for user and session data
- **Drizzle ORM**: Database schema and migrations
- **ESPN APIs**: Free access to NFL, NBA, MLB scores
- **RapidAPI**: Premium sports data (requires API keys)
- **The Odds API**: Betting odds and spreads (requires API keys)
- **Football-Data.org**: Soccer/football match data (requires API keys)
