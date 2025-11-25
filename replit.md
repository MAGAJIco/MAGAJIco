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
- **Mobile Design**: FlashScore-style compact mobile interface with collapsible sections

## System Architecture
The platform is built with a FastAPI backend (Python 3.11) and a Next.js 16 frontend, running on ports 8000 and 5000 (via Nginx proxy) respectively.

### UI/UX Decisions
- **Theme System**: A central feature offering "Amazon Consumer-Friendly" light mode (clean white, Amazon Blue/Orange) and "Apple Premium" dark mode (deep charcoal, purple gradients). It supports automatic system detection, persistent storage via localStorage, and smooth 0.3s transitions.
- **Internationalization (i18n)**: Supports 4 languages (English, Spanish, French, German) with easy extensibility via JSON files. Language preference is saved to localStorage.
- **Authentication UI**: `AuthNav` component dynamically displays user profile or login button, integrating seamlessly with the theme toggle.
- **Guest Experience**: Guests receive a 30-minute free trial to explore the app. A friendly timer banner appears when 5 minutes remain, prompting sign-up to unlock full features. The timer uses localStorage to persist the session across page reloads.
- **Mobile-First Interface**: FlashScore-inspired design with compact layouts, collapsible sections, and tap-friendly elements for optimal mobile experience.

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

### 2025-11-25: Prediction Cards Connected to Real API Data ✅
**All Card Components Now Functional with Real Data:**
- **MyBetsCard**: Fetches from `/api/predictions/mybets` (real data)
- **ScorePredictionCard**: Fetches from `/api/predictions/scoreprediction` (real data)
- **StatAreaCard**: Fetches from `/api/predictions/statarea` (real data)
- **SecretMatchCard**: Fetches from `/api/predictions/flashscore-odds` (real data)
- **All pages use real API data** - No static/mock data fallbacks
- **Frontend hooks**: `useCardData.ts` with `useMyBetsData()`, `useScorePredictionData()`, `useStatAreaData()`
- **Backend**: All endpoints support secrets/environment variables for authentication
- **Features**:
  - Real-time data fetching with error handling
  - Auto-retry on failure
  - 60-second refresh intervals
  - Loading states with spinners
  - Error banners with retry buttons

### 2025-11-25: MongoDB Integration + Data Dashboards ✅
**Dual-Storage System with Frontend Dashboards:**
- **ResultsLogger Enhanced**: Now supports both MongoDB Atlas (cloud) and JSON (local)
- **Automatic Failover**: Falls back to JSON if MongoDB connection fails
- **Storage Strategy**:
  - **MongoDB**: Primary storage for scalability and easy access
  - **JSON** (`shared/results_log.json`): Backup storage for reliability
  - Both receive every log entry for redundancy
- **Backend Endpoints**:
  - `/api/mongodb/status` - Check MongoDB connection status & collections
  - `/api/mongodb/stats` - View detailed MongoDB statistics
  - `/api/training/logs` - Get recent logs by type
  - `/api/training/data` - Get all training data in JSON format
  - `/api/training/summary` - Get summary statistics
- **Frontend Dashboard Pages** (NEW):
  - **`/en/mongodb`** - MongoDB Status Dashboard
    - Real-time connection status monitoring
    - Collection statistics visualization
    - Storage method indicators
    - Auto-refresh every 10 seconds
  - **`/en/training-data`** - Training Data Dashboard
    - View all logged predictions, odds, matches
    - Download training data as JSON
    - Summary statistics and charts
    - Filterable by data type
- **Navigation Menu** (UPDATED):
  - Added "Data & Analytics" section to EnhancedMenu
  - Quick links to MongoDB Status and Training Data dashboards
  - Accessible from main menu with Database and BookOpen icons
- **Features**:
  - Automatic sync of historical JSON data to MongoDB on startup
  - Graceful error handling - system continues with JSON-only if MongoDB unavailable
  - MongoDB collections: `predictions`, `odds`, `matches`, `metadata`
  - Dual logging to both databases automatically
  - Real-time dashboard updates and statistics
