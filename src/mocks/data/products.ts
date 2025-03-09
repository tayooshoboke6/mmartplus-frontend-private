import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  categoryId: string;
  stock: number;
  sku: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
    price: 199.99,
    discountPrice: 179.99,
    images: [
      'https://example.com/images/headphones-1.jpg',
      'https://example.com/images/headphones-2.jpg',
    ],
    categoryId: '1', // Electronics
    stock: 50,
    sku: 'HDPH-001',
    isActive: true,
    rating: 4.7,
    reviewCount: 128,
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-02-15').toISOString()
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt, perfect for everyday wear.',
    price: 29.99,
    images: [
      'https://example.com/images/tshirt-1.jpg',
      'https://example.com/images/tshirt-2.jpg',
    ],
    categoryId: '2', // Clothing
    stock: 200,
    sku: 'TSHRT-002',
    isActive: true,
    rating: 4.5,
    reviewCount: 87,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    id: '3',
    name: 'Smart Home Hub',
    description: 'Control all your smart home devices from one central hub with voice commands.',
    price: 149.99,
    discountPrice: 129.99,
    images: [
      'https://example.com/images/smarthub-1.jpg',
      'https://example.com/images/smarthub-2.jpg',
    ],
    categoryId: '1', // Electronics
    stock: 30,
    sku: 'SMHUB-003',
    isActive: true,
    rating: 4.2,
    reviewCount: 45,
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date('2025-02-01').toISOString()
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    description: 'Eco-friendly 24oz water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 24.99,
    images: [
      'https://example.com/images/bottle-1.jpg',
      'https://example.com/images/bottle-2.jpg',
    ],
    categoryId: '3', // Home & Kitchen
    stock: 150,
    sku: 'WTBTL-004',
    isActive: true,
    rating: 4.8,
    reviewCount: 210,
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString()
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    discountPrice: 34.99,
    images: [
      'https://example.com/images/charger-1.jpg',
      'https://example.com/images/charger-2.jpg',
    ],
    categoryId: '1', // Electronics
    stock: 75,
    sku: 'CHRG-005',
    isActive: true,
    rating: 4.4,
    reviewCount: 68,
    createdAt: new Date('2025-02-10').toISOString(),
    updatedAt: new Date('2025-02-10').toISOString()
  }
];

// Helper functions for product operations
export const getAllProducts = (): Product[] => {
  return products.filter(product => product.isActive);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId && product.isActive);
};

export const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (id: string, productData: Partial<Product>): Product | null => {
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString()
  };
  
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return false;
  
  // Soft delete by setting isActive to false
  products[index].isActive = false;
  products[index].updatedAt = new Date().toISOString();
  
  return true;
};
