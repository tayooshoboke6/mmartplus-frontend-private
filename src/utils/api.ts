import axios from 'axios';

// Set base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_DOMAIN = API_BASE_URL.replace('/api', '');

// Create axios instance with credentials support
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // This is crucial for CORS with credentials
});

// Function to get CSRF token
const getCsrfToken = async () => {
  try {
    await axios.get(`${API_DOMAIN}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
    console.log('✅ CSRF token fetched successfully');
  } catch (error) {
    console.error('❌ Failed to fetch CSRF token', error);
  }
};

// Intercept requests to add auth token and handle CSRF
api.interceptors.request.use(
  async (config) => {
    // For mutations (non-GET requests), ensure we have a CSRF token
    if (config.method !== 'get' && config.method !== 'GET') {
      await getCsrfToken();
    }
    
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
    
    // Log detailed API errors for debugging
    if (error.response) {
      console.log('🔍 API Error Details');
      console.log(`📌 Error: ${error.message}`);
      console.log(`🔗 Request URL: ${error.config.url}`);
      console.log(`📦 Request Data:`, error.config.data ? JSON.parse(error.config.data) : {});
    }
    
    return Promise.reject(error);
  }
);

// Log configuration for debugging
console.log('🔐 API URL:', API_BASE_URL);
console.log('🔐 API Domain:', API_DOMAIN);
console.log('🔐 CSRF URL:', `${API_DOMAIN}/sanctum/csrf-cookie`);

export default api;