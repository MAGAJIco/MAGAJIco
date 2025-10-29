# Sports API Service

## Overview
A multi-language sports data aggregation service with REST API that integrates with multiple sports APIs to fetch live match data, odds, and predictions across various sports (NFL, NBA, MLB, Soccer).

## Project Structure
- `main.py` - FastAPI REST API server
- `sports_api.py` - Python sports API service with data aggregation logic
- `sports.ts` - TypeScript version of sports API library (legacy)
- `index.ts` - TypeScript demo application (legacy)
- `tsconfig.json` - TypeScript configuration
- `package.json` - Node.js dependencies
- `pyproject.toml` - Python dependencies

## Current State
- **Language**: Python 3.11 with FastAPI (Primary), TypeScript/Node.js 20 (Legacy)
- **Status**: Fully functional REST API server
- **Workflow**: FastAPI server running on port 5000
- **API Documentation**: Available at `/docs` (Swagger UI)

## Features

### Free APIs (No keys required)
- ESPN APIs for NFL, NBA, and MLB scores
- No authentication required
- Live scores and game status

### Premium APIs (API keys required)
- **RapidAPI**: NFL, NBA, MLB detailed data
  - Requires: `RAPIDAPI_KEY` environment variable
- **The Odds API**: Betting odds and spreads
  - Requires: `ODDS_API_KEY` environment variable
- **Football-Data.org**: Soccer/football matches (Premier League)
  - Requires: `FOOTBALL_DATA_API_KEY` environment variable

### Legacy Features (TypeScript only)
- FlashScore integration (web scraping) - Available in `sports.ts`
- StatArea predictions (web scraping) - Available in `sports.ts`

## Usage

### Running the API Server
The FastAPI server runs automatically when you start the Repl on port 5000. Access it at:
- **Root**: `/` - API information and available endpoints
- **Documentation**: `/docs` - Interactive Swagger UI
- **Health Check**: `/health` - Server health status

### REST API Endpoints

#### Core Endpoints
- `GET /` - API information and endpoint listing
- `GET /health` - Server health check
- `GET /api/health` - Check status of all integrated sports APIs
- `GET /api/config` - View configured API keys status

#### Sports Data Endpoints
- `GET /api/matches` - Fetch all live matches from all sources
- `GET /api/nfl?source=espn` - NFL matches (source: espn or rapidapi)
- `GET /api/nba?source=espn` - NBA matches (source: espn or rapidapi)
- `GET /api/mlb?source=espn` - MLB matches (source: espn or rapidapi)
- `GET /api/soccer` - Premier League soccer matches (requires API key)

#### ESPN Free Endpoints
- `GET /api/espn/nfl` - NFL scores from ESPN (no key required)
- `GET /api/espn/nba` - NBA scores from ESPN (no key required)
- `GET /api/espn/mlb` - MLB scores from ESPN (no key required)

#### Betting Odds Endpoint
- `GET /api/odds/{sport}` - Get betting odds for NFL, NBA, or MLB (requires API key)

### Adding API Keys
To enable premium features, add these secrets in the Replit Secrets pane:
- `RAPIDAPI_KEY` - For RapidAPI sports data
- `ODDS_API_KEY` - For The Odds API betting data
- `FOOTBALL_DATA_API_KEY` - For Football-Data.org soccer data

### Example API Calls
```bash
# Get all live matches
curl http://localhost:5000/api/matches

# Get NFL scores from ESPN (free)
curl http://localhost:5000/api/espn/nfl

# Check API health
curl http://localhost:5000/api/health

# Get NBA matches with source selection
curl http://localhost:5000/api/nba?source=espn
```

## Architecture
- **RESTful API**: FastAPI with auto-generated OpenAPI documentation
- **Type-safe**: Python type hints and Pydantic models
- **Multi-source**: Aggregates data from 7+ different sources
- **Fallback strategy**: Free ESPN APIs as default, premium APIs optional
- **Error handling**: Graceful degradation when APIs are unavailable
- **CORS enabled**: Supports cross-origin requests for web clients

## Development
- **Python/FastAPI**:
  - Start server: `python main.py` (runs on port 5000)
  - API docs available at `/docs` when server is running
  
- **TypeScript (Legacy)**:
  - Build: `npm run build` - Compiles TypeScript to JavaScript
  - Start: `npm start` - Builds and runs the demo application

## Recent Changes
- **2025-10-29**: Added FastAPI REST API layer
  - Created Python sports API service (`sports_api.py`)
  - Built comprehensive REST API with FastAPI (`main.py`)
  - Added 10+ API endpoints for sports data access
  - Configured workflow to run FastAPI server on port 5000
  - Enabled CORS for cross-origin access
  - Added interactive API documentation at `/docs`
  - Verified all free ESPN endpoints are working (NFL, NBA, MLB)
  - Original TypeScript library maintained for reference
