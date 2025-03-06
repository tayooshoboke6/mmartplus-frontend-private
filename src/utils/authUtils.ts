/**
 * Authentication and CSRF utilities
 */
import axios from 'axios';
import config from '../config';

/**
 * Get CSRF token for Laravel Sanctum
 * This is required for authentication and other protected routes
 * @returns Promise<boolean> - True if token was retrieved or already exists
 */
export const getCsrfCookie = async (): Promise<boolean> => {
  // Skip if not using Sanctum or already have XSRF-TOKEN cookie
  if (document.cookie.includes('XSRF-TOKEN')) {
    return true;
  }
  
  try {
    // Use the URL API to extract domain from API URL
    const apiUrl = config.api.baseUrl;
    const apiDomain = new URL(apiUrl).origin;
    const csrfUrl = `${apiDomain}/sanctum/csrf-cookie`;
    
    console.log('🔐 API URL:', apiUrl);
    console.log('🔐 API Domain:', apiDomain);
    console.log('🔐 CSRF URL:', csrfUrl);
    
    await axios.get(csrfUrl, {
      withCredentials: true
    });
    console.log('✅ CSRF token fetched successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to fetch CSRF token:', error);
    
    // Continue without CSRF in development, but throw in production
    if (config.app.environment !== 'production') {
      console.log('⚠️ Continuing without CSRF token in development');
      return false;
    } else {
      console.error('🚫 CSRF token required in production');
      throw error;
    }
  }
};

/**
 * Check if a user is authenticated
 * @returns boolean - True if user has a valid token in localStorage
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('mmartToken');
};

export default {
  getCsrfCookie,
  isAuthenticated
};
