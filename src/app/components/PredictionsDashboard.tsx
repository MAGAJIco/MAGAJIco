"use client";

import { useState, useEffect } from "react";

interface Prediction {
  home_team: string;
  away_team: string;
  prediction: string;
  confidence: number;
  odds?: number;
  implied_odds?: number;
  game_time: string;
  league?: string;
  source?: string;
}

interface PredictionsData {
  mybets: Prediction[];
  statarea: Prediction[];
  flashscore: Prediction[];
}

export default function PredictionsDashboard() {
  const [predictions, setPredictions] = useState<PredictionsData>({
    mybets: [],
    statarea: [],
    flashscore: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mybets' | 'statarea' | 'flashscore'>('mybets');

  const API_BASE = `https://${process.env.NEXT_PUBLIC_REPLIT_DEV_DOMAIN?.split(',')[0]}:8000`;

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const [mybetsRes, statareaRes, flashscoreRes] = await Promise.all([
          fetch(`${API_BASE}/api/predictions/soccer?min_confidence=86&date=today`),
          fetch(`${API_BASE}/api/predictions/statarea?min_odds=1.5&max_odds=3.0`),
          fetch(`${API_BASE}/api/predictions/flashscore/over45?exclude_african=true&min_odds=1.5`)
        ]);

        const [mybetsData, statareaData, flashscoreData] = await Promise.all([
          mybetsRes.json(),
          statareaRes.json(),
          flashscoreRes.json()
        ]);

        setPredictions({
          mybets: mybetsData.predictions || [],
          statarea: statareaData.predictions || [],
          flashscore: flashscoreData.predictions || []
        });
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [API_BASE]);

  const renderPredictionCard = (pred: Prediction, source: string) => (
    <div key={`${pred.home_team}-${pred.away_team}-${source}`} style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
            {pred.home_team} vs {pred.away_team}
          </div>
          {pred.league && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {pred.league}
            </div>
          )}
        </div>
        <div style={{
          background: pred.confidence >= 90 ? '#10b981' : pred.confidence >= 85 ? '#3b82f6' : '#f59e0b',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {pred.confidence}%
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Prediction</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
            {pred.prediction}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Odds</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {(pred.odds || pred.implied_odds || 0).toFixed(2)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Time</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {pred.game_time}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
        <div style={{ fontSize: '18px', marginBottom: '12px' }}>Loading predictions...</div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>Fetching data from FlashScore, MyBetsToday & StatArea</div>
      </div>
    );
  }

  const getCurrentPredictions = () => {
    switch (activeTab) {
      case 'mybets':
        return predictions.mybets;
      case 'statarea':
        return predictions.statarea;
      case 'flashscore':
        return predictions.flashscore;
      default:
        return [];
    }
  };

  const currentPredictions = getCurrentPredictions();

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
        fontWeight: '700',
        color: 'white',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        🎯 Today's Predictions
      </h2>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('mybets')}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'mybets' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          MyBetsToday ({predictions.mybets.length})
        </button>
        <button
          onClick={() => setActiveTab('statarea')}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'statarea' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          StatArea ({predictions.statarea.length})
        </button>
        <button
          onClick={() => setActiveTab('flashscore')}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'flashscore' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          FlashScore Over 4.5 ({predictions.flashscore.length})
        </button>
      </div>

      {/* Predictions List */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {currentPredictions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            color: 'rgba(255,255,255,0.7)'
          }}>
            No predictions available from {activeTab === 'mybets' ? 'MyBetsToday' : activeTab === 'statarea' ? 'StatArea' : 'FlashScore'}
          </div>
        ) : (
          currentPredictions.map((pred) => renderPredictionCard(pred, activeTab))
        )}
      </div>
    </div>
  );
}
