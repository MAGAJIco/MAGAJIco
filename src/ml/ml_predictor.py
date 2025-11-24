"""ML Model Prediction Service for Sports Match Outcomes"""
import pickle
import os
import logging
from typing import Dict, List, Tuple
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MLPredictor:
    """Loads and uses the trained Random Forest model for predictions"""
    
    def __init__(self, model_path: str = "model_data.pkl"):
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.accuracy = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained model and scaler from pickle file"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, "rb") as f:
                    model_data = pickle.load(f)
                
                self.model = model_data["model"]
                self.scaler = model_data["scaler"]
                self.accuracy = model_data["accuracy"]
                
                logger.info(f"✅ ML Model loaded successfully (accuracy: {self.accuracy:.2%})")
            else:
                logger.warning(f"⚠️ Model file not found at {self.model_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {str(e)}")
    
    def predict(self, features: List[float]) -> Tuple[int, Dict[str, float]]:
        """
        Predict match outcome using the trained model
        
        Args:
            features: [home_strength, away_strength, home_advantage, 
                      recent_form_home, recent_form_away, head_to_head, injuries]
        
        Returns:
            (prediction, confidence_dict)
            - prediction: 0=home_win, 1=draw, 2=away_win
            - confidence_dict: probabilities for each outcome
        """
        if self.model is None:
            logger.warning("Model not loaded")
            return None, {}
        
        try:
            # Scale features using the trained scaler
            features_array = np.array([features])
            scaled_features = self.scaler.transform(features_array)
            
            # Get prediction
            prediction = self.model.predict(scaled_features)[0]
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba(scaled_features)[0]
            
            confidence_dict = {
                "home_win": float(probabilities[0]),
                "draw": float(probabilities[1]),
                "away_win": float(probabilities[2])
            }
            
            return int(prediction), confidence_dict
        
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return None, {}
    
    def predict_batch(self, features_list: List[List[float]]) -> List[Tuple[int, Dict]]:
        """Predict multiple matches at once"""
        if self.model is None:
            return []
        
        results = []
        for features in features_list:
            prediction, confidence = self.predict(features)
            results.append((prediction, confidence))
        
        return results
    
    def predict_match(self, home_strength: float, away_strength: float, 
                     home_advantage: float, recent_form_home: float, 
                     recent_form_away: float, head_to_head: float, 
                     injuries: float) -> Dict:
        """
        Convenience method to predict a match with named parameters
        
        Returns:
            {
                "prediction": "home_win|draw|away_win",
                "confidence": 0.0-1.0,
                "probabilities": {"home_win": 0.0, "draw": 0.0, "away_win": 0.0},
                "model_accuracy": 0.903
            }
        """
        features = [
            home_strength, away_strength, home_advantage,
            recent_form_home, recent_form_away, head_to_head, injuries
        ]
        
        prediction, probabilities = self.predict(features)
        
        if prediction is None:
            return {"error": "Model not available"}
        
        outcome_map = {0: "home_win", 1: "draw", 2: "away_win"}
        prediction_str = outcome_map[prediction]
        confidence = probabilities.get(outcome_map[prediction], 0)
        
        return {
            "prediction": prediction_str,
            "confidence": confidence,
            "probabilities": probabilities,
            "model_accuracy": self.accuracy or 0.903
        }
    
    def is_ready(self) -> bool:
        """Check if model is loaded and ready"""
        return self.model is not None
