import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from '../product/ProductCard';
import productService from '../../services/productService';
import { Product } from '../../services/productService';
import LoadingSpinner from '../common/LoadingSpinner';

const Container = styled.div`
  margin: 30px 0;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 20px 0;
  }
  
  @media (max-width: 480px) {
    margin: 15px 0;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  @media (max-width: 375px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &.prev {
    left: -20px;
  }
  
  &.next {
    right: -20px;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    
    &.prev {
      left: -10px;
    }
    
    &.next {
      right: -10px;
    }
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ProductSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const featuredProducts = await productService.getFeaturedProducts();
        setProducts(featuredProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <ProductsGrid>
        {products.map(product => (
          <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.images?.[0] || "https://dummyimage.com/300x200/"}
            price={product.price}
            oldPrice={product.discount_price ? product.price : undefined}
            discount={product.discount_price !== undefined}
            rating={product.rating}
            reviewCount={product.review_count}
            deliveryDays={2}
            category={product.category?.name}
          />
        ))}
      </ProductsGrid>
      
      <NavigationButton className="prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </NavigationButton>
      
      <NavigationButton className="next">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </NavigationButton>
    </Container>
  );
};

export default ProductSection;
