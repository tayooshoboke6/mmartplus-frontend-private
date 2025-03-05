import api from './api';
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
      const response = await api.get<ApiResponse<{ data: Voucher[] }>>('/admin/vouchers');
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
      const response = await api.get<ApiResponse<Customer[]>>('/admin/customers');
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
      const response = await api.post<VoucherResponse>('/admin/vouchers', voucherData);
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
      const response = await api.put<VoucherResponse>(`/admin/vouchers/${voucherId}`, voucherData);
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
      const response = await api.put<VoucherResponse>(`/admin/vouchers/${voucherId}/toggle-status`);
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
      const response = await api.delete(`/admin/vouchers/${voucherId}`);
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
      const response = await api.post<BulkVoucherResponse>('/admin/vouchers/bulk', data);
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
      const response = await api.get<VoucherStatsResponse>(`/admin/vouchers/${voucherId}/stats`);
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
      const response = await api.post<ApiResponse<{
        valid: boolean;
        discount_amount?: number;
        error_message?: string;
      }>>('/vouchers/validate', {
        code,
        cart_total: cartTotal
      });
      
      if (response.data.status === 'success') {
        return {
          valid: response.data.data.valid,
          discount_amount: response.data.data.discount_amount,
          error_message: response.data.data.error_message
        };
      }
      
      return {
        valid: false,
        error_message: response.data.message || 'Voucher validation failed'
      };
    } catch (error: any) {
      console.error('Error validating voucher:', error);
      
      // If in development, use mock validation
      if (import.meta.env.DEV && config.features.useMockData) {
        if (code === 'WELCOME10' && cartTotal >= 50) {
          return {
            valid: true,
            discount_amount: Math.min(cartTotal * 0.1, 20)
          };
        } else if (code === 'FLAT20' && cartTotal >= 200) {
          return {
            valid: true,
            discount_amount: 20
          };
        }
      }
      
      return {
        valid: false,
        error_message: error.response?.data?.message || 'Failed to validate voucher'
      };
    }
  },

  // Apply a voucher to an order
  applyVoucher: async (orderId: number, voucherCode: string): Promise<ApplyVoucherResponse> => {
    try {
      const response = await api.post<ApplyVoucherResponse>('/orders/apply-voucher', {
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

  // Get vouchers for current user
  getUserVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await api.get<ApiResponse<Voucher[]>>('/user/vouchers');
      if (response.data.status === 'success') {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching user vouchers:', error);
      
      // If in development, use mock data on API failure
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
      const response = await api.get<ApiResponse<Voucher[]>>('/vouchers');
      if (response.data.status === 'success') {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching available vouchers:', error);
      
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
      const response = await api.post<{
        status: string;
        message?: string;
        data: {
          users: any[];
          total_count: number;
        };
      }>('/admin/vouchers/preview-targeted-users', segmentData);
      
      return response.data;
    } catch (error) {
      console.error('Error previewing targeted users:', error);
      
      // If in development, use mock data on API failure
      if (import.meta.env.DEV && config.features.useMockData) {
        console.log('Using mock user preview data in development mode');
        
        // Generate different mock responses based on segment type
        let mockUsers: any[] = [];
        let totalCount = 0;
        
        switch (segmentData.segment_type) {
          case 'all_users':
            mockUsers = [
              { id: 1, name: 'John Doe', email: 'john@example.com', total_orders: 5, total_spent: 25000 },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', total_orders: 3, total_spent: 15000 }
            ];
            totalCount = 120;
            break;
          case 'new_users':
            mockUsers = [
              { id: 3, name: 'Alex Johnson', email: 'alex@example.com', total_orders: 1, total_spent: 5000 },
              { id: 4, name: 'Sam Wilson', email: 'sam@example.com', total_orders: 1, total_spent: 7500 }
            ];
            totalCount = 35;
            break;
          case 'inactive_users':
            mockUsers = [
              { id: 5, name: 'Mike Brown', email: 'mike@example.com', last_order_date: '2024-11-15', total_orders: 2 },
              { id: 6, name: 'Sarah Lee', email: 'sarah@example.com', last_order_date: '2024-10-22', total_orders: 4 }
            ];
            totalCount = 42;
            break;
          case 'high_value':
            mockUsers = [
              { id: 7, name: 'Robert James', email: 'robert@example.com', total_orders: 12, total_spent: 150000 },
              { id: 8, name: 'Emma Watson', email: 'emma@example.com', total_orders: 8, total_spent: 120000 }
            ];
            totalCount = 18;
            break;
          default:
            mockUsers = [
              { id: 9, name: 'Test User 1', email: 'test1@example.com' },
              { id: 10, name: 'Test User 2', email: 'test2@example.com' }
            ];
            totalCount = 10;
        }
        
        return {
          status: 'success',
          data: {
            users: mockUsers,
            total_count: totalCount
          }
        };
      }
      
      // Return empty data with error message as fallback
      return {
        status: 'error',
        message: 'Failed to preview targeted users',
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
      const response = await api.post<{
        status: string;
        message: string;
        data: {
          campaign_id: number;
          vouchers_created: number;
          notifications_queued?: number;
        };
      }>('/admin/vouchers/create-targeted-campaign', campaignData);
      
      return response.data;
    } catch (error) {
      console.error('Error creating targeted voucher campaign:', error);
      
      // If in development, use mock success response on API failure
      if (import.meta.env.DEV && config.features.useMockData) {
        console.log('Using mock response for targeted voucher campaign in development mode');
        
        // Simulate distribution method affecting notification count
        const notificationsQueued = campaignData.distribution.notifyUsers
          ? (campaignData.segment_type === 'all_users' ? 120 : 
             campaignData.segment_type === 'new_users' ? 35 : 
             campaignData.segment_type === 'inactive_users' ? 42 : 
             campaignData.segment_type === 'high_value' ? 18 : 10)
          : 0;
        
        return {
          status: 'success',
          message: 'Targeted voucher campaign created successfully',
          data: {
            campaign_id: Math.floor(Math.random() * 1000) + 1,
            vouchers_created: notificationsQueued,
            notifications_queued: campaignData.distribution.notifyUsers ? notificationsQueued : undefined
          }
        };
      }
      
      // Return error response as fallback
      return {
        status: 'error',
        message: 'Failed to create targeted voucher campaign'
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
