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

// Function to get CSRF token for Laravel Sanctum
export const getCsrfCookie = async (): Promise<boolean> => {
  // Skip if not using Sanctum or already have XSRF-TOKEN cookie
  if (document.cookie.includes('XSRF-TOKEN')) {
    return true;
  }
  
  try {
    // Get CSRF cookie from Laravel Sanctum
    const csrfUrl = `${config.api.baseUrl.split('/api')[0]}/sanctum/csrf-cookie`;
    console.log('Fetching CSRF token from:', csrfUrl);
    
    await axios.get(csrfUrl, {
      withCredentials: true
    });
    console.log('CSRF token fetched successfully');
    return true;
  } catch (error: any) {
    console.error('Failed to fetch CSRF token:', error);
    
    // Continue without CSRF
    console.log('Continuing without CSRF token');
    return false;
  }
};

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

// Request interceptor to add auth token to all requests
api.interceptors.request.use(async (config) => {
  try {
    // Get CSRF token if needed (for Laravel Sanctum)
    await getCsrfCookie();

    // Update activity timestamp on each request
    updateActivityTimestamp();

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    // Check if we should skip auth for admin routes in development
    const isAdminRoute = config.url?.includes('/admin/');
    const shouldSkipAuth = import.meta.env.DEV && 
                          isAdminRoute && 
                          config.features?.skipAuthForAdmin;
    
    if (shouldSkipAuth) {
      console.log('Skipping authentication for admin route in development mode');
      // Don't add any auth headers
    }
    // Use admin token for admin routes, general token for other routes
    else if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log('Added admin token to request');
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added user token to request');
    } else if (isAdminRoute) {
      // For admin endpoints, always ensure there's a token
      const devAdminToken = config.development?.mockAdminToken || 'dev-admin-token-for-testing';
      config.headers.Authorization = `Bearer ${devAdminToken}`;
      console.log('Added default admin token to request');
      localStorage.setItem('adminToken', devAdminToken);
    }

    // Set locale preference if available
    const locale = localStorage.getItem('locale') || 'en';
    config.headers['Accept-Language'] = locale;
    
    // Add timestamp to avoid caching
    config.params = {
      ...config.params,
      _t: new Date().getTime()
    };
    
    // For debugging
    if (config.features?.debugApiResponses) {
      console.log(`API Request to ${config.url}:`, {
        method: config.method,
        params: config.params,
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config; // Return config even if there's an error to prevent request failure
  }
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log response for debugging if enabled
    if (config.features?.debugApiResponses) {
      console.log(`API Response from ${response.config.url}:`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
    }
    
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server responded with an error status code
      const status = error.response.status;
      
      // Log the error for debugging
      console.error(`API Error (${status}):`, {
        url: error.config.url,
        method: error.config.method,
        status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle 401 Unauthorized errors
      if (status === 401) {
        console.log('Unauthorized request. Attempting to refresh token...');
        
        // Try to refresh the token
        const refreshSuccess = await refreshSession();
        
        // If refresh succeeded, retry the original request
        if (refreshSuccess) {
          console.log('Token refreshed, retrying original request');
          // Get fresh token
          const newToken = localStorage.getItem('token');
          const newAdminToken = localStorage.getItem('adminToken');
          
          // Determine which token to use based on URL
          if (error.config.url.includes('/admin/') && newAdminToken) {
            error.config.headers.Authorization = `Bearer ${newAdminToken}`;
          } else if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
          }
          
          // Retry the original request with new token
          return axios(error.config);
        }
      }
      
      // For validation errors, provide more details
      if (status === 422) {
        const errorData = error.response.data;
        console.error('Validation errors:', errorData.errors || errorData.message || errorData);
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network error - no response received:', error.request);
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
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
