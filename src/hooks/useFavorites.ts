import { useState, useEffect } from 'react';

interface Favorite {
  id: string;
  type: 'team' | 'league' | 'match';
  name: string;
  addedAt: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('magajico_favorites');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse favorites:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('magajico_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (id: string, type: Favorite['type'], name: string) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === id)) return prev;
      return [...prev, { id, type, name, addedAt: Date.now() }];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  const toggleFavorite = (id: string, type: Favorite['type'], name: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id, type, name);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
