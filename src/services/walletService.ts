import api from './api';

export interface WalletData {
  balance: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
}

export interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string;
}

export interface GenerateAccountResponse {
  success: boolean;
  data?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  };
  message?: string;
}

const walletService = {
  /**
   * Get wallet balance and details
   */
  getWalletDetails: async (): Promise<WalletData> => {
    try {
      const response = await api.get('/wallet');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate a virtual account for the user
   */
  generateVirtualAccount: async (): Promise<GenerateAccountResponse> => {
    try {
      const response = await api.post('/wallet/generate-account');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction history
   */
  getTransactions: async (page = 1, limit = 10): Promise<Transaction[]> => {
    try {
      const response = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
      return response.data.transactions;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify a payment
   */
  verifyPayment: async (reference: string): Promise<any> => {
    try {
      const response = await api.post('/wallet/verify-payment', { reference });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Withdraw from wallet
   */
  withdraw: async (amount: number, bankAccount: string, bankCode: string): Promise<any> => {
    try {
      const response = await api.post('/wallet/withdraw', { amount, bankAccount, bankCode });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default walletService;