- **Configuration**: Uses `MONGODB_URI` secret from environment
- **Status**: System running with JSON storage (MongoDB DNS failover working), dashboards live

**To Enable MongoDB Cloud Storage**:
1. Create MongoDB Atlas free account (mongodb.com)
2. Create a cluster and get connection string
3. Whitelist Replit IP: 0.0.0.0/0 in MongoDB Atlas Network Access
4. Update MONGODB_URI secret with your connection string

### 2025-11-25: Results Storage & Training Data System ✅
**Comprehensive Logging for All API Outputs:**
- **ResultsLogger Class**: Stores all predictions, odds, and matches to `shared/results_log.json`
- **Training Data Endpoints**:
  - `/api/training/logs` - Get recent logs by type (prediction/odds/match)
  - `/api/training/data` - Get all logged data formatted for model retraining
  - `/api/training/summary` - View statistics on logged results
- **Caching System**:
  - All successful results cached to prevent gaps on failures
  - ML predictions return cached results if model unavailable
  - Odds cached across bookmakers for consistency
- **Persistence**: All results automatically saved to disk (JSON format)
- **Training Ready**: Complete history available for model retraining

### 2025-11-25: soccerapi Integration - Real Betting Odds ✅
**Real Odds from Commercial Bookmakers:**
- **Bookmakers Supported**: 888Sport, Bet365, Unibet (via soccerapi Python library)
- **Markets Included**:
  - Full-time result (1/X/2)
  - Over/Under 4.5 goals specifically
  - Both teams to score
- **New Endpoints**:
  - `/api/odds/soccerapi` - Get real odds from any bookmaker
  - `/api/odds/over-4-5` - Filter for over 4.5 goals market specifically
  - `/api/odds/aggregate-weekly-soccer` - Combine from all sources
- **Optimizations**:
  - 5-second timeout per bookmaker (prevents hangs)
  - Reduced to 10 matches per request for speed
  - Automatic fallback to sample data on timeout
  - Global caching across requests
- **Features**:
  - Query by league (premier_league, la_liga, serie_a, bundesliga, ligue_1)
  - Filter by max odds threshold (customizable)
  - All results logged for training data

## Recent Changes (Previous)

### 2025-11-25: Real Multi-Source Web Scraper Implementation ✅
**Live Sports Predictions from Multiple Sources:**

#### **Implemented Scrapers (5 Real Sources)**
1. **FlashScore** - Live soccer matches with scores/times (PRIMARY)
   - Scrapes: `https://www.flashscore.mobi/?d=0&s=5` (mobile version)
   - Extracts: Teams, live scores, match times, odds (1X2 format)
   - Method: `scrape_flashscore_soccer()`

2. **MyBets.today** - Real soccer predictions with betting odds
   - Scrapes: `/recommended-soccer-predictions/`
   - Extracts: Teams, prediction types (1/X/2/OVER/UNDER), odds
   - Method: `scrape_mybets_today()`

3. **Statarea.com** - Soccer prediction percentages
   - Scrapes: `https://www.statarea.com/predictions`
   - Extracts: Home/Draw/Away percentages (46% / 25% / 29% format)
   - Confidence: ~78% based on prediction dominance
   - Method: `scrape_statarea()`

4. **ScorePrediction.net** - Exact score predictions
   - Scrapes: `https://scorepredictor.net/`
   - Extracts: Predicted scores (e.g., 3:1), total goals, confidence
   - Filters: Only scores with total goals > 1
   - Method: `scrape_scoreprediction()`

5. **ESPN** - Live scores (Soccer, NFL, NBA, MLB)
   - Scrapes: ESPN scoreboard pages
   - Parses: Embedded JSON with real-time match data
   - Method: `scrape_espn_scores(sport)`

