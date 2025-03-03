import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  // Point directly to test_api.php on port 8001
  baseURL: 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mmartToken');
      localStorage.removeItem('mmartUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
