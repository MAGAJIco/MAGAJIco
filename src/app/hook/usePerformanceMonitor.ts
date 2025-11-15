
'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  renderTime: number;
  interactionTime: number;
}

export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef(performance.now());
  const metricsRef = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    renderTime: 0,
    interactionTime: 0
  });

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    metricsRef.current.renderTime = renderTime;

    // Log performance metrics (Bezos-style data obsession)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [${componentName}] Performance Metrics:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memory: performance.memory ? 
          `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB` : 
          'N/A'
      });
    }

    // Track Core Web Vitals
    if ('web-vital' in window || typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`🎨 LCP for ${componentName}:`, entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log(`👆 FID for ${componentName}:`, (entry as any).processingStart - entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (e) {
        // Browser doesn't support these metrics
      }

      return () => observer.disconnect();
    }
  }, [componentName]);

  return metricsRef.current;
}

// Bezos-style A/B testing helper
export function useABTest(testName: string, variants: string[]) {
  const variant = useRef(
    variants[Math.floor(Math.random() * variants.length)]
  );

  useEffect(() => {
    // Log which variant user sees (for analytics)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`🧪 A/B Test [${testName}]:`, variant.current);
    }
  }, [testName]);

  return variant.current;
}