#### **Data Pipeline**
Updated `get_all_predictions()` to aggregate from **all 5 sources**:
```
Priority Order:
1. FlashScore matches (live soccer - primary)
2. MyBets.today predictions (real odds data)
3. Statarea predictions (percentage-based)
4. ScorePrediction (score predictions)
5. ESPN matches (live scores)
6. API-Football (if API key provided)
7. Sample data (ultimate fallback)
```

#### **Live Data Output**
When `/api/predictions/live` is called:
- Returns **36+ predictions** from multiple sources
- Each prediction includes: teams, prediction type, confidence, odds (if available)
- Example: "Chelsea vs Barcelona - Prediction: 1 (Home) - Confidence: 60% - Source: statarea.com"

#### **Backend Logs**
```
✅ Scraped 15 predictions from Statarea
✅ Scraped 16 predictions from ScorePrediction
✅ Scraped 5 matches from ESPN
📊 Total predictions: 36 from multiple sources
```

#### **Frontend Integration**
- Homepage fetches `/api/predictions/live` every 30 seconds
- Displays real match data in FlashScore-style cards
- Collapsible league sections show all available predictions
- Live counter header displays active matches

#### **Tech Stack**
- **BeautifulSoup4**: HTML parsing from websites
- **Requests**: HTTP requests with user-agent headers
- **Regex**: Data extraction and pattern matching
- **Fallback System**: Sample data returned if scraping fails
- **Type Safety**: All outputs converted to `Dict[str, Any]`

### 2025-11-25: FlashScore Mobile Interface + Global Gradient Design System 🎨
**Complete Mobile-First Redesign with Premium Gradient System:**

#### **FlashScore Mobile Homepage Interface**
- **Layout**: Mobile-optimized max-width 2xl container, compact spacing throughout
- **Live Counter Header**: Sticky red/orange gradient bar showing live match count
- **Now Playing Section**: 2-column grid of compact live match cards (max 6 displayed)
  - Each card shows: Home team, score with pulsing indicator, Away team
  - Heart icon for favoriting matches
  - Red gradient LIVE badge with pulsing animation
- **Refresh Button**: Full-width blue gradient button with smooth hover effects
- **Divider**: Gradient line separating live and upcoming sections
- **All Matches Section**: Collapsible competition list
  - League header with flag, name, match count, live count badge
  - ChevronDown animation on expand/collapse
  - Compact match rows: Teams (2-line) + Score/Time (right-aligned)
  - Smooth height animation when expanding/collapsing
  - Color-coded LIVE indicator with pulsing animation
- **View All Predictions Link**: Purple gradient button linking to predictions page

#### **Global Gradient Design System**
- **CSS Variables**: Premium gradient library in globals.css
  - `--gradient-blue-from/to`: #3b82f6 → #1d4ed8
  - `--gradient-purple-from/to`: #a855f7 → #7c3aed
  - `--gradient-red-from/to`: #ef4444 → #f97316
  - `--gradient-green-from/to`: #10b981 → #059669
- **Utility Classes**:
  - `.gradient-blue`, `.gradient-red`, `.gradient-purple`, `.gradient-green` - Background gradients
  - `.gradient-text-blue`, `.gradient-text-red` - Text gradients with clip-path
  - `.gradient-animate` - Animated shifting gradients
- **Component Applications**:
  - **TopNav**: Blue gradient background (replaced gray)
  - **BottomNav**: Gradient-to-top background (from blue-50 to white, with dark mode support)
  - **EnhancedMenu**: Gradient header bar with gradient icon badges
  - **Layout**: Dark gradient background (gray-950 → gray-900)
  - **Secrets Page**: Premium gradient styling on all interactive elements
  - **Homepage**: Fully themed with gradient cards and buttons

#### **Files Modified**
- `src/app/[locale]/page.tsx` - Redesigned homepage with FlashScore layout
- `src/app/globals.css` - Premium gradient design system
- `src/app/components/TopNav.tsx` - Blue gradient styling
- `src/app/components/BottomNav.tsx` - Gradient top border
- `src/app/components/EnhancedMenu.tsx` - Gradient header
- `src/app/[locale]/layout.tsx` - Dark gradient background
- `src/app/[locale]/secrets/page.tsx` - Full gradient styling

