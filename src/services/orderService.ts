import api from './api';
import { getCsrfCookie } from '../utils/authUtils';

// Order status enum definition
export enum OrderStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Export the enum as a value for runtime usage
export const OrderStatus = OrderStatusEnum;

// Define the type using the enum values
export type OrderStatus = OrderStatusEnum.PENDING | 
  OrderStatusEnum.PROCESSING | 
  OrderStatusEnum.SHIPPED | 
  OrderStatusEnum.DELIVERED | 
  OrderStatusEnum.CANCELLED | 
  OrderStatusEnum.COMPLETED;

// Payment method enum
export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

// Order item interface
export interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// Order interface
export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  total: number;
  shipping_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: PaymentMethod;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// Order summary for list view
export interface OrderSummary {
  id: number;
  order_number: string;
  customer_name?: string;
  total: number;
  status: OrderStatus;
  items_count?: number;
  items?: OrderItem[];
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at?: string;
  user_id?: number;
}

// Order filter options
export interface OrderFilterOptions {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'total';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  paymentStatus?: string;
}

// Response interfaces
export interface GetOrdersResponse {
  orders: OrderSummary[];
  total_count: number;
}

export interface GetOrderDetailResponse {
  success: boolean;
  order: Order;
}

// Dashboard stats interface
export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  order_count: number;
  pending_orders: number;
  total_customers: number;
  new_customers: number;
  orders_by_status: Array<{ status: string; count: number }>;
  recent_orders: OrderSummary[];
  popular_products: Array<{ id: number; name: string; total_quantity_sold: number }>;
  low_stock_products: Array<{ id: number; name: string; stock: number }>;
  sales_by_day: Array<{ date: string; total_sales: number }>;
  daily_sales: Array<{ date: string; total_sales: number }>;
  sales_by_category: Array<{ category: string; total_sales: number }>;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

// Helper function to ensure authentication token is available before making requests
const ensureAuthenticated = async () => {
  // Get CSRF cookie if needed
  await getCsrfCookie();
  
  // Get authentication token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required. Please log in to view orders.');
  }
  
  return token;
};

const orderService = {
  // Get orders with pagination and filtering
  async getOrders(options: OrderFilterOptions = {}): Promise<GetOrdersResponse> {
    try {
      // Ensure we have authentication before proceeding
      await ensureAuthenticated();
      
      // Construct query parameters
      const params = new URLSearchParams();
      
      if (options.status) {
        params.append('status', options.status);
      }
      
      if (options.startDate) {
        params.append('start_date', options.startDate);
      }
      
      if (options.endDate) {
        params.append('end_date', options.endDate);
      }
      
      if (options.sortBy) {
        params.append('sort_by', options.sortBy);
      }
      
      if (options.sortOrder) {
        params.append('sort_order', options.sortOrder);
      }
      
      if (options.paymentStatus) {
        params.append('payment_status', options.paymentStatus);
      }
      
      // Default pagination to page 1 with 10 items per page if not specified
      const page = options.page || 1;
      const limit = options.limit || 10;
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      // Clear any cached responses for orders
      if (typeof api.clearApiCache === 'function') {
        api.clearApiCache(/\/orders/);
      }
      
      const response = await api.get('/orders', { 
        params,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      return {
        orders: response.data.data || [],
        total_count: response.data.meta?.total || 0
      };
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      
      // If authentication error, redirect to login
      if (error.response?.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
      
      return {
        orders: [],
        total_count: 0
      };
    }
  },
  
  // Get single order details
  async getOrderDetail(orderId: number): Promise<GetOrderDetailResponse> {
    try {
      // Ensure we have authentication before proceeding
      await ensureAuthenticated();
      
      const response = await api.get(`/orders/${orderId}`);
      return {
        success: true,
        order: response.data.data
      };
    } catch (error) {
      console.error(`Failed to fetch order #${orderId}:`, error);
      throw error;
    }
  },
  
  // Get dashboard statistics
  async getDashboardStats(): Promise<{ status: string; data: DashboardStats }> {
    try {
      // Ensure we have authentication before proceeding
      await ensureAuthenticated();
      
      const response = await api.get('/dashboard/stats');
      return {
        status: 'success',
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },
  
  // Cancel an order
  async cancelOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    try {
      // Ensure we have authentication before proceeding
      await ensureAuthenticated();
      
      const response = await api.post(`/orders/${orderId}/cancel`);
      return {
        success: true,
        message: response.data.message || 'Order cancelled successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order'
      };
    }
  },
  
  // Reorder - add all items from an order to cart
  async reorder(orderId: number): Promise<{ success: boolean; message: string; cart_id?: number }> {
    try {
      // Ensure we have authentication before proceeding
      await ensureAuthenticated();
      
      const response = await api.post(`/orders/${orderId}/reorder`);
      return {
        success: true,
        message: response.data.message || 'Items added to cart',
        cart_id: response.data.cart_id
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reorder'
      };
    }
  },
  
  // Update order status (admin only)
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<{ success: boolean; message: string }> {
    try {
      // Ensure we have authentication before proceeding
      await ensureAuthenticated();
      
      const response = await api.patch(`/orders/${orderId}/status`, {
        status
      });
      
      return {
        success: true,
        message: response.data.message || `Order status updated to ${status}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  }
};

export default orderService;
