# MagajiCo Sports Platform - Amazon Consumer-Friendly + Apple Premium Design

## Overview
A multi-language sports data aggregation service with REST API integrated with real-time predictions from FlashScore, MyBetsToday, and StatArea. Now featuring enterprise-grade light/dark theme system matching **Amazon's consumer-friendly design** + **Apple's premium dark aesthetic**.

## Project Structure
- `main.py` - FastAPI REST API server (Port 8000)
- `src/app/[locale]/page.tsx` - Homepage with theme toggle and auth
- `src/app/[locale]/bets/page.tsx` - Today's Bets page with theme support
- `src/app/[locale]/predictions/page.tsx` - Advanced Predictions Hub (fixed import path)
- `src/app/components/ThemeProvider.tsx` - React Context-based theme system
- `src/app/components/ThemeToggle.tsx` - Beautiful animated theme switcher
- `src/app/components/AuthNav.tsx` - Authentication navigation component
- `src/app/api/auth/*` - API routes for authentication
- `src/styles/theme-enhanced.css` - Complete light/dark theme variables
- `tailwind.config.ts` - Tailwind with Amazon-inspired color palette
- `shared/schema.ts` - Database schema for users and sessions

## Current State (November 25, 2025)
- **Language**: Python 3.11 FastAPI + Next.js 16 Frontend
- **Status**: Fully functional with theme system, i18n & **authenticated user login**
- **Frontend Port**: 5000 (Nginx proxy)
- **Backend Port**: 8000 (Direct)
- **Workflow Status**: Both running successfully
- **i18n**: Full internationalization with 4 languages (English, Spanish, French, German)
- **Authentication**: Replit Auth integration with login/logout UI

## Authentication System (NEW ✨)
- **Provider**: Replit Auth (OpenID Connect)
- **Supported Login Methods**: 
  - Email/Password
  - Google
  - GitHub
  - X (Twitter)
  - Apple
- **Database**: PostgreSQL with user and session tables
- **UI Components**:
  - `AuthNav` component in header showing user profile or login button
  - Login redirects to Replit Auth
  - Logout clears session and returns to homepage
- **API Endpoints**:
  - `GET /api/auth/user` - Fetch current authenticated user
  - `GET /api/login` - Start login flow
  - `GET /api/logout` - Start logout flow

## New Theme System - "Amazon + Apple" Design Philosophy

### Light Theme (Amazon Consumer-Friendly) ☀️
```css
Primary Colors:
- Background: #ffffff (Clean white)
- Secondary Background: #f8f9fa (Warm light gray)
- Primary Brand: #0066cc (Amazon Blue)
- Secondary Brand: #ff9900 (Amazon Orange)
- Text: #0a0e27 (Deep navy - high contrast)
- Accent: #146eb4 (Professional blue)
```
**Psychology**: Trust, approachability, e-commerce established pattern
**Use Case**: Day trading, casual browsing, consumer-friendly sports betting

### Dark Theme (Apple Premium) 🌙
```css
Primary Colors:
- Background: #0d1117 (Deep charcoal)
- Secondary Background: #161b22 (Premium dark)
- Primary Brand: #667eea (Purple gradient start)
- Secondary Brand: #764ba2 (Purple gradient end)
- Accent: #f093fb (Pink accent - premium feel)
- Text: #e6edf3 (Soft white for reduced eye strain)
```
**Psychology**: Premium, sophisticated, reduced eye strain
**Use Case**: Late-night trading, professional viewing, OLED displays

## Features

### Internationalization (i18n) System ✨
- **4 Languages**: English, Spanish, French, German
- **Feature-Based Organization**: Settings, Navigation, Home, Predictions, Matches, Leaderboard
- **Settings Translation**: Full i18n on Settings page
- **Dynamic Language Switching**: Language preference saved to localStorage
- **Easy Extensibility**: Add new languages by creating new JSON files in `src/locales/messages/`

### Translation File Structure
```
src/locales/messages/
├── en.json          # English
├── es.json          # Español
├── fr.json          # Français
└── de.json          # Deutsch

Each file contains:
- common: Shared UI strings (loading, error, retry, save, cancel, close)
- nav: Navigation items
- settings: All settings-related strings
- theme: Theme selection options
- home, predictions, matches, leaderboard: Feature-specific strings
```

### Theme System
- **Automatic System Detection** - Respects OS light/dark preference
- **Persistent Storage** - Saves user theme choice to localStorage
- **Smooth Transitions** - 0.3s color transitions on all elements
- **Consumer-Friendly Light Mode** - Amazon-style clean and approachable
- **Premium Dark Mode** - Apple-style minimal and sophisticated
- **3 Selection Modes**: Light / Dark / System (auto)

