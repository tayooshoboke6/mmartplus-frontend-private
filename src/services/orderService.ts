import axios from 'axios';
import config from '../config';

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
  /**
   * Get orders with optional filtering
   */
  async getOrders(options: OrderFilterOptions = {}): Promise<GetOrdersResponse> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/orders`, { 
        params: options 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  /**
   * Get order details by ID
   */
  async getOrderDetail(orderId: number): Promise<GetOrderDetailResponse> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch order details for order ID ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ status: string; data: DashboardStats }> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel order ID ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Reorder items from a previous order
   */
  async reorder(orderId: number): Promise<{ success: boolean; message: string; cart_id?: number }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/orders/${orderId}/reorder`);
      return response.data;
    } catch (error) {
      console.error(`Failed to reorder items from order ID ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.put(`${config.api.baseUrl}/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Failed to update status for order ID ${orderId}:`, error);
      throw error;
    }
  }
};

export default orderService;
