/**
 * API utility for making backend requests
 * Automatically uses the correct backend URL based on environment
 */

// Get backend API URL from environment variable or use localhost in development
const getApiBaseUrl = (): string => {
  // In production (Vercel), use the environment variable for backend URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In development, use localhost:8000
  if (typeof window !== 'undefined') {
    return 'http://localhost:8000';
  }
  
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Helper function to make API calls to the backend
 */
export async function fetchFromBackend(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