### Free APIs (No keys required)
- ESPN APIs for NFL, NBA, and MLB scores
- Live scores and game status

### Premium APIs (API keys required)
- **RapidAPI**: NFL, NBA, MLB detailed data
- **The Odds API**: Betting odds and spreads
- **Football-Data.org**: Soccer/football matches

### Real Data Features
- Multi-source prediction aggregation (FlashScore, MyBetsToday, StatArea)
- Platform statistics with real API metrics
- Live match tracking with real odds
- Parlay builder with real calculations
- Stake.com betting integration

## Usage

### Running the Platform
```bash
# Frontend (Nginx proxy on 5000)
npm run dev

# Backend (Direct on 8000)
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### REST API Endpoints
- `GET /` - API information
- `GET /api/health` - Server health check
- `GET /api/stats/platform` - Real platform statistics
- `GET /api/matches` - All live matches
- `GET /api/nfl|nba|mlb` - Sport-specific matches
- `GET /api/soccer` - Premier League matches
- `GET /api/predictions/soccer` - Soccer predictions
- `GET /api/predictions/statarea` - StatArea predictions
- `GET /api/predictions/flashscore/over45` - FlashScore predictions

### Theme Toggle Usage
1. Click the **sun/moon icon** (☀️/🌙) in the navbar (top-right)
2. Select from: **Light** / **Dark** / **System**
3. Your preference automatically saves
4. All pages smoothly transition colors

### Login/Logout Usage
1. Click **Login** button in the top-right navbar
2. Sign in with your preferred method (Email, Google, GitHub, X, Apple)
3. Your user profile appears in the navbar
4. Click **Logout** to sign out and return to login state

## Design Architecture

### Theme System Stack
- **React Context API** - Global theme state management
- **localStorage** - Persistent user preference
- **CSS Variables** - Dynamic theming across entire app
- **Tailwind Dark Mode** - `class` + `data-theme` attribute selectors
- **Framer Motion** - Smooth theme transition animations

### Authentication Stack
- **Replit Auth** - OpenID Connect provider (Google, GitHub, X, Apple, Email)
- **Next.js API Routes** - Backend authentication endpoints
- **PostgreSQL** - User and session storage
- **Drizzle ORM** - Database schema and migrations
- **React Query** - Client-side user state management

### Design Decision: Why "Amazon + Apple"?
1. **Amazon Light Mode**: 
   - Proven consumer trust pattern (e-commerce leader)
   - Blue + Orange = high contrast, accessible
   - Perfect for sports betting platform (approachable, not intimidating)

2. **Apple Dark Mode**:
   - Premium, sophisticated aesthetic
   - Reduced eye strain for late-night viewing
   - Purple gradients feel modern and tech-forward
   - Proven on 1B+ iOS devices

3. **Result**:
   - Users during day = trustworthy Amazon UX
   - Users at night = premium Apple experience
   - Automatic switching respects their OS preference

## Recent Changes

- **2025-11-25**: ✅ Private Predictions Page Protected with Authentication
  - **Protection Added**: `/en/predictions` now requires user authentication
  - **User Experience**:
    - Loading state shown while checking authentication status
    - Non-authenticated users see login prompt with "Sign In" button
    - Authenticated users see personalized header: "Private Predictions - Welcome {FirstName}"
  - **Code Cleanup**: Removed 146 lines of leftover/duplicate code from predictions page
  - **Personalization**: Dynamic greeting with user's first name when logged in
  - **Implementation Details**:
    - useAuth hook checks authentication status on component mount
    - If loading: shows spinner and "Loading..." message
    - If not authenticated: shows lock icon + login prompt + Sign In button
    - If authenticated: loads full predictions page with user data

- **2025-11-25**: ✅ Authenticated User Login Complete
  - **Provider Integration**: Replit Auth (OpenID Connect) with 5 login methods
  - **Database Setup**: PostgreSQL with users and sessions tables
  - **Frontend Components**:
    - `AuthNav.tsx` - Shows login button or user profile in navbar
    - `useAuth.ts` hook - Manages auth state with React Query
  - **API Routes**:
    - `/api/auth/user` - Fetch authenticated user info
    - `/api/login` - Redirect to Replit Auth login
    - `/api/logout` - Clear session and sign out
  - **UI Integration**:
    - Login/Logout button in header next to theme toggle
    - User profile display with avatar and name
    - Smooth auth state loading
  - **Database Schema** (`shared/schema.ts`):
    - `users` table: id, email, firstName, lastName, profileImageUrl, timestamps
    - `sessions` table: express-session compatible table for session storage

- **2025-11-25**: ✅ MagajiCo Secret Feature Complete (Match Deduplication)
  - **Core Feature**: Detects matches appearing across multiple scrapers with star ratings
    - Displays matches found in 2+ sources (Statarea, ScorePrediction, MyBets)
    - ⭐⭐ for appearing in 2 sources
    - ⭐⭐⭐ for appearing in all 3 sources
  
  - **Implementation**:
    - New `calculateSecretMatches()` function matches teams across all scrapers
    - Team name normalization: case-insensitive, alphabetically sorted for deduplication
    - useEffect recalculates whenever any scraper data updates
    - Matches sorted by confidence (highest first), max 10 displayed
  
  - **UI Design**:
    - **Card Design**: Gold/orange/red gradient background (gradient-to-br from-yellow-400 via-orange-400 to-red-500)
    - **Star Rating**: Large emoji display (⭐⭐ or ⭐⭐⭐)
    - **Header**: "🔮 MAGAJICO SECRET" with spinning crystal emoji
    - **Shows**: Team matchup, sources where match appears, confidence from each source
    - **Button**: "🎁 Claim Secret Bet" call-to-action
    - **Position**: Placed at TOP of predictions page for maximum visibility

## User Preferences
- **Theme System**: Light/Dark/System with automatic detection
- **Persistence**: localStorage key: `theme` 
- **Color Priority**: Amazon Blue (#0066cc) for trust, Purple gradients for premium
- **Accessibility**: High contrast in light mode, reduced eye strain in dark mode
- **Animation**: Smooth transitions, no jarring color changes
- **Authentication**: Integrated login/logout with profile display

## Project Architecture
```
Frontend (Next.js 16):
├── Layout with ThemeProvider wrapper
├── Pages with embedded ThemeToggle & i18n
├── AuthNav component in navbar
├── API routes for authentication
├── CSS theme variables for dynamic styling
├── i18n translations via next-intl
└── Tailwind dark mode with `class` selector

Backend (FastAPI + ML):
├── Sports data aggregation API
├── ML prediction service (Random Forest)
├── Real-time prediction APIs
├── Platform statistics endpoint
├── ML health check & status endpoints
└── Health monitoring

Database (PostgreSQL):
├── users table (id, email, firstName, lastName, profileImageUrl)
├── sessions table (sid, sess, expire)
└── Managed via Drizzle ORM

Authentication:
├── Replit Auth (OpenID Connect)
├── 5 login providers (Email, Google, GitHub, X, Apple)
├── React Query for client-side state
└── Next.js API routes for backend

ML Model Pipeline:
├── src/ml/train_model.py (data generation & training)
├── src/ml/ml_predictor.py (prediction service)
├── model_data.pkl (trained model with 90.3% accuracy)
└── 7 input features for match outcome prediction

Internationalization:
├── src/locales/messages/ (JSON translation files)
├── src/i18n.ts (i18n configuration)
├── useTranslations() hook for client components
└── 4 supported languages with localStorage persistence

Styling:
├── theme-enhanced.css (Amazon + Apple colors)
├── design-tokens.css (brand tokens)
└── globals.css (Tailwind base styles)
```

### Shared Folder Organization
```
shared/                         # Shared files
├── schema.ts                   # Drizzle schema (users, sessions)
└── health.ts                   # Health check types

src/
├── locales/
│   └── messages/              # Frontend translations (ONLY)
│       ├── en.json
│       ├── es.json
│       ├── fr.json
│       └── de.json
├── hooks/
│   └── useAuth.ts             # Auth state management hook
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── user/          # GET user info
│   │       ├── login/         # Redirect to Replit Auth
│   │       └── logout/        # Clear session
│   └── components/
│       ├── AuthNav.tsx        # Login/logout UI
│       ├── ThemeToggle.tsx
│       ├── ThemeProvider.tsx
│       └── ...rest of components...
└── ...rest of frontend code...
```

## Deployment

### Frontend Build
```bash
npm run build
npm run start
```

### Backend Deployment
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

The platform is production-ready with enterprise-grade theming, real sports data integration, and authenticated user login.

## Next Steps (Optional Enhancements)
- Add user profile page with preferences
- Implement user-specific predictions history
- Add more theme variants (e.g., "High Contrast" accessibility mode)
- Implement per-component theme overrides for special sections
- Extend authentication to more pages (settings, social, analytics)
- A/B test authentication conversion rates
