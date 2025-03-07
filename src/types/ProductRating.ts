import { User } from './User';
import { Product } from './Product';

export interface ProductRating {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  review: string | null;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  
  // Relationships
  user?: User;
  product?: Product;
}

export interface ProductRatingResponse {
  status: string;
  data: {
    average_rating: number;
    rating_count: number;
    ratings: {
      data: ProductRating[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }
  }
}

export interface RatingSubmitResponse {
  status: string;
  message: string;
  data?: {
    average_rating: number;
    rating_count: number;
  }
}
