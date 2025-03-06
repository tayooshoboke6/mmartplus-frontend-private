import axios from 'axios';
import config from '../config';
import { getCsrfCookie } from '../utils/authUtils';
import Cookies from 'js-cookie';

// Cache storage for API responses
const apiCache = new Map();

// Helper to generate cache key from request config
const generateCacheKey = (config: any) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
};

// Extract domain for cookie settings
const extractDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch (error) {
    console.error('Failed to extract domain from URL:', error);
    return null;
  }
};

// Get domain for cookies
const COOKIE_DOMAIN = extractDomain(config.api.baseUrl) || undefined;

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: config.api.baseUrl, // Only use baseUrl, not adminUrl
  withCredentials: true, // Enables sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps identify AJAX requests
    'Cache-Control': 'no-cache' // Default cache control
  },
  // Add a timeout to prevent requests from hanging indefinitely
  timeout: 10000,
});

// Create a separate admin API instance
export const adminApi = axios.create({
  baseURL: `${config.api.baseUrl}${config.api.adminUrl}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10000,
});

// Helper to set cookie with appropriate domain
const setCookie = (name: string, value: string, days = 7) => {
  Cookies.set(name, value, { 
    expires: days, 
    domain: COOKIE_DOMAIN, 
    secure: window.location.protocol === 'https:',
    sameSite: 'strict'
  });
};

// Set admin token in localStorage and cookies
export const setAdminToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
  setCookie('adminToken', token, 30); // Store in cookies with 30 day expiry
  console.log('Admin token set:', token.substring(0, 10) + '...');
  // Update last activity timestamp
  updateActivityTimestamp();
};

// Get admin token from cookies or localStorage
export const getAdminToken = (): string | null => {
  return Cookies.get('adminToken') || localStorage.getItem('adminToken');
};

// Update last activity timestamp
export const updateActivityTimestamp = (): void => {
  const timestamp = Date.now().toString();
  localStorage.setItem('mmartLastActivityTimestamp', timestamp);
  setCookie('mmartLastActivityTimestamp', timestamp, 1); // 1 day expiry for activity timestamp
};

// Refresh user session
export const refreshSession = async (): Promise<boolean> => {
  try {
    
    // In production, make a real token refresh request
    const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
      }
    });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // If this is an admin token refresh, update that too
      if (response.data.adminToken) {
        localStorage.setItem('adminToken', response.data.adminToken);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    

    
    return false;
  }
};

// Request interceptor - add token to Authorization header and handle caching
api.interceptors.request.use(
  async (config) => {
    // Get token from cookies or localStorage
    const token = Cookies.get('adminToken') || localStorage.getItem('adminToken');
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle CSRF token for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = Cookies.get('XSRF-TOKEN');
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }
    
    // Check if request should use cache (only GET requests)
    if (config.method === 'get' && config.cache !== false) {
      const cacheKey = generateCacheKey(config);
      const cachedResponse = apiCache.get(cacheKey);
      
      // If we have a cached response and it's not expired
      if (cachedResponse && cachedResponse.timestamp > Date.now() - (config.cacheTime || 5 * 60 * 1000)) {
        console.log('Using cached response for:', config.url);
        // Return cached response in a format Axios expects for its interceptors
        return Promise.resolve({
          ...config,
          cached: true,
          data: cachedResponse.data,
          status: 200,
          statusText: 'OK',
          headers: cachedResponse.headers,
          cachedAt: cachedResponse.timestamp
        });
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors and caching
api.interceptors.response.use(
  (response) => {
    // Skip caching for interceptor-resolved responses or non-GET requests
    if (response.cached || response.config.method !== 'get' || response.config.cache === false) {
      updateActivityTimestamp();
      return response;
    }
    
    // Cache the successful GET response
    const cacheKey = generateCacheKey(response.config);
    apiCache.set(cacheKey, {
      data: response.data,
      headers: response.headers,
      timestamp: Date.now()
    });
    
    // Handle CSRF token if it's in the headers
    const csrfToken = response.headers['x-csrf-token'] || response.headers['X-CSRF-TOKEN'];
    if (csrfToken) {
      setCookie('XSRF-TOKEN', csrfToken);
    }
    
    // Update last activity timestamp on successful response
    updateActivityTimestamp();
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - possibly expired token
    if (error.response && error.response.status === 401) {
      // Clear token from both localStorage and cookies
      localStorage.removeItem('adminToken');
      Cookies.remove('adminToken', { domain: COOKIE_DOMAIN });
      
      // Could also redirect to login page here
      // window.location.href = '/admin/login';
    }
    
    // Clear cache on certain error statuses
    if (error.response && [400, 422, 500].includes(error.response.status)) {
      // Clear specific cache entry if it exists
      if (error.config) {
        const cacheKey = generateCacheKey(error.config);
        apiCache.delete(cacheKey);
      }
    }
    
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => {
    // Update last activity timestamp on successful response
    updateActivityTimestamp();
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - possibly expired token
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('adminToken');
      // Could also redirect to login page here
    }
    
    return Promise.reject(error);
  }
);

// When user successfully logs in, set up session
export const initializeSession = () => {
  // Set fresh login timestamp
  localStorage.setItem('mmartLoginTimestamp', Date.now().toString());
  
  // Update last activity
  localStorage.setItem('mmartLastActivityTimestamp', Date.now().toString());
  
  console.log('Session initialized with timestamps');
};

// Try to refresh token on application startup
export const checkAndRefreshTokenOnStartup = async () => {
  try {
    // Set a fresh login timestamp if none exists
    if (!localStorage.getItem('mmartLoginTimestamp')) {
      console.log('Setting new login timestamp on startup');
      localStorage.setItem('mmartLoginTimestamp', Date.now().toString());
      localStorage.setItem('mmartLastActivityTimestamp', Date.now().toString());
    }
    

    
    // Refresh session to be safe
    await refreshSession();
    
    console.log('Token check completed on startup');
    return true;
  } catch (error) {
    console.error('Error refreshing session on startup:', error);
    return false;
  }
};

// Method to clear specific cache entries or the entire cache
export const clearApiCache = (configOrPattern?: any) => {
  if (!configOrPattern) {
    // Clear entire cache
    apiCache.clear();
    console.log('API cache cleared entirely');
    return;
  }
  
  if (typeof configOrPattern === 'string') {
    // Clear by URL pattern
    const pattern = configOrPattern;
    let count = 0;
    [...apiCache.keys()].forEach(key => {
      if (key.includes(pattern)) {
        apiCache.delete(key);
        count++;
      }
    });
    console.log(`API cache cleared for pattern "${pattern}": ${count} entries removed`);
  } else {
    // Clear by config object
    const cacheKey = generateCacheKey(configOrPattern);
    apiCache.delete(cacheKey);
    console.log(`API cache cleared for specific request: ${cacheKey}`);
  }
};

// Re-export getCsrfCookie for backward compatibility
export { getCsrfCookie };

export default api;
