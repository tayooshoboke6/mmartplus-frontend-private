export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  processingFeeType: 'fixed' | 'percentage';
  processingFee: number; // In kobo (1 Naira = 100 kobo)
  icon?: string;
  sortOrder: number;
}

export interface TaxSettings {
  taxRate: number; // Percentage (e.g., 7.5 for 7.5%)
  applyToDeliveryFee: boolean;
}

export interface PaymentSettings {
  paymentMethods: PaymentMethod[];
  taxSettings: TaxSettings;
}

// Default values for new settings
export const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your credit or debit card',
    isActive: true,
    processingFeeType: 'percentage',
    processingFee: 150, // 1.5%
    icon: 'credit-card',
    sortOrder: 1
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Pay directly from your bank account',
    isActive: true,
    processingFeeType: 'fixed',
    processingFee: 0,
    icon: 'bank',
    sortOrder: 2
  },
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    description: 'Pay with cash when your order is delivered',
    isActive: true,
    processingFeeType: 'fixed',
    processingFee: 0,
    icon: 'money-bill',
    sortOrder: 3
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'Pay using your mobile money account',
    isActive: true,
    processingFeeType: 'fixed',
    processingFee: 10000, // ₦100.00
    icon: 'mobile',
    sortOrder: 4
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    isActive: false,
    processingFeeType: 'percentage',
    processingFee: 350, // 3.5%
    icon: 'paypal',
    sortOrder: 5
  }
];

export const defaultTaxSettings: TaxSettings = {
  taxRate: 7.5,
  applyToDeliveryFee: true
};

export const defaultPaymentSettings: PaymentSettings = {
  paymentMethods: defaultPaymentMethods,
  taxSettings: defaultTaxSettings
};
