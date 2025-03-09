/**
 * mockAPI.ts
 * 
 * This file provides a unified interface for making API calls to our mock backend.
 * It can be used as a drop-in replacement for real API calls until the actual backend is ready.
 * 
 * Usage:
 * import { mockAPI } from '../utils/mockAPI';
 * 
 * // Then use it like you would use axios:
 * const response = await mockAPI.get('/products');
 * const product = await mockAPI.get(`/products/${id}`);
 * await mockAPI.post('/orders', orderData);
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';
import { isMockApiEnabled } from '../mocks';

// Create a custom axios instance for the mock API
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true, // Enable cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies or localStorage if needed
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('refreshToken='))
          ?.split('=')[1];
        
        if (refreshToken) {
          // In a real implementation, you would call a token refresh endpoint
          // For the mock API, we'll just simulate a successful refresh
          console.log('Token expired, would refresh in a real implementation');
          
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Create a wrapper around the axios instance to provide a simpler interface
export const mockAPI = {
  /**
   * Make a GET request to the mock API
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get<T, AxiosResponse<T>>(url, config)
      .then(response => response.data);
  },
  
  /**
   * Make a POST request to the mock API
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post<T, AxiosResponse<T>>(url, data, config)
      .then(response => response.data);
  },
  
  /**
   * Make a PUT request to the mock API
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put<T, AxiosResponse<T>>(url, data, config)
      .then(response => response.data);
  },
  
  /**
   * Make a PATCH request to the mock API
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.patch<T, AxiosResponse<T>>(url, data, config)
      .then(response => response.data);
  },
  
  /**
   * Make a DELETE request to the mock API
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete<T, AxiosResponse<T>>(url, config)
      .then(response => response.data);
  },
  
  /**
   * Check if the mock API is enabled
   */
  isEnabled: (): boolean => {
    return isMockApiEnabled();
  }
};

export default mockAPI;
