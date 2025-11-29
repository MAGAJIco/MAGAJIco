'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, AlertCircle, Plus, Trash2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookedGame {
  id: string;
  team1: string;
  team2: string;
  prediction: string;
  odds: number;
  timestamp: number;
}

export default function MagajicoCEO() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Magajico CEO. I\'ll help you manage your bets. How many games would you like to book today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [bookedGames, setBookedGames] = useState<BookedGame[]>([]);
  const [gameCount, setGameCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Simple AI logic for game counting and booking
    if (!gameCount && userMessage.match(/\d+/)) {
      const count = parseInt(userMessage.match(/\d+/)?.[0] || '0');
      setGameCount(count);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great! I'll help you book ${count} games. Please tell me the game details (Team 1 vs Team 2, prediction, odds). One at a time.`
      }]);
    } else if (gameCount && bookedGames.length < gameCount) {
      // Parse game details
      const gameRegex = /(.*?)\s+vs\s+(.*?),?\s+(?:prediction:?\s*)?(.*?),?\s+(?:odds?:?\s*)?(\d+\.?\d*)/i;
      const match = userMessage.match(gameRegex);
      
      if (match) {
        const newGame: BookedGame = {
          id: `game-${Date.now()}`,
          team1: match[1].trim(),
          team2: match[2].trim(),
          prediction: match[3].trim(),
          odds: parseFloat(match[4]),
          timestamp: Date.now()
        };
        
        setBookedGames(prev => [...prev, newGame]);
        
        if (bookedGames.length + 1 === gameCount) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Perfect! I've booked all ${gameCount} games. You can now place your bets. Remember: gamble responsibly and only bet what you can afford to lose.`
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ Game added! ${gameCount - bookedGames.length - 1} more to go.`
          }]);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Please provide game details in this format: Team1 vs Team2, prediction, odds (e.g., "Liverpool vs Manchester City, 1, 2.5")'
        }]);
      }
    } else if (bookedGames.length >= gameCount && gameCount) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'You\'ve already booked all your games! You can review them below or reset to book new games.'
      }]);
    }

    setLoading(false);
  };

  const removeGame = (id: string) => {
    setBookedGames(prev => prev.filter(g => g.id !== id));
  };

  const resetBetting = () => {
    setGameCount(null);
    setBookedGames([]);
    setMessages([{
      role: 'assistant',
      content: 'How many games would you like to book?'
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center gap-2">
        <Brain className="w-5 h-5" />
        <h3 className="font-bold">Magajico CEO</h3>
        <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">AI Manager</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Booked Games Preview */}
      {bookedGames.length > 0 && (
        <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Betting Slip ({bookedGames.length})
            </p>
          </div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {bookedGames.map(game => (
              <div key={game.id} className="flex items-center justify-between text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {game.team1} vs {game.team2}
                </span>
                <button
                  onClick={() => removeGame(game.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about your bets..."
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {gameCount && bookedGames.length >= gameCount && (
          <button
            type="button"
            onClick={resetBetting}
            className="mt-2 w-full text-xs py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
          >
            Start New Booking
          </button>
        )}
      </form>
    </div>
  );
}
