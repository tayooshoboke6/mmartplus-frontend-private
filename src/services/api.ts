import axios from 'axios';
import config from '../config';

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: `${config.api.baseUrl}${config.api.adminUrl}`, // Combine baseUrl and adminUrl
  withCredentials: true, // Enables sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps identify AJAX requests
  },
  // Add a timeout to prevent requests from hanging indefinitely
  timeout: 10000,
});

// Set admin token in localStorage and memory
export const setAdminToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
  console.log('Admin token set:', token.substring(0, 10) + '...');
  // Update last activity timestamp
  updateActivityTimestamp();
};

// Get admin token from localStorage
export const getAdminToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Update last activity timestamp
export const updateActivityTimestamp = (): void => {
  localStorage.setItem('mmartLastActivityTimestamp', Date.now().toString());
};

// Refresh user session
export const refreshSession = async (): Promise<boolean> => {
  try {
    if (import.meta.env.DEV && config.features.useMockAuth) {
      console.log('Using mock token refresh in development mode');
      
      // For development: generate mock tokens
      const mockUserToken = 'mock-refreshed-user-token-' + Date.now();
      const mockAdminToken = 'mock-refreshed-admin-token-' + Date.now();
      
      localStorage.setItem('token', mockUserToken);
      localStorage.setItem('adminToken', mockAdminToken);
      
      return true;
    }
    
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
    
    // If in development, provide a fallback token to continue testing
    if (import.meta.env.DEV) {
      console.log('Creating fallback dev token after refresh failure');
      const fallbackToken = 'fallback-dev-token-' + Date.now();
      localStorage.setItem('token', fallbackToken);
      localStorage.setItem('adminToken', fallbackToken);
      return true;
    }
    
    return false;
  }
};

// Request interceptor - add token to Authorization header
api.interceptors.request.use(
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

// Response interceptor - handle common errors
api.interceptors.response.use(
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
    
    // Ensure admin token exists at startup
    if (!localStorage.getItem('adminToken')) {
      localStorage.setItem('adminToken', 'dev-admin-token-for-testing');
      console.log('Admin token initialized on startup');
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

export default api;
