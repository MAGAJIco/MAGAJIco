# Sports API Service

A comprehensive TypeScript library for aggregating sports data from multiple sources including ESPN, RapidAPI, The Odds API, and more.

## Features

- **Multi-sport support**: NFL, NBA, MLB, Soccer
- **Multiple data sources**: 10+ integrated APIs
- **Free tier available**: ESPN APIs work without any API keys
- **Live scores**: Real-time match data and scores
- **Betting odds**: Integration with The Odds API (requires key)
- **Predictions**: StatArea integration for match predictions
- **Type-safe**: Full TypeScript implementation

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run the Demo
```bash
npm start
```

This will:
1. Check the health of all integrated APIs
2. Fetch current sports data from ESPN (free)
3. Display sample matches and scores

## API Integration

### Free APIs (No keys needed)
- ✅ ESPN NFL Scoreboard
- ✅ ESPN NBA Scoreboard
- ✅ ESPN MLB Scoreboard
- ✅ FlashScore (web scraping)
- ✅ StatArea predictions (web scraping)

### Premium APIs (API keys required)
Set these as environment variables:

- `RAPIDAPI_KEY` - For RapidAPI sports data
  - NFL, NBA, MLB detailed game data
  
- `ODDS_API_KEY` - For The Odds API
  - Betting odds, spreads, over/under
  
- `FOOTBALL_DATA_API_KEY` - For Football-Data.org
  - Soccer/football match data

## Usage Example

```typescript
import { createSportsAPIService } from './sports';

const service = createSportsAPIService();

// Fetch live NFL matches
const nflMatches = await service.fetchESPNNFL();
console.log(nflMatches);

// Check API health status
const health = await service.checkAPIHealth();
console.log(health);

// Fetch all live matches from all sources
const allMatches = await service.fetchAllLiveMatches();
console.log(allMatches);

// Get betting odds (requires API key)
const odds = await service.fetchOddsData('NFL');
console.log(odds);
```

## Data Structures

### LiveMatch
```typescript
{
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
  prediction?: string;
  confidence?: number;
}
```

### OddsData
```typescript
{
  gameId: string;
  bookmaker: string;
  homeOdds: number;
  awayOdds: number;
  drawOdds?: number;
  overUnder?: {
    total: number;
    overOdds: number;
    underOdds: number;
  };
}
```

## Development

### Build
```bash
npm run build
```

### Scripts
- `npm start` - Build and run demo
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Same as start (for development)

## License

ISC
