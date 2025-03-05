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

const orderService = {
  getOrders: async (options: OrderFilterOptions = {}): Promise<GetOrdersResponse> => {
    try {
      // Use the admin orders endpoint for admin users
      const response = await api.get<any>('/admin/orders', { 
        params: {
          status: options.status,
          payment_status: options.paymentStatus,
          from_date: options.startDate,
          to_date: options.endDate,
          page: options.page || 1,
          per_page: options.limit || 10
        } 
      });
      
      console.log('Admin Orders API response:', response.data);
      
      // Map the Laravel response to our expected format
      if (response.data && response.data.status === 'success' && response.data.data) {
        // The response contains Laravel pagination data
        const orders = response.data.data.data || [];
        
        // Transform the response to match our frontend model
        const transformedOrders = orders.map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          customer_name: order.user ? `${order.user.name}` : 'Guest User',
          total: order.total,
          status: order.status,
          items_count: order.items ? order.items.length : 0,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          created_at: order.created_at,
          updated_at: order.updated_at,
          user_id: order.user_id
        }));
        
        return {
          orders: transformedOrders,
          total_count: response.data.data.total || 0
        };
      }
      
      // Fallback for unexpected response format
      return {
        orders: [],
        total_count: 0
      };
    } catch (error) {
      console.error('Error fetching admin orders:', error);
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

  getDashboardStats: async (): Promise<{ status: string; data: DashboardStats }> => {
    try {
      const response = await api.get<{ status: string; data: DashboardStats }>('/admin/dashboard/stats');
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
  },

  updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return {
        success: response.data.status === 'success',
        message: response.data.message || 'Order status updated successfully'
      };
    } catch (error) {
      console.error(`Error updating order #${orderId} status:`, error);
      throw error;
    }
  },
};

export default orderService;
