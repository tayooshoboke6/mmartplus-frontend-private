import api from './api';
import brevoService from './brevoService';
import config from '../config';

interface VerificationResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    verified?: boolean;
  };
}

class EmailVerificationService {
  /**
   * Check if a user's email is verified
   */
  async checkVerificationStatus(): Promise<VerificationResponse> {
    try {
      const response = await api.get('/email/verification/status');
      return {
        status: 'success',
        message: 'Status retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Failed to check verification status:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to check verification status'
      };
    }
  }

  /**
   * Send a verification code to the user's email
   */
  async sendVerificationCode(): Promise<VerificationResponse> {
    try {
      // First check if email is already verified to prevent unnecessary API calls
      const statusCheck = await this.checkVerificationStatus();
      
      // If email is already verified, return early
      if (statusCheck.data?.verified) {
        return {
          status: 'success',
          message: 'Email is already verified',
          data: { verified: true }
        };
      }
      
      const response = await api.post('/email/verification/send');
      return {
        status: 'success',
        message: 'Verification code sent successfully',
        data: response.data
      };
    } catch (error: any) {
      // If error message indicates email is already verified, treat as success
      if (error.response?.data?.message === 'Email is already verified.') {
        return {
          status: 'success',
          message: 'Email is already verified',
          data: { verified: true }
        };
      }
      
      console.error('Failed to send verification code:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to send verification code'
      };
    }
  }

  /**
   * Send a verification code to a specific email (used during registration)
   */
  async sendVerificationCodeByEmail(email: string): Promise<VerificationResponse> {
    try {
      // For debug mode, just return success without calling API
      if (config.features.debugApiResponses) {
        console.log('Debug mode enabled, skipping real verification code sending');
        return {
          status: 'success',
          message: 'Verification code sent successfully (debug mode)'
        };
      }

      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Use Brevo service to send the email
      await brevoService.sendVerificationEmail(email, verificationCode);
      
      // Store the code in localStorage temporarily (not secure for production)
      // In production, this should be stored on the server
      localStorage.setItem(`verificationCode_${email}`, verificationCode);
      
      return {
        status: 'success',
        message: 'Verification code sent successfully'
      };
    } catch (error: any) {
      // If error message indicates email is already verified, treat as success
      if (error.response?.data?.message === 'Email is already verified.') {
        return {
          status: 'success',
          message: 'Email is already verified',
          data: { verified: true }
        };
      }
      
      console.error('Failed to send verification code:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to send verification code'
      };
    }
  }

  /**
   * Verify email with a code
   */
  async verifyEmail(code: string): Promise<VerificationResponse> {
    try {
      // First check if email is already verified to prevent unnecessary API calls
      const statusCheck = await this.checkVerificationStatus();
      
      // If email is already verified, return early
      if (statusCheck.data?.verified) {
        return {
          status: 'success',
          message: 'Email is already verified',
          data: { verified: true }
        };
      }
      
      const response = await api.post('/email/verification/verify', { code });
      return {
        status: 'success',
        message: 'Email verified successfully',
        data: response.data
      };
    } catch (error: any) {
      // If error message indicates email is already verified, treat as success
      if (error.response?.data?.message === 'Email is already verified.') {
        return {
          status: 'success',
          message: 'Email is already verified',
          data: { verified: true }
        };
      }
      
      console.error('Failed to verify email:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to verify email'
      };
    }
  }

  /**
   * Verify email with a code for a specific email (used during registration)
   */
  async verifyEmailWithCode(email: string, code: string): Promise<VerificationResponse> {
    try {
      // For debug mode, check the code against localStorage
      if (config.features.debugApiResponses) {
        const storedCode = localStorage.getItem(`verificationCode_${email}`);
        
        if (storedCode === code) {
          return {
            status: 'success',
            message: 'Email verified successfully (debug mode)',
            data: { verified: true }
          };
        } else {
          return {
            status: 'error',
            message: 'Invalid verification code'
          };
        }
      }

      // For real API verification
      const response = await api.post('/email/verification/verify', { 
        email, 
        code 
      });
      
      return {
        status: 'success',
        message: 'Email verified successfully',
        data: { verified: true }
      };
    } catch (error: any) {
      // If error message indicates email is already verified, treat as success
      if (error.response?.data?.message === 'Email is already verified.') {
        return {
          status: 'success',
          message: 'Email is already verified',
          data: { verified: true }
        };
      }
      
      console.error('Failed to verify email:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to verify email'
      };
    }
  }
}

const emailVerificationService = new EmailVerificationService();
export default emailVerificationService;
