"use client";

import { useState } from "react";

interface AIPick {
  match: string;
  recommendation: string;
  confidence: number;
  reasoning: string;
  risk_level: string;
}

interface AISuggestionsData {
  top_picks?: AIPick[];
  strategy?: string;
  bankroll_tip?: string;
  warnings?: string[];
}

export default function AISuggestions() {
  const [suggestions, setSuggestions] = useState<AISuggestionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const API_BASE = `https://${process.env.NEXT_PUBLIC_REPLIT_DEV_DOMAIN?.split(',')[0]}:8000`;

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/ai/suggestions?min_confidence=86&max_predictions=5`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.message);
      } else if (data.ai_suggestions) {
        setSuggestions(data.ai_suggestions);
        setShowPanel(true);
      }
    } catch (err) {
      setError("Failed to fetch AI suggestions");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
      {!showPanel ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite' }}>⚙️</span>
                Analyzing predictions...
              </>
            ) : (
              <>
                🤖 Get AI Next Move Suggestions
              </>
            )}
          </button>
          {error && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤖 AI Betting Analyst
            </h3>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>

          {suggestions?.top_picks && suggestions.top_picks.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                Top Picks
              </h4>
              {suggestions.top_picks.map((pick, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {pick.match}
                      </div>
                      <div style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                        {pick.recommendation}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        background: pick.confidence >= 90 ? '#10b981' : pick.confidence >= 80 ? '#3b82f6' : '#f59e0b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {pick.confidence}%
                      </div>
                      <div style={{
                        background: getRiskColor(pick.risk_level),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {pick.risk_level} Risk
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                    {pick.reasoning}
                  </div>
                </div>
              ))}
            </div>
          )}

          {suggestions?.strategy && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                📊 Strategy Recommendation
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {suggestions.strategy}
              </p>
            </div>
          )}

          {suggestions?.bankroll_tip && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                💰 Bankroll Management
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {suggestions.bankroll_tip}
              </p>
            </div>
          )}

          {suggestions?.warnings && suggestions.warnings.length > 0 && (
            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                ⚠️ Warnings
              </h4>
              <ul style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                {suggestions.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
