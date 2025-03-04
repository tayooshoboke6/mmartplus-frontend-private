import api from './api';

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
  payment_method: PaymentMethod;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  shipping_fee: number;
  notes?: string;
  tracking_number?: string;
  expected_delivery_date?: string;
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

export interface SalesStatsResponse {
  daily_sales: Array<{
    date: string;
    amount: number;
  }>;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  low_stock_items: number;
  revenue_change: number;
  orders_change: number;
  new_products_count: number;
  low_stock_change: number;
  recent_orders: OrderSummary[];
}

const orderService = {
  getOrders: async (options: OrderFilterOptions = {}): Promise<GetOrdersResponse> => {
    try {
      const response = await api.get<any>('/orders', { params: options });
      console.log('Orders API response:', response.data);
      
      // Map the Laravel response to our expected format
      if (response.data && response.data.status === 'success' && response.data.data) {
        // The response contains Laravel pagination data
        return {
          orders: response.data.data.data || [], // In Laravel pagination, items are in data.data
          total_count: response.data.data.total || 0
        };
      }
      
      // Fallback for unexpected response format
      return {
        orders: [],
        total_count: 0
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderDetail: async (orderId: number): Promise<GetOrderDetailResponse> => {
    try {
      const response = await api.get<GetOrderDetailResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order #${orderId}:`, error);
      throw error;
    }
  },

  getSalesStats: async (): Promise<SalesStatsResponse> => {
    try {
      const response = await api.get<SalesStatsResponse>('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      throw error;
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order #${orderId}:`, error);
      throw error;
    }
  },

  reorder: async (orderId: number): Promise<{ success: boolean; message: string; cart_id?: number }> => {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      return response.data;
    } catch (error) {
      console.error(`Error reordering order #${orderId}:`, error);
      throw error;
    }
  }
};

export default orderService;
