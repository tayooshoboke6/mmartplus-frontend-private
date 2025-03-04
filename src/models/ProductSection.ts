import { Product } from '../types/Product';

export interface ProductSection {
  id: number;
  title: string;
  type: ProductSectionType;
  active: boolean;
  displayOrder: number;
  productIds: number[];
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductSectionType {
  FEATURED = 'featured',
  HOT_DEALS = 'hot_deals',
  NEW_ARRIVALS = 'new_arrivals',
  EXPIRING_SOON = 'expiring_soon',
  BEST_SELLERS = 'best_sellers',
  CUSTOM = 'custom'
}

export interface ProductSectionWithProducts extends ProductSection {
  products: Product[];
}
