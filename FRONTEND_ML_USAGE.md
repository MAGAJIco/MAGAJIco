# Using ML Predictions in Frontend

## Quick Start

### 1. Import the ML Prediction Widget
```tsx
import MLPredictionWidget from "@/app/components/MLPredictionWidget";

export default function Page() {
  return <MLPredictionWidget />;
}
```

### 2. Call ML Endpoint Directly
```tsx
const fetchPrediction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ml/predict?` +
    `home_strength=0.7&` +
    `away_strength=0.6&` +
    `home_advantage=0.65&` +
    `recent_form_home=0.7&` +
    `recent_form_away=0.6&` +
    `head_to_head=0.5&` +
    `injuries=0.8`
  );
  const data = await response.json();
  console.log(data); // {prediction, confidence, probabilities, model_accuracy}
};
```

## Response Format

```json
{
  "prediction": "home_win",
  "confidence": 0.75,
  "probabilities": {
    "home_win": 0.75,
    "draw": 0.15,
    "away_win": 0.10
  },
  "model_accuracy": 0.903
}
```

## Integration Examples

### With Live Matches
```tsx
const addMLPredictions = async (matches) => {
  const enhanced = await Promise.all(
    matches.map(async (match) => {
      const pred = await fetch(
        `/api/ml/predict?home_strength=${match.homeStrength}&...`
      ).then(r => r.json());
      
      return { ...match, mlPrediction: pred };
    })
  );
  return enhanced;
};
```

### With Predictions Page
```tsx
// Show ML prediction alongside other predictions
<div className="prediction-card">
  <div>MyBetsToday: {prediction.mybets}</div>
  <div>StatArea: {prediction.statarea}</div>
  <div className="highlight">
    ML Model: {prediction.ml.prediction} 
    ({(prediction.ml.confidence * 100).toFixed(1)}%)
  </div>
</div>
```

### With Analytics Dashboard
```tsx
const stats = {
  ml_accuracy: 0.903,
  average_confidence: 0.78,
  predictions_today: 247,
  ml_model_version: "Random Forest v1"
};
```

## Environment Setup

Make sure `NEXT_PUBLIC_API_URL` is set:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Feature Ranges

When calling the API, ensure values are within ranges:

| Feature | Min | Max | Typical |
|---------|-----|-----|---------|
| home_strength | 0.3 | 1.0 | 0.7 |
| away_strength | 0.3 | 1.0 | 0.6 |
| home_advantage | 0.5 | 0.8 | 0.65 |
| recent_form_home | 0.2 | 1.0 | 0.7 |
| recent_form_away | 0.2 | 1.0 | 0.6 |
| head_to_head | 0.3 | 0.7 | 0.5 |
| injuries | 0.4 | 1.0 | 0.8 |

## Prediction Classes

- `home_win` - Home team wins (class 0)
- `draw` - Match ends in draw (class 1)
- `away_win` - Away team wins (class 2)

## Tips

1. **Always use confidence scores** - Don't just look at prediction
2. **Combine with other sources** - Use ML + MyBetsToday + StatArea for best results
3. **Filter by confidence** - Only show predictions with >75% confidence
4. **Track accuracy** - Monitor if ML predictions beat other sources over time
5. **Use probabilities** - Show full probability distribution to users

## Testing

Test with curl:
```bash
curl "http://localhost:8000/api/ml/predict?home_strength=0.7&away_strength=0.6&home_advantage=0.65&recent_form_home=0.7&recent_form_away=0.6&head_to_head=0.5&injuries=0.8"
```

Check model status:
```bash
curl "http://localhost:8000/api/ml/status"
```
