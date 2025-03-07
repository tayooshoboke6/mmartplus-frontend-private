import React, { useState } from 'react';
import styled from 'styled-components';
import StarRating from './StarRating';
import { useAuth } from '../../contexts/AuthContext';

interface RatingSubmissionProps {
  productId: number;
  onRatingSubmitted: (data: { average_rating: number; bayesian_rating: number; rating_count: number }) => void;
}

const RatingSubmissionContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
`;

const RatingArea = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const RatingLabel = styled.span`
  margin-right: 12px;
  font-weight: 500;
`;

const TextareaContainer = styled.div`
  margin-bottom: 16px;
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-height: 100px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #b1b1b1;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  margin-bottom: 16px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: #43a047;
  margin-bottom: 16px;
  font-size: 14px;
  background-color: #e8f5e9;
  border-left: 4px solid #43a047;
  padding: 12px;
  display: flex;
  align-items: center;
`;

const SuccessIcon = styled.div`
  margin-right: 8px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NotLoggedInMessage = styled.div`
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
  padding: 12px;
  margin-bottom: 16px;
`;

const RatingSubmission: React.FC<RatingSubmissionProps> = ({ productId, onRatingSubmitted }) => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const maxReviewLength = 1000;
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxReviewLength) {
      setReview(value);
    }
  };
  
  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          rating, 
          review: review.trim() || null 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit rating');
      }
      
      setSuccess('Your rating has been submitted successfully!');
      setRating(0);
      setReview('');
      
      // Notify parent component about the new rating data
      if (data.data) {
        onRatingSubmitted(data.data);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your rating');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <RatingSubmissionContainer>
        <Title>Write a Review</Title>
        <NotLoggedInMessage>
          Please log in to submit a rating and review.
        </NotLoggedInMessage>
      </RatingSubmissionContainer>
    );
  }
  
  return (
    <RatingSubmissionContainer>
      <Title>Write a Review</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && (
        <SuccessMessage>
          <SuccessIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </SuccessIcon>
          <div>
            <strong>Thank you for your feedback!</strong> Your rating has been submitted successfully and is now visible to other customers.
          </div>
        </SuccessMessage>
      )}
      
      <RatingArea>
        <RatingLabel>Your Rating:</RatingLabel>
        <StarRating 
          rating={rating} 
          interactive={true} 
          onRatingChange={handleRatingChange} 
        />
      </RatingArea>
      
      <TextareaContainer>
        <ReviewTextarea 
          placeholder="Write your review here (optional)"
          value={review}
          onChange={handleReviewChange}
          maxLength={maxReviewLength}
        />
        <CharCount>{review.length}/{maxReviewLength}</CharCount>
      </TextareaContainer>
      
      <SubmitButton 
        onClick={handleSubmit}
        disabled={loading || rating === 0}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </SubmitButton>
    </RatingSubmissionContainer>
  );
};

export default RatingSubmission;
