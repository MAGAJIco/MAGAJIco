# MagajiCo Sports Empire

A comprehensive REST API for aggregating sports data from multiple sources including ESPN, RapidAPI, The Odds API, and more. Built with FastAPI and Python, providing a clean RESTful interface for accessing live sports data.

## Features

- **RESTful API**: Clean, well-documented REST endpoints
- **Multi-sport support**: NFL, NBA, MLB, Soccer
- **Multiple data sources**: 7+ integrated APIs
- **Free tier available**: ESPN APIs work without any API keys
- **Live scores**: Real-time match data and scores
- **Betting odds**: Integration with The Odds API (requires key)
- **Interactive docs**: Auto-generated Swagger UI at `/docs`
- **CORS enabled**: Ready for web applications
- **Type-safe**: Python type hints throughout

## Quick Start

### Run the Server
The server starts automatically on port 5000. Access it at:
- **API Root**: `http://localhost:5000/`
- **Documentation**: `http://localhost:5000/docs`
- **Health Check**: `http://localhost:5000/health`

### Test the API
```bash
# Get all live matches
curl http://localhost:5000/api/matches

# Get NFL scores (free ESPN data)
curl http://localhost:5000/api/espn/nfl

# Check API health
curl http://localhost:5000/api/health
```

## API Endpoints

### Core Endpoints
- `GET /` - API information and endpoint listing
- `GET /health` - Server health check
- `GET /api/health` - Check status of all integrated APIs
- `GET /api/config` - View configured API keys

### Sports Data
- `GET /api/matches` - All live matches from all sources
- `GET /api/nfl?source=espn` - NFL matches (espn or rapidapi)
- `GET /api/nba?source=espn` - NBA matches (espn or rapidapi)
- `GET /api/mlb?source=espn` - MLB matches (espn or rapidapi)
- `GET /api/soccer` - Premier League matches (requires key)

### Free ESPN Endpoints
- `GET /api/espn/nfl` - NFL scores (no key required)
- `GET /api/espn/nba` - NBA scores (no key required)
- `GET /api/espn/mlb` - MLB scores (no key required)

### Betting Odds
- `GET /api/odds/{sport}` - Betting odds for NFL, NBA, or MLB (requires key)

## Data Sources

### Free APIs (No keys needed)
- ✅ ESPN NFL Scoreboard
- ✅ ESPN NBA Scoreboard
- ✅ ESPN MLB Scoreboard

### Premium APIs (API keys required)
Set these as secrets in your environment:

- `RAPIDAPI_KEY` - For RapidAPI sports data (NFL, NBA, MLB)
- `ODDS_API_KEY` - For The Odds API (betting odds, spreads)
- `FOOTBALL_DATA_API_KEY` - For Football-Data.org (soccer)

## Example Usage

### Using the REST API
```bash
# Get NFL scores from ESPN
curl http://localhost:5000/api/espn/nfl

# Get all live matches
curl http://localhost:5000/api/matches

# Check which APIs are working
curl http://localhost:5000/api/health
```

### Response Format
```json
{
  "sport": "NFL",
  "source": "ESPN",
  "count": 14,
  "matches": [
    {
      "id": "401772943",
      "sport": "NFL",
      "homeTeam": "Miami Dolphins",
      "awayTeam": "Baltimore Ravens",
      "gameTime": "2025-10-31T00:15Z",
      "status": "Scheduled",
      "homeScore": 0,
      "awayScore": 0
    }
  ]
}
```

## Technology Stack

- **Backend**: Python 3.11, FastAPI, Uvicorn
- **HTTP Client**: Requests library
- **API Documentation**: Auto-generated OpenAPI/Swagger
- **Legacy**: TypeScript/Node.js version also available

## Project Structure

```
.
├── main.py              # FastAPI server
├── sports_api.py        # Sports data aggregation service
├── sports.ts            # TypeScript version (legacy)
├── index.ts             # TypeScript demo (legacy)
├── pyproject.toml       # Python dependencies
├── package.json         # Node.js dependencies
└── README.md            # This file
```

## Interactive Documentation

Visit `/docs` when the server is running to access:
- Interactive API explorer
- Request/response schemas
- Try-it-out functionality for all endpoints
- Automatic request validation

## Contributing

The project supports both Python and TypeScript implementations:
- **Python/FastAPI** (Primary): RESTful API server
- **TypeScript** (Legacy): Original library implementation

## License

ISC