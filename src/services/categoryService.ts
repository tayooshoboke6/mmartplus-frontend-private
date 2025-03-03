import api from './api';

// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  order: number;
  is_active: boolean;
  parent?: Category;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  success: boolean;
  categories: {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SingleCategoryResponse {
  success: boolean;
  category: Category;
}

const categoryService = {
  // Get all categories
  getCategories: async (params: { 
    parent_only?: boolean; 
    per_page?: number;
    page?: number;
  } = {}): Promise<CategoryResponse> => {
    try {
      const response = await api.get<CategoryResponse>('/categories', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch categories'
      };
    }
  },

  // Get a specific category by ID or slug
  getCategory: async (idOrSlug: number | string): Promise<SingleCategoryResponse> => {
    try {
      const response = await api.get<SingleCategoryResponse>(`/categories/${idOrSlug}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch category'
      };
    }
  },

  // Get products for a specific category
  getCategoryProducts: async (
    idOrSlug: number | string, 
    params: {
      include_children?: boolean;
      per_page?: number;
      page?: number;
    } = {}
  ) => {
    try {
      const response = await api.get(`/categories/${idOrSlug}/products`, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch category products'
      };
    }
  },

  // Admin: Create a new category
  createCategory: async (formData: FormData) => {
    try {
      const response = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to create category'
      };
    }
  },

  // Admin: Update a category
  updateCategory: async (id: number, formData: FormData) => {
    try {
      const response = await api.post(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to update category'
      };
    }
  },

  // Admin: Delete a category
  deleteCategory: async (id: number) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to delete category'
      };
    }
  },
};

export default categoryService;
