import api from './api';
import axios from 'axios';
import config from '../config';
import emailVerificationService from './emailVerificationService';
import { getCsrfCookie } from '../utils/authUtils';
import Cookies from 'js-cookie';
import { clearApiCache } from './api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  // Backend API fields
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  profile_picture?: string;
}

// UI form fields interface - to be used by components
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profile_picture?: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // First try to get CSRF token
      await getCsrfCookie(); 
      
      console.log('Submitting registration data:', userData);
      
      // Map the frontend fields to what the backend expects
      const { first_name, last_name, email, password, password_confirmation, phone } = userData;
      const payload = {
        name: `${first_name} ${last_name}`, // Combine first and last name for backend
        email,
        phone_number: phone || '',  // Ensure phone_number is always sent
        password,
        password_confirmation: password_confirmation || password, // Use provided confirmation or password
      };
      
      console.log('Mapped to backend fields:', payload);
      
      // Use the correct registration endpoint
      // The correct endpoint is /api/register (not /api/admin/register)
      const apiUrl = config.api.baseUrl;
      const registrationUrl = `${apiUrl}/auth/register`;
      
      console.log('📮 Registration URL:', registrationUrl);
      
      // Direct axios request to the auth endpoint
      const response = await axios.post<AuthResponse>(
        registrationUrl, 
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      if (response.data.success && response.data.token) {
        // Store in both localStorage and cookies for redundancy
        localStorage.setItem('mmartToken', response.data.token);
        localStorage.setItem('mmartUser', JSON.stringify(response.data.user));
        
        // Set cookies with secure attributes
        const domain = window.location.hostname;
        Cookies.set('mmartToken', response.data.token, {
          expires: 30, // 30 days
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          domain: domain !== 'localhost' ? domain : undefined
        });
        
        Cookies.set('mmartUser', JSON.stringify(response.data.user), {
          expires: 30,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          domain: domain !== 'localhost' ? domain : undefined
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // Log the full validation error details
        if (error.response.status === 422) {
          console.error('Validation errors:', JSON.stringify(error.response.data, null, 2));
        }
        
        if (error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join(', ');
          throw new Error(errorMessages || 'Registration failed');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
      }
      
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // First try to get CSRF token
      await getCsrfCookie();
      
      // Call the login endpoint
      const response = await api.post<AuthResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      // Log login response for debugging
      console.log('Login response:', JSON.stringify(response.data));
      
      if (response.data) {
        const { token, user } = response.data;
        
        // Clear any existing tokens to prevent conflicts
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        Cookies.remove('token');
        Cookies.remove('adminToken');
        
        // Store in both localStorage and cookies with consistent naming
        localStorage.setItem('mmartToken', token);
        localStorage.setItem('mmartUser', JSON.stringify(user));
        
        // Set cookies with secure attributes
        const domain = window.location.hostname;
        Cookies.set('mmartToken', token, {
          expires: 30, // 30 days
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          domain: domain !== 'localhost' ? domain : undefined
        });
        
        Cookies.set('mmartUser', JSON.stringify(user), {
          expires: 30,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          domain: domain !== 'localhost' ? domain : undefined
        });
        
        // If user is admin, also set admin-specific tokens
        if (user.role === 'admin') {
          localStorage.setItem('adminToken', token);
          Cookies.set('adminToken', token, {
            expires: 30,
            secure: window.location.protocol === 'https:',
            sameSite: 'strict',
            domain: domain !== 'localhost' ? domain : undefined
          });
        }
        
        // Clear API cache to prevent stale data
        clearApiCache();
        
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Try to extract detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      // Return a consistent error format
      return {
        success: false,
        token: '',
        user: {} as User,
        message: errorMessage
      };
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Get CSRF cookie first
      await getCsrfCookie();
      
      // Call logout endpoint
      await api.post('/logout');
      
      // Clear all tokens and user data
      localStorage.removeItem('mmartToken');
      localStorage.removeItem('mmartUser');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      
      // Clear cookies
      Cookies.remove('mmartToken');
      Cookies.remove('mmartUser');
      Cookies.remove('token');
      Cookies.remove('adminToken');
      
      // Clear API cache to prevent using cached authenticated responses
      clearApiCache();
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, clear local tokens
      localStorage.removeItem('mmartToken');
      localStorage.removeItem('mmartUser');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      
      Cookies.remove('mmartToken');
      Cookies.remove('mmartUser');
      Cookies.remove('token');
      Cookies.remove('adminToken');
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/user');
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put('/auth/user', userData);
      
      if (response.data.success && response.data.user) {
        // Update user in storage
        localStorage.setItem('mmartUser', JSON.stringify(response.data.user));
      }
      
      return response.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    // Check both localStorage and cookies for auth token
    return !!(localStorage.getItem('mmartToken') || Cookies.get('mmartToken'));
  },

  // Save user to both local storage and cookies
  saveUser(user: User): void {
    const userData = JSON.stringify(user);
    localStorage.setItem('mmartUser', userData);
    
    // Also save to cookies for redundancy and cross-tab access
    const domain = window.location.hostname;
    Cookies.set('mmartUser', userData, {
      expires: 30,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      domain: domain !== 'localhost' ? domain : undefined
    });
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    try {
      // Get user data from either cookies or localStorage
      const userFromCookie = Cookies.get('mmartUser');
      const userFromStorage = localStorage.getItem('mmartUser');
      const userData = userFromCookie || userFromStorage;
      if (!userData) return false;
      
      const user = JSON.parse(userData);
      
      // Check for different variations of admin role
      const role = user?.role?.toLowerCase?.();
      return role === 'admin' || role === 'super-admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  // Get user from storage (checking both cookies and localStorage)
  getUser: (): User | null => {
    try {
      // Try to get user from cookies first, then localStorage as fallback
      const userFromCookie = Cookies.get('mmartUser');
      const userFromStorage = localStorage.getItem('mmartUser');
      
      // Use cookie data if available, otherwise use localStorage
      const userData = userFromCookie || userFromStorage;
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Ensure user has a role property (default to 'user' if missing)
      if (user && !user.role) {
        user.role = 'user';
      }
      
      // Ensure both storage locations have the same data for consistency
      if (userFromCookie && !userFromStorage) {
        localStorage.setItem('mmartUser', userData);
      } else if (!userFromCookie && userFromStorage) {
        const domain = window.location.hostname;
        Cookies.set('mmartUser', userFromStorage, {
          expires: 30,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          domain: domain !== 'localhost' ? domain : undefined
        });
      }
      
      return user;
    } catch (error) {
      console.error('Failed to parse user from storage:', error);
      // Clear corrupt data
      localStorage.removeItem('mmartUser');
      Cookies.remove('mmartUser');
      return null;
    }
  },

  // Verify email with code
  verifyEmail: async (code: string): Promise<void> => {
    return emailVerificationService.verifyEmail(code);
  },
  
  // Send email verification code
  sendVerificationCode: async (): Promise<void> => {
    await emailVerificationService.sendVerificationCode();
  },
  
  // Refresh user session
  refreshSession: async (): Promise<boolean> => {
    try {
      // Get CSRF cookie first
      await getCsrfCookie();
      
      // Get the current token from either cookies or localStorage
      const tokenFromCookie = Cookies.get('mmartToken');
      const tokenFromStorage = localStorage.getItem('mmartToken');
      const token = tokenFromCookie || tokenFromStorage;
      
      if (!token) {
        console.warn('No token found in storage, cannot refresh session');
        return false;
      }
      
      // Call the refresh endpoint
      const response = await api.post('/auth/refresh');
      
      if (response.data && response.data.token) {
        console.log('Session refreshed successfully, updating token');
        
        // Store domain for cookie operations
        const domain = window.location.hostname;
        const cookieOptions = {
          expires: 30, // 30 days
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          domain: domain !== 'localhost' ? domain : undefined
        };
        
        // Update token in both localStorage and cookies
        localStorage.setItem('mmartToken', response.data.token);
        Cookies.set('mmartToken', response.data.token, cookieOptions);
        
        // Clear API cache to ensure fresh data with new token
        clearApiCache();
        
        // Update user data if returned
        if (response.data.user) {
          // Check if there's existing user data from either storage method
          const existingUserFromCookie = Cookies.get('mmartUser');
          const existingUserFromStorage = localStorage.getItem('mmartUser');
          const existingUserData = existingUserFromCookie || existingUserFromStorage;
          const newUser = response.data.user;
          
          // If we have existing user data, preserve role information if not present in new data
          if (existingUserData) {
            try {
              const parsedExistingUser = JSON.parse(existingUserData);
              
              // Ensure role information is preserved, especially for admins
              if ((parsedExistingUser.role === 'admin' || parsedExistingUser.role === 'super-admin') && 
                  (!newUser.role || (newUser.role !== 'admin' && newUser.role !== 'super-admin'))) {
                console.log('Preserving admin role from existing user data');
                newUser.role = parsedExistingUser.role;
              }
            } catch (parseError) {
              console.error('Error parsing existing user data:', parseError);
            }
          }
          
          // Store user data in both locations
          const newUserData = JSON.stringify(newUser);
          localStorage.setItem('mmartUser', newUserData);
          Cookies.set('mmartUser', newUserData, cookieOptions);
        }
        
        // Update login timestamp in both locations
        const timestamp = new Date().getTime().toString();
        localStorage.setItem('mmartLoginTimestamp', timestamp);
        Cookies.set('mmartLoginTimestamp', timestamp, cookieOptions);
        
        // Store last activity time
        localStorage.setItem('mmartLastActivityTimestamp', timestamp);
        Cookies.set('mmartLastActivityTimestamp', timestamp, cookieOptions);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  },

};

export default authService;
