import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button, SectionContainer, Spacer, Text } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px 0;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  
  a {
    color: var(--dark-gray);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 8px;
    color: var(--med-gray);
  }
`;

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr 300px;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const CartHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 100px 150px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 15px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px minmax(220px, 1fr) 100px 150px;
  gap: 15px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto auto;
    gap: 10px;
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--light-gray);
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    grid-row: span 2;
  }
`;

const ProductInfo = styled.div`
  @media (max-width: 768px) {
    grid-column: 2;
  }
`;

const ProductName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const ProductMeta = styled.div`
  font-size: 13px;
  color: var(--dark-gray);
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-column: 2;
  }
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid var(--med-gray);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.div`
  width: 40px;
  height: 30px;
  border-top: 1px solid var(--med-gray);
  border-bottom: 1px solid var(--med-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

const PriceContainer = styled.div`
  font-weight: 500;
  
  @media (max-width: 768px) {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    border-top: 1px dashed var(--light-gray);
    padding-top: 10px;
  }
`;

const ActionLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;
  
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  
  &:hover {
    color: var(--dark-blue);
  }
`;

const SummarySection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: fit-content;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

interface TotalRowProps {
  final?: boolean;
}

const TotalRow = styled.div<TotalRowProps>`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: ${props => props.final ? 'none' : '1px solid var(--light-gray)'};
  
  &.grand-total {
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 10px;
  }
`;

const ShippingOptions = styled.div`
  margin-bottom: 20px;
`;

const ShippingOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  input {
    margin-right: 10px;
  }
`;

const ShippingPrice = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const DeliveryAddress = styled.div`
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const ChangeLink = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  margin-top: 5px;
  
  &:hover {
    color: var(--dark-blue);
  }
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    color: var(--med-gray);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const AddItemPrompt = styled.div`
  background-color: #f0f9ff;
  border: 1px dashed var(--primary-color);
  padding: 15px;
  margin-top: 20px;
  text-align: center;
  border-radius: 8px;
  
  p {
    margin-bottom: 10px;
  }
`;

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [deliveryOption, setDeliveryOption] = useState('home');
  
  // Calculate cart totals
  const subtotal = getCartTotal();
  const shipping = deliveryOption === 'home' ? 1000 : 0;
  const total = subtotal + shipping;
  
  // Would normally handle images properly with imports or actual URLs
  const getImagePlaceholder = (image: string) => {
    return image || 'https://via.placeholder.com/80';
  };

  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <SectionContainer>
          <BreadcrumbNav>
            <Link to="/">Home</Link>
            <span>›</span>
            <Text>Cart</Text>
          </BreadcrumbNav>
          
          <PageTitle>Cart</PageTitle>
          
          {cartItems.length === 0 ? (
            <EmptyCartMessage>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <Text size="lg">Your cart is empty</Text>
              <Spacer size={20} />
              <Button variant="primary" as={Link} to="/">Continue Shopping</Button>
            </EmptyCartMessage>
          ) : (
            <CartContainer>
              {/* Left Column - Cart Items */}
              <CartItemsSection>
                <CartHeader>
                  <div>Products</div>
                  <div>Quantity</div>
                  <div>Price</div>
                </CartHeader>
                
                {cartItems.map(item => (
                  <CartItem key={item.id}>
                    <ProductImage>
                      <img 
                        src={getImagePlaceholder(item.image)} 
                        alt={item.name} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                        }}
                      />
                    </ProductImage>
                    
                    <ProductInfo>
                      <ProductName>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </ProductName>
                      <ProductMeta>
                        Item #: {1000 + item.id}
                      </ProductMeta>
                      <ActionLinks>
                        <ActionLink onClick={() => removeFromCart(item.id)}>
                          Remove
                        </ActionLink>
                      </ActionLinks>
                    </ProductInfo>
                    
                    <QuantitySelector>
                      <QuantityButton 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        -
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </QuantityButton>
                    </QuantitySelector>
                    
                    <PriceContainer>
                      <div>Price:</div>
                      <Text weight="500">{formatCurrency(item.price * item.quantity)}</Text>
                    </PriceContainer>
                  </CartItem>
                ))}
                
                <AddItemPrompt>
                  <p>Add product worth at least {formatCurrency(50000)} and get free shipping</p>
                  <Button variant="outline" as={Link} to="/" size="small">
                    Continue Shopping
                  </Button>
                </AddItemPrompt>
              </CartItemsSection>
              
              {/* Right Column - Order Summary */}
              <SummarySection>
                <SummaryTitle>Cart Total</SummaryTitle>
                
                <SummaryRow>
                  <Text>Sub Total</Text>
                  <Text weight="500">{formatCurrency(subtotal)}</Text>
                </SummaryRow>
                
                <ShippingOptions>
                  <Text weight="500" style={{ marginBottom: '10px' }}>Delivery option</Text>
                  
                  <ShippingOption>
                    <input 
                      type="radio" 
                      name="delivery" 
                      id="home-delivery"
                      checked={deliveryOption === 'home'}
                      onChange={() => setDeliveryOption('home')}
                    />
                    <div>Home delivery</div>
                    <ShippingPrice>{formatCurrency(1000)}</ShippingPrice>
                  </ShippingOption>
                  
                  <ShippingOption>
                    <input 
                      type="radio" 
                      name="delivery" 
                      id="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={() => setDeliveryOption('pickup')}
                    />
                    <div>Pick up at shop</div>
                    <ShippingPrice>Free</ShippingPrice>
                  </ShippingOption>
                </ShippingOptions>
                
                <div>
                  <Text weight="500" style={{ marginBottom: '10px' }}>Ship to</Text>
                  <DeliveryAddress>
                    Default address:
                    <div>1234 cafe, Ajanlekoko, Ogun state.</div>
                    <ChangeLink>Change location</ChangeLink>
                  </DeliveryAddress>
                </div>
                
                <TotalRow>
                  <Text>Total</Text>
                  <Text>{formatCurrency(total)}</Text>
                </TotalRow>
                
                <Button variant="primary" fullWidth={true}>
                  Proceed to checkout
                </Button>
              </SummarySection>
            </CartContainer>
          )}
        </SectionContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default CartPage;
