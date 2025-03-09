import axios from 'axios';
import config from '../config';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // Only used for development/testing
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Login a user with email and password
   * Uses HTTP-only cookies for authentication
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/login`, credentials, {
        withCredentials: true // Important for cookies
      });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Map frontend fields to backend expectations if needed
      const registrationData = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
        password_confirmation: data.password_confirmation
      };

      const response = await axios.post(`${config.api.baseUrl}/auth/register`, registrationData, {
        withCredentials: true // Important for cookies
      });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   * This will clear the HTTP-only cookies on the server
   */
  async logout(): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/logout`, {}, {
        withCredentials: true // Important for cookies
      });
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/auth/me`, {
        withCredentials: true // Important for cookies
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user information:', error);
      throw error;
    }
  },

  /**
   * Request a password reset link
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Failed to send password reset link:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetData): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/reset-password`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  },

  /**
   * Verify email with verification code
   */
  async verifyEmail(userId: number, code: string): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/auth/verify-email`, {
        user_id: userId,
        verification_code: code
      });
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  },

  /**
   * Login with Google
   * This would typically redirect to Google OAuth
   * For now it's a placeholder for the actual implementation
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // In a real implementation, this might redirect to Google OAuth
      // For now, we'll just make a request to our backend's Google auth endpoint
      const response = await axios.get(`${config.api.baseUrl}/auth/google`, {
        withCredentials: true // Important for cookies
      });
      return response.data;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },

  /**
   * Login with Apple
   * This would typically redirect to Apple OAuth
   * For now it's a placeholder for the actual implementation
   */
  async loginWithApple(): Promise<AuthResponse> {
    try {
      // In a real implementation, this might redirect to Apple OAuth
      // For now, we'll just make a request to our backend's Apple auth endpoint
      const response = await axios.get(`${config.api.baseUrl}/auth/apple`, {
        withCredentials: true // Important for cookies
      });
      return response.data;
    } catch (error) {
      console.error('Apple login failed:', error);
      throw error;
    }
  }
};

export default authService;
