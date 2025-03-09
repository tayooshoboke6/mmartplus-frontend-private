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

// Mock payment methods data
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    name: 'Credit/Debit Card',
    code: 'card',
    description: 'Pay with Visa, Mastercard, or Verve',
    processingFee: 1.5,
    processingFeeType: 'percentage',
    isActive: true,
    icon: 'credit-card'
  },
  {
    id: '2',
    name: 'Bank Transfer',
    code: 'bank_transfer',
    description: 'Pay directly from your bank account',
    processingFee: 100,
    processingFeeType: 'fixed',
    isActive: true,
    icon: 'bank'
  },
  {
    id: '3',
    name: 'Cash on Delivery',
    code: 'cod',
    description: 'Pay when your order is delivered',
    processingFee: 0,
    processingFeeType: 'fixed',
    isActive: true,
    icon: 'money'
  },
  {
    id: '4',
    name: 'Mobile Money',
    code: 'mobile_money',
    description: 'Pay using mobile money services',
    processingFee: 1.0,
    processingFeeType: 'percentage',
    isActive: true,
    icon: 'mobile'
  }
];

// Mock payment settings
const MOCK_PAYMENT_SETTINGS: PaymentSettings = {
  allowPartialPayments: true,
  minimumPartialPaymentPercentage: 30,
  defaultPaymentMethod: 'card',
  paymentDueDays: 3,
  enableInstallments: true,
  maxInstallments: 3
};

// Payment service with mock data
export const PaymentService = {
  // Get all available payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(MOCK_PAYMENT_METHODS.filter(method => method.isActive));
      }, 500);
    });
  },

  // Get payment settings
  getPaymentSettings: async (): Promise<PaymentSettings> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(MOCK_PAYMENT_SETTINGS);
      }, 300);
    });
  },

  // Get payment method by ID
  getPaymentMethodById: async (id: string): Promise<PaymentMethod | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const method = MOCK_PAYMENT_METHODS.find(m => m.id === id) || null;
        resolve(method);
      }, 300);
    });
  },

  // Get payment method by code
  getPaymentMethodByCode: async (code: string): Promise<PaymentMethod | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const method = MOCK_PAYMENT_METHODS.find(m => m.code === code) || null;
        resolve(method);
      }, 300);
    });
  },

  // Calculate processing fee for a payment method
  calculateProcessingFee: async (methodCode: string, amount: number): Promise<number> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const method = MOCK_PAYMENT_METHODS.find(m => m.code === methodCode);
        
        if (!method || !method.processingFee) {
          resolve(0);
          return;
        }
        
        let fee = 0;
        if (method.processingFeeType === 'percentage') {
          fee = (amount * method.processingFee) / 100;
        } else {
          fee = method.processingFee;
        }
        
        resolve(fee);
      }, 200);
    });
  },

  // Admin: Update payment method
  updatePaymentMethod: async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const index = MOCK_PAYMENT_METHODS.findIndex(m => m.id === id);
        
        if (index === -1) {
          reject(new Error(`Payment method with ID ${id} not found`));
          return;
        }
        
        // Update the method
        MOCK_PAYMENT_METHODS[index] = {
          ...MOCK_PAYMENT_METHODS[index],
          ...data
        };
        
        resolve(MOCK_PAYMENT_METHODS[index]);
      }, 500);
    });
  },

  // Admin: Toggle payment method status
  togglePaymentMethodStatus: async (id: string): Promise<PaymentMethod> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const index = MOCK_PAYMENT_METHODS.findIndex(m => m.id === id);
        
        if (index === -1) {
          reject(new Error(`Payment method with ID ${id} not found`));
          return;
        }
        
        // Toggle the status
        MOCK_PAYMENT_METHODS[index] = {
          ...MOCK_PAYMENT_METHODS[index],
          isActive: !MOCK_PAYMENT_METHODS[index].isActive
        };
        
        resolve(MOCK_PAYMENT_METHODS[index]);
      }, 500);
    });
  },

  // Admin: Update payment settings
  updatePaymentSettings: async (settings: Partial<PaymentSettings>): Promise<PaymentSettings> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Update settings
        Object.assign(MOCK_PAYMENT_SETTINGS, settings);
        
        resolve(MOCK_PAYMENT_SETTINGS);
      }, 500);
    });
  }
};

// Also export as default for flexibility
export default PaymentService;
