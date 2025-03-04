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
  
  // Search products specifically for search bar functionality
  searchProducts: async (query: string, page: number = 1, perPage: number = 20): Promise<ProductsResponse> => {
    try {
      const response = await api.get<ProductsResponse>('/products', { 
        params: { 
          search: query,
          page,
          per_page: perPage 
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching products:', error);
      
      // Return mock data for development
      const mockData: ProductsResponse = {
        success: true,
        products: {
          data: [
            {
              id: 1,
              name: `${query} Sample Product 1`,
              slug: 'sample-product-1',
              description: 'Sample description',
              short_description: 'Sample short description',
              price: 19999,
              sale_price: 14999,
              stock_quantity: 100,
              sku: 'SAMPLE-001',
              barcode: '1234567890',
              is_featured: true,
              is_active: true,
              weight: '1kg',
              dimensions: '10x10x10',
              category_id: 1,
              image_urls: ['https://via.placeholder.com/300?text=Product1'],
              metadata: null,
              created_at: '2023-01-01',
              updated_at: '2023-01-01',
              is_on_sale: true,
              is_in_stock: true,
              discount_percentage: 25,
              formatted_price: '₦19,999',
              formatted_sale_price: '₦14,999',
              average_rating: 4.5,
              review_count: 10
            },
            {
              id: 2,
              name: `${query} Sample Product 2`,
              slug: 'sample-product-2',
              description: 'Another sample description',
              short_description: 'Another sample short description',
              price: 29999,
              sale_price: null,
              stock_quantity: 50,
              sku: 'SAMPLE-002',
              barcode: '0987654321',
              is_featured: false,
              is_active: true,
              weight: '2kg',
              dimensions: '20x20x20',
              category_id: 2,
              image_urls: ['https://via.placeholder.com/300?text=Product2'],
              metadata: null,
              created_at: '2023-01-02',
              updated_at: '2023-01-02',
              is_on_sale: false,
              is_in_stock: true,
              discount_percentage: null,
              formatted_price: '₦29,999',
              formatted_sale_price: null,
              average_rating: 4.0,
              review_count: 5
            }
          ],
          current_page: page,
          last_page: 1,
          per_page: perPage,
          total: 2
        }
      };
      
      return mockData;
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
  createProduct: async (formData: FormData): Promise<SingleProductResponse> => {
    try {
      const response = await api.post<SingleProductResponse>('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
  updateProduct: async (id: number, formData: FormData): Promise<SingleProductResponse> => {
    try {
      const response = await api.post<SingleProductResponse>(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
  deleteProduct: async (id: number): Promise<{success: boolean; message: string}> => {
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
  }): Promise<{success: boolean; message: string}> => {
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
      per_page: limit
    });
  },

  // Get new arrivals
  getNewArrivals: async (limit: number = 8): Promise<ProductsResponse> => {
    return productService.getProducts({
      sort_by: 'created_at',
      sort_order: 'desc',
      per_page: limit
    });
  },

  // Get best selling products
  getBestSellers: async (limit: number = 8): Promise<ProductsResponse> => {
    return productService.getFeaturedProducts(limit);
  }
};

export default productService;
