export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  isActive: boolean;
  requiresRedirect?: boolean;
  processingFee?: number;
  processingFeeType?: 'percentage' | 'fixed';
  minimumAmount?: number;
  maximumAmount?: number;
  position?: number;
}

export interface PaymentSettings {
  availablePaymentMethods?: PaymentMethod[];
  defaultPaymentMethod: string;
  allowCashOnDelivery?: boolean;
  allowBankTransfer?: boolean;
  allowCardPayments?: boolean;
  allowMobilePayments?: boolean;
  allowPartialPayments?: boolean;
  minimumPartialPaymentPercentage?: number;
  paymentDueDays?: number;
  enableInstallments?: boolean;
  maxInstallments?: number;
  processingFees?: {
    [key: string]: {
      amount: number;
      type: 'percentage' | 'fixed';
    }
  };
}
