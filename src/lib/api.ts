/**
 * API utility for making backend requests
 * Automatically uses the correct backend URL based on environment
 */

// Get backend API URL - must be called at runtime, not at module load time
export const getApiBaseUrl = (): string => {
  // In production (Vercel), use the environment variable for backend URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser context (Replit or localhost development)
  if (typeof window !== 'undefined') {
    // Get the current hostname from window.location
    const hostname = window.location.hostname;
    // Backend runs on port 8000 on the same host
    return `http://${hostname}:8000`;
  }

  // For SSR or other non-browser environments, default to localhost:8000
  return 'http://localhost:8000';
};

/**
 * Helper function to make API calls to the backend
 */
export async function fetchFromBackend(endpoint: string, options?: RequestInit) {
  const url = `${getApiBaseUrl()}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}