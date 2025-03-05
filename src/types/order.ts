// Order type definitions

// Dashboard statistics interface
export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  order_count: number;
  total_customers: number;
  new_customers: number;
  pending_orders: number;
  orders_by_status: Array<{
    status: string;
    count: number;
  }>;
  recent_orders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  popular_products: Array<{
    id: number;
    name: string;
    total_quantity_sold: number;
  }>;
  low_stock_products: Array<{
    id: number;
    name: string;
    stock: number;
  }>;
  sales_by_day: Array<{
    date: string;
    total_sales: number;
  }>;
  daily_sales: Array<{
    date: string;
    total_sales: number;
  }>;
  sales_by_category: Array<{
    category: string;
    total_sales: number;
  }>;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed'
}

// Order item interface
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  total: number;
}

// Order interface
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount: number;
  status: OrderStatus;
  payment_status: string;
  payment_method: string;
  notes?: string;
  shipping_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}
