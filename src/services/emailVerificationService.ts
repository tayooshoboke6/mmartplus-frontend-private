// Types
export interface VerificationResponse {
  status: string;
  message: string;
  data?: {
    verified?: boolean;
    verified_at?: string;
  };
}

// Mock data for verification
const mockVerificationData = {
  sentCodes: new Map<string, string>(),
  verifiedEmails: new Set<string>(),
  currentUserEmail: 'user@example.com', // Simulated current user
};

// Helper to generate a random 6-digit code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const emailVerificationService = {
  // Send a verification code to the user's email (authenticated user)
  sendVerificationCode: async (): Promise<VerificationResponse> => {
    try {
      // Generate a new code for the current user
      const code = generateVerificationCode();
      mockVerificationData.sentCodes.set(mockVerificationData.currentUserEmail, code);
      
      console.log('Mock verification code sent:', code);
      
      return {
        status: 'success',
        message: 'Verification code sent to your email address.'
      };
    } catch (error: any) {
      console.error('Send verification code error:', error);
      
      throw {
        status: 'error',
        message: 'Failed to send verification code. Please try again.'
      };
    }
  },
  
  // Send a verification code to a specific email (non-authenticated)
  sendVerificationCodeByEmail: async (email: string): Promise<VerificationResponse> => {
    try {
      // Check if email exists in our mock system
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email address');
      }
      
      // Generate a new code for the specified email
      const code = generateVerificationCode();
      mockVerificationData.sentCodes.set(email, code);
      
      console.log(`Mock verification code sent to ${email}:`, code);
      
      return {
        status: 'success',
        message: 'Verification code sent to your email address.'
      };
    } catch (error: any) {
      console.error('Send verification code error:', error);
      
      throw {
        status: 'error',
        message: error.message || 'Failed to send verification code. Please try again.'
      };
    }
  },
  
  // Verify the code that the user received via email (authenticated user)
  verifyEmail: async (code: string): Promise<VerificationResponse> => {
    try {
      const storedCode = mockVerificationData.sentCodes.get(mockVerificationData.currentUserEmail);
      
      if (!storedCode || storedCode !== code) {
        throw new Error('Invalid or expired verification code');
      }
      
      // Mark as verified
      mockVerificationData.verifiedEmails.add(mockVerificationData.currentUserEmail);
      
      return {
        status: 'success',
        message: 'Email verified successfully.',
        data: {
          verified: true,
          verified_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Verify code error:', error);
      
      throw {
        status: 'error',
        message: error.message || 'Invalid or expired verification code. Please try again.'
      };
    }
  },
  
  // Verify email with verification code (non-authenticated)
  verifyEmailWithCode: async (email: string, code: string): Promise<VerificationResponse> => {
    try {
      const storedCode = mockVerificationData.sentCodes.get(email);
      
      if (!storedCode || storedCode !== code) {
        throw new Error('Invalid or expired verification code');
      }
      
      // Mark as verified
      mockVerificationData.verifiedEmails.add(email);
      
      return {
        status: 'success',
        message: 'Email verified successfully.',
        data: {
          verified: true,
          verified_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Verify email error:', error);
      
      throw {
        status: 'error',
        message: error.message || 'Invalid or expired verification code. Please try again.'
      };
    }
  },
  
  // Check the current email verification status
  checkVerificationStatus: async (): Promise<VerificationResponse> => {
    try {
      const isVerified = mockVerificationData.verifiedEmails.has(mockVerificationData.currentUserEmail);
      
      return {
        status: 'success',
        message: isVerified ? 'Email is verified.' : 'Email is not verified.',
        data: {
          verified: isVerified,
          verified_at: isVerified ? new Date().toISOString() : undefined
        }
      };
    } catch (error: any) {
      console.error('Check verification status error:', error);
      
      throw {
        status: 'error',
        message: 'Failed to check verification status.'
      };
    }
  },
  
  // For testing: get the current verification code (would not exist in real implementation)
  _getVerificationCode: (email: string): string | undefined => {
    return mockVerificationData.sentCodes.get(email);
  }
};

export default emailVerificationService;
