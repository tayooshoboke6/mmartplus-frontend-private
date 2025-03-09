import { v4 as uuidv4 } from 'uuid';

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    image: 'https://example.com/images/electronics.jpg',
    isActive: true,
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString()
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    image: 'https://example.com/images/clothing.jpg',
    isActive: true,
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString()
  },
  {
    id: '3',
    name: 'Home & Kitchen',
    description: 'Home goods and kitchen appliances',
    image: 'https://example.com/images/home.jpg',
    isActive: true,
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString()
  },
  {
    id: '4',
    name: 'Smartphones',
    description: 'Mobile phones and accessories',
    image: 'https://example.com/images/smartphones.jpg',
    parentId: '1', // Electronics is the parent
    isActive: true,
    createdAt: new Date('2025-01-02').toISOString(),
    updatedAt: new Date('2025-01-02').toISOString()
  },
  {
    id: '5',
    name: 'Laptops',
    description: 'Laptops and computing accessories',
    image: 'https://example.com/images/laptops.jpg',
    parentId: '1', // Electronics is the parent
    isActive: true,
    createdAt: new Date('2025-01-02').toISOString(),
    updatedAt: new Date('2025-01-02').toISOString()
  }
];

// Helper functions for category operations
export const getAllCategories = (): Category[] => {
  return categories.filter(category => category.isActive);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getParentCategories = (): Category[] => {
  return categories.filter(category => !category.parentId && category.isActive);
};

export const getSubcategories = (parentId: string): Category[] => {
  return categories.filter(category => category.parentId === parentId && category.isActive);
};

export const createCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
  const newCategory: Category = {
    ...categoryData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id: string, categoryData: Partial<Category>): Category | null => {
  const index = categories.findIndex(category => category.id === id);
  if (index === -1) return null;
  
  categories[index] = {
    ...categories[index],
    ...categoryData,
    updatedAt: new Date().toISOString()
  };
  
  return categories[index];
};

export const deleteCategory = (id: string): boolean => {
  const index = categories.findIndex(category => category.id === id);
  if (index === -1) return false;
  
  // Soft delete by setting isActive to false
  categories[index].isActive = false;
  categories[index].updatedAt = new Date().toISOString();
  
  return true;
};
