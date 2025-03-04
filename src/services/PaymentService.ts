import { PaymentMethod, PaymentSettings } from '../models/PaymentMethod';

// Mock payment methods data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Credit/Debit Card',
    code: 'card',
    description: 'Pay securely with your credit or debit card',
    icon: 'credit-card',
    enabled: true,
    requiresRedirect: false,
    processingFee: 1.5,
    processingFeeType: 'percentage',
    position: 1
  },
  {
    id: '2',
    name: 'Bank Transfer',
    code: 'bank_transfer',
    description: 'Pay directly from your bank account',
    icon: 'bank',
    enabled: true,
    requiresRedirect: true,
    position: 2
  },
  {
    id: '3',
    name: 'Cash on Delivery',
    code: 'cod',
    description: 'Pay with cash when your order is delivered',
    icon: 'cash',
    enabled: true,
    requiresRedirect: false,
    position: 3
  },
  {
    id: '4',
    name: 'Mobile Money',
    code: 'mobile_money',
    description: 'Pay using your mobile money account',
    icon: 'mobile',
    enabled: true,
    requiresRedirect: true,
    processingFee: 100,
    processingFeeType: 'fixed',
    position: 4
  },
  {
    id: '5',
    name: 'PayPal',
    code: 'paypal',
    description: 'Pay securely with PayPal',
    icon: 'paypal',
    enabled: false,
    requiresRedirect: true,
    processingFee: 2.9,
    processingFeeType: 'percentage',
    position: 5
  }
];

// Mock payment settings
const mockPaymentSettings: PaymentSettings = {
  availablePaymentMethods: mockPaymentMethods.filter(method => method.enabled),
  defaultPaymentMethod: 'card',
  allowCashOnDelivery: true,
  allowBankTransfer: true,
  allowCardPayments: true,
  allowMobilePayments: true,
  processingFees: {
    card: {
      amount: 1.5,
      type: 'percentage'
    },
    mobile_money: {
      amount: 100,
      type: 'fixed'
    }
  }
};

// In a real application, these functions would make API calls to a backend server
export const PaymentService = {
  // Get all available payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const enabledMethods = mockPaymentMethods.filter(method => method.enabled);
        // Sort by position
        enabledMethods.sort((a, b) => a.position - b.position);
        resolve(enabledMethods);
      }, 500);
    });
  },

  // Get payment settings
  getPaymentSettings: async (): Promise<PaymentSettings> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPaymentSettings);
      }, 300);
    });
  },

  // Get payment method by ID
  getPaymentMethodById: async (id: string): Promise<PaymentMethod | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const method = mockPaymentMethods.find(m => m.id === id);
        resolve(method || null);
      }, 200);
    });
  },

  // Get payment method by code
  getPaymentMethodByCode: async (code: string): Promise<PaymentMethod | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const method = mockPaymentMethods.find(m => m.code === code);
        resolve(method || null);
      }, 200);
    });
  },

  // Calculate processing fee for a payment method
  calculateProcessingFee: (methodCode: string, amount: number): number => {
    const fee = mockPaymentSettings.processingFees[methodCode];
    if (!fee) return 0;
    
    if (fee.type === 'percentage') {
      return (amount * fee.amount) / 100;
    } else {
      return fee.amount;
    }
  }
};

export default PaymentService;
