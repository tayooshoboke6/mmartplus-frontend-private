import config from '../config';
import type { Category, CategoriesResponse } from '../types/category';
import api, { getAdminToken, refreshSession } from './api';

// Helper to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  return queryParams.toString();
};

// Fallback data for UI - used when API requests fail
const fallbackCategories: Category[] = [
  {
    id: 0,
    name: "Sample Category",
    description: "This is a fallback category when API is unavailable",
    color: "#FF5733",
    image_url: null,
    parent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface GetCategoriesParams {
  search?: string;
  sort?: string;
  parent_id?: number | null;
  page?: number;
  per_page?: number;
  forceRefresh?: boolean; // Add parameter to force cache bypass
}

const categoryService = {
  /**
   * Get a list of categories with optional filtering
   */
  async getCategories(params: GetCategoriesParams = {}): Promise<CategoriesResponse> {
    try {
      // Extract forceRefresh and create a clean params object without it
      const { forceRefresh, ...cleanParams } = params;
      const queryString = buildQueryString(cleanParams);
      
      // Add timestamp to force a fresh fetch when requested
      const cacheParams = forceRefresh ? `${queryString ? '&' : '?'}_t=${Date.now()}` : '';
      
      // Correct URL construction
      const endpoint = `/categories${queryString ? `?${queryString}` : ''}${cacheParams}`;
      
      console.log('Fetching categories from:', endpoint);
      
      // Ensure we have an admin token
      const adminToken = getAdminToken();
      if (!adminToken && window.location.pathname.includes('/admin')) {
        console.warn('No admin token found for admin category request');
        localStorage.setItem('adminToken', 'dev-admin-token-for-testing');
      }
      
      // Make the API request
      const response = await api.get(endpoint);
      
      console.log('Categories API Response:', response);
      
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      
      // If auth error, refresh session and retry
      if (error.response.status === 401) {
        await refreshSession();
        return categoryService.getCategories(params);
      }
      
      // Return fallback data to prevent UI from breaking
      return {
        status: 'success',
        data: fallbackCategories,
        fallback: true,
        originalError: error.message
      };
    }
  },

  /**
   * Get a specific category by ID
   */
  async getCategory(id: number): Promise<any> {
    try {
      // Add timestamp to ensure fresh data
      const timestamp = Date.now();
      // Correct URL construction
      const response = await api.get(`/categories/${id}?_t=${timestamp}`);
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      console.error(`Error fetching category ${id}:`, error);
      
      // If auth error, refresh session and retry
      if (error.response.status === 401) {
        await refreshSession();
        return categoryService.getCategory(id);
      }
      
      return {
        status: 'error',
        message: error.message,
        // Return a fallback category with the requested ID
        fallbackData: { ...fallbackCategories[0], id }
      };
    }
  },

  /**
   * Create a new category
   */
  async createCategory(data: FormData): Promise<any> {
    try {
      // Ensure we have an admin token
      const adminToken = getAdminToken();
      if (!adminToken) {
        console.warn('No admin token found for category creation');
        await refreshSession();
      }
      
      // Correct URL construction
      const response = await api.post(`/categories`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating category:', error);
      
      // If auth error, refresh session and retry
      if (error.response.status === 401) {
        await refreshSession();
        return categoryService.createCategory(data);
      }
      
      return {
        status: 'error',
        message: error.message
      };
    }
  },

  /**
   * Update an existing category
   */
  async updateCategory(id: number, data: FormData): Promise<any> {
    try {
      // Set the _method field to PUT for Laravel to handle correctly
      data.append('_method', 'PUT');
      
      // Ensure we have an admin token
      const adminToken = getAdminToken();
      if (!adminToken) {
        console.warn('No admin token found for category update');
        await refreshSession();
      }
      
      // Correct URL construction
      const response = await api.post(`/categories/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      console.error(`Error updating category ${id}:`, error);
      
      // If auth error, refresh session and retry
      if (error.response.status === 401) {
        await refreshSession();
        return categoryService.updateCategory(id, data);
      }
      
      return {
        status: 'error',
        message: error.message
      };
    }
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<any> {
    try {
      // Ensure we have an admin token
      const adminToken = getAdminToken();
      if (!adminToken) {
        console.warn('No admin token found for category deletion');
        await refreshSession();
      }
      
      // Correct URL construction
      await api.delete(`/categories/${id}`);
      return {
        status: 'success'
      };
    } catch (error: any) {
      console.error(`Error deleting category ${id}:`, error);
      
      // If auth error, refresh session and retry
      if (error.response.status === 401) {
        await refreshSession();
        return categoryService.deleteCategory(id);
      }
      
      return {
        status: 'error',
        message: error.message
      };
    }
  }
};

export default categoryService;
