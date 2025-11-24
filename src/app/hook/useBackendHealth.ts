
import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../lib/api';
import type { HealthStatus } from '../../../shared/health';

export function useBackendHealth(checkInterval = 60000) {
  const [health, setHealth] = useState<HealthStatus>({
    isHealthy: true,
    lastChecked: new Date()
  });

  const checkHealth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      setHealth({
        isHealthy: response.ok,
        lastChecked: new Date(),
        error: response.ok ? undefined : `Backend returned ${response.status}`
      });
    } catch (error) {
      setHealth({
        isHealthy: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Backend unreachable'
      });
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, checkInterval);
    return () => clearInterval(interval);
  }, [checkHealth, checkInterval]);

  return { ...health, recheckHealth: checkHealth };
}
