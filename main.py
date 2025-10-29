from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
from dotenv import load_dotenv
from sports_api import create_sports_api_service, LiveMatch, OddsData

load_dotenv()

app = FastAPI(
    title="Sports API Aggregation Service",
    description="Multi-source sports data aggregation API supporting NFL, NBA, MLB, and Soccer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = create_sports_api_service()


@app.get("/")
async def root():
    return {
        "message": "Sports API Aggregation Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "api_health": "/api/health",
            "all_matches": "/api/matches",
            "nfl": "/api/nfl",
            "nba": "/api/nba",
            "mlb": "/api/mlb",
            "soccer": "/api/soccer",
            "odds": "/api/odds/{sport}",
            "espn_nfl": "/api/espn/nfl",
            "espn_nba": "/api/espn/nba",
            "espn_mlb": "/api/espn/mlb"
        },
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Sports API Aggregation Service"
    }


@app.get("/api/health")
async def api_health():
    try:
        health_status = service.check_api_health()
        healthy_count = sum(1 for h in health_status if h["status"] == "healthy")
        total_count = len(health_status)
        
        return {
            "summary": {
                "healthy": healthy_count,
                "total": total_count,
                "percentage": round((healthy_count / total_count) * 100, 2) if total_count > 0 else 0
            },
            "services": health_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/matches")
async def get_all_matches():
    try:
        matches = service.fetch_all_live_matches()
        return {
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch matches: {str(e)}")


@app.get("/api/nfl")
async def get_nfl_matches(source: Optional[str] = Query("espn", description="Data source: 'rapidapi' or 'espn'")):
    try:
        if source.lower() == "rapidapi":
            matches = service.fetch_nfl_matches()
        else:
            matches = service.fetch_espn_nfl()
        
        return {
            "sport": "NFL",
            "source": source,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch NFL matches: {str(e)}")


@app.get("/api/nba")
async def get_nba_matches(source: Optional[str] = Query("espn", description="Data source: 'rapidapi' or 'espn'")):
    try:
        if source.lower() == "rapidapi":
            matches = service.fetch_nba_matches()
        else:
            matches = service.fetch_espn_nba()
        
        return {
            "sport": "NBA",
            "source": source,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch NBA matches: {str(e)}")


@app.get("/api/mlb")
async def get_mlb_matches(source: Optional[str] = Query("espn", description="Data source: 'rapidapi' or 'espn'")):
    try:
        if source.lower() == "rapidapi":
            matches = service.fetch_mlb_matches()
        else:
            matches = service.fetch_espn_mlb()
        
        return {
            "sport": "MLB",
            "source": source,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch MLB matches: {str(e)}")


@app.get("/api/soccer")
async def get_soccer_matches():
    try:
        matches = service.fetch_soccer_matches()
        return {
            "sport": "Soccer",
            "league": "Premier League",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch soccer matches: {str(e)}")


@app.get("/api/espn/nfl")
async def get_espn_nfl():
    try:
        matches = service.fetch_espn_nfl()
        return {
            "sport": "NFL",
            "source": "ESPN",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ESPN NFL data: {str(e)}")


@app.get("/api/espn/nba")
async def get_espn_nba():
    try:
        matches = service.fetch_espn_nba()
        return {
            "sport": "NBA",
            "source": "ESPN",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ESPN NBA data: {str(e)}")


@app.get("/api/espn/mlb")
async def get_espn_mlb():
    try:
        matches = service.fetch_espn_mlb()
        return {
            "sport": "MLB",
            "source": "ESPN",
            "count": len(matches),
            "matches": [match.to_dict() for match in matches]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ESPN MLB data: {str(e)}")


@app.get("/api/odds/{sport}")
async def get_odds(sport: str):
    try:
        sport_upper = sport.upper()
        if sport_upper not in ["NFL", "NBA", "MLB"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported sport: {sport}. Supported: NFL, NBA, MLB"
            )
        
        odds = service.fetch_odds_data(sport_upper)
        return {
            "sport": sport_upper,
            "count": len(odds),
            "odds": [odd.to_dict() for odd in odds]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch odds data: {str(e)}")


@app.get("/api/config")
async def get_config():
    return {
        "api_keys_configured": {
            "rapidapi": bool(os.getenv("RAPIDAPI_KEY")),
            "odds_api": bool(os.getenv("ODDS_API_KEY")),
            "football_data": bool(os.getenv("FOOTBALL_DATA_API_KEY"))
        },
        "available_sources": {
            "free": ["ESPN NFL", "ESPN NBA", "ESPN MLB"],
            "premium": [
                "RapidAPI (NFL, NBA, MLB)" if os.getenv("RAPIDAPI_KEY") else None,
                "The Odds API" if os.getenv("ODDS_API_KEY") else None,
                "Football-Data.org" if os.getenv("FOOTBALL_DATA_API_KEY") else None
            ]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
