import api from './api';
import { ProductSection, ProductSectionType } from '../models/ProductSection';
import { Product } from '../types/Product';
import config from '../config';

// Response interfaces
export interface ProductSectionsResponse {
  status?: string;
  success?: boolean;
  message?: string;
  data?: ProductSection[];
  productSections?: ProductSection[];
}

export interface ProductSectionResponse {
  status?: string;
  success?: boolean;
  message?: string;
  data?: ProductSection;
  productSection?: ProductSection;
}

export interface ProductsResponse {
  status?: string;
  success?: boolean;
  message?: string;
  data?: Product[];
  products?: Product[];
}

// Debugging function to help identify API response format issues
const logResponseFormat = (endpoint: string, response: any) => {
  if (config.features.debugApiResponses) {
    console.log(`API Response from ${endpoint}:`, {
      hasStatus: 'status' in response.data,
      hasSuccess: 'success' in response.data,
      hasData: 'data' in response.data,
      hasProductSections: 'productSections' in response.data,
      hasProducts: 'products' in response.data,
      keys: Object.keys(response.data),
      sample: response.data
    });
  }
};

// Helper to extract data from different API response formats
const extractData = <T>(response: any, legacyField: string): T => {
  // First try the standard "data" field (Laravel API resource format)
  if (response.data?.data) {
    return response.data.data as T;
  }
  // Then try the legacy field name
  else if (response.data?.[legacyField]) {
    return response.data[legacyField] as T;
  }
  // If neither exists, return the whole data object or empty array/object as appropriate
  else {
    console.warn(`Could not find data in response. Expected 'data' or '${legacyField}'`, response.data);
    return (Array.isArray(response.data) ? response.data : (typeof response.data === 'object' ? response.data : [])) as T;
  }
};

