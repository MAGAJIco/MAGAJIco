
import SkeletonCard from "../components/SkeletonCard";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-12 bg-white/10 rounded-lg w-64 mb-3"></div>
          <div className="h-6 bg-white/5 rounded-lg w-48"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-white/10 rounded w-24 mb-2"></div>
              <div className="h-10 bg-white/10 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-white/10 rounded w-48"></div>
                </div>
              </div>
              <div className="h-24 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 text-white">
            <div className="w-6 h-6 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300 font-medium">Loading amazing content...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
