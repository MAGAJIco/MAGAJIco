"use client";

import { useState, useEffect } from "react";

interface HealthData {
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

export default function BackendHealthStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_REPLIT_DEV_DOMAIN?.split(',')[0]}:8000/api/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
          setError(null);
        } else {
          setError('Backend unavailable');
        }
      } catch (err) {
        setError('Backend offline');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="health-status loading">
        <div className="pulse-dot" />
        <span>Checking backend...</span>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="health-status offline">
        <div className="status-dot offline" />
        <span>Backend: {error || 'Offline'}</span>
      </div>
    );
  }

  const isHealthy = health.summary ? health.summary.percentage >= 50 : health.status === 'healthy';

  const getStatusStyles = () => {
    if (loading) return { background: 'rgba(156, 163, 175, 0.1)', color: '#6b7280' };
    if (error || !health) return { background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' };
    if (isHealthy) return { background: 'rgba(16, 185, 129, 0.1)', color: '#059669' };
    return { background: 'rgba(251, 191, 36, 0.1)', color: '#d97706' };
  };

  const getDotColor = () => {
    if (loading) return '#6b7280';
    if (error || !health) return '#ef4444';
    if (isHealthy) return '#10b981';
    return '#fbbf24';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.3s',
      ...getStatusStyles()
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: getDotColor(),
        animation: 'pulse 2s ease-in-out infinite'
      }} />
      <span>
        Backend: {isHealthy ? 'Online' : 'Degraded'}
        {health.summary && (
          <span style={{ opacity: 0.8, fontSize: '12px' }}>
            {' '}({health.summary.healthy}/{health.summary.total} APIs active)
          </span>
        )}
      </span>
    </div>
  );
}
