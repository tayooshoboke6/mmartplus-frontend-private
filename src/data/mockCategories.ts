import type { Category } from '../types/category';

export const mockCategories: Category[] = [
  { id: 1, name: 'Dairy', slug: 'dairy', description: 'All dairy products', image_url: null, parent_id: null, color: '#4CAF50', order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: 2, name: 'Grains & Rice', slug: 'grains-rice', description: 'Grains, rice, pasta', image_url: null, parent_id: null, color: '#2196F3', order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: 3, name: 'Meat & Seafood', slug: 'meat-seafood', description: 'Fresh meat and seafood', image_url: null, parent_id: null, color: '#F44336', order: 3, is_active: true, created_at: '', updated_at: '' },
  { id: 4, name: 'Household', slug: 'household', description: 'Household supplies', image_url: null, parent_id: null, color: '#FF9800', order: 4, is_active: true, created_at: '', updated_at: '' },
  { id: 5, name: 'Milk', slug: 'milk', description: 'Fresh milk', image_url: null, parent_id: 1, color: '#8BC34A', order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: 6, name: 'Cheese', slug: 'cheese', description: 'Various types of cheese', image_url: null, parent_id: 1, color: '#CDDC39', order: 2, is_active: true, created_at: '', updated_at: '' }
];