// ProductSection service with real API endpoints
export const ProductSectionService = {
  // Get all product sections
  getProductSections: async (): Promise<ProductSection[]> => {
    try {
      // Try the admin endpoint first - this is now implemented on the backend
      const response = await api.get<ProductSectionsResponse>('/admin/product-sections');
      logResponseFormat('/admin/product-sections', response);
      return extractData<ProductSection[]>(response, 'productSections');
    } catch (error) {
      console.error('Error fetching product sections:', error);
      
      // In development mode and configured to use mock data, return empty array
      if (config.features.useMockData) {
        console.info('Using mock data for product sections (empty array)');
        return [];
      }
      throw error;
    }
  },

  // Get all products to add to sections
  getAllProducts: async (): Promise<Product[]> => {
    try {
      // Try admin products endpoint first
      const response = await api.get<ProductsResponse>('/admin/products', {
        params: { limit: 100 } // Get a large number of products
      });
      logResponseFormat('/admin/products', response);
      return extractData<Product[]>(response, 'products');
    } catch (error) {
      console.error('Error fetching all products:', error);
      
      // Try fallback to non-admin endpoint
      try {
        const fallbackResponse = await api.get<ProductsResponse>('/products', {
          params: { limit: 100 }
        });
        logResponseFormat('/products', fallbackResponse);
        return extractData<Product[]>(fallbackResponse, 'products');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        // If in development mode and configured to use mock data, return empty array
        if (config.features.useMockData) {
          console.info('Using mock data for products (empty array)');
          return [];
        }
        throw fallbackError;
      }
    }
  },

  // Create a new product section
  createProductSection: async (productSectionData: Omit<ProductSection, 'id'>): Promise<ProductSection> => {
    try {
      const response = await api.post<ProductSectionResponse>('/admin/product-sections', productSectionData);
      logResponseFormat('/admin/product-sections POST', response);
      return extractData<ProductSection>(response, 'productSection');
    } catch (error) {
      console.error('Error creating product section:', error);
      throw error;
    }
  },

  // Update an existing product section
  updateProductSection: async (id: number, productSectionData: Partial<ProductSection>): Promise<ProductSection> => {
    try {
      const response = await api.put<ProductSectionResponse>(`/admin/product-sections/${id}`, productSectionData);
      logResponseFormat(`/admin/product-sections/${id} PUT`, response);
      return extractData<ProductSection>(response, 'productSection');
    } catch (error) {
      console.error(`Error updating product section #${id}:`, error);
      throw error;
    }
  },

  // Delete a product section
  deleteProductSection: async (id: number): Promise<void> => {
    try {
      await api.delete(`/admin/product-sections/${id}`);
    } catch (error) {
      console.error(`Error deleting product section #${id}:`, error);
      throw error;
    }
  },
  
  // Toggle a product section's status (active/inactive)
  toggleProductSectionStatus: async (id: number): Promise<ProductSection> => {
    try {
      const response = await api.patch<ProductSectionResponse>(`/admin/product-sections/${id}/toggle`);
      logResponseFormat(`/admin/product-sections/${id}/toggle PATCH`, response);
      return extractData<ProductSection>(response, 'productSection');
    } catch (error) {
      console.error(`Error toggling product section #${id} status:`, error);
      throw error;
    }
  },
  
  // Reorder product sections
  reorderProductSections: async (orderedIds: number[]): Promise<ProductSection[]> => {
    try {
      const response = await api.post<ProductSectionsResponse>('/admin/product-sections/reorder', {
        section_ids: orderedIds
      });
      logResponseFormat('/admin/product-sections/reorder POST', response);
      return extractData<ProductSection[]>(response, 'productSections');
    } catch (error) {
      console.error('Error reordering product sections:', error);
      throw error;
    }
  },
  
  // Get products for a specific section type
  getProductsForSectionType: async (sectionType: ProductSectionType, limit: number = 10): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>('/products', {
        params: { type: sectionType, limit }
      });
      logResponseFormat(`/products?type=${sectionType}&limit=${limit}`, response);
      return extractData<Product[]>(response, 'products');
    } catch (error) {
      console.error(`Error fetching products for section type ${sectionType}:`, error);
      
      // If in development mode and configured to use mock data, return empty array
      if (config.features.useMockData) {
        console.info(`Using mock data for products of type ${sectionType} (empty array)`);
        return [];
      }
      throw error;
    }
  },
  
  // Add product to a section
  addProductToSection: async (sectionId: number, productId: number): Promise<ProductSection> => {
    try {
      // Get the current section
      const section = await ProductSectionService.show(sectionId);
      
      // Add the product ID if it's not already in the list
      if (!section.product_ids.includes(productId)) {
        section.product_ids.push(productId);
        return await ProductSectionService.updateProductSection(sectionId, {
          product_ids: section.product_ids
        });
      }
      
      return section;
    } catch (error) {
      console.error(`Error adding product #${productId} to section #${sectionId}:`, error);
      throw error;
    }
  },
  
  // Remove product from a section
  removeProductFromSection: async (sectionId: number, productId: number): Promise<ProductSection> => {
    try {
      // Get the current section
      const section = await ProductSectionService.show(sectionId);
      
      // Remove the product ID if it's in the list
      section.product_ids = section.product_ids.filter(id => id !== productId);
      
      return await ProductSectionService.updateProductSection(sectionId, {
        product_ids: section.product_ids
      });
    } catch (error) {
      console.error(`Error removing product #${productId} from section #${sectionId}:`, error);
      throw error;
    }
  },
  
  // Get a single product section by ID
  show: async (id: number): Promise<ProductSection> => {
    try {
      const response = await api.get<ProductSectionResponse>(`/admin/product-sections/${id}`);
      logResponseFormat(`/admin/product-sections/${id} GET`, response);
      return extractData<ProductSection>(response, 'productSection');
    } catch (error) {
      console.error(`Error fetching product section #${id}:`, error);
      throw error;
    }
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getProductSections = ProductSectionService.getProductSections;
export const getAllProducts = ProductSectionService.getAllProducts;
export const createProductSection = ProductSectionService.createProductSection;
export const updateProductSection = ProductSectionService.updateProductSection;
export const deleteProductSection = ProductSectionService.deleteProductSection;
export const toggleProductSectionStatus = ProductSectionService.toggleProductSectionStatus;
export const reorderProductSections = ProductSectionService.reorderProductSections;
export const getProductsForSectionType = ProductSectionService.getProductsForSectionType;
export const addProductToSection = ProductSectionService.addProductToSection;
export const removeProductFromSection = ProductSectionService.removeProductFromSection;

export default ProductSectionService;
