'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in with username, redirect to home
  if (isAuthenticated && user?.username) {
    router.push('/');
    return null;
  }

  // If user is authenticated but needs to set username
  if (isAuthenticated && !isLoading) {
    const handleSetUsername = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/auth/set-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim() }),
          credentials: 'include',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to set username');
        }

        // Store username in localStorage
        localStorage.setItem('user_username', trimmedUsername);
        
        // Small delay to ensure localStorage is written
        setTimeout(() => {
          router.push('/');
        }, 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <h1 className="text-3xl font-bold text-center mb-2">Welcome!</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Create your username to get started
            </p>

            <form onSubmit={handleSetUsername} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose a Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., soccerFan123"
                  maxLength={30}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Letters, numbers, and underscores only. 3-30 characters.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!username.trim() || isSubmitting}
                className="w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 bg-brand-primary hover:bg-opacity-90 text-white"
              >
                {isSubmitting ? 'Setting up...' : 'Continue to MagajiCo'}
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => router.push('/api/logout')}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Use a different account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show Google login button
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold text-center mb-2">MagajiCo</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Sports Prediction Platform
          </p>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
            </div>
          ) : (
            <Link
              href="/api/login"
              className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-lg bg-brand-primary hover:bg-opacity-90 text-white font-semibold transition-colors"
            >
              <LogIn size={20} />
              Continue with Google
            </Link>
          )}

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            By logging in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
