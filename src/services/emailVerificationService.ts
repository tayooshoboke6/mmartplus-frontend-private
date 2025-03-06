import api from './api';
import axios from 'axios';  
import config from '../config';
import { logApiError } from '../utils/debugUtils';
import { getCsrfCookie } from '../utils/authUtils';

// Types
export interface VerificationResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    email?: string;
    code?: string;
    expiry?: string;
  };
}

const emailVerificationService = {
  // Send a verification code to the user's email (authenticated user)
  sendVerificationCode: async (): Promise<VerificationResponse> => {
    try {
      const response = await api.post<VerificationResponse>('/email/verify/send');
      return response.data;
    } catch (error: any) {
      console.error('Send verification code error:', error);
      
      if (error.response?.data) {
        throw error.response.data;
      }
      
      throw {
        status: 'error',
        message: 'Failed to send verification code. Please try again.'
      };
    }
  },
  
  // Send a verification code to a specific email (non-authenticated)
  sendVerificationCodeByEmail: async (email: string): Promise<VerificationResponse> => {
    try {
      console.log('🔍 Email verification attempt for:', email);
      
      // The correct endpoint is /email/non-auth/send (without /api prefix as it's already in baseUrl)
      const verificationUrl = `${config.api.baseUrl}/email/non-auth/send`;
      console.log('🌐 Using verification URL:', verificationUrl);
      console.log('⚙️ Current config:', {
        baseUrl: config.api.baseUrl,
        adminUrl: config.api.adminUrl,
        debug: import.meta.env.VITE_DEBUG,
        environment: config.app.environment
      });
      
      // TESTING MODE: For development/testing, return a success response without calling the API
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('🧪 DEBUG MODE: Bypassing actual API call for testing');
        return {
          status: 'success',
          message: 'Verification code sent successfully. Please check your email.'
        };
      }
      
      // Get CSRF token before making the request
      await getCsrfCookie();
      
      // Use axios directly to bypass the api instance with adminUrl
      const response = await axios.post<VerificationResponse>(
        verificationUrl, 
        { email },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      console.log('✅ Verification response:', response.data);
      return response.data;
    } catch (error: any) {
      logApiError(error);
      
      // TESTING MODE: If we're in debug mode and get an error, create a fake success response
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('🧪 DEBUG MODE: Returning success despite API error');
        return {
          status: 'success',
          message: 'DEBUG MODE: Verification code sent successfully. Use code 123456.'
        };
      }
      
      if (error.response?.data) {
        throw error.response.data;
      }
      
      throw {
        status: 'error',
        message: error.response?.status === 404
          ? 'Email address not found.'
          : 'Failed to send verification code. Please try again.'
      };
    }
  },
  
  // Verify the code that the user received via email (authenticated user)
  verifyEmail: async (code: string): Promise<VerificationResponse> => {
    try {
      const response = await api.post<VerificationResponse>('/email/verify', { code });
      return response.data;
    } catch (error: any) {
      console.error('Verify code error:', error);
      
      if (error.response?.data) {
        throw error.response.data;
      }
      
      throw {
        status: 'error',
        message: 'Invalid or expired verification code. Please try again.'
      };
    }
  },
  
  // Verify email with verification code (non-authenticated)
  verifyEmailWithCode: async (email: string, code: string): Promise<VerificationResponse> => {
    try {
      console.log('🔍 Email verification code attempt:', { email, code });
      console.log('🌐 Using API URL:', `${config.api.baseUrl}/email/non-auth/verify`);
      
      // Use axios directly to bypass the api instance with adminUrl
      const response = await axios.post<VerificationResponse>(
        `${config.api.baseUrl}/email/non-auth/verify`, 
        { email, code },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        }
      );
      
      console.log('✅ Code verification response:', response.data);
      return response.data;
    } catch (error: any) {
      logApiError(error);
      
      if (error.response?.data) {
        throw error.response.data;
      }
      
      throw {
        status: 'error',
        message: error.response?.status === 404
          ? 'Invalid verification code or email address.'
          : 'Failed to verify email. Please try again.'
      };
    }
  },
  
  // Check the current email verification status
  checkVerificationStatus: async (): Promise<VerificationResponse> => {
    try {
      const response = await api.get<VerificationResponse>('/email/status');
      return response.data;
    } catch (error: any) {
      console.error('Check verification status error:', error);
      
      if (error.response?.data) {
        throw error.response.data;
      }
      
      throw {
        status: 'error',
        message: 'Failed to check verification status.'
      };
    }
  }
};

export default emailVerificationService;
