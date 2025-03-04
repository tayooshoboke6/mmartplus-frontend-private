import api from './api';
import { Voucher, VoucherType, VoucherStatus } from '../models/Voucher';
import { Customer } from '../models/Customer';

// Response interfaces
export interface VoucherResponse {
  success: boolean;
  voucher: Voucher;
}

export interface VouchersResponse {
  success: boolean;
  vouchers: Voucher[];
}

export interface CustomersResponse {
  success: boolean;
  customers: Customer[];
}

export const VoucherService = {
  // Get all vouchers
  getVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await api.get<VouchersResponse>('/vouchers');
      return response.data.vouchers;
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get a specific voucher by ID
  getVoucherById: async (id: string): Promise<Voucher | null> => {
    try {
      const response = await api.get<VoucherResponse>(`/vouchers/${id}`);
      return response.data.voucher;
    } catch (error) {
      console.error(`Error fetching voucher #${id}:`, error);
      return null;
    }
  },

  // Create a new voucher
  createVoucher: async (voucherData: Partial<Voucher>): Promise<Voucher> => {
    try {
      const response = await api.post<VoucherResponse>('/vouchers', voucherData);
      return response.data.voucher;
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw error;
    }
  },

  // Update an existing voucher
  updateVoucher: async (id: string, voucherData: Partial<Voucher>): Promise<Voucher> => {
    try {
      const response = await api.put<VoucherResponse>(`/vouchers/${id}`, voucherData);
      return response.data.voucher;
    } catch (error) {
      console.error(`Error updating voucher #${id}:`, error);
      throw error;
    }
  },

  // Delete a voucher
  deleteVoucher: async (id: string): Promise<void> => {
    try {
      await api.delete(`/vouchers/${id}`);
    } catch (error) {
      console.error(`Error deleting voucher #${id}:`, error);
      throw error;
    }
  },

  // Toggle a voucher's status (active/inactive)
  toggleVoucherStatus: async (id: string): Promise<Voucher> => {
    try {
      const response = await api.put<VoucherResponse>(`/vouchers/${id}/toggle-status`);
      return response.data.voucher;
    } catch (error) {
      console.error(`Error toggling voucher #${id} status:`, error);
      throw error;
    }
  },

  // Get all customers for voucher targeting
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<CustomersResponse>('/customers');
      return response.data.customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return []; // Return empty array as fallback
    }
  },

  // Verify voucher code for a customer
  verifyVoucher: async (code: string, options: { customerId?: number, cartTotal?: number } = {}): Promise<{
    valid: boolean;
    voucher?: Voucher;
    discountAmount?: number;
    message?: string;
  }> => {
    try {
      const response = await api.post('/vouchers/verify', {
        code,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying voucher:', error);
      return { valid: false, message: 'Failed to verify voucher. Please try again.' };
    }
  },

  // Send voucher notification
  sendVoucherNotification: async (notification: any): Promise<boolean> => {
    try {
      // In a real application, this would send notifications via the specified channels
      console.log('Sending voucher notification:', notification);
      return true;
    } catch (error) {
      console.error('Error sending voucher notification:', error);
      return false;
    }
  },

  // Validate and apply voucher code
  validateVoucher: async (code: string, cartTotal: number): Promise<{
    valid: boolean;
    voucher?: Voucher;
    discountAmount?: number;
    errorMessage?: string;
  }> => {
    try {
      const voucher = await this.getVoucherById(code);

      if (!voucher) {
        return { 
          valid: false, 
          errorMessage: 'Invalid voucher code or voucher is inactive' 
        };
      }

      // Check if voucher is valid based on dates
      const currentDate = new Date();
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);

      if (currentDate < startDate || currentDate > endDate) {
        return { 
          valid: false, 
          errorMessage: 'Voucher is not valid for current date' 
        };
      }

      // Check minimum purchase requirement
      if (cartTotal < voucher.minPurchase) {
        return { 
          valid: false, 
          errorMessage: `Minimum purchase of ${voucher.minPurchase} required` 
        };
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (voucher.discountType === 'percentage') {
        discountAmount = (cartTotal * voucher.discount) / 100;
        // Apply maximum discount if specified
        if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
          discountAmount = voucher.maxDiscount;
        }
      } else {
        // Fixed discount
        discountAmount = voucher.discount;
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
        errorMessage: 'Failed to validate voucher. Please try again.' 
      };
    }
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getVouchers = VoucherService.getVouchers;
export const getVoucherById = VoucherService.getVoucherById;
export const createVoucher = VoucherService.createVoucher;
export const updateVoucher = VoucherService.updateVoucher;
export const deleteVoucher = VoucherService.deleteVoucher;
export const toggleVoucherStatus = VoucherService.toggleVoucherStatus;
export const getCustomers = VoucherService.getCustomers;
export const verifyVoucher = VoucherService.verifyVoucher;
export const validateVoucher = VoucherService.validateVoucher;

export default VoucherService;
