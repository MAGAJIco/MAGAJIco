// Performance optimization utilities - Tesla/SpaceX philosophy
// Focus on speed, efficiency, and data optimization

/**
 * Cache API responses with expiration
 */
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedFetch = async (url: string, options = {}) => {
  const cached = apiCache.get(url);

  // Return cached data if fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(url, { ...options, timeout: 5000 });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    apiCache.set(url, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    // Return stale cache if fetch fails
    if (cached) return cached.data;
    throw error;
  }
};

/**
 * Batch multiple API calls with parallel execution
 */
export const batchFetch = async (urls: string[]) => {
  const promises = urls.map((url) => cachedFetch(url).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

/**
 * Debounce function for optimizing frequent calls
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Request animation frame throttle for smooth animations
 */
export const rafThrottle = (callback: () => void) => {
  let frameId: number;
  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(callback);
  };
};

/**
 * Clear cache when needed
 */
export const clearApiCache = () => {
  apiCache.clear();
};

/**
 * Prefetch critical resources
 */
export const prefetchResources = (urls: string[]) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      urls.forEach((url) => cachedFetch(url).catch(() => {}));
    });
  }
};
