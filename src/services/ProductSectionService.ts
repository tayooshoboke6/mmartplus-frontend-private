import { ProductSection, ProductSectionType } from '../models/ProductSection';
import { Product } from '../types/Product';

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Golden Penny Semovita - 5kg',
    price: 5500,
    oldPrice: 6000,
    discount: 8,
    image: '/products/golden-penny-semovita.jpg',
    category: 'Staples & Grains',
    rating: 4.8,
    reviewCount: 42,
    isFeatured: true,
    expiryDate: '2025-05-15'
  },
  {
    id: 2,
    name: 'Sunlight Detergent Powder - 900g',
    price: 1200,
    oldPrice: 1500,
    discount: 20,
    image: '/products/sunlight-detergent.jpg',
    category: 'Cleaning & Laundry',
    rating: 4.2,
    reviewCount: 63,
    isFeatured: true
  },
  {
    id: 3,
    name: 'Mamador Cooking Oil - 3.8L',
    price: 8500,
    oldPrice: 9000,
    discount: 5,
    image: '/products/mamador-oil.jpg',
    category: 'Cooking Essentials',
    rating: 4.5,
    reviewCount: 32,
    isFeatured: true
  },
  {
    id: 4,
    name: 'Indomie Instant Noodles (Chicken Flavor) - Pack of 40',
    price: 7200,
    oldPrice: 7500,
    discount: 4,
    image: '/products/indomie-noodles.jpg',
    category: 'Packaged & Frozen Foods',
    rating: 4.7,
    reviewCount: 87,
    isFeatured: true
  },
  {
    id: 5,
    name: 'Peak Milk Powder - 900g',
    price: 4400,
    oldPrice: 4800,
    discount: 8,
    image: '/products/peak-milk.jpg',
    category: 'Dairy & Breakfast',
    rating: 4.4,
    reviewCount: 55,
    isFeatured: true
  },
  {
    id: 6,
    name: 'Mortein Insecticide Spray - 600ml',
    price: 2400,
    oldPrice: 2600,
    discount: 8,
    image: '/products/mortein-spray.jpg',
    category: 'Pest Control & Safety',
    rating: 4.1,
    reviewCount: 29,
    isFeatured: true
  },
  {
    id: 7,
    name: 'Dano Milk Powder - 800g',
    price: 4100,
    oldPrice: 4500,
    discount: 9,
    image: '/products/dano-milk.jpg',
    category: 'Dairy & Breakfast',
    rating: 4.3,
    reviewCount: 47,
    isFeatured: false,
    expiryDate: '2025-04-10'
  },
  {
    id: 8,
    name: 'Ariel Detergent - 1kg',
    price: 1800,
    oldPrice: 2000,
    discount: 10,
    image: '/products/ariel-detergent.jpg',
    category: 'Cleaning & Laundry',
    rating: 4.6,
    reviewCount: 73,
    isFeatured: false,
    expiryDate: '2025-04-05'
  },
  {
    id: 9,
    name: 'Titus Sardines - Pack of 5',
    price: 3200,
    oldPrice: 3500,
    discount: 9,
    image: '/products/titus-sardines.jpg',
    category: 'Canned Foods',
    rating: 4.2,
    reviewCount: 38,
    isFeatured: false,
    expiryDate: '2025-04-20'
  },
  {
    id: 10,
    name: 'Knorr Chicken Cubes - Box of 50',
    price: 1500,
    oldPrice: 1700,
    discount: 12,
    image: '/products/knorr-cubes.jpg',
    category: 'Cooking Essentials',
    rating: 4.5,
    reviewCount: 92,
    isFeatured: false
  }
];

// Initial product sections
const initialProductSections: ProductSection[] = [
  {
    id: 1,
    title: 'Featured Products',
    type: ProductSectionType.FEATURED,
    active: true,
    displayOrder: 1,
    productIds: [1, 2, 3, 4, 5, 6],
    backgroundColor: '#f9f9f9',
    textColor: '#333333',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: 2,
    title: 'About to Expire - Hot Deals!',
    type: ProductSectionType.EXPIRING_SOON,
    active: true,
    displayOrder: 2,
    productIds: [7, 8, 9],
    backgroundColor: '#fff8e1',
    textColor: '#ff6d00',
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-02-20')
  },
  {
    id: 3,
    title: 'New Arrivals',
    type: ProductSectionType.NEW_ARRIVALS,
    active: false,
    displayOrder: 3,
    productIds: [10],
    backgroundColor: '#e3f2fd',
    textColor: '#0066b2',
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01')
  }
];

