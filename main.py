"""
Updated FastAPI Main - Integrate Real Sports Data + ML
Add this to your existing main.py
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from datetime import datetime
import pickle
import numpy as np

# Import your scraper (save the previous artifact as real_scraper.py)
from real_scraper import RealSportsScraperService, LiveMatch

app = FastAPI(title="MagajiCo Sports Prediction API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
try:
    with open("shared/model_data.pkl", "rb") as f:
        model_data = pickle.load(f)
        ml_model = model_data["model"]
        feature_names = model_data["feature_names"]
    print("✅ ML Model loaded successfully from shared/model_data.pkl")
except Exception as e:
    print(f"❌ Failed to load ML model: {e}")
    ml_model = None
    feature_names = []

# Initialize scraper with ML model
scraper = RealSportsScraperService(ml_predictor=ml_model)


# ========== ML ENDPOINTS (Existing) ==========

@app.get("/api/ml/status")
async def get_ml_status():
    """Get ML model status"""
    if not ml_model:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    return {
        "status": "ready",
        "model": str(type(ml_model).__name__).replace("Classifier", " Classifier"),
        "accuracy": 0.9035,
        "features": len(feature_names),
        "feature_names": feature_names,
        "prediction_classes": [
            "Home Win (1)",
            "Draw (X)",
            "Away Win (2)"
        ],
        "training_samples": 10000,
        "training_accuracy": 0.987,
        "test_accuracy": 0.9035
    }


@app.get("/api/ml/predict")
async def predict_match(
    home_strength: float = Query(..., ge=0.3, le=1.0),
    away_strength: float = Query(..., ge=0.3, le=1.0),
    home_advantage: float = Query(0.65, ge=0.5, le=0.8),
    recent_form_home: float = Query(..., ge=0.2, le=1.0),
    recent_form_away: float = Query(..., ge=0.2, le=1.0),
    head_to_head: float = Query(0.5, ge=0.3, le=0.7),
    injuries: float = Query(0.9, ge=0.4, le=1.0)
):
    """Make ML prediction for a match"""
    if not ml_model:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    try:
        features = np.array([[
            home_strength,
            away_strength,
            home_advantage,
            recent_form_home,
            recent_form_away,
            head_to_head,
            injuries
        ]])
        
        prediction = ml_model.predict(features)[0]
        probabilities = ml_model.predict_proba(features)[0]
        
        prediction_map = {
            0: "Home Win",
            1: "Draw",
            2: "Away Win"
        }
        
        return {
            "prediction": prediction_map[prediction],
            "confidence": float(max(probabilities) * 100),
            "probabilities": {
                "home_win": float(probabilities[0]),
                "draw": float(probabilities[1]),
                "away_win": float(probabilities[2])
            },
            "features_used": {
                "home_strength": home_strength,
                "away_strength": away_strength,
                "home_advantage": home_advantage,
                "recent_form_home": recent_form_home,
                "recent_form_away": recent_form_away,
                "head_to_head": head_to_head,
                "injuries": injuries
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# ========== NEW LIVE PREDICTIONS ENDPOINTS ==========

@app.get("/api/predictions/live")
async def get_live_predictions(
    api_key: Optional[str] = Query(None, description="RapidAPI key for real data")
):
    """
    Get live match predictions from multiple sources
    Returns real data if API key provided, otherwise uses ESPN + samples
    """
    try:
        predictions = scraper.get_all_predictions(api_key=api_key)
        
        return {
            "status": "success",
            "count": len(predictions),
            "predictions": predictions,
            "timestamp": datetime.now().isoformat(),
            "sources": ["ESPN", "FlashScore", "API-Football"] if api_key else ["ESPN", "Sample Data"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch predictions: {str(e)}")


@app.get("/api/predictions/sport/{sport}")
async def get_sport_predictions(sport: str):
    """
    Get predictions for a specific sport
    Supported: soccer, nfl, nba, mlb
    """
    sport = sport.lower()
    
    if sport not in ["soccer", "nfl", "nba", "mlb"]:
        raise HTTPException(status_code=400, detail="Unsupported sport. Use: soccer, nfl, nba, or mlb")
    
    try:
        matches = scraper.scrape_espn_scores(sport)
        
        return {
            "sport": sport,
            "count": len(matches),
            "matches": [match.to_dict() for match in matches],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch {sport} data: {str(e)}")


@app.get("/api/predictions/high-confidence")
async def get_high_confidence_predictions(
    min_confidence: int = Query(85, ge=70, le=100),
    api_key: Optional[str] = None
):
    """
    Get only high-confidence predictions
    """
    try:
        all_predictions = scraper.get_all_predictions(api_key=api_key)
        
        high_conf = [
            p for p in all_predictions 
            if p.get('confidence', 0) >= min_confidence
        ]
        
        return {
            "status": "success",
            "min_confidence": min_confidence,
            "count": len(high_conf),
            "predictions": high_conf,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/predictions/league/{league}")
async def get_league_predictions(
    league: str,
    api_key: Optional[str] = None
):
    """
    Get predictions filtered by league
    Examples: Premier League, La Liga, NFL, NBA
    """
    try:
        all_predictions = scraper.get_all_predictions(api_key=api_key)
        
        league_predictions = [
            p for p in all_predictions
            if league.lower() in p.get('league', '').lower()
        ]
        
        return {
            "league": league,
            "count": len(league_predictions),
            "predictions": league_predictions,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/predictions/today")
async def get_today_predictions(api_key: Optional[str] = None):
    """
    Get all predictions for today's matches
    """
    try:
        predictions = scraper.get_all_predictions(api_key=api_key)
        
        # Filter for today (in production, you'd parse timestamps)
        today_predictions = predictions  # All fetched data is from today
        
        return {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "count": len(today_predictions),
            "predictions": today_predictions,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== UTILITY ENDPOINTS ==========

@app.get("/api/health")
async def health_check():
    """Check API health"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ml_model_loaded": ml_model is not None,
        "scraper_active": True
    }


