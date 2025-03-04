import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from './CartContext';
import { PaymentMethod } from '../models/PaymentMethod';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: string;
  deliveryMethod: string;
  reference?: string;
  createdAt: Date;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  getOrderById: (orderId: string) => Order | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    setOrders(prev => [...prev, newOrder]);
    setCurrentOrder(newOrder);

    // Here you would typically make an API call to your backend
    // to create the order in your database

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );

    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, paymentStatus } : order
      )
    );

    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, paymentStatus } : null);
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId) || null;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      createOrder,
      updateOrderStatus,
      updatePaymentStatus,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
