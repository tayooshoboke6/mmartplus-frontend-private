import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import config from '../config';

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials: boolean;
}

/**
 * Standard API Response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

/**
 * Create and configure the API client
 */
const createApiClient = (): AxiosInstance => {
  // Get base URL from environment variables with fallback
  const baseURL = import.meta.env.VITE_API_BASE_URL || config.api.baseUrl || 'http://localhost:8000/api';
  
  // Create client configuration
  const clientConfig: ApiClientConfig = {
    baseURL,
    timeout: 30000, // 30 seconds
    withCredentials: true, // Important for HTTP-only cookie auth
  };

  // Create axios instance
  const client = axios.create(clientConfig);

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // No need to set Authorization header as we're using HTTP-only cookies
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle authentication errors
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // No need to clear localStorage tokens as we're using HTTP-only cookies
        
        // Redirect to login if not already on login or auth-related page
        const currentPath = window.location.pathname;
        if (
          !currentPath.startsWith('/login') && 
          !currentPath.startsWith('/register') && 
          !currentPath.startsWith('/forgot-password') && 
          !currentPath.startsWith('/reset-password') &&
          !currentPath.startsWith('/verify-email')
        ) {
          window.location.href = '/login';
        }
      }
      
      // Log errors in development
      if (import.meta.env.DEV) {
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Create the API client instance
const apiClient = createApiClient();

/**
 * Wrapper for API requests with standardized error handling
 */
export const apiRequest = async <T>(
  config: AxiosRequestConfig,
  errorMessage: string = 'An error occurred while processing your request'
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    // Format error response
    const errorResponse: ApiResponse<T> = {
      success: false,
      error: {
        message: errorMessage,
        details: error.response?.data || error.message,
      },
    };
    
    // If the error has a specific message from the server, use it
    if (error.response?.data?.message) {
      errorResponse.error.message = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorResponse.error.message = error.response.data.error;
    }
    
    // Add error code if available
    if (error.response?.status) {
      errorResponse.error.code = error.response.status.toString();
    }
    
    return errorResponse;
  }
};

/**
 * API endpoints object
 * Centralizes all API endpoints in one place for easy management
 */
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    refreshToken: '/auth/refresh-token',
    me: '/auth/me',
    google: '/auth/google',
    apple: '/auth/apple',
  },
  
  // User endpoints
  users: {
    profile: '/users/profile',
    addresses: '/users/addresses',
    wishlist: '/users/wishlist',
    orders: '/users/orders',
  },
  
  // Product endpoints
  products: {
    base: '/products',
    featured: '/products/featured',
    newArrivals: '/products/new-arrivals',
    bestSellers: '/products/best-sellers',
    bySlug: (slug: string) => `/products/slug/${slug}`,
    byId: (id: number | string) => `/products/${id}`,
    reviews: (id: number | string) => `/products/${id}/reviews`,
    search: '/products/search',
  },
  
  // Category endpoints
  categories: {
    base: '/categories',
    byId: (id: number | string) => `/categories/${id}`,
    bySlug: (slug: string) => `/categories/slug/${slug}`,
    products: (id: number | string) => `/categories/${id}/products`,
  },
  
  // Cart endpoints
  cart: {
    base: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
    clear: '/cart/clear',
    checkout: '/cart/checkout',
  },
  
  // Order endpoints
  orders: {
    base: '/orders',
    byId: (id: number | string) => `/orders/${id}`,
    cancel: (id: number | string) => `/orders/${id}/cancel`,
    track: (id: number | string) => `/orders/${id}/track`,
  },
  
  // Payment endpoints
  payments: {
    methods: '/payments/methods',
    process: '/payments/process',
    verify: '/payments/verify',
  },
  
  // Store location endpoints
  storeLocations: {
    base: '/store-locations',
    pickup: '/store-locations/pickup',
    byId: (id: number | string) => `/store-locations/${id}`,
  },
  
  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    categories: '/admin/categories',
    orders: '/admin/orders',
    users: '/admin/users',
    settings: '/admin/settings',
    storeLocations: '/admin/store-locations',
  },
};

export default apiClient;