@app.get("/api/predictions/mybets")
async def get_mybets_predictions():
    """
    Get recommended soccer predictions from mybets.today
    """
    try:
        predictions = scraper.scrape_mybets_today()
        
        return {
            "status": "success",
            "source": "mybets.today",
            "count": len(predictions),
            "predictions": predictions,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch mybets predictions: {str(e)}")


@app.get("/api/predictions/statarea")
async def get_statarea_predictions():
    """
    Get soccer predictions from Statarea (https://www.statarea.com/predictions)
    Features: Home/Draw/Away percentage predictions
    Accuracy: ~78% confidence prediction quality
    """
    try:
        predictions = scraper.scrape_statarea()
        
        return {
            "status": "success",
            "source": "statarea.com",
            "count": len(predictions),
            "predictions": predictions,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Statarea predictions: {str(e)}")


@app.get("/api/predictions/scoreprediction")
async def get_scoreprediction():
    """
    Get score predictions from ScorePrediction.net
    Features: Predicted match scores with >1:0 or 0:1 filtering
    Returns: All games with total goals > 1
    """
    try:
        predictions = scraper.scrape_scoreprediction()
        
        return {
            "status": "success",
            "source": "scorepredictor.net",
            "count": len(predictions),
            "predictions": predictions,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ScorePrediction: {str(e)}")


@app.get("/api/predictions/flashscore-odds")
async def get_flashscore_odds(
    max_odds: float = Query(1.16, ge=1.0, le=3.0, description="Maximum odds threshold (e.g., 1.16 for favorites)")
):
    """
    Get FlashScore COMPLETE WEEK odds calendar (all 7 days) filtered by max odds
    Uses mobile version: https://www.flashscore.mobi/?d=X&s=5 (d=0 to d=6)
    Returns organized day-by-day with only matches where any odd is <= max_odds
    """
    try:
        week_calendar = scraper.scrape_flashscore_odds(max_odds=max_odds)
        
        # Count total matches across all days
        total_matches = sum(day.get("matches_count", 0) for day in week_calendar.values())
        total_days_with_matches = len([d for d in week_calendar.values() if d.get("matches_count", 0) > 0])
        
        return {
            "status": "success",
            "source": "flashscore.mobi",
            "filter": f"odds <= {max_odds}",
            "summary": {
                "total_matches": total_matches,
                "days_with_matches": total_days_with_matches,
                "total_days": len(week_calendar)
            },
            "week_calendar": week_calendar,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch FlashScore odds: {str(e)}")


@app.get("/api/stats")
async def get_stats(api_key: Optional[str] = None):
    """Get prediction statistics"""
    try:
        predictions = scraper.get_all_predictions(api_key=api_key)
        
        if not predictions:
            return {
                "total_matches": 0,
                "avg_confidence": 0,
                "high_confidence_count": 0,
                "by_sport": {}
            }
        
        confidences = [p.get('confidence', 0) for p in predictions]
        
        by_sport = {}
        for p in predictions:
            sport = p.get('sport', 'Unknown')
            by_sport[sport] = by_sport.get(sport, 0) + 1
        
        return {
            "total_matches": len(predictions),
            "avg_confidence": sum(confidences) / len(confidences) if confidences else 0,
            "high_confidence_count": sum(1 for c in confidences if c >= 85),
            "medium_confidence_count": sum(1 for c in confidences if 70 <= c < 85),
            "low_confidence_count": sum(1 for c in confidences if c < 70),
            "by_sport": by_sport,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== ROOT ==========

@app.get("/")
async def root():
    """API welcome message"""
    return {
        "message": "MagajiCo Sports Prediction API",
        "version": "2.0",
        "endpoints": {
            "ml_status": "/api/ml/status",
            "ml_predict": "/api/ml/predict",
            "live_predictions": "/api/predictions/live",
            "sport_predictions": "/api/predictions/sport/{sport}",
            "high_confidence": "/api/predictions/high-confidence",
            "today": "/api/predictions/today",
            "mybets": "/api/predictions/mybets",
            "flashscore_odds": "/api/predictions/flashscore-odds",
            "health": "/api/health",
            "stats": "/api/stats"
        },
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)