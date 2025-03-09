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

// Mock products for sections
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    short_description: 'Premium noise-cancelling headphones',
    price: 199.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 5,
    stock: 45,
    sku: 'AUDIO001',
    is_featured: true,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Smartphone X Pro',
    slug: 'smartphone-x-pro',
    description: 'Latest smartphone with advanced camera and long battery life',
    short_description: 'Advanced smartphone with great camera',
    price: 899.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 1,
    stock: 20,
    sku: 'PHONE002',
    is_featured: true,
    is_active: true,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Ultra HD Smart TV 55"',
    slug: 'ultra-hd-smart-tv-55',
    description: '4K Ultra HD Smart TV with HDR and built-in streaming apps',
    short_description: '4K Smart TV with HDR',
    price: 649.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 2,
    stock: 15,
    sku: 'TV003',
    is_featured: false,
    is_active: true,
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'Laptop Pro 15"',
    slug: 'laptop-pro-15',
    description: 'Powerful laptop with high-performance processor and graphics',
    short_description: 'High-performance laptop',
    price: 1299.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 3,
    stock: 12,
    sku: 'COMP004',
    is_featured: true,
    is_active: true,
    created_at: '2025-01-04T00:00:00Z',
    updated_at: '2025-01-04T00:00:00Z'
  },
  {
    id: 5,
    name: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: 'Ergonomic gaming mouse with customizable RGB lighting',
    short_description: 'Ergonomic RGB gaming mouse',
    price: 59.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 4,
    stock: 30,
    sku: 'GAME005',
    is_featured: false,
    is_active: true,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-05T00:00:00Z'
  },
  {
    id: 6,
    name: 'Smart Watch Series 5',
    slug: 'smart-watch-series-5',
    description: 'Advanced smartwatch with health monitoring and GPS',
    short_description: 'Health monitoring smartwatch with GPS',
    price: 299.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 1,
    stock: 25,
    sku: 'WEAR006',
    is_featured: true,
    is_active: true,
    created_at: '2025-01-06T00:00:00Z',
    updated_at: '2025-01-06T00:00:00Z'
  },
  {
    id: 7,
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable Bluetooth speaker with waterproof design',
    short_description: 'Portable waterproof speaker',
    price: 79.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 5,
    stock: 40,
    sku: 'AUDIO007',
    is_featured: false,
    is_active: true,
    created_at: '2025-01-07T00:00:00Z',
    updated_at: '2025-01-07T00:00:00Z'
  },
  {
    id: 8,
    name: 'Digital Camera Pro',
    slug: 'digital-camera-pro',
    description: 'Professional digital camera with 4K video recording',
    short_description: 'Professional 4K camera',
    price: 799.99,
    images: ['https://dummyimage.com/300x200/'],
    category_id: 6,
    stock: 10,
    sku: 'PHOTO008',
    is_featured: true,
    is_active: true,
    created_at: '2025-01-08T00:00:00Z',
    updated_at: '2025-01-08T00:00:00Z'
  }
];

// Mock product sections
let MOCK_PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: 1,
    title: 'Featured Products',
    description: 'Our handpicked selection of the best products',
    type: ProductSectionType.FEATURED,
    background_color: '#f8f9fa',
    text_color: '#212529',
    product_ids: [1, 2, 4, 6, 8],
    display_order: 1,
    active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Hot Deals',
    description: 'Limited-time offers you don\'t want to miss',
    type: ProductSectionType.HOT_DEALS,
    background_color: '#dc3545',
    text_color: '#ffffff',
    product_ids: [3, 5, 7],
    display_order: 2,
    active: true,
    created_at: '2025-01-16T11:30:00Z',
    updated_at: '2025-01-16T11:30:00Z'
  },
  {
    id: 3,
    title: 'New Arrivals',
    description: 'Check out our latest products',
    type: ProductSectionType.NEW_ARRIVALS,
    background_color: '#007bff',
    text_color: '#ffffff',
    product_ids: [2, 4, 8],
    display_order: 3,
    active: true,
    created_at: '2025-01-17T09:15:00Z',
    updated_at: '2025-01-17T09:15:00Z'
  },
  {
    id: 4,
    title: 'Best Sellers',
    description: 'Our most popular products',
    type: ProductSectionType.BEST_SELLERS,
    background_color: '#28a745',
    text_color: '#ffffff',
    product_ids: [1, 4, 6],
    display_order: 4,
    active: true,
    created_at: '2025-01-18T14:20:00Z',
    updated_at: '2025-01-18T14:20:00Z'
  }
];

// Debugging function to help identify API response format issues
const logResponseFormat = (endpoint: string, response: any) => {
  if (config.features.debugApiResponses) {
    console.log(`Mock Response for ${endpoint}:`, response);
  }
};

// Helper function to get products by IDs
const getProductsByIds = (productIds: number[]): Product[] => {
  return MOCK_PRODUCTS.filter(product => productIds.includes(product.id));
};

