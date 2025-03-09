import apiService, { endpoints } from './apiService';
import { ApiResponse } from '../utils/apiClient';
import { categories, getParentCategories, getChildCategories, getCategoryById as getLocalCategoryById, getCategoryBySlug as getLocalCategoryBySlug } from '../data/categories';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
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
    parent_id?: number | null;
  } = {}): Promise<ApiResponse<CategoryListResponse>> {
    try {
      // In a real API environment, this would be:
      // return apiService.get<CategoryListResponse>(endpoints.categories.base, params);
      
      // For now, use our local data
      let filteredCategories = [...categories];
      
      // Filter by active status if specified
      if (params.include_inactive === false) {
        filteredCategories = filteredCategories.filter(cat => cat.is_active);
      }
      
      // Filter by parent_id if specified
      if (params.parent_id !== undefined) {
        if (params.parent_id === null) {
          // Get only parent categories
          filteredCategories = filteredCategories.filter(cat => cat.parent_id === null);
        } else {
          // Get children of specific parent
          const children = getChildCategories(params.parent_id);
          return {
            success: true,
            data: {
              data: children,
              meta: {
                current_page: 1,
                from: 1,
                last_page: 1,
                path: '',
                per_page: children.length,
                to: children.length,
                total: children.length
              }
            }
          };
        }
      }
      
      // Remove children if not requested
      if (!params.include_children) {
        filteredCategories = filteredCategories.map(cat => ({
          ...cat,
          children: undefined
        }));
      }
      
      return {
        success: true,
        data: {
          data: filteredCategories,
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: '',
            per_page: filteredCategories.length,
            to: filteredCategories.length,
            total: filteredCategories.length
          }
        }
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch categories'
        }
      };
    }
  },
  
  /**
   * Get a category by ID
   */
  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    try {
      // In a real API environment, this would be:
      // return apiService.get<Category>(endpoints.categories.byId(id));
      
      // For now, use our local data
      const category = getLocalCategoryById(id);
      
      if (!category) {
        return {
          success: false,
          error: {
            message: `Category with ID ${id} not found`
          }
        };
      }
      
      return {
        success: true,
        data: category
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: `Failed to fetch category with ID ${id}`
        }
      };
    }
  },
  
  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      // In a real API environment, this would be:
      // return apiService.get<Category>(endpoints.categories.bySlug(slug));
      
      // For now, use our local data
      const category = getLocalCategoryBySlug(slug);
      
      if (!category) {
        return {
          success: false,
          error: {
            message: `Category with slug '${slug}' not found`
          }
        };
      }
      
      return {
        success: true,
        data: category
      };
    } catch (error) {
      console.error(`Error fetching category with slug '${slug}':`, error);
      return {
        success: false,
        error: {
          message: `Failed to fetch category with slug '${slug}'`
        }
      };
    }
  },
  
  /**
   * Get products in a category
   */
  getCategoryProducts(categoryId: number, params: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse<any>> {
    return apiService.get(
      endpoints.categories.products(categoryId),
      params,
      `Failed to fetch products for category ${categoryId}`
    );
  },
  
  /**
   * Create a new category
   */
  createCategory(categoryData: CategoryCreateData): Promise<ApiResponse<Category>> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('name', categoryData.name);
    
    if (categoryData.description) {
      formData.append('description', categoryData.description);
    }
    
    if (categoryData.parent_id !== undefined) {
      formData.append('parent_id', categoryData.parent_id.toString());
    }
    
    if (categoryData.is_active !== undefined) {
      formData.append('is_active', categoryData.is_active ? '1' : '0');
    }
    
    // Add image if provided
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }
    
    return apiService.post(
      endpoints.categories.base,
      formData,
      'Failed to create category'
    );
  },
  
  /**
   * Update an existing category
   */
  updateCategory(categoryData: CategoryUpdateData): Promise<ApiResponse<Category>> {
    const formData = new FormData();
    
    // Add method override for PUT request
    formData.append('_method', 'PUT');
    
    // Add fields that are present
    if (categoryData.name !== undefined) {
      formData.append('name', categoryData.name);
    }
    
    if (categoryData.description !== undefined) {
      formData.append('description', categoryData.description);
    }
    
    if (categoryData.parent_id !== undefined) {
      formData.append('parent_id', categoryData.parent_id.toString());
    }
    
    if (categoryData.is_active !== undefined) {
      formData.append('is_active', categoryData.is_active ? '1' : '0');
    }
    
    // Add image if provided
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }
    
    return apiService.post(
      endpoints.categories.byId(categoryData.id),
      formData,
      `Failed to update category ${categoryData.id}`
    );
  },
  
  /**
   * Delete a category
   */
  deleteCategory(id: number): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(
      endpoints.categories.byId(id),
      {},
      `Failed to delete category ${id}`
    );
  }
};

export default categoryService;
