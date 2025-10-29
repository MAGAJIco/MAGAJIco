# Sports API Service

## Overview
A TypeScript-based sports data aggregation library that integrates with multiple sports APIs to fetch live match data, odds, and predictions across various sports (NFL, NBA, MLB, Soccer).

## Project Structure
- `sports.ts` - Main library with `SportsAPIService` class
- `index.ts` - Demo application showing API usage
- `tsconfig.json` - TypeScript configuration
- `package.json` - Node.js dependencies and scripts

## Current State
- **Language**: TypeScript (Node.js 20)
- **Status**: Fully functional demo application
- **Workflow**: Console application that demonstrates API integration

## Features

### Free APIs (No keys required)
- ESPN APIs for NFL, NBA, and MLB scores
- FlashScore integration (web scraping)
- StatArea predictions (web scraping)

### Premium APIs (API keys required)
- **RapidAPI**: NFL, NBA, MLB data
  - Requires: `RAPIDAPI_KEY` environment variable
- **The Odds API**: Betting odds and spreads
  - Requires: `ODDS_API_KEY` environment variable
- **Football-Data.org**: Soccer/football matches
  - Requires: `FOOTBALL_DATA_API_KEY` environment variable

## Usage

### Running the Demo
The demo application runs automatically when you start the Repl. It:
1. Checks health status of all integrated APIs
2. Fetches live match data from ESPN APIs
3. Displays sample matches with scores and status

### Adding API Keys
To enable premium features, add these secrets in the Replit Secrets pane:
- `RAPIDAPI_KEY` - For RapidAPI sports data
- `ODDS_API_KEY` - For The Odds API betting data
- `FOOTBALL_DATA_API_KEY` - For Football-Data.org soccer data

### Using the Library in Code
```typescript
import { createSportsAPIService } from './sports';

const service = createSportsAPIService();

// Fetch NFL matches
const nflMatches = await service.fetchESPNNFL();

// Check API health
const health = await service.checkAPIHealth();

// Fetch odds data (requires API key)
const odds = await service.fetchOddsData('NFL');
```

## Architecture
- **Type-safe**: Full TypeScript implementation with interfaces
- **Multi-source**: Aggregates data from 10+ different sources
- **Fallback strategy**: Free APIs used as fallback for premium APIs
- **Error handling**: Graceful degradation when APIs are unavailable

## Development
- Build: `npm run build` - Compiles TypeScript to JavaScript
- Start: `npm start` - Builds and runs the demo application
- The compiled output is in the `dist/` directory

## Recent Changes
- **2025-10-29**: Initial setup in Replit environment
  - Configured TypeScript compilation
  - Set up workflow for console demo
  - Verified free ESPN APIs are working
  - Added proper error handling and health checks
