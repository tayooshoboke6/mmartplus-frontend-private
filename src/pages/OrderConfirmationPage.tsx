import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button, SectionContainer, Spacer, Text } from '../styles/GlobalComponents';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 40px 0;
`;

const ConfirmationContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background-color: #e6f7ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const CheckIcon = styled.div`
  color: #0071BC;
  font-size: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
`;

const OrderDetails = styled.div`
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Get current date and add 5 days for estimated delivery
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <SectionContainer>
          <ConfirmationContainer>
            <IconContainer>
              <CheckIcon>
                <i className="fas fa-check"></i>
              </CheckIcon>
            </IconContainer>
            
            <Title>Order Confirmed!</Title>
            <Text>Thank you for your purchase. Your order has been received and is being processed.</Text>
            
            <OrderDetails>
              <DetailRow>
                <Text weight="500">Order Number:</Text>
                <Text>{orderNumber}</Text>
              </DetailRow>
              <DetailRow>
                <Text weight="500">Date:</Text>
                <Text>{orderDate}</Text>
              </DetailRow>
              <DetailRow>
                <Text weight="500">Estimated Delivery:</Text>
                <Text>{estimatedDelivery}</Text>
              </DetailRow>
            </OrderDetails>
            
            <Text>
              We'll send you a confirmation email with your order details and tracking information once your order ships.
            </Text>
            
            <Spacer size={20} />
            
            <ButtonContainer>
              <Button variant="outline" onClick={() => navigate('/account/orders')}>
                View Order
              </Button>
              <Button variant="primary" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </ButtonContainer>
          </ConfirmationContainer>
        </SectionContainer>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default OrderConfirmationPage;
