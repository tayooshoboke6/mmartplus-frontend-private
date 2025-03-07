import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarRating from './StarRating';
import RatingSubmission from './RatingSubmission';
import { useAuth } from '../../contexts/AuthContext';

interface Rating {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  review: string | null;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface ProductRatingsProps {
  productId: number;
  initialAverageRating?: number;
  initialBayesianRating?: number;
  initialRatingCount?: number;
}

const RatingsContainer = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const RatingsSummary = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AverageRatingContainer = styled.div`
  margin-right: 40px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

const RatingValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;
`;

const RatingStats = styled.div`
  font-size: 14px;
  color: #666;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

const RatingsList = styled.div`
  margin-top: 24px;
`;

const NoRatingsMessage = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  text-align: center;
  color: #666;
  margin-bottom: 24px;
`;

const RatingItem = styled.div`
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewerName = styled.span`
  font-weight: 500;
  margin-right: 8px;
`;

const VerifiedBadge = styled.span`
  background-color: #4caf50;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
`;

const RatingDate = styled.span`
  color: #999;
  font-size: 13px;
`;

const ReviewText = styled.p`
  margin-top: 8px;
  line-height: 1.5;
  color: #333;
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoTooltip = styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: #4a90e2;
  cursor: help;
  position: relative;
`;

const ProductRatings: React.FC<ProductRatingsProps> = ({
  productId,
  initialAverageRating = 0,
  initialBayesianRating = 0,
  initialRatingCount = 0
}) => {
  const { isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [averageRating, setAverageRating] = useState<number>(initialAverageRating);
  const [bayesianRating, setBayesianRating] = useState<number>(initialBayesianRating);
  const [ratingCount, setRatingCount] = useState<number>(initialRatingCount);
  
  const fetchRatings = async (pageNumber: number) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/ratings?page=${pageNumber}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        if (pageNumber === 1) {
          setRatings(data.data.ratings.data);
        } else {
          setRatings(prev => [...prev, ...data.data.ratings.data]);
        }
        
        setAverageRating(data.data.average_rating);
        setBayesianRating(data.data.bayesian_rating);
        setRatingCount(data.data.rating_count);
        setHasMorePages(data.data.ratings.current_page < data.data.ratings.last_page);
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRatingSubmitted = (data: { average_rating: number; bayesian_rating: number; rating_count: number }) => {
    setAverageRating(data.average_rating);
    setBayesianRating(data.bayesian_rating);
    setRatingCount(data.rating_count);
    // Refresh the ratings list
    fetchRatings(1);
  };
  
  const loadMoreRatings = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRatings(nextPage);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  useEffect(() => {
    if (productId) {
      fetchRatings(1);
    }
  }, [productId]);
  
  return (
    <RatingsContainer>
      <SectionTitle>Ratings & Reviews</SectionTitle>
      
      <RatingsSummary>
        <AverageRatingContainer>
          <RatingValue>{bayesianRating > 0 ? bayesianRating.toFixed(1) : "0.0"}</RatingValue>
          <StarRating 
            rating={averageRating} 
            bayesianRating={bayesianRating}
            useBayesian={true}
            size="lg" 
            tooltipText="Uses Bayesian average to ensure fair ratings, especially for products with few reviews"
          />
          <RatingStats>{ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}</RatingStats>
          <InfoTooltip title="The rating is calculated using Bayesian average, which considers both the product's ratings and the global average to provide a more balanced score.">ⓘ What is this?</InfoTooltip>
        </AverageRatingContainer>
      </RatingsSummary>
      
      {isAuthenticated && (
        <RatingSubmission 
          productId={productId} 
          onRatingSubmitted={handleRatingSubmitted} 
        />
      )}
      
      <RatingsList>
        {ratings.length === 0 ? (
          <NoRatingsMessage>
            No reviews yet. Be the first to review this product!
          </NoRatingsMessage>
        ) : (
          ratings.map(rating => (
            <RatingItem key={rating.id}>
              <RatingHeader>
                <ReviewerInfo>
                  <ReviewerName>{rating.user.name}</ReviewerName>
                  {rating.verified_purchase && (
                    <VerifiedBadge>Verified Purchase</VerifiedBadge>
                  )}
                </ReviewerInfo>
                <RatingDate>{formatDate(rating.created_at)}</RatingDate>
              </RatingHeader>
              
              <StarRating rating={rating.rating} size="sm" />
              
              {rating.review && (
                <ReviewText>{rating.review}</ReviewText>
              )}
            </RatingItem>
          ))
        )}
        
        {hasMorePages && (
          <LoadMoreButton 
            onClick={loadMoreRatings}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </LoadMoreButton>
        )}
      </RatingsList>
    </RatingsContainer>
  );
};

export default ProductRatings;
