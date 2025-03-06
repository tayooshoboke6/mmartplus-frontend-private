import api from './api';
import axios from 'axios';  
import config from '../config';

// Types
export interface VerificationResponse {
  status: string;
  message: string;
  data?: {
    verified?: boolean;
    verified_at?: string;
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
      // Use axios directly to bypass the api instance with adminUrl
      const response = await axios.post<VerificationResponse>(
        `${config.api.baseUrl}/email/non-auth/send`, 
        { email },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Send verification code error:', error);
      
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
      return response.data;
    } catch (error: any) {
      console.error('Verify email error:', error);
      
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
