import axios from 'axios';
import config from '../config';

// Define max number of recently viewed products to store
const MAX_RECENTLY_VIEWED = 20;
const LOCAL_STORAGE_KEY = 'mmartplus_recently_viewed';

export interface RecentlyViewedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  viewedAt: string;
}

interface RecentlyViewedResponse {
  status: string;
  data: RecentlyViewedProduct[];
}

const recentlyViewedService = {
  // Get recently viewed products
  getRecentlyViewed: async (): Promise<RecentlyViewedProduct[]> => {
    try {
      // Try to get from API first
      try {
        const response = await axios.get(`${config.api.baseUrl}/user/recently-viewed`, {
          withCredentials: true // Important for cookies
        });
        if (response.data.status === 'success') {
          // Sort by viewedAt in descending order (newest first)
          return response.data.data
            .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
            .slice(0, MAX_RECENTLY_VIEWED);
        }
      } catch (error) {
        console.log('Using local storage for recently viewed as fallback');
      }

      // Fallback to localStorage for development
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedItems) return [];
      
      const items: RecentlyViewedProduct[] = JSON.parse(storedItems);
      return items
        .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        .slice(0, MAX_RECENTLY_VIEWED);
    } catch (error) {
      console.error('Error fetching recently viewed products:', error);
      return [];
    }
  },

  // Add product to recently viewed
  addToRecentlyViewed: async (product: any): Promise<void> => {
    try {
      // First try API
      try {
        await axios.post(`${config.api.baseUrl}/user/recently-viewed`, 
          { product_id: product.id },
          { withCredentials: true } // Important for cookies
        );
        return;
      } catch (error) {
        console.log('Using local storage for recently viewed as fallback');
      }

      // Fallback to localStorage
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      let recentlyViewed: RecentlyViewedProduct[] = storedItems ? JSON.parse(storedItems) : [];
      
      // Check if product is already in recently viewed
      const existingIndex = recentlyViewed.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        // Update viewedAt time
        recentlyViewed[existingIndex].viewedAt = new Date().toISOString();
      } else {
        // Add new product
        const newItem: RecentlyViewedProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category || 'General',
          rating: product.rating || 0,
          viewedAt: new Date().toISOString()
        };
        
        recentlyViewed.push(newItem);
      }
      
      // Sort by viewedAt in descending order and limit to MAX_RECENTLY_VIEWED
      recentlyViewed = recentlyViewed
        .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        .slice(0, MAX_RECENTLY_VIEWED);
      
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error adding product to recently viewed:', error);
    }
  },

  // Clear recently viewed
  clearRecentlyViewed: async (): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await axios.delete(`${config.api.baseUrl}/user/recently-viewed`, {
          withCredentials: true // Important for cookies
        });
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for recently viewed as fallback');
      }

      // Clear localStorage
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
      return false;
    }
  }
};

export default recentlyViewedService;
