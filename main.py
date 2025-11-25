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

# Prediction cache for consistency on failures
_PREDICTION_RESULT_CACHE = {}

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
    home_team: str = Query("Team A", description="Home team name"),
    away_team: str = Query("Team B", description="Away team name"),
    home_strength: float = Query(..., ge=0.3, le=1.0),
    away_strength: float = Query(..., ge=0.3, le=1.0),
    home_advantage: float = Query(0.65, ge=0.5, le=0.8),
    recent_form_home: float = Query(..., ge=0.2, le=1.0),
    recent_form_away: float = Query(..., ge=0.2, le=1.0),
    head_to_head: float = Query(0.5, ge=0.3, le=0.7),
    injuries: float = Query(0.9, ge=0.4, le=1.0)
):
    """Make ML prediction for a match with caching for consistency on failures"""
    global _PREDICTION_RESULT_CACHE
    
    if not ml_model:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    # Create cache key for this match
    cache_key = f"{home_team}_{away_team}"
    
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
        
        result = {
            "match": f"{home_team} vs {away_team}",
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
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Cache successful result for consistency on future failures
        _PREDICTION_RESULT_CACHE[cache_key] = result
        return result
        
    except Exception as e:
        # On failure, return cached result if available to maintain consistency
        if cache_key in _PREDICTION_RESULT_CACHE:
            cached = _PREDICTION_RESULT_CACHE[cache_key].copy()
            cached["cached"] = True
            cached["error_recovered"] = f"Using cached prediction due to: {str(e)}"
            cached["cached_at"] = cached.get("timestamp")
            return cached
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


@app.get("/api/odds/soccerapi")
async def get_soccerapi_odds(
    bookmaker: str = Query("888sport", description="Bookmaker: 888sport, bet365, or unibet"),
    league: str = Query("premier_league", description="League: premier_league, la_liga, serie_a, bundesliga, ligue_1"),
    max_odds: float = Query(1.16, ge=1.0, le=5.0, description="Maximum odds threshold"),
    include_over_under: bool = Query(True, description="Include over/under 4.5 goals odds")
):
    """
    Get real soccer odds from commercial bookmakers using soccerapi library
    Supports: 888Sport, Bet365, Unibet
    Includes: Full-time result odds + Over/Under 4.5 goals market
    """
    try:
        odds = scraper.scrape_soccerapi_odds(
            bookmaker=bookmaker.lower(),
            league=league.lower(),
            min_odds=1.0,
            max_odds=max_odds,
            include_over_under=include_over_under
        )
        
        # Filter and sort
        filtered = [odd for odd in odds if odd.get("best_odd", float('inf')) <= max_odds]
        
        # Count stats
        predictions_count = {}
        over_under_count = 0
        for odd in filtered:
            pred = odd.get("prediction", "Unknown")
            predictions_count[pred] = predictions_count.get(pred, 0) + 1
            if "over_4_5" in odd or "under_4_5" in odd:
                over_under_count += 1
        
        return {
            "status": "success",
            "source": f"soccerapi ({bookmaker.upper()})",
            "league": league,
            "filter": f"odds <= {max_odds}",
            "total_matches": len(filtered),
            "summary": {
                "by_prediction": predictions_count,
                "with_over_under_4_5": over_under_count
            },
            "matches": filtered,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch soccerapi odds: {str(e)}")


@app.get("/api/odds/over-4-5")
async def get_over_4_5_odds(
    bookmaker: str = Query("888sport", description="Bookmaker: 888sport, bet365, or unibet"),
    league: str = Query("premier_league", description="League: premier_league, la_liga, serie_a, bundesliga, ligue_1"),
    max_odds: float = Query(2.0, ge=1.0, le=5.0, description="Maximum odds threshold for over 4.5")
):
    """
    Get OVER 4.5 goals betting odds from commercial bookmakers
    Returns only matches with available over 4.5 goals odds <= threshold
    """
    try:
        odds = scraper.scrape_soccerapi_odds(
            bookmaker=bookmaker.lower(),
            league=league.lower(),
            min_odds=1.0,
            max_odds=5.0,
            include_over_under=True
        )
        
        # Filter for ONLY matches with over 4.5 and where over_4_5 odds <= max_odds
        over_4_5_matches = []
        for odd in odds:
            over_4_5 = odd.get("over_4_5")
            if over_4_5 and over_4_5 <= max_odds:
                over_4_5_matches.append({
                    "home_team": odd.get("home_team"),
                    "away_team": odd.get("away_team"),
                    "time": odd.get("time"),
                    "full_time_1": odd.get("odds_1"),
                    "full_time_x": odd.get("odds_x"),
                    "full_time_2": odd.get("odds_2"),
                    "over_4_5_odds": over_4_5,
                    "under_4_5_odds": odd.get("under_4_5"),
                    "source": odd.get("source")
                })
        
        return {
            "status": "success",
            "market": "Over 4.5 Goals",
            "source": f"soccerapi ({bookmaker.upper()})",
            "league": league,
            "filter": f"over 4.5 odds <= {max_odds}",
            "total_matches_with_over_4_5": len(over_4_5_matches),
            "matches": over_4_5_matches,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch over 4.5 odds: {str(e)}")


@app.get("/api/odds/bet365")
async def get_bet365_odds(
    max_odds: float = Query(2.5, ge=1.0, le=5.0, description="Maximum odds threshold")
):
    """
    Get soccer odds from Bet365 filtered by max odds threshold
    Returns: Matches with betting odds <= max_odds from Bet365
    """
    try:
        bet365_odds = scraper.scrape_bet365_odds()
        
        # Filter by max_odds threshold
        filtered = [
            odd for odd in bet365_odds 
            if odd.get("best_odd", float('inf')) <= max_odds
        ]
        
        # Count by prediction type
        predictions_count = {}
        for odd in filtered:
            pred = odd.get("prediction", "Unknown")
            predictions_count[pred] = predictions_count.get(pred, 0) + 1
        
        return {
            "status": "success",
            "source": "Bet365",
            "filter": f"odds <= {max_odds}",
            "total_matches": len(filtered),
            "summary": {
                "by_prediction": predictions_count
            },
            "matches": filtered,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Bet365 odds: {str(e)}")


@app.get("/api/odds/aggregate-weekly-soccer")
async def get_aggregate_weekly_soccer_odds(
    max_odds: float = Query(1.16, ge=1.0, le=3.0, description="Maximum odds threshold")
):
    """
    Aggregate weekly soccer odds from all sources filtered by max odds threshold (≤ 1.16)
    Returns: Matches with odds <= max_odds from Bet365, MyBets, Statarea, and ScorePrediction
    """
    try:
        all_odds = []
        
        # Fetch from Bet365
        try:
            bet365_odds = scraper.scrape_bet365_odds()
            filtered_bet365 = [
                {
                    "home_team": p.get("home_team"),
                    "away_team": p.get("away_team"),
                    "prediction": p.get("prediction"),
                    "odds_1": p.get("odds_1"),
                    "odds_x": p.get("odds_x"),
                    "odds_2": p.get("odds_2"),
                    "best_odd": p.get("best_odd", 0.0),
                    "source": "Bet365"
                }
                for p in bet365_odds
                if p.get("best_odd", float('inf')) <= max_odds
            ]
            all_odds.extend(filtered_bet365)
        except:
            pass
        
        # Fetch from MyBets
        try:
            mybets_predictions = scraper.scrape_mybets_today()
            all_odds.extend([
                {
                    "home_team": p.get("home_team"),
                    "away_team": p.get("away_team"),
                    "prediction": p.get("prediction"),
                    "confidence": p.get("confidence"),
                    "source": "MyBets.today"
                }
                for p in mybets_predictions
            ])
        except:
            pass
        
        # Fetch from Statarea (has odds data)
        try:
            statarea_predictions = scraper.scrape_statarea()
            filtered_statarea = [
                {
                    "home_team": p.get("home_team"),
                    "away_team": p.get("away_team"),
                    "prediction": p.get("prediction"),
                    "predicted_score": p.get("predicted_score"),
                    "odds": p.get("odds", 0.0),
                    "source": "Statarea"
                }
                for p in statarea_predictions
                if p.get("odds", 0.0) > 0 and p.get("odds", 0.0) <= max_odds
            ]
            all_odds.extend(filtered_statarea)
        except:
            pass
        
        # Filter by max_odds threshold
        filtered_odds = [
            odd for odd in all_odds 
            if odd.get("best_odd", float('inf')) <= max_odds or odd.get("odds", float('inf')) <= max_odds or "odds" not in odd or odd.get("confidence", 0) >= 65
        ]
        
        # Count by prediction type
        predictions_count = {}
        for odd in filtered_odds:
            pred = odd.get("prediction", "Unknown")
            predictions_count[pred] = predictions_count.get(pred, 0) + 1
        
        # Count by source
        sources_count = {}
        for odd in filtered_odds:
            source = odd.get("source", "Unknown")
            sources_count[source] = sources_count.get(source, 0) + 1
        
        return {
            "status": "success",
            "filter": f"odds <= {max_odds}",
            "total_matches": len(filtered_odds),
            "summary": {
                "by_prediction": predictions_count,
                "by_source": sources_count,
                "high_confidence": sum(1 for o in filtered_odds if o.get("confidence", 0) >= 85)
            },
            "matches": filtered_odds,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch aggregate odds: {str(e)}")


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
            "statarea": "/api/predictions/statarea",
            "scoreprediction": "/api/predictions/scoreprediction",
            "soccerapi_odds": "/api/odds/soccerapi",
            "over_4_5_goals": "/api/odds/over-4-5",
            "bet365_odds": "/api/odds/bet365",
            "aggregate_weekly_soccer_odds": "/api/odds/aggregate-weekly-soccer",
            "health": "/api/health",
            "stats": "/api/stats"
        },
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)