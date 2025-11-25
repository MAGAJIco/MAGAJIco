import { useState, useEffect } from 'react';

interface ViewHistory {
  id: string;
  type: string;
  name: string;
  timestamp: number;
  engagement: number; // 0-1 score
}

interface Recommendation {
  id: string;
  name: string;
  reason: string;
  score: number;
}

export const useRecommendations = () => {
  const [history, setHistory] = useState<ViewHistory[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('magajico_view_history');
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse history:', e);
        }
      }
    }
  }, []);

  // Persist history
  useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
      localStorage.setItem('magajico_view_history', JSON.stringify(history.slice(-50)));
    }
  }, [history]);

  // Track view with engagement
  const trackView = (id: string, type: string, name: string, engagement = 0.5) => {
    setHistory((prev) => [
      ...prev,
      { id, type, name, timestamp: Date.now(), engagement },
    ]);
  };

  // Generate recommendations based on history
  const generateRecommendations = (availableItems: any[]) => {
    if (history.length === 0) {
      // Return trending items if no history
      return availableItems.slice(0, 5).map((item, idx) => ({
        id: item.id,
        name: item.name,
        reason: 'Trending now',
        score: 0.95 - idx * 0.1,
      }));
    }

    // Find most viewed type and recommend similar
    const typeCounts = history.reduce(
      (acc, h) => {
        acc[h.type] = (acc[h.type] || 0) + h.engagement;
        return acc;
      },
      {} as Record<string, number>
    );

    const preferredType = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

    // Score items based on type preference and recency
    const scored = availableItems.map((item) => {
      let score = 0.5;

      // Type preference boost
      if (item.type === preferredType) score += 0.3;

      // Recency boost for new items
      if (item.timestamp && Date.now() - item.timestamp < 3600000) score += 0.2;

      return {
        id: item.id,
        name: item.name,
        reason: item.type === preferredType ? 'Based on your interests' : 'Popular today',
        score: Math.min(1, score),
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  return {
    trackView,
    generateRecommendations,
    history,
  };
};
