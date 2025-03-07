import { api } from './api';
import { 
  ProductRatingResponse,
  RatingSubmitResponse
} from '../types/ProductRating';

/**
 * Get ratings for a specific product
 * @param productId - The ID of the product
 * @param page - The page number for pagination
 */
export const getProductRatings = async (productId: number, page: number = 1): Promise<ProductRatingResponse> => {
  try {
    const response = await api.get(`/products/${productId}/ratings?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product ratings:', error);
    throw error;
  }
};

/**
 * Submit a new rating for a product
 * @param productId - The ID of the product
 * @param rating - Rating value (1-5)
 * @param review - Optional review text
 */
export const submitProductRating = async (
  productId: number,
  rating: number,
  review?: string
): Promise<RatingSubmitResponse> => {
  try {
    const response = await api.post(`/products/${productId}/ratings`, {
      rating,
      review: review || null
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting product rating:', error);
    throw error;
  }
};

/**
 * Delete a product rating
 * @param ratingId - The ID of the rating to delete
 */
export const deleteProductRating = async (ratingId: number): Promise<RatingSubmitResponse> => {
  try {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product rating:', error);
    throw error;
  }
};
