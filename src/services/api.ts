import axios from 'axios';

// Determine API URL based on environment
// In development, we can use environment variables or hardcoded values
// In production, this should come from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// For development fallback when backend is not running
const USE_MOCK_FALLBACK = true;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Add this for Laravel to recognize the request as AJAX
  },
  withCredentials: true,  // Required for CORS and CSRF
  timeout: 10000,  // 10 second timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mmartToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error.message);
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mmartToken');
      localStorage.removeItem('mmartUser');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Handle network errors with meaningful message
    if (error.code === 'ERR_NETWORK' && USE_MOCK_FALLBACK) {
      console.warn('Network error encountered, using mock fallback data');
      // The services will handle fallback data individually
    }
    
    return Promise.reject(error);
  }
);

// Add a function to get CSRF cookie before sensitive operations
export const getCsrfCookie = async () => {
  try {
    await axios.get(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
    console.log('CSRF cookie set');
  } catch (error) {
    console.error('Error getting CSRF cookie:', error);
  }
};

export default api;
