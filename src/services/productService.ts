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
  rating?: number;
  review_count?: number;
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
import { ApiResponse } from '../utils/apiClient';
import apiService from './apiService';
import { products, getFeaturedProducts, getNewArrivals, getBestSellers, getProductById, getProductBySlug, getProductsByCategory, getProductsByCategorySlug, searchProducts as searchLocalProducts } from '../data/products';

/**
 * Product service for handling product-related API calls
 * Falls back to local data if API calls fail
 */
const productService = {
  /**
   * Get a list of products with optional filtering
   */
  async getProducts(filters: ProductFilter = {}): Promise<ProductListResponse> {
    try {
      const response = await apiService.get<ProductListResponse>('/products', filters);
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error?.message || 'Failed to fetch products');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      
      // Filter local products based on the filters
      let filteredProducts = [...products];
      
      if (filters.category_id) {
        filteredProducts = filteredProducts.filter(p => p.category_id === filters.category_id);
      }
      
      if (filters.category_slug) {
        filteredProducts = getProductsByCategorySlug(filters.category_slug);
      }
      
      if (filters.min_price) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.min_price!);
      }
      
      if (filters.max_price) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.max_price!);
      }
      
      if (filters.search) {
        filteredProducts = searchLocalProducts(filters.search);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          p.tags && filters.tags!.some(tag => p.tags!.includes(tag))
        );
      }
      
      // Sort products
      if (filters.sort_by) {
        switch (filters.sort_by) {
          case 'price_asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            filteredProducts.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
          case 'popular':
            filteredProducts.sort((a, b) => 
              (b.rating || 0) - (a.rating || 0) || 
              (b.review_count || 0) - (a.review_count || 0)
            );
            break;
        }
      }
      
      // Pagination
      const page = filters.page || 1;
      const perPage = filters.per_page || 12;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      // Create a response that matches the API response structure
      const mockResponse: ProductListResponse = {
        data: paginatedProducts,
        meta: {
          current_page: page,
          from: startIndex + 1,
          last_page: Math.ceil(filteredProducts.length / perPage),
          path: '/products',
          per_page: perPage,
          to: Math.min(endIndex, filteredProducts.length),
          total: filteredProducts.length
        }
      };
      
      return mockResponse;
    }
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiService.get<Product>(`/products/${id}`);
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error?.message || 'Failed to fetch product');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      const product = getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }
  },

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await apiService.get<Product>(`/products/slug/${slug}`);
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error?.message || 'Failed to fetch product');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      const product = getProductBySlug(slug);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await apiService.get<ProductListResponse>('/products/featured');
      if (response.success) {
        return response.data!.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch featured products');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      return getFeaturedProducts();
    }
  },

  /**
   * Get new arrivals
   */
  async getNewArrivals(): Promise<Product[]> {
    try {
      const response = await apiService.get<ProductListResponse>('/products/new-arrivals');
      if (response.success) {
        return response.data!.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch new arrivals');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      return getNewArrivals();
    }
  },

  /**
   * Get best sellers
   */
  async getBestSellers(): Promise<Product[]> {
    try {
      const response = await apiService.get<ProductListResponse>('/products/best-sellers');
      if (response.success) {
        return response.data!.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch best sellers');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      return getBestSellers();
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const response = await apiService.get<ProductListResponse>('/products', { category_id: categoryId });
      if (response.success) {
        return response.data!.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch products by category');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      return getProductsByCategory(categoryId);
    }
  },

  /**
   * Get products by category slug
   */
  async getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
    try {
      const response = await apiService.get<ProductListResponse>('/products', { category_slug: categorySlug });
      if (response.success) {
        return response.data!.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch products by category slug');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      return getProductsByCategorySlug(categorySlug);
    }
  },

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<ProductListResponse> {
    try {
      const response = await apiService.get<ProductListResponse>('/products/search', { query });
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error?.message || 'Failed to search products');
    } catch (error) {
      console.warn('API call failed, using local data:', error);
      const searchResults = searchLocalProducts(query);
      
      // Create a response that matches the API response structure
      const mockResponse: ProductListResponse = {
        data: searchResults,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          path: '/products/search',
          per_page: searchResults.length,
          to: searchResults.length,
          total: searchResults.length
        }
      };
      
      return mockResponse;
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData: ProductCreateData): Promise<Product> {
    try {
      // If there are images, we need to handle file uploads
      if (productData.images && productData.images.length > 0) {
        const formData = new FormData();
        
        // Add all non-file fields to the form data
        Object.entries(productData).forEach(([key, value]) => {
          if (key !== 'images') {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        
        // Add each image file to the form data
        productData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
        
        const response = await apiService.post<Product>('/products', formData, 'Failed to create product', true);
        if (response.success) {
          return response.data!;
        }
        throw new Error(response.error?.message || 'Failed to create product');
      } else {
        // No images, just send the data as JSON
        const response = await apiService.post<Product>('/products', productData, 'Failed to create product');
        if (response.success) {
          return response.data!;
        }
        throw new Error(response.error?.message || 'Failed to create product');
      }
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
      
      // If there are images, we need to handle file uploads
      if (updateData.images && updateData.images.length > 0) {
        const formData = new FormData();
        
        // Add all non-file fields to the form data
        Object.entries(updateData).forEach(([key, value]) => {
          if (key !== 'images') {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        
        // Add each image file to the form data
        updateData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
        
        // Use PUT method for update
        const response = await apiService.put<Product>(`/products/${id}`, formData, 'Failed to update product', true);
        if (response.success) {
          return response.data!;
        }
        throw new Error(response.error?.message || 'Failed to update product');
      } else {
        // No images, just send the data as JSON
        const response = await apiService.put<Product>(`/products/${id}`, updateData, 'Failed to update product');
        if (response.success) {
          return response.data!;
        }
        throw new Error(response.error?.message || 'Failed to update product');
      }
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
      const response = await apiService.delete<{ success: boolean }>(`/products/${id}`, {}, 'Failed to delete product');
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error?.message || 'Failed to delete product');
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  /**
   * Get product reviews
   */
  async getProductReviews(productId: number): Promise<any[]> {
    try {
      const response = await apiService.get<{ data: any[] }>(`/products/${productId}/reviews`);
      if (response.success) {
        return response.data!.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch product reviews');
    } catch (error) {
      console.warn('API call failed, using empty reviews array:', error);
      return [];
    }
  }
};

export default productService;
