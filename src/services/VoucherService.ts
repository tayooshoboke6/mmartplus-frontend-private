import api from './api';
import { Voucher, VoucherType, VoucherStatus } from '../models/Voucher';
import { Customer } from '../models/Customer';

// Response interfaces
export interface VoucherResponse {
  status: string;
  data: Voucher;
  message?: string;
}

export interface VouchersResponse {
  status: string;
  data: Voucher[];
}

export interface CustomersResponse {
  status: string;
  data: Customer[];
}

export interface ApplyVoucherResponse {
  status: string;
  message: string;
  data?: {
    discount_amount: number;
    new_total: number;
  };
}

export interface BulkVoucherResponse {
  status: string;
  message: string;
  data?: {
    voucher_codes: string[];
  };
}

export const VoucherService = {
  // Get all vouchers for the current user
  getVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await api.get<VouchersResponse>('/vouchers');
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return []; // Return empty array as fallback
    }
  },

  // Apply a voucher to an order
  applyVoucher: async (orderId: number, voucherCode: string): Promise<ApplyVoucherResponse> => {
    try {
      const response = await api.post<ApplyVoucherResponse>('/vouchers/apply', {
        order_id: orderId,
        voucher_code: voucherCode
      });
      return response.data;
    } catch (error: any) {
      console.error('Error applying voucher:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to apply voucher'
      };
    }
  },

  // Admin: Create a new voucher
  createVoucher: async (voucherData: any): Promise<VoucherResponse> => {
    try {
      const response = await api.post<VoucherResponse>('/vouchers', voucherData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      return {
        status: 'error',
        data: {} as Voucher,
        message: error.response?.data?.message || 'Failed to create voucher'
      };
    }
  },

  // Admin: Generate bulk vouchers
  generateBulkVouchers: async (data: any): Promise<BulkVoucherResponse> => {
    try {
      const response = await api.post<BulkVoucherResponse>('/vouchers/bulk', data);
      return response.data;
    } catch (error: any) {
      console.error('Error generating bulk vouchers:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to generate vouchers'
      };
    }
  },

  // Admin: Schedule targeted voucher distribution
  scheduleVoucherDistribution: async (data: any): Promise<VoucherResponse> => {
    try {
      const response = await api.post<VoucherResponse>('/vouchers/schedule', data);
      return response.data;
    } catch (error: any) {
      console.error('Error scheduling voucher distribution:', error);
      return {
        status: 'error',
        data: {} as Voucher,
        message: error.response?.data?.message || 'Failed to schedule voucher distribution'
      };
    }
  },

  // Admin: Get voucher usage statistics
  getVoucherStats: async (voucherId: number): Promise<any> => {
    try {
      const response = await api.get(`/vouchers/${voucherId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching voucher stats:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to fetch voucher statistics'
      };
    }
  },

  // Client-side voucher validation (for cart preview)
  validateVoucher: async (code: string, cartTotal: number): Promise<{
    valid: boolean;
    voucher?: Voucher;
    discountAmount?: number;
    errorMessage?: string;
  }> => {
    try {
      // Get all vouchers and find the matching one
      const vouchers = await VoucherService.getVouchers();
      const voucher = vouchers.find(v => v.code === code);
      
      if (!voucher) {
        return {
          valid: false,
          errorMessage: 'Invalid voucher code'
        };
      }
      
      // Check if voucher is active
      if (!voucher.is_active) {
        return {
          valid: false,
          errorMessage: 'This voucher is no longer active'
        };
      }
      
      // Check if voucher is expired
      if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
        return {
          valid: false,
          errorMessage: 'This voucher has expired'
        };
      }
      
      // Check minimum spend
      if (voucher.min_spend && cartTotal < voucher.min_spend) {
        return {
          valid: false,
          errorMessage: `This voucher requires a minimum spend of ₦${voucher.min_spend.toFixed(2)}`
        };
      }
      
      // Calculate discount
      let discountAmount = 0;
      if (voucher.type === 'percentage') {
        discountAmount = cartTotal * (voucher.value / 100);
      } else {
        discountAmount = Math.min(voucher.value, cartTotal); // Don't exceed cart total
      }
      
      return {
        valid: true,
        voucher,
        discountAmount
      };
    } catch (error) {
      console.error('Error validating voucher:', error);
      return {
        valid: false,
        errorMessage: 'An error occurred while validating your voucher'
      };
    }
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getVouchers = VoucherService.getVouchers;
export const applyVoucher = VoucherService.applyVoucher;
export const createVoucher = VoucherService.createVoucher;
export const generateBulkVouchers = VoucherService.generateBulkVouchers;
export const scheduleVoucherDistribution = VoucherService.scheduleVoucherDistribution;
export const getVoucherStats = VoucherService.getVoucherStats;
export const validateVoucher = VoucherService.validateVoucher;
