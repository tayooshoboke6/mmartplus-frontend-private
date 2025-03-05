import { Product } from '../types/Product';

export interface ProductSection {
  id: number;
  title: string;
  description?: string;
  type: ProductSectionType;
  background_color: string;
  text_color: string;
  product_ids: number[];
  display_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Virtual attribute that may be populated on the frontend
  products?: Product[];
}

export enum ProductSectionType {
  FEATURED = 'featured',
  HOT_DEALS = 'hot_deals',
  NEW_ARRIVALS = 'new_arrivals',
  EXPIRING_SOON = 'expiring_soon',
  BEST_SELLERS = 'best_sellers',
  CLEARANCE = 'clearance',
  RECOMMENDED = 'recommended',
  CUSTOM = 'custom'
}

export interface ProductSectionWithProducts extends ProductSection {
  products: Product[];
}
