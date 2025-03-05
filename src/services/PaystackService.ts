import api from './api';

interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
  };
}

export const PaystackService = {
  // Initialize a transaction
  initializeTransaction: async (
    email: string,
    amount: number,
    reference: string,
    callback_url: string
  ): Promise<PaystackTransactionResponse> => {
    try {
      const response = await api.post('/payment/paystack/initialize', {
        email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        reference,
        callback_url,
        currency: 'NGN'
      });

      return response.data;
    } catch (error) {
      console.error('Error initializing Paystack transaction:', error);
      throw error;
    }
  },

  // Verify a transaction
  verifyTransaction: async (reference: string): Promise<PaystackVerificationResponse> => {
    try {
      const response = await api.get(`/payment/paystack/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying Paystack transaction:', error);
      throw error;
    }
  },

  // Generate a unique reference
  generateReference: (): string => {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `mmart-${timestamp}-${randomStr}`;
  }
};

export default PaystackService;
