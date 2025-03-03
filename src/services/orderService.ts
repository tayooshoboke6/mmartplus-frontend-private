import api from './api';

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

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
  status: OrderStatus;
  total: number;
  items_count: number;
  payment_method: PaymentMethod;
  created_at: string;
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
  success: boolean;
  orders: OrderSummary[];
  total_count: number;
  page: number;
  limit: number;
}

export interface GetOrderDetailResponse {
  success: boolean;
  order: Order;
}

// Order service class
class OrderService {
  // Get all orders with filtering and pagination
  async getOrders(options: OrderFilterOptions = {}): Promise<GetOrdersResponse> {
    try {
      const response = await api.get<GetOrdersResponse>('/orders', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get single order details
  async getOrderDetail(orderId: number): Promise<GetOrderDetailResponse> {
    try {
      const response = await api.get<GetOrderDetailResponse>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order #${orderId}:`, error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId: number, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order #${orderId}:`, error);
      throw error;
    }
  }

  // Reorder (add all items from an order to cart)
  async reorder(orderId: number): Promise<{ success: boolean; message: string; cart_id?: number }> {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      return response.data;
    } catch (error) {
      console.error(`Error reordering order #${orderId}:`, error);
      throw error;
    }
  }

  // Mock data for testing - remove in production
  getMockOrders(): GetOrdersResponse {
    const mockOrders: OrderSummary[] = [
      {
        id: 1001,
        order_number: 'ORD-10001-2025',
        status: OrderStatus.DELIVERED,
        total: 12850.00,
        items_count: 5,
        payment_method: PaymentMethod.CARD,
        created_at: '2025-02-25T15:30:22Z'
      },
      {
        id: 1002,
        order_number: 'ORD-10002-2025',
        status: OrderStatus.SHIPPED,
        total: 7650.50,
        items_count: 3,
        payment_method: PaymentMethod.BANK_TRANSFER,
        created_at: '2025-02-28T09:15:45Z'
      },
      {
        id: 1003,
        order_number: 'ORD-10003-2025',
        status: OrderStatus.PROCESSING,
        total: 4200.75,
        items_count: 2,
        payment_method: PaymentMethod.CASH_ON_DELIVERY,
        created_at: '2025-03-01T18:22:10Z'
      }
    ];

    return {
      success: true,
      orders: mockOrders,
      total_count: mockOrders.length,
      page: 1,
      limit: 10
    };
  }

  // Get mock order detail
  getMockOrderDetail(orderId: number): GetOrderDetailResponse {
    const mockItems: OrderItem[] = [
      {
        id: 1,
        product_id: 101,
        order_id: orderId,
        product_name: 'Premium Rice (5kg)',
        product_image: '/images/products/rice.jpg',
        quantity: 2,
        price: 3500.00,
        subtotal: 7000.00,
        created_at: '2025-02-28T09:15:45Z',
        updated_at: '2025-02-28T09:15:45Z'
      },
      {
        id: 2,
        product_id: 203,
        order_id: orderId,
        product_name: 'Fresh Tomatoes (1kg)',
        product_image: '/images/products/tomatoes.jpg',
        quantity: 1,
        price: 1200.50,
        subtotal: 1200.50,
        created_at: '2025-02-28T09:15:45Z',
        updated_at: '2025-02-28T09:15:45Z'
      },
      {
        id: 3,
        product_id: 305,
        order_id: orderId,
        product_name: 'Vegetable Oil (2L)',
        product_image: '/images/products/vegetable-oil.jpg',
        quantity: 1,
        price: 2950.00,
        subtotal: 2950.00,
        created_at: '2025-02-28T09:15:45Z',
        updated_at: '2025-02-28T09:15:45Z'
      }
    ];

    const mockOrder: Order = {
      id: orderId,
      user_id: 123,
      order_number: `ORD-1000${orderId}-2025`,
      status: OrderStatus.SHIPPED,
      total: 11150.50,
      payment_method: PaymentMethod.CARD,
      shipping_address: {
        address: '123 Main Street',
        city: 'Lagos',
        state: 'Lagos State',
        postal_code: '100001',
        country: 'Nigeria'
      },
      shipping_fee: 500.00,
      tracking_number: 'TRK123456789NG',
      expected_delivery_date: '2025-03-05',
      items: mockItems,
      created_at: '2025-02-28T09:15:45Z',
      updated_at: '2025-02-28T10:30:22Z'
    };

    return {
      success: true,
      order: mockOrder
    };
  }
}

export default new OrderService();
