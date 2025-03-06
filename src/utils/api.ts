import axios from 'axios';

// Set base URL for API requests
// TODO: Update with actual API URL when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token
      localStorage.removeItem('auth_token');
      // Redirect to login (if not already on login page)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export functions to manage authentication state
export const setAuthToken = (token: string) => {
  // Store in both localStorage and cookie
  localStorage.setItem('auth_token', token);
  setCookie('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
  Cookies.remove('auth_token', { domain: COOKIE_DOMAIN });
  Cookies.remove('XSRF-TOKEN', { domain: COOKIE_DOMAIN });
};

export const getAuthToken = () => {
  return Cookies.get('auth_token') || localStorage.getItem('auth_token');
};

// Export API instance
export default api;

// Method to clear specific cache entries or the entire cache
const clearApiCache = (configOrPattern?: any) => {
  if (!configOrPattern) {
    // Clear entire cache
    apiCache.clear();
    return;
  }
  
  if (typeof configOrPattern === 'string') {
    // Clear by URL pattern
    const pattern = configOrPattern;
    [...apiCache.keys()].forEach(key => {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    });
  } else {
    // Clear by config object
    const cacheKey = generateCacheKey(configOrPattern);
    apiCache.delete(cacheKey);
  }
};

// Export cache control
export { clearApiCache };
