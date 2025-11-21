
import { useState, useEffect } from 'react';

export interface UserPreferences {
  favoriteTeams: string[];
  favoriteSports: string[];
  preferredLeagues: string[];
  darkMode: boolean;
  notifications: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteTeams: [],
  favoriteSports: [],
  preferredLeagues: [],
  darkMode: false,
  notifications: true
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load preferences:', error);
        }
      }
      setLoading(false);
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    }
  };

  const addFavoriteTeam = (team: string) => {
    if (!preferences.favoriteTeams.includes(team)) {
      updatePreferences({
        favoriteTeams: [...preferences.favoriteTeams, team]
      });
    }
  };

  const removeFavoriteTeam = (team: string) => {
    updatePreferences({
      favoriteTeams: preferences.favoriteTeams.filter(t => t !== team)
    });
  };

  const toggleFavoriteSport = (sport: string) => {
    const sports = preferences.favoriteSports.includes(sport)
      ? preferences.favoriteSports.filter(s => s !== sport)
      : [...preferences.favoriteSports, sport];
    updatePreferences({ favoriteSports: sports });
  };

  return {
    preferences,
    loading,
    updatePreferences,
    addFavoriteTeam,
    removeFavoriteTeam,
    toggleFavoriteSport
  };
}
