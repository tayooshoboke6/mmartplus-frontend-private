import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const orders: Order[] = [
  {
    id: '1',
    userId: '2', // Regular user
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Premium Wireless Headphones',
        quantity: 1,
        price: 179.99, // Discounted price
        total: 179.99
      },
      {
        id: '2',
        productId: '4',
        productName: 'Stainless Steel Water Bottle',
        quantity: 2,
        price: 24.99,
        total: 49.98
      }
    ],
    subtotal: 229.97,
    tax: 18.40,
    shipping: 10.00,
    discount: 0,
    total: 258.37,
    status: 'delivered',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
      phone: '555-123-4567'
    },
    createdAt: new Date('2025-02-15').toISOString(),
    updatedAt: new Date('2025-02-18').toISOString()
  },
  {
    id: '2',
    userId: '2', // Regular user
    items: [
      {
        id: '1',
        productId: '3',
        productName: 'Smart Home Hub',
        quantity: 1,
        price: 129.99, // Discounted price
        total: 129.99
      }
    ],
    subtotal: 129.99,
    tax: 10.40,
    shipping: 5.00,
    discount: 0,
    total: 145.39,
    status: 'processing',
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
      phone: '555-123-4567'
    },
    createdAt: new Date('2025-03-05').toISOString(),
    updatedAt: new Date('2025-03-05').toISOString()
  }
];

// Helper functions for order operations
export const getAllOrders = (): Order[] => {
  return [...orders];
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const getUserOrders = (userId: string): Order[] => {
  return orders.filter(order => order.userId === userId);
};

export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const newOrder: Order = {
    ...orderData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = (id: string, status: Order['status']): Order | null => {
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString()
  };
  
  return orders[index];
};

export const updatePaymentStatus = (id: string, paymentStatus: Order['paymentStatus']): Order | null => {
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    paymentStatus,
    updatedAt: new Date().toISOString()
  };
  
  return orders[index];
};
