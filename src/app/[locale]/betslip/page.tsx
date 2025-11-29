'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import MagajicoCEO from '@/app/components/MagajicoCEO';
import GamblingReminder from '@/app/components/GamblingReminder';
import PageNav from '@/app/components/PageNav';

export default function BetslipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <PageNav title="Betting Manager" icon={BookOpen} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main AI Manager */}
          <div className="lg:col-span-2">
            <div className="h-screen lg:h-auto">
              <MagajicoCEO />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Gambling Reminder */}
            <GamblingReminder />

            {/* Tips Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Smart Betting Tips</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Start with a game count you want to book</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Add game details one at a time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Review your betting slip before placing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Check odds and predictions from multiple sources</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span>Set daily and weekly betting limits</span>
                </li>
              </ul>
            </div>

            {/* Popular Matches Card - Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                <span className="text-lg">⭐</span> Featured Matches
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Check the Live page for today's top matches with high confidence predictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
