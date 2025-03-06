import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Define types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  specifications?: { name: string; value: string }[];
  metadata?: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  buyNow: (item: CartItem) => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('mmartCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('mmartCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mmartCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check for pending cart items after login
  useEffect(() => {
    // Check if there's a pending cart item and if the user is now authenticated
    if (isAuthenticated) {
      const pendingItem = localStorage.getItem('pendingCartItem');
      if (pendingItem) {
        try {
          const item = JSON.parse(pendingItem);
          // Add the pending item to cart
          setCartItems(prevItems => {
            // Check if item already exists in cart
            const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
            
            if (existingItemIndex >= 0) {
              // Update existing item
              const updatedItems = [...prevItems];
              updatedItems[existingItemIndex].quantity += item.quantity;
              return updatedItems;
            } else {
              // Add new item
              return [...prevItems, item];
            }
          });

          // Remove the pending item from localStorage
          localStorage.removeItem('pendingCartItem');
          
          // Navigate to cart page
          navigate('/cart');
        } catch (error) {
          console.error('Failed to parse pending cart item:', error);
          localStorage.removeItem('pendingCartItem');
        }
      }
    }
  }, [isAuthenticated, navigate]);

  // Add item to cart
  const addItem = (item: CartItem) => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      // Save this item temporarily in localStorage so we can add it after login
      localStorage.setItem('pendingCartItem', JSON.stringify(item));
      // Redirect to login page
      navigate('/login?redirect=cart');
      return;
    }

    // User is authenticated, proceed with adding item to cart
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mmartCart');
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Buy now function - add to cart and navigate to cart page
  const buyNow = (item: CartItem) => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      // Save this item temporarily in localStorage so we can add it after login
      localStorage.setItem('pendingCartItem', JSON.stringify(item));
      // Redirect to login page
      navigate('/login?redirect=cart');
      return;
    }

    // User is authenticated, proceed with adding item to cart
    addItem(item);
    navigate('/cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addItem,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      buyNow
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
