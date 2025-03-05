import { Category } from '../services/categoryService';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price?: number | null;
  stock: number;
  sku: string;
  barcode?: string | null;
  is_featured: boolean;
  is_active: boolean;
  category_id: number;
  expiry_date?: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
  
  // Computed properties
  is_on_sale?: boolean;
  is_in_stock?: boolean;
  discount_percentage?: number | null;
  formatted_price?: string;
  
  // Relationships
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string; 
  sku: string;
  stock: string; 
  category_id: string; 
  is_featured: boolean;
  is_active: boolean;
  expiry_date?: string;
  images?: File[];
  existing_images?: string[];
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}
