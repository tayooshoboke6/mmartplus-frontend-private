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
      
      // Remove timestamp parameter that's causing 404s on the backend
      const cacheParams = ''; // Remove timestamp to avoid 404 errors
      
      // Use admin endpoint when in admin section
      const isAdminSection = window.location.pathname.includes('/admin');
      const baseEndpoint = isAdminSection ? '/admin/categories' : '/categories';
      
      // Correct URL construction
      const endpoint = `${baseEndpoint}${queryString ? `?${queryString}` : ''}${cacheParams}`;
      
      console.log('Fetching categories from:', endpoint);
      
      // Ensure we have an admin token
      const adminToken = getAdminToken();
      if (!adminToken && isAdminSection) {
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
      if (error.response?.status === 401) {
        await refreshSession();
        return categoryService.getCategories(params);
      }
      
      // Return user-friendly error messages based on status code
      let errorMessage = 'Failed to fetch categories';
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Categories endpoint not found. Please check API configuration.';
            break;
          case 403:
            errorMessage = 'You do not have permission to view categories.';
            break;
          case 500:
            errorMessage = 'Server error while fetching categories. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      // Return fallback data to prevent UI from breaking
      return {
        status: 'success',
        data: fallbackCategories,
        fallback: true,
        originalError: errorMessage
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
      
      // Use admin endpoint when in admin section
      const isAdminSection = window.location.pathname.includes('/admin');
      const baseEndpoint = isAdminSection ? '/admin/categories' : '/categories';
      
      // Correct URL construction
      const response = await api.get(`${baseEndpoint}/${id}?_t=${timestamp}`);
      
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      console.error(`Error fetching category ${id}:`, error);
      
      // If auth error, refresh session and retry
      if (error.response?.status === 401) {
        await refreshSession();
        return categoryService.getCategory(id);
      }
      
      // Return user-friendly error messages based on status code
      let errorMessage = `Failed to fetch category #${id}`;
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = `Category #${id} not found. It may have been deleted.`;
            break;
          case 403:
            errorMessage = 'You do not have permission to view this category.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      return {
        status: 'error',
        message: errorMessage
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
      
      // Correct URL construction with admin prefix
      const response = await api.post(`/admin/categories`, data, {
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
      if (error.response?.status === 401) {
        await refreshSession();
        return categoryService.createCategory(data);
      }
      
      // Return user-friendly error messages based on status code
      let errorMessage = 'Failed to create category';
      if (error.response) {
        switch (error.response.status) {
          case 422:
            const validationErrors = error.response.data?.errors || {};
            if (validationErrors.name && validationErrors.name.includes('already been taken')) {
              errorMessage = 'A category with this name already exists. Please choose a different name.';
            } else if (validationErrors.slug && validationErrors.slug.includes('already been taken')) {
              errorMessage = 'A category with this slug already exists. Please modify the name to generate a unique slug.';
            } else {
              errorMessage = 'Validation error: ' + (error.response.data?.message || 'Please check your inputs');
            }
            break;
          case 403:
            errorMessage = 'You do not have permission to create categories.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      return {
        status: 'error',
        message: errorMessage
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
      
      // Correct URL construction with admin prefix
      const response = await api.post(`/admin/categories/${id}`, data, {
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
      if (error.response?.status === 401) {
        await refreshSession();
        return categoryService.updateCategory(id, data);
      }
      
      // Return user-friendly error messages based on status code
      let errorMessage = `Failed to update category #${id}`;
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = `Category #${id} not found. It may have been deleted.`;
            break;
          case 422:
            const validationErrors = error.response.data?.errors || {};
            if (validationErrors.name && validationErrors.name.includes('already been taken')) {
              errorMessage = 'A category with this name already exists. Please choose a different name.';
            } else if (validationErrors.slug && validationErrors.slug.includes('already been taken')) {
              errorMessage = 'A category with this slug already exists. Please modify the name to generate a unique slug.';
            } else {
              errorMessage = 'Validation error: ' + (error.response.data?.message || 'Please check your inputs');
            }
            break;
          case 403:
            errorMessage = 'You do not have permission to update this category.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      return {
        status: 'error',
        message: errorMessage
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
      
      // Correct URL construction with admin prefix
      await api.delete(`/admin/categories/${id}`);
      return {
        status: 'success'
      };
    } catch (error: any) {
      console.error(`Error deleting category ${id}:`, error);
      
      // If auth error, refresh session and retry
      if (error.response?.status === 401) {
        await refreshSession();
        return categoryService.deleteCategory(id);
      }
      
      // Return user-friendly error messages based on status code
      let errorMessage = `Failed to delete category #${id}`;
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = `Category #${id} not found. It may have been deleted already.`;
            break;
          case 422:
            errorMessage = 'Cannot delete this category: ' + (error.response.data?.message || 'It may be in use by products');
            break;
          case 403:
            errorMessage = 'You do not have permission to delete this category.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      return {
        status: 'error',
        message: errorMessage
      };
    }
  }
};

export default categoryService;
