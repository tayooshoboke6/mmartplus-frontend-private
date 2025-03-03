import api from './api';
import { Category } from './categoryService';

// Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  sku: string;
  barcode: string | null;
  is_featured: boolean;
  is_active: boolean;
  weight: string | null;
  dimensions: string | null;
  category_id: number;
  image_urls: string[];
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  
  // Computed properties
  is_on_sale: boolean;
  is_in_stock: boolean;
  discount_percentage: number | null;
  formatted_price: string;
  formatted_sale_price: string | null;
  average_rating: number | null;
  review_count: number;
  
  // Relationships
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  
  // Relationships
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
}

export interface ProductsResponse {
  success: boolean;
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
  related_products: Product[];
}

const productService = {
  // Get all products with optional filtering
  getProducts: async (params: {
    category_id?: number;
    include_subcategories?: boolean;
    featured?: boolean;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: 'name' | 'price' | 'created_at' | 'stock_quantity' | 'sale_price';
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<ProductsResponse> => {
    try {
      const response = await api.get<ProductsResponse>('/products', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch products'
      };
    }
  },

  // Get a specific product by slug
  getProduct: async (slug: string): Promise<SingleProductResponse> => {
    try {
      const response = await api.get<SingleProductResponse>(`/products/${slug}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch product'
      };
    }
  },

  // Admin: Create a new product
  createProduct: async (formData: FormData) => {
    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to create product'
      };
    }
  },

  // Admin: Update a product
  updateProduct: async (id: number, formData: FormData) => {
    try {
      const response = await api.post(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to update product'
      };
    }
  },

  // Admin: Delete a product
  deleteProduct: async (id: number) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to delete product'
      };
    }
  },

  // Submit a product review
  submitReview: async (productId: number, data: {
    rating: number;
    comment?: string;
  }) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to submit review'
      };
    }
  },

  // Get featured products for homepage
  getFeaturedProducts: async (limit: number = 8): Promise<ProductsResponse> => {
    return productService.getProducts({
      featured: true,
      per_page: limit,
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  },

  // Get new arrivals
  getNewArrivals: async (limit: number = 8): Promise<ProductsResponse> => {
    return productService.getProducts({
      per_page: limit,
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  },

  // Get best selling products
  getBestSellers: async (limit: number = 8): Promise<ProductsResponse> => {
    // This would typically require backend support for tracking best sellers
    // For now, we'll just get featured products as a placeholder
    return productService.getFeaturedProducts(limit);
  },
};

export default productService;
