import axios from 'axios';
import config from '../config';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price?: number;
    stock_quantity: number;
    images: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id: number | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface UpdateCartItemData {
  cart_item_id: number;
  quantity: number;
}

/**
 * Cart service for handling cart-related API calls
 */
const cartService = {
  /**
   * Get the current user's cart
   */
  async getCart(): Promise<Cart> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/cart`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    }
  },

  /**
   * Add a product to the cart
   */
  async addToCart(data: AddToCartData): Promise<Cart> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/cart/add`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  },

  /**
   * Update a cart item's quantity
   */
  async updateCartItem(data: UpdateCartItemData): Promise<Cart> {
    try {
      const response = await axios.put(`${config.api.baseUrl}/cart/update`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  },

  /**
   * Remove an item from the cart
   */
  async removeFromCart(cartItemId: number): Promise<Cart> {
    try {
      const response = await axios.delete(`${config.api.baseUrl}/cart/remove`, {
        data: { cart_item_id: cartItemId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  },

  /**
   * Clear all items from the cart
   */
  async clearCart(): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/cart/clear`);
      return response.data;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  },

  /**
   * Apply a coupon code to the cart
   */
  async applyCoupon(code: string): Promise<Cart> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/cart/apply-coupon`, { code });
      return response.data;
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      throw error;
    }
  },

  /**
   * Remove a coupon from the cart
   */
  async removeCoupon(): Promise<Cart> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/cart/remove-coupon`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      throw error;
    }
  },

  /**
   * Get shipping options for the cart
   */
  async getShippingOptions(zipCode: string): Promise<any[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/cart/shipping-options`, {
        params: { zip_code: zipCode }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shipping options:', error);
      throw error;
    }
  },

  /**
   * Set shipping option for the cart
   */
  async setShippingOption(shippingOptionId: number): Promise<Cart> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/cart/set-shipping`, {
        shipping_option_id: shippingOptionId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to set shipping option:', error);
      throw error;
    }
  },

  /**
   * Proceed to checkout
   */
  async checkout(): Promise<{ order_id: number }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/cart/checkout`);
      return response.data;
    } catch (error) {
      console.error('Failed to process checkout:', error);
      throw error;
    }
  }
};

export default cartService;
