'use client';

import { useRouter } from 'next/navigation';
import { Lock, Zap } from 'lucide-react';

export default function SecretPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-900 pb-24">
      <nav className="border-b border-purple-800 bg-purple-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold text-purple-100">Secret Features</h1>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Advanced Analytics', description: 'Deep dive into your data with ML-powered insights' },
            { title: 'Predictive Models', description: 'Forecast future trends with high accuracy' },
            { title: 'Custom Reports', description: 'Generate tailored reports in seconds' },
            { title: 'Data Export', description: 'Export all your data in multiple formats' },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-purple-800/40 border border-purple-700 rounded-lg hover:bg-purple-800/60 transition-colors cursor-pointer"
            >
              <h3 className="font-semibold text-purple-100 mb-2">{feature.title}</h3>
              <p className="text-purple-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-purple-900 dark:bg-purple-900 border-t border-purple-800 z-30">
        <div className="px-4 py-2 sm:py-3 flex justify-around items-center">
          <button 
            onClick={() => router.push('/en/live')}
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-red-500 transition-colors p-2 hover:opacity-80 active:opacity-60"
            title="Live Matches"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-medium">Live</span>
          </button>
          <button 
            onClick={() => router.push('/en/secret')}
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-indigo-300 transition-colors p-2 hover:opacity-80 active:opacity-60"
            title="Secret Features"
          >
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Secret</span>
          </button>
          <button 
            onClick={() => router.push('/en')}
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-200 transition-colors p-2 hover:opacity-80 active:opacity-60"
            title="Generate AI Ideas"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Generate</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
