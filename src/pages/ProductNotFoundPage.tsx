import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 300px;
  margin: 0 auto 30px;
  display: block;
`;

const ContinueButton = styled.button`
  background-color: #0066b2;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #005091;
  }
`;

const Suggestions = styled.div`
  margin: 40px 0;
  
  h3 {
    margin-bottom: 15px;
    font-size: 18px;
  }
`;

const ProductNotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || 'the product';
  
  const handleContinueShopping = () => {
    navigate('/');
  };
  
  return (
    <Layout>
      <Container>
        <ProductImage 
          src="/images/not-found.png" 
          alt="Product Not Found" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=Product+Not+Found';
            target.onerror = null;
          }}
        />
        <Title>Product Not Found</Title>
        <Message>
          We're sorry, but we couldn't find any products matching "<strong>{searchQuery}</strong>".
          <br />
          Please try searching with different keywords or browse our categories.
        </Message>
        
        <Suggestions>
          <h3>You might want to:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>• Check the spelling of your search terms</li>
            <li>• Try using more general keywords</li>
            <li>• Browse products by category instead</li>
            <li>• Contact customer support if you need assistance</li>
          </ul>
        </Suggestions>
        
        <ContinueButton onClick={handleContinueShopping}>
          Continue Shopping
        </ContinueButton>
      </Container>
    </Layout>
  );
};

export default ProductNotFoundPage;
