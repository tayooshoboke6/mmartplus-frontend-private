import apiService, { endpoints } from './apiService';
import { ApiResponse } from '../utils/apiClient';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
  product_count?: number;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
  parent_id?: number;
  image?: File;
  is_active?: boolean;
}

export interface CategoryUpdateData extends Partial<CategoryCreateData> {
  id: number;
}

export interface CategoryListResponse {
  data: Category[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

/**
 * Category service for handling category-related API calls
 */
const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(params: { 
    include_inactive?: boolean; 
    include_children?: boolean;
    include_product_count?: boolean;
    parent_id?: number;
  } = {}): Promise<ApiResponse<CategoryListResponse>> {
    return apiService.get<CategoryListResponse>(
      endpoints.categories.base,
      params,
      'Failed to fetch categories'
    );
  },

  /**
   * Get a category by ID
   */
  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    return apiService.get<Category>(
      endpoints.categories.byId(id),
      {},
      `Failed to fetch category with ID ${id}`
    );
  },

  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return apiService.get<Category>(
      endpoints.categories.bySlug(slug),
      {},
      `Failed to fetch category with slug "${slug}"`
    );
  },

  /**
   * Get products in a category
   */
  async getCategoryProducts(categoryId: number, params: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse<any>> {
    return apiService.get<any>(
      endpoints.categories.products(categoryId),
      params,
      `Failed to fetch products for category ID ${categoryId}`
    );
  },

  /**
   * Create a new category
   */
  async createCategory(categoryData: CategoryCreateData): Promise<ApiResponse<Category>> {
    // If there is an image, use FormData
    if (categoryData.image) {
      const formData = new FormData();
      
      // Add all category data to FormData
      Object.entries(categoryData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      return apiService.upload<Category>(
        endpoints.categories.base,
        formData,
        'Failed to create category'
      );
    }
    
    // If no image, use regular POST
    return apiService.post<Category>(
      endpoints.categories.base,
      categoryData,
      'Failed to create category'
    );
  },

  /**
   * Update an existing category
   */
  async updateCategory(categoryData: CategoryUpdateData): Promise<ApiResponse<Category>> {
    const { id, ...updateData } = categoryData;
    
    // If there is an image, use FormData
    if (updateData.image) {
      const formData = new FormData();
      
      // Add all category data to FormData
      Object.entries(updateData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      return apiService.upload<Category>(
        endpoints.categories.byId(id),
        formData,
        'Failed to update category'
      );
    }
    
    // If no image, use regular PUT
    return apiService.put<Category>(
      endpoints.categories.byId(id),
      updateData,
      'Failed to update category'
    );
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(
      endpoints.categories.byId(id),
      {},
      'Failed to delete category'
    );
  }
};

export default categoryService;
