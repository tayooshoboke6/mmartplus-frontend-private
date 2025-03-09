// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id: number | null;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  images: string[];
  category_id: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: string[];
  attributes?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ProductFilter {
  category_id?: number;
  category_slug?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  per_page?: number;
  tags?: string[];
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  category_id: number;
  images?: File[];
  tags?: string[];
  attributes?: Record<string, string>;
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  id: number;
}

import axios from 'axios';
import config from '../config';

/**
 * Product service for handling product-related API calls
 */
const productService = {
  /**
   * Get a list of products with optional filtering
   */
  async getProducts(filters: ProductFilter = {}): Promise<ProductListResponse> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product with slug "${slug}":`, error);
      throw error;
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/featured`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  },

  /**
   * Get new arrivals
   */
  async getNewArrivals(): Promise<Product[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/new-arrivals`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch new arrivals:', error);
      throw error;
    }
  },

  /**
   * Get best sellers
   */
  async getBestSellers(): Promise<Product[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/best-sellers`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch best sellers:', error);
      throw error;
    }
  },

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<ProductListResponse> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData: ProductCreateData): Promise<Product> {
    try {
      // If there are images, use FormData
      if (productData.images && productData.images.length > 0) {
        const formData = new FormData();
        
        // Add all product data to FormData
        Object.entries(productData).forEach(([key, value]) => {
          if (key === 'images') {
            // Add each image file
            productData.images?.forEach((image, index) => {
              formData.append(`images[${index}]`, image);
            });
          } else if (key === 'tags' && Array.isArray(value)) {
            // Add tags as JSON string
            formData.append('tags', JSON.stringify(value));
          } else if (key === 'attributes' && typeof value === 'object') {
            // Add attributes as JSON string
            formData.append('attributes', JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });
        
        const response = await axios.post(`${config.api.baseUrl}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      }
      
      // If no images, use regular POST
      const response = await axios.post(`${config.api.baseUrl}/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(productData: ProductUpdateData): Promise<Product> {
    try {
      const { id, ...updateData } = productData;
      
      // If there are images, use FormData
      if (updateData.images && updateData.images.length > 0) {
        const formData = new FormData();
        
        // Add all product data to FormData
        Object.entries(updateData).forEach(([key, value]) => {
          if (key === 'images') {
            // Add each image file
            updateData.images?.forEach((image, index) => {
              formData.append(`images[${index}]`, image);
            });
          } else if (key === 'tags' && Array.isArray(value)) {
            // Add tags as JSON string
            formData.append('tags', JSON.stringify(value));
          } else if (key === 'attributes' && typeof value === 'object') {
            // Add attributes as JSON string
            formData.append('attributes', JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        });
        
        const response = await axios.post(`${config.api.baseUrl}/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      }
      
      // If no images, use regular PUT
      const response = await axios.put(`${config.api.baseUrl}/products/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`${config.api.baseUrl}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get product reviews
   */
  async getProductReviews(productId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch reviews for product ID ${productId}:`, error);
      throw error;
    }
  }
};

export default productService;
