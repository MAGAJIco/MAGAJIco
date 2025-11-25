'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LogOut, LogIn, User } from 'lucide-react';

export function AuthNav() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.username || user.firstName || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-text-primary">
            {user.username || user.firstName || user.email || 'User'}
          </span>
        </div>
        <Link
          href="/api/logout"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Logout
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/en/login"
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary hover:bg-opacity-90 text-white font-medium transition-colors"
    >
      <LogIn size={16} />
      Login
    </Link>
  );
}
