import api from './api';
import { AxiosResponse } from 'axios';

// Types for wishlist items
export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  inStock: boolean;
  dateAdded: string;
}

interface WishlistResponse {
  status: string;
  data: WishlistItem[];
}

// For development testing - will be removed when backend is ready
const LOCAL_STORAGE_KEY = 'mmartplus_wishlist';

const wishlistService = {
  // Get all wishlist items for the current user
  getWishlistItems: async (): Promise<WishlistItem[]> => {
    try {
      // Try to get from API first
      try {
        const response = await api.get<WishlistResponse>('/wishlist');
        if (response.data.status === 'success') {
          return response.data.data;
        }
      } catch (error) {
        console.log('Using local storage for wishlist as fallback');
      }

      // Fallback to localStorage for development
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      return [];
    }
  },

  // Add a product to wishlist
  addToWishlist: async (product: any): Promise<WishlistItem | null> => {
    try {
      // Try API first
      try {
        const response = await api.post<{ status: string; data: WishlistItem }>('/wishlist', { 
          product_id: product.id 
        });
        if (response.data.status === 'success') {
          return response.data.data;
        }
      } catch (error) {
        console.log('Using local storage for wishlist as fallback');
      }

      // Fallback to localStorage for development
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      const wishlistItems: WishlistItem[] = storedItems ? JSON.parse(storedItems) : [];
      
      // Check if product is already in wishlist
      if (wishlistItems.some(item => item.productId === product.id)) {
        return null;
      }
      
      const newItem: WishlistItem = {
        id: Date.now(), // Generate a temporary ID
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        rating: product.rating || 0,
        inStock: product.in_stock || true,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      
      wishlistItems.push(newItem);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
      return newItem;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      return null;
    }
  },

  // Remove a product from wishlist
  removeFromWishlist: async (id: number): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await api.delete(`/wishlist/${id}`);
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for wishlist as fallback');
      }

      // Fallback to localStorage for development
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedItems) return false;
      
      const wishlistItems: WishlistItem[] = JSON.parse(storedItems);
      const updatedItems = wishlistItems.filter(item => item.id !== id);
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return false;
    }
  },

  // Clear the entire wishlist
  clearWishlist: async (): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await api.delete('/wishlist');
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for wishlist as fallback');
      }

      // Fallback to localStorage for development
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  },

  // Check if a product is in wishlist
  isInWishlist: async (productId: number): Promise<boolean> => {
    const wishlistItems = await wishlistService.getWishlistItems();
    return wishlistItems.some(item => item.productId === productId);
  }
};

export default wishlistService;
