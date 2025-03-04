import api from './api';
import { PaymentMethod, PaymentSettings } from '../models/PaymentMethod';

// Response interfaces
export interface PaymentMethodResponse {
  success: boolean;
  payment_method: PaymentMethod;
}

export interface PaymentMethodsResponse {
  success: boolean;
  payment_methods: PaymentMethod[];
}

export interface PaymentSettingsResponse {
  success: boolean;
  settings: PaymentSettings;
}

// Payment service with real API endpoints
export const PaymentService = {
  // Get all available payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await api.get<PaymentMethodsResponse>('/payment-methods');
      return response.data.payment_methods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Get payment settings
  getPaymentSettings: async (): Promise<PaymentSettings> => {
    try {
      const response = await api.get<PaymentSettingsResponse>('/payment/settings');
      return response.data.settings;
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      throw error;
    }
  },

  // Get payment method by ID
  getPaymentMethodById: async (id: string): Promise<PaymentMethod | null> => {
    try {
      const response = await api.get<PaymentMethodResponse>(`/payment-methods/${id}`);
      return response.data.payment_method;
    } catch (error) {
      console.error(`Error fetching payment method #${id}:`, error);
      return null;
    }
  },

  // Get payment method by code
  getPaymentMethodByCode: async (code: string): Promise<PaymentMethod | null> => {
    try {
      const response = await api.get<PaymentMethodResponse>('/payment-methods/by-code', {
        params: { code }
      });
      return response.data.payment_method;
    } catch (error) {
      console.error(`Error fetching payment method with code ${code}:`, error);
      return null;
    }
  },

  // Calculate processing fee for a payment method
  calculateProcessingFee: async (methodCode: string, amount: number): Promise<number> => {
    try {
      const response = await api.get('/payment/calculate-fee', {
        params: {
          method_code: methodCode,
          amount
        }
      });
      return response.data.fee;
    } catch (error) {
      console.error('Error calculating processing fee:', error);
      return 0;
    }
  },

  // Admin: Update payment method
  updatePaymentMethod: async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      const response = await api.put<PaymentMethodResponse>(`/payment-methods/${id}`, data);
      return response.data.payment_method;
    } catch (error) {
      console.error(`Error updating payment method #${id}:`, error);
      throw error;
    }
  },

  // Admin: Toggle payment method status
  togglePaymentMethodStatus: async (id: string): Promise<PaymentMethod> => {
    try {
      const response = await api.put<PaymentMethodResponse>(`/payment-methods/${id}/toggle`);
      return response.data.payment_method;
    } catch (error) {
      console.error(`Error toggling payment method #${id}:`, error);
      throw error;
    }
  },

  // Admin: Update payment settings
  updatePaymentSettings: async (settings: Partial<PaymentSettings>): Promise<PaymentSettings> => {
    try {
      const response = await api.put<PaymentSettingsResponse>('/payment/settings', settings);
      return response.data.settings;
    } catch (error) {
      console.error('Error updating payment settings:', error);
      throw error;
    }
  }
};

// Also export as default for flexibility
export default PaymentService;
