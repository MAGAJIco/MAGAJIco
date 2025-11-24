/**
 * Health Check Types - Shared between Backend and Frontend
 * 
 * The backend exposes health endpoints:
 * - GET /health - Simple health check
 * - GET /api/health - Detailed API service health
 * 
 * The frontend uses these types to display backend status
 */

/**
 * Detailed health response from /api/health endpoint
 * Used by BackendHealthStatus component
 */
export interface HealthData {
  status: string;
  summary?: {
    healthy: number;
    total: number;
    percentage: number;
  };
  services?: Array<{
    name: string;
    status: string;
    endpoint?: string;
  }>;
}

/**
 * Simple health status for health tracking hook
 * Used by useBackendHealth custom hook
 */
export interface HealthStatus {
  isHealthy: boolean;
  lastChecked: Date;
  error?: string;
}

/**
 * API Health Endpoints
 */
export const HEALTH_ENDPOINTS = {
  simple: '/health',
  detailed: '/api/health'
} as const;
