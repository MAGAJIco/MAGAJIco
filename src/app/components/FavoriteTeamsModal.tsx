
"use client";

import { useState } from "react";
import { Star, X, Search } from "lucide-react";

interface FavoriteTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (team: string) => void;
}

const POPULAR_TEAMS = [
  { name: "Manchester United", sport: "Soccer", league: "Premier League" },
  { name: "Liverpool", sport: "Soccer", league: "Premier League" },
  { name: "Real Madrid", sport: "Soccer", league: "La Liga" },
  { name: "Barcelona", sport: "Soccer", league: "La Liga" },
  { name: "Bayern Munich", sport: "Soccer", league: "Bundesliga" },
  { name: "Los Angeles Lakers", sport: "NBA", league: "NBA" },
  { name: "Boston Celtics", sport: "NBA", league: "NBA" },
  { name: "Kansas City Chiefs", sport: "NFL", league: "NFL" },
  { name: "Dallas Cowboys", sport: "NFL", league: "NFL" },
  { name: "New York Yankees", sport: "MLB", league: "MLB" }
];

export default function FavoriteTeamsModal({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite
}: FavoriteTeamsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredTeams = POPULAR_TEAMS.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto z-[2001] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Favorite Teams</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none transition-colors"
          />
        </div>

        {/* Selected Favorites */}
        {favorites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Favorites ({favorites.length})</h3>
            <div className="flex flex-wrap gap-2">
              {favorites.map(team => (
                <button
                  key={team}
                  onClick={() => onToggleFavorite(team)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  <Star className="w-4 h-4 fill-white" />
                  {team}
                  <X className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Teams */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTeams.map(team => {
              const isFavorite = favorites.includes(team.name);
              return (
                <button
                  key={team.name}
                  onClick={() => onToggleFavorite(team.name)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isFavorite
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{team.name}</p>
                      <p className="text-sm text-gray-500">{team.sport} • {team.league}</p>
                    </div>
                    <Star className={`w-5 h-5 ${isFavorite ? 'fill-purple-500 text-purple-500' : 'text-gray-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
