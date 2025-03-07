import axios from 'axios';
import config from '../config';

// Define types for Brevo API
export interface SendEmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: {
    email: string;
    name?: string;
  }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface BrevoApiResponse {
  messageId?: string;
  code?: string;
  message?: string;
}

/**
 * Service for interacting with the Brevo API
 */
const brevoService = {
  /**
   * Send verification email using Brevo API
   * @param email - Recipient email address
   * @param verificationCode - The verification code to send
   * @returns Promise with the API response
   */
  sendVerificationEmail: async (email: string, verificationCode: string): Promise<BrevoApiResponse> => {
    try {
      // Check if we're in debug mode and return mock response if true
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('🧪 DEBUG MODE: Bypassing actual Brevo API call');
        console.log(`Would have sent verification code ${verificationCode} to ${email}`);
        return {
          messageId: 'mock-message-id',
          message: 'Email sent successfully in debug mode'
        };
      }

      // Get the Brevo API key from environment
      const apiKey = import.meta.env.VITE_BREVO_API_KEY;
      
      if (!apiKey) {
        throw new Error('Brevo API key is not configured');
      }

      // Construct the email request
      const emailRequest: SendEmailRequest = {
        sender: {
          name: config.app.name,
          email: 'verification@mmartplus.com'
        },
        to: [
          {
            email: email
          }
        ],
        subject: `${config.app.name} - Your Verification Code`,
        htmlContent: `
          <html>
            <body>
              <h2>Email Verification</h2>
              <p>Thank you for signing up with ${config.app.name}!</p>
              <p>Your verification code is: <strong>${verificationCode}</strong></p>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </body>
          </html>
        `,
        textContent: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`
      };

      // Send the request to Brevo API
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        emailRequest,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': apiKey
          }
        }
      );

      console.log('✅ Brevo email sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error sending email via Brevo:', error);
      
      if (error.response?.data) {
        throw error.response.data;
      }
      
      throw {
        code: 'error',
        message: 'Failed to send verification email. Please try again.'
      };
    }
  },

  /**
   * Generate a random verification code
   * @param length Length of the code (default: 6)
   * @returns Random numeric verification code
   */
  generateVerificationCode: (length: number = 6): string => {
    const characters = '0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    return code;
  }
};

export default brevoService;
