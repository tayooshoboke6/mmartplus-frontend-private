import api, { getCsrfCookie } from './api';
import emailVerificationService from './emailVerificationService';

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
      console.log('Sending registration data to API:', userData);
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
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
      
      // Map the Laravel response structure to our AuthResponse
      const authResponse: AuthResponse = {
        success: response.data.status === 'success',
        message: response.data.message,
        token: response.data.data?.token,
        user: response.data.data?.user
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
      await api.post('/auth/logout');
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
    const user = JSON.parse(localStorage.getItem('mmartUser') || 'null');
    return user && user.role === 'admin';
  },
  
  // Verify email with code
  verifyEmail: async (code: string): Promise<void> => {
    await emailVerificationService.verifyCode(code);
  },
  
  // Send email verification code
  sendVerificationCode: async (): Promise<void> => {
    await emailVerificationService.sendVerificationCode();
  },
};

export default authService;