// Local storage keys
const PRODUCT_SECTIONS_STORAGE_KEY = 'mmart_product_sections';
const PRODUCTS_STORAGE_KEY = 'mmart_products';

// Helper to get data from localStorage with fallback to initial data
const getStoredData = <T>(key: string, initialData: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : initialData;
};

// Helper to save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Product section service methods
export const getProductSections = (): ProductSection[] => {
  return getStoredData<ProductSection[]>(PRODUCT_SECTIONS_STORAGE_KEY, initialProductSections);
};

export const getActiveProductSections = (): ProductSection[] => {
  const sections = getProductSections();
  return sections.filter(section => section.active).sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getProductSectionById = (id: number): ProductSection | undefined => {
  const sections = getProductSections();
  return sections.find(section => section.id === id);
};

export const createProductSection = (newSection: Omit<ProductSection, 'id' | 'createdAt' | 'updatedAt'>): ProductSection => {
  const sections = getProductSections();
  
  // Generate a new ID
  const maxId = sections.reduce((max, section) => Math.max(max, section.id), 0);
  const now = new Date();
  
  // Set default values for styling if not provided
  const defaultBackgroundColor = '#f7f7f7'; // Light gray background like featured products
  const defaultTextColor = '#333333'; // Dark gray text for readability
  
  const productSection: ProductSection = {
    ...newSection,
    id: maxId + 1,
    backgroundColor: newSection.backgroundColor || defaultBackgroundColor,
    textColor: newSection.textColor || defaultTextColor,
    createdAt: now,
    updatedAt: now
  };
  
  const updatedSections = [...sections, productSection];
  saveData(PRODUCT_SECTIONS_STORAGE_KEY, updatedSections);
  
  return productSection;
};

export const updateProductSection = (updatedSection: ProductSection): ProductSection => {
  const sections = getProductSections();
  const now = new Date();
  
  const updatedSections = sections.map(section => 
    section.id === updatedSection.id 
      ? { ...updatedSection, updatedAt: now } 
      : section
  );
  
  saveData(PRODUCT_SECTIONS_STORAGE_KEY, updatedSections);
  return { ...updatedSection, updatedAt: now };
};

export const deleteProductSection = (id: number): void => {
  const sections = getProductSections();
  const updatedSections = sections.filter(section => section.id !== id);
  saveData(PRODUCT_SECTIONS_STORAGE_KEY, updatedSections);
};

export const toggleProductSectionStatus = (id: number): ProductSection => {
  const sections = getProductSections();
  const section = sections.find(s => s.id === id);
  
  if (!section) {
    throw new Error(`Product section with ID ${id} not found`);
  }
  
  const updatedSection = { 
    ...section, 
    active: !section.active,
    updatedAt: new Date()
  };
  
  const updatedSections = sections.map(s => 
    s.id === id ? updatedSection : s
  );
  
  saveData(PRODUCT_SECTIONS_STORAGE_KEY, updatedSections);
  return updatedSection;
};

export const reorderProductSections = (orderedIds: number[]): ProductSection[] => {
  const sections = getProductSections();
  const now = new Date();
  
  // Create a map for quick lookups
  const sectionMap = new Map(sections.map(section => [section.id, section]));
  
  // Update the display order based on the provided order
  const updatedSections = sections.map(section => {
    const newOrder = orderedIds.indexOf(section.id);
    if (newOrder !== -1) {
      return { 
        ...section, 
        displayOrder: newOrder + 1,
        updatedAt: now
      };
    }
    return section;
  });
  
  saveData(PRODUCT_SECTIONS_STORAGE_KEY, updatedSections);
  return updatedSections;
};

// Product methods
export const getAllProducts = (): Product[] => {
  return getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, mockProducts);
};

export const getProductsByIds = (ids: number[]): Product[] => {
  const products = getAllProducts();
  return products.filter(product => ids.includes(product.id));
};

export const getProductsForSection = (sectionId: number): Product[] => {
  const section = getProductSectionById(sectionId);
  if (!section) return [];
  
  return getProductsByIds(section.productIds);
};

// Get products with their section data
export const getProductSectionsWithProducts = () => {
  const sections = getActiveProductSections();
  const products = getAllProducts();
  
  return sections.map(section => {
    const sectionProducts = section.productIds
      .map(id => products.find(p => p.id === id))
      .filter(p => p !== undefined) as Product[];
      
    return {
      ...section,
      products: sectionProducts
    };
  });
};