// Helper function to simulate API delay
const simulateApiDelay = (ms: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ProductSection service with mock data
export const ProductSectionService = {
  // Get all product sections
  getProductSections: async (): Promise<ProductSection[]> => {
    await simulateApiDelay();
    logResponseFormat('/admin/product-sections', { data: MOCK_PRODUCT_SECTIONS });
    return [...MOCK_PRODUCT_SECTIONS];
  },

  // Get all products to add to sections
  getAllProducts: async (): Promise<Product[]> => {
    await simulateApiDelay();
    logResponseFormat('/admin/products', { data: MOCK_PRODUCTS });
    return [...MOCK_PRODUCTS];
  },

  // Create a new product section
  createProductSection: async (productSectionData: Omit<ProductSection, 'id'>): Promise<ProductSection> => {
    await simulateApiDelay(500);
    
    // Generate a new ID
    const newId = Math.max(...MOCK_PRODUCT_SECTIONS.map(section => section.id)) + 1;
    
    // Create new section with timestamps
    const newSection: ProductSection = {
      ...productSectionData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to mock data
    MOCK_PRODUCT_SECTIONS.push(newSection);
    
    logResponseFormat('/admin/product-sections POST', { data: newSection });
    return { ...newSection };
  },

  // Update an existing product section
  updateProductSection: async (id: number, productSectionData: Partial<ProductSection>): Promise<ProductSection> => {
    await simulateApiDelay(500);
    
    const index = MOCK_PRODUCT_SECTIONS.findIndex(section => section.id === id);
    
    if (index === -1) {
      throw new Error(`Product section with ID ${id} not found`);
    }
    
    // Update the section
    const updatedSection: ProductSection = {
      ...MOCK_PRODUCT_SECTIONS[index],
      ...productSectionData,
      updated_at: new Date().toISOString()
    };
    
    // Update in mock data
    MOCK_PRODUCT_SECTIONS[index] = updatedSection;
    
    logResponseFormat(`/admin/product-sections/${id} PUT`, { data: updatedSection });
    return { ...updatedSection };
  },

  // Delete a product section
  deleteProductSection: async (id: number): Promise<void> => {
    await simulateApiDelay(300);
    
    const index = MOCK_PRODUCT_SECTIONS.findIndex(section => section.id === id);
    
    if (index === -1) {
      throw new Error(`Product section with ID ${id} not found`);
    }
    
    // Remove from mock data
    MOCK_PRODUCT_SECTIONS.splice(index, 1);
    
    logResponseFormat(`/admin/product-sections/${id} DELETE`, { success: true });
  },
  
  // Toggle a product section's status (active/inactive)
  toggleProductSectionStatus: async (id: number): Promise<ProductSection> => {
    await simulateApiDelay(300);
    
    const index = MOCK_PRODUCT_SECTIONS.findIndex(section => section.id === id);
    
    if (index === -1) {
      throw new Error(`Product section with ID ${id} not found`);
    }
    
    // Toggle active status
    const updatedSection: ProductSection = {
      ...MOCK_PRODUCT_SECTIONS[index],
      active: !MOCK_PRODUCT_SECTIONS[index].active,
      updated_at: new Date().toISOString()
    };
    
    // Update in mock data
    MOCK_PRODUCT_SECTIONS[index] = updatedSection;
    
    logResponseFormat(`/admin/product-sections/${id}/toggle PATCH`, { data: updatedSection });
    return { ...updatedSection };
  },
  
  // Reorder product sections
  reorderProductSections: async (orderedIds: number[]): Promise<ProductSection[]> => {
    await simulateApiDelay(500);
    
    // Validate all IDs exist
    const allIdsExist = orderedIds.every(id => 
      MOCK_PRODUCT_SECTIONS.some(section => section.id === id)
    );
    
    if (!allIdsExist) {
      throw new Error('One or more product section IDs not found');
    }
    
    // Update display order based on the provided order
    orderedIds.forEach((id, index) => {
      const sectionIndex = MOCK_PRODUCT_SECTIONS.findIndex(section => section.id === id);
      if (sectionIndex !== -1) {
        MOCK_PRODUCT_SECTIONS[sectionIndex].display_order = index + 1;
        MOCK_PRODUCT_SECTIONS[sectionIndex].updated_at = new Date().toISOString();
      }
    });
    
    // Sort sections by display_order
    MOCK_PRODUCT_SECTIONS.sort((a, b) => a.display_order - b.display_order);
    
    logResponseFormat('/admin/product-sections/reorder POST', { data: MOCK_PRODUCT_SECTIONS });
    return [...MOCK_PRODUCT_SECTIONS];
  },
  
  // Get products for a specific section type
  getProductsForSectionType: async (sectionType: ProductSectionType, limit: number = 10): Promise<Product[]> => {
    await simulateApiDelay();
    
    let filteredProducts: Product[] = [];
    
    // Find sections of the specified type
    const sections = MOCK_PRODUCT_SECTIONS.filter(section => 
      section.type === sectionType && section.active
    );
    
    if (sections.length > 0) {
      // Get all product IDs from these sections
      const productIds = sections.flatMap(section => section.product_ids);
      
      // Get unique product IDs
      const uniqueProductIds = [...new Set(productIds)];
      
      // Get products by IDs and limit the result
      filteredProducts = getProductsByIds(uniqueProductIds).slice(0, limit);
    }
    
    logResponseFormat(`/products?type=${sectionType}&limit=${limit}`, { data: filteredProducts });
    return filteredProducts;
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
    await simulateApiDelay(300);
    
    const section = MOCK_PRODUCT_SECTIONS.find(section => section.id === id);
    
    if (!section) {
      throw new Error(`Product section with ID ${id} not found`);
    }
    
    logResponseFormat(`/admin/product-sections/${id} GET`, { data: section });
    return { ...section };
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
