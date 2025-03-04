import api from './api';
import { ProductSection, ProductSectionType } from '../models/ProductSection';
import { Product } from '../types/Product';

// Response interfaces
export interface ProductSectionsResponse {
  success: boolean;
  productSections: ProductSection[];
}

export interface ProductSectionResponse {
  success: boolean;
  productSection: ProductSection;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

// ProductSection service with real API endpoints
export const ProductSectionService = {
  // Get all product sections
  getProductSections: async (): Promise<ProductSection[]> => {
    try {
      const response = await api.get<ProductSectionsResponse>('/product-sections');
      return response.data.productSections;
    } catch (error) {
      console.error('Error fetching product sections:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get all products to add to sections
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>('/products', {
        params: { limit: 100 } // Get a large number of products
      });
      return response.data.products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return []; // Return empty array as fallback
    }
  },

  // Create a new product section
  createProductSection: async (productSectionData: Omit<ProductSection, 'id'>): Promise<ProductSection> => {
    try {
      const response = await api.post<ProductSectionResponse>('/product-sections', productSectionData);
      return response.data.productSection;
    } catch (error) {
      console.error('Error creating product section:', error);
      throw error;
    }
  },

  // Update an existing product section
  updateProductSection: async (id: number, productSectionData: Partial<ProductSection>): Promise<ProductSection> => {
    try {
      const response = await api.put<ProductSectionResponse>(`/product-sections/${id}`, productSectionData);
      return response.data.productSection;
    } catch (error) {
      console.error(`Error updating product section #${id}:`, error);
      throw error;
    }
  },

  // Delete a product section
  deleteProductSection: async (id: number): Promise<void> => {
    try {
      await api.delete(`/product-sections/${id}`);
    } catch (error) {
      console.error(`Error deleting product section #${id}:`, error);
      throw error;
    }
  },

  // Toggle a product section's status (active/inactive)
  toggleProductSectionStatus: async (id: number): Promise<ProductSection> => {
    try {
      const response = await api.put<ProductSectionResponse>(`/product-sections/${id}/toggle-status`);
      return response.data.productSection;
    } catch (error) {
      console.error(`Error toggling product section #${id} status:`, error);
      throw error;
    }
  },

  // Reorder product sections
  reorderProductSections: async (orderedIds: number[]): Promise<ProductSection[]> => {
    try {
      const response = await api.put<ProductSectionsResponse>('/product-sections/reorder', { 
        orderedIds 
      });
      return response.data.productSections;
    } catch (error) {
      console.error('Error reordering product sections:', error);
      throw error;
    }
  },

  // Get products for a specific section type
  getProductsForSectionType: async (sectionType: ProductSectionType, limit: number = 10): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>(`/products/by-type/${sectionType}`, {
        params: { limit }
      });
      return response.data.products;
    } catch (error) {
      console.error(`Error fetching products for section type ${sectionType}:`, error);
      return []; // Return empty array as fallback
    }
  },

  // Add product to a section
  addProductToSection: async (sectionId: number, productId: number): Promise<ProductSection> => {
    try {
      const response = await api.post<ProductSectionResponse>(`/product-sections/${sectionId}/products`, {
        productId
      });
      return response.data.productSection;
    } catch (error) {
      console.error(`Error adding product #${productId} to section #${sectionId}:`, error);
      throw error;
    }
  },

  // Remove product from a section
  removeProductFromSection: async (sectionId: number, productId: number): Promise<ProductSection> => {
    try {
      const response = await api.delete<ProductSectionResponse>(`/product-sections/${sectionId}/products/${productId}`);
      return response.data.productSection;
    } catch (error) {
      console.error(`Error removing product #${productId} from section #${sectionId}:`, error);
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