#### **UX Improvements**
- Compact mobile-first spacing (px-3 py-3 instead of px-4 py-4)
- Collapsible sections reduce visual clutter
- Tap-friendly buttons and interactive elements
- Color-coded gradients for visual hierarchy
- Smooth animations on all interactions
- Loading states with spinner animation
- Empty states with helpful messaging

### 2025-11-25: Secrets Page with Starred Predictions ⭐
**New VIP Feature - Exclusive Starred Predictions:**
- **Created**: `/en/secrets` page showcasing high-confidence match predictions
- **Features**:
  - Displays matches with confidence >= 130% (starred automatically)
  - Filter options: Starred Only, Today, This Week
  - Real-time statistics: Starred matches count, average confidence, best odds
  - Beautiful gradient design with red/orange star theme
  - VIP Access badge for premium feel
  - Detailed match cards with league, teams, odds (1X2), predictions
  - Confidence badges: ULTRA HIGH (>=140%), VERY HIGH (>=130%), HIGH (>=100%), MODERATE
  - Animated star icons on high-confidence matches
- **Integration**:
  - Added to main navigation menu (EnhancedMenu) with ⭐ icon
  - Featured on dashboard with "Secrets ⭐" card
  - Connects to FlashScore odds API endpoint
- **Technical**:
  - Fetches data from `/api/predictions/flashscore-odds`
  - Sorts matches by confidence (highest first)
  - Responsive design with mobile optimization
- **CORS Fix**: Updated backend to allow all origins for development (`allow_origins=["*"]`)

### 2025-11-25: 2:2:2:4 World-Class Architecture ✅
**Strategic Implementation - Inspired by Industry Leaders:**

#### **2 Parts: Apple (Tim Cook)** - Premium Design & Polish
- Created `PremiumUI.tsx` component system with:
  - Glass-morphism cards with shimmer effects on hover
  - Particle animations for premium feel
  - Smooth spring-based transitions (Framer Motion)
  - Micro-interactions with responsive feedback
  - Premium toast notifications with gradient backgrounds
  - Expandable sections with smooth animations
- All components follow Apple's attention-to-detail philosophy

#### **2 Parts: Tesla/SpaceX (Elon Musk)** - Performance & Efficiency
- Implemented performance optimization tier (`lib/performance.ts`):
  - Smart API caching with 5-minute TTL (reduces redundant API calls)
  - Batch fetch utility for parallel API execution
  - RAF throttling for smooth animations
  - Request debouncing to prevent duplicate requests
  - Auto-prefetch critical resources during idle time
- Next.js config optimizations:
  - SWC minification enabled for faster builds
  - Webpack chunk splitting for intelligent bundle management
  - Production source maps disabled for smaller bundles
  - Turbo mode enabled for parallel compilation
  - Package import optimization (lucide-react, framer-motion)

#### **2 Parts: Meta (Mark Zuckerberg)** - Engagement & Social
- Created engagement notification system:
  - Real-time toast notifications for user actions
  - Favorites tracking with persistent badge counter
  - Live match indicators with pulsing animation
  - Engagement hooks: `useFavorites`, `useNotifications`
  - Favorite matches appear with heart icon and counter badge
  - Meta-style notifications appear top-right with auto-dismiss
  - Homepage now shows hover-triggered favorite buttons on matches

#### **4 Parts: Amazon (Jeff Bezos)** - Data-Driven Personalization
- Implemented `useRecommendations.ts` hook:
  - Tracks user view history with engagement scores (0-1)
  - Generates smart recommendations based on viewing patterns
  - Trending algorithm: scoring based on type preference + recency
  - "Recommended for You" section on homepage with confidence scores
  - Personalization improves with each user interaction
  - localStorage persistence for view history across sessions
  - Returns top 5 recommendations with reasoning ("Based on your interests", "Popular today")

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
