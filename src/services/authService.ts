import api from './api';
import axios from 'axios';
import config from '../config';
import emailVerificationService from './emailVerificationService';
import { getCsrfCookie } from '../utils/authUtils';

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
      const registrationData = {
        name: `${userData.first_name} ${userData.last_name}`, // Combine first and last name
        email: userData.email,
        phone_number: userData.phone || '', // Provide an empty string if missing
        password: userData.password,
        password_confirmation: userData.password_confirmation
      };
      
      console.log('Mapped to backend fields:', registrationData);
      
      // Use the correct registration endpoint
      // The correct endpoint is /api/register (not /api/admin/register)
      const apiUrl = config.api.baseUrl;
      const registrationUrl = `${apiUrl}/register`;
      
      console.log('📮 Registration URL:', registrationUrl);
      
      // Direct axios request to the auth endpoint
      const response = await axios.post<AuthResponse>(
        registrationUrl, 
        registrationData,
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
        localStorage.setItem('mmartToken', response.data.token);
        localStorage.setItem('mmartUser', JSON.stringify(response.data.user));
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
      console.log('Sending login data to API:', credentials);
      
      // Get CSRF cookie first
      await getCsrfCookie();
      
      // Standard API flow for all users
      const response = await api.post<any>('/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('Login response received:', response.data);
      
      // Extract user data from response
      const userData = response.data.data?.user;
      
      // Determine if user has admin role from Laravel's roles relationship
      let isAdmin = false;
      if (userData && userData.roles && Array.isArray(userData.roles)) {
        isAdmin = userData.roles.some(role => role.name === 'admin');
      }
      
      // Create user object with correct role
      const user: User = {
        ...userData,
        role: isAdmin ? 'admin' : 'user' // Set role based on the roles array
      };
      
      console.log('Processed user with role:', user);
      
      // Map the Laravel response structure to our AuthResponse
      const authResponse: AuthResponse = {
        success: response.data.status === 'success',
        message: response.data.message,
        token: response.data.data?.token,
        user: user
      };
      
      if (authResponse.success && authResponse.token) {
        localStorage.setItem('mmartToken', authResponse.token);
        localStorage.setItem('mmartUser', JSON.stringify(authResponse.user));
      }
      
      return authResponse;
    } catch (error: any) {
      console.error('Login API error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join(', ');
          throw new Error(errorMessages || 'Login failed');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw error.response?.data || { 
        success: false, 
        message: 'Login failed. Please check your credentials and try again.' 
      };
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('mmartToken');
      localStorage.removeItem('mmartUser');
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
    return !!localStorage.getItem('mmartToken');
  },

  // Save user to local storage
  saveUser(user: User): void {
    localStorage.setItem('mmartUser', JSON.stringify(user));
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    try {
      const userStr = localStorage.getItem('mmartUser');
      if (!userStr) return false;
      
      const user = JSON.parse(userStr);
      
      // Check for different variations of admin role
      const role = user?.role?.toLowerCase?.();
      return role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  // Get user from local storage
  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('mmartUser');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Ensure user has a role property (default to 'user' if missing)
      if (user && !user.role) {
        user.role = 'user';
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
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
      
      // Get the current token
      const token = localStorage.getItem('mmartToken');
      if (!token) {
        console.warn('No token found in localStorage, cannot refresh session');
        return false;
      }
      
      // Call the refresh endpoint
      const response = await api.post('/auth/refresh');
      
      if (response.data && response.data.token) {
        console.log('Session refreshed successfully, updating token');
        
        // Update token in localStorage
        localStorage.setItem('mmartToken', response.data.token);
        
        // Update user data if returned
        if (response.data.user) {
          // Check if there's existing user data
          const existingUser = localStorage.getItem('mmartUser');
          const newUser = response.data.user;
          
          // If we have existing user data, preserve role information if not present in new data
          if (existingUser) {
            try {
              const parsedExistingUser = JSON.parse(existingUser);
              
              // Ensure role information is preserved, especially for admins
              if (parsedExistingUser.role === 'admin' && (!newUser.role || newUser.role !== 'admin')) {
                console.log('Preserving admin role from existing user data');
                newUser.role = 'admin';
              }
            } catch (parseError) {
              console.error('Error parsing existing user data:', parseError);
            }
          }
          
          localStorage.setItem('mmartUser', JSON.stringify(newUser));
        }
        
        // Update login timestamp
        localStorage.setItem('mmartLoginTimestamp', new Date().getTime().toString());
        
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
