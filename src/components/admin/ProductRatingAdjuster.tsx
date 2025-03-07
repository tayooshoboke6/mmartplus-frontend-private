import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types/Product';

const Container = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
`;

const Title = styled.h3`
  font-size: 16px;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: var(--text-secondary);
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  grid-column: span 2;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-disabled);
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${props => props.type === 'success' ? 'var(--success-light)' : 'var(--error-light)'};
  color: ${props => props.type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
`;

interface ProductRatingAdjusterProps {
  product: Product;
  onRatingUpdated?: (updatedProduct: Product) => void;
}

const ProductRatingAdjuster: React.FC<ProductRatingAdjusterProps> = ({ 
  product, 
  onRatingUpdated 
}) => {
  const { getAccessToken } = useAuth();
  const [averageRating, setAverageRating] = useState<number>(product.average_rating || 0);
  const [bayesianRating, setBayesianRating] = useState<number>(product.bayesian_rating || 0);
  const [ratingCount, setRatingCount] = useState<number>(product.rating_count || 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = await getAccessToken();
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/products/${product.id}/ratings`,
        {
          average_rating: parseFloat(averageRating.toString()),
          bayesian_rating: parseFloat(bayesianRating.toString()),
          rating_count: parseInt(ratingCount.toString())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage({
          text: 'Product ratings updated successfully',
          type: 'success'
        });
        
        if (onRatingUpdated && response.data.product) {
          onRatingUpdated(response.data.product);
        }
      }
    } catch (error) {
      console.error('Error updating product ratings:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to update product ratings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Admin Rating Adjustment</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="averageRating">Average Rating (0-5)</Label>
          <Input
            id="averageRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={averageRating}
            onChange={(e) => setAverageRating(parseFloat(e.target.value))}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="bayesianRating">Bayesian Rating (0-5)</Label>
          <Input
            id="bayesianRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={bayesianRating}
            onChange={(e) => setBayesianRating(parseFloat(e.target.value))}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="ratingCount">Rating Count</Label>
          <Input
            id="ratingCount"
            type="number"
            min="0"
            value={ratingCount}
            onChange={(e) => setRatingCount(parseInt(e.target.value))}
            required
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Ratings'}
        </SubmitButton>
      </Form>
      
      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}
    </Container>
  );
};

export default ProductRatingAdjuster;
