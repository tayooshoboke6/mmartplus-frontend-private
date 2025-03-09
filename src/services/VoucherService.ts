import axios from 'axios';
import config from '../config';

// Voucher models
export interface Voucher {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number;
  usage_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Response interfaces
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface VoucherResponse {
  status: string;
  message?: string;
  data: {
    id: number;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    max_discount_amount: number | null;
    start_date: string;
    end_date: string;
    usage_limit: number;
    usage_count: number;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface VouchersResponse {
  status: string;
  message?: string;
  data: Voucher[];
}

export interface CustomersResponse {
  status: string;
  message?: string;
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

export interface VoucherValidationResponse {
  valid: boolean;
  voucher?: Voucher;
  discount_amount?: number;
  error_message?: string;
}

export interface VoucherStatsResponse {
  status: string;
  message?: string;
  data: {
    redeemed_count: number;
    total_discount_amount: number;
    usage_by_day: { date: string; count: number }[];
  };
}

export const VoucherService = {
  // Get all vouchers (admin)
  getAllVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axios.get<ApiResponse<{ data: Voucher[] }>>(`${config.api.baseUrl}/admin/vouchers`, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        return response.data.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      
      // If in development, use mock data on API failure
      if (import.meta.env.DEV && config.features.useMockData) {
        console.log('Using mock voucher data in development mode');
        return [
          {
            id: 1,
            code: 'WELCOME10',
            description: 'Welcome discount for new users',
            discount_type: 'percentage',
            discount_value: 10,
            min_order_amount: 50,
            max_discount_amount: 20,
            start_date: '2025-03-01',
            end_date: '2025-04-30',
            usage_limit: 100,
            usage_count: 12,
            active: true,
            created_at: '2025-03-01 00:00:00',
            updated_at: '2025-03-01 00:00:00'
          },
          {
            id: 2,
            code: 'FLAT20',
            description: 'Flat $20 off on orders above $200',
            discount_type: 'fixed',
            discount_value: 20,
            min_order_amount: 200,
            max_discount_amount: null,
            start_date: '2025-03-01',
            end_date: '2025-03-15',
            usage_limit: 50,
            usage_count: 5,
            active: true,
            created_at: '2025-03-01 00:00:00',
            updated_at: '2025-03-01 00:00:00'
          }
        ];
      }
      
      return []; // Return empty array as fallback
    }
  },

  // Get all customers for voucher assignment (admin)
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await axios.get<ApiResponse<Customer[]>>(`${config.api.baseUrl}/admin/customers`, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      
      // If in development, use mock data on API failure
      if (import.meta.env.DEV && config.features.useMockData) {
        return [
          { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' }
        ];
      }
      
      return []; // Return empty array as fallback
    }
  },

  // Create a new voucher (admin)
  createVoucher: async (voucherData: {
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    max_discount_amount?: number | null;
    start_date: string;
    end_date: string;
    usage_limit: number;
    active: boolean;
  }): Promise<VoucherResponse> => {
    try {
      const response = await axios.post<VoucherResponse>(`${config.api.baseUrl}/admin/vouchers`, voucherData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to create voucher',
        data: {} as VoucherResponse['data']
      };
    }
  },

  // Update an existing voucher (admin)
  updateVoucher: async (voucherId: number, voucherData: Partial<Voucher>): Promise<VoucherResponse> => {
    try {
      const response = await axios.put<VoucherResponse>(`${config.api.baseUrl}/admin/vouchers/${voucherId}`, voucherData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating voucher:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to update voucher',
        data: {} as VoucherResponse['data']
      };
    }
  },

  // Toggle voucher active status (admin)
  toggleVoucherStatus: async (voucherId: number): Promise<VoucherResponse> => {
    try {
      const response = await axios.put<VoucherResponse>(`${config.api.baseUrl}/admin/vouchers/${voucherId}/toggle-status`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error toggling voucher status:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to toggle voucher status',
        data: {} as VoucherResponse['data']
      };
    }
  },

  // Delete a voucher (admin)
  deleteVoucher: async (voucherId: number): Promise<{ status: string; message: string }> => {
    try {
      const response = await axios.delete(`${config.api.baseUrl}/admin/vouchers/${voucherId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting voucher:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to delete voucher'
      };
    }
  },

  // Generate bulk vouchers (admin)
  generateBulkVouchers: async (data: {
    prefix: string;
    count: number;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    max_discount_amount?: number | null;
    start_date: string;
    end_date: string;
    usage_limit: number;
    active: boolean;
  }): Promise<BulkVoucherResponse> => {
    try {
      const response = await axios.post<BulkVoucherResponse>(`${config.api.baseUrl}/admin/vouchers/bulk`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error generating bulk vouchers:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to generate bulk vouchers'
      };
    }
  },

  // Get voucher statistics (admin)
  getVoucherStats: async (voucherId: number): Promise<VoucherStatsResponse> => {
    try {
      const response = await axios.get<VoucherStatsResponse>(`${config.api.baseUrl}/admin/vouchers/${voucherId}/stats`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching voucher stats:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to fetch voucher statistics',
        data: {
          redeemed_count: 0,
          total_discount_amount: 0,
          usage_by_day: []
        }
      };
    }
  },

  // Validate a voucher code (for the client-side cart preview)
  validateVoucher: async (code: string, cartTotal: number): Promise<VoucherValidationResponse> => {
    try {
      const response = await axios.post<VoucherValidationResponse>(`${config.api.baseUrl}/vouchers/validate`, {
        code,
        cart_total: cartTotal
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error validating voucher:', error);
      
      // If in development, use mock validation
      if (import.meta.env.DEV && config.features.useMockData) {
        if (code === 'WELCOME10' && cartTotal >= 50) {
          const discountAmount = Math.min(cartTotal * 0.1, 20);
          return {
            valid: true,
            voucher: {
              id: 1,
              code: 'WELCOME10',
              description: 'Welcome discount for new users',
              discount_type: 'percentage',
              discount_value: 10,
              min_order_amount: 50,
              max_discount_amount: 20,
              start_date: '2025-03-01',
              end_date: '2025-04-30',
              usage_limit: 100,
              usage_count: 12,
              active: true,
              created_at: '2025-03-01 00:00:00',
              updated_at: '2025-03-01 00:00:00'
            },
            discount_amount: discountAmount
          };
        }
      }
      
      return {
        valid: false,
        error_message: error.response?.data?.message || 'Invalid voucher code'
      };
    }
  },

  // Apply a voucher to an order
  applyVoucher: async (orderId: number, voucherCode: string): Promise<ApplyVoucherResponse> => {
    try {
      const response = await axios.post<ApplyVoucherResponse>(`${config.api.baseUrl}/orders/${orderId}/apply-voucher`, {
        code: voucherCode
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error applying voucher to order:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to apply voucher'
      };
    }
  },

  // Get vouchers for current user
  getUserVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axios.get<ApiResponse<Voucher[]>>(`${config.api.baseUrl}/user/vouchers`, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching user vouchers:', error);
      
      // If in development, use mock data
      if (import.meta.env.DEV && config.features.useMockData) {
        return [
          {
            id: 1,
            code: 'WELCOME10',
            description: 'Welcome discount for new users',
            discount_type: 'percentage',
            discount_value: 10,
            min_order_amount: 50,
            max_discount_amount: 20,
            start_date: '2025-03-01',
            end_date: '2025-04-30',
            usage_limit: 100,
            usage_count: 12,
            active: true,
            created_at: '2025-03-01 00:00:00',
            updated_at: '2025-03-01 00:00:00'
          }
        ];
      }
      
      return []; // Return empty array as fallback
    }
  },

  // Get all available vouchers for the storefront
  getVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axios.get<ApiResponse<Voucher[]>>(`${config.api.baseUrl}/vouchers`, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      
      // If in development, use mock data
      if (import.meta.env.DEV && config.features.useMockData) {
        return [
          {
            id: 1,
            code: 'WELCOME10',
            description: 'Welcome discount for new users',
            discount_type: 'percentage',
            discount_value: 10,
            min_order_amount: 50,
            max_discount_amount: 20,
            start_date: '2025-03-01',
            end_date: '2025-04-30',
            usage_limit: 100,
            usage_count: 12,
            active: true,
            created_at: '2025-03-01 00:00:00',
            updated_at: '2025-03-01 00:00:00'
          },
          {
            id: 2,
            code: 'FLAT20',
            description: 'Flat $20 off on orders above $200',
            discount_type: 'fixed',
            discount_value: 20,
            min_order_amount: 200,
            max_discount_amount: null,
            start_date: '2025-03-01',
            end_date: '2025-03-15',
            usage_limit: 50,
            usage_count: 5,
            active: true,
            created_at: '2025-03-01 00:00:00',
            updated_at: '2025-03-01 00:00:00'
          }
        ];
      }
      
      return []; // Return empty array as fallback
    }
  },

  // Preview targeted users for vouchers based on segment
  previewTargetedUsers: async (segmentData: {
    segment_type: string;
    segment_options: {
      newUserDays?: number;
      inactiveDays?: number;
      orderCount?: number;
      loyaltyPeriod?: number;
      minSpend?: string;
      spendPeriod?: number;
      abandonedDays?: number;
      categoryIds?: number[];
      categoryPurchasePeriod?: number;
      birthdayMonth?: number;
      [key: string]: any;
    };
  }): Promise<{
    status: string;
    message?: string;
    data: {
      users: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        last_order_date?: string;
        total_orders?: number;
        total_spent?: number;
      }[];
      total_count: number;
    };
  }> => {
    try {
      const response = await axios.post(`${config.api.baseUrl}/admin/vouchers/preview-targeted-users`, segmentData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error previewing targeted users:', error);
      
      // If in development, return mock data
      if (import.meta.env.DEV && config.features.useMockData) {
        return {
          status: 'success',
          data: {
            users: [
              {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                last_order_date: '2025-02-15',
                total_orders: 5,
                total_spent: 350
              },
              {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+0987654321',
                last_order_date: '2025-02-10',
                total_orders: 3,
                total_spent: 210
              }
            ],
            total_count: 2
          }
        };
      }
      
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to preview targeted users',
        data: {
          users: [],
          total_count: 0
        }
      };
    }
  },

  // Create targeted voucher campaign
  createTargetedVoucherCampaign: async (campaignData: {
    segment_type: string;
    segment_options: any;
    voucher_config: {
      prefix: string;
      type: 'percentage' | 'fixed';
      value: number;
      min_spend: number;
      expires_at: string | null;
      max_usage_per_user: number;
      max_total_usage: number | null;
      description: string;
      is_active: boolean;
    };
    distribution: {
      method: 'email' | 'sms' | 'app';
      emailTemplate?: string;
      emailSubject?: string;
      notifyUsers: boolean;
      scheduleDelivery: boolean;
      deliveryDate?: Date;
    };
  }): Promise<{
    status: string;
    message: string;
    data?: {
      campaign_id: number;
      vouchers_created: number;
      notifications_queued?: number;
    };
  }> => {
    try {
      const response = await axios.post(`${config.api.baseUrl}/admin/vouchers/targeted-campaign`, campaignData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating targeted voucher campaign:', error);
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to create targeted voucher campaign'
      };
    }
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getAllVouchers = VoucherService.getAllVouchers;
export const getCustomers = VoucherService.getCustomers;
export const createVoucher = VoucherService.createVoucher;
export const updateVoucher = VoucherService.updateVoucher;
export const toggleVoucherStatus = VoucherService.toggleVoucherStatus;
export const deleteVoucher = VoucherService.deleteVoucher;
export const generateBulkVouchers = VoucherService.generateBulkVouchers;
export const getVoucherStats = VoucherService.getVoucherStats;
export const validateVoucher = VoucherService.validateVoucher;
export const applyVoucher = VoucherService.applyVoucher;
export const getUserVouchers = VoucherService.getUserVouchers;
export const getVouchers = VoucherService.getVouchers;
export const previewTargetedUsers = VoucherService.previewTargetedUsers;
export const createTargetedVoucherCampaign = VoucherService.createTargetedVoucherCampaign;

export default VoucherService;
