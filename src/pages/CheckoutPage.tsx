import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button, SectionContainer, Spacer, Text } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import AddressService from '../services/AddressService';
import PaymentService from '../services/PaymentService';
import StoreAddressService from '../services/StoreAddressService';
import { Address } from '../models/Address';
import { PaymentMethod } from '../models/PaymentMethod';
import { StoreAddress } from '../models/StoreAddress';

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

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const CheckoutContainer = styled.div`
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

const CheckoutSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: sticky;
  top: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const TotalRow = styled(SummaryRow)`
  font-weight: 500;
  font-size: 18px;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px solid #f0f0f0;
`;

const AddressCard = styled.div`
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 15px;
`;

const PaymentMethodCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 15px;
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PaymentDetails = styled.div`
  flex: 1;
`;

const PaymentName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const PaymentDescription = styled.div`
  font-size: 13px;
  color: #666;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #fdeded;
  border-radius: 6px;
  margin-bottom: 20px;
  color: #d32f2f;
`;

// Helper function to get icon element based on payment method code
const getPaymentIcon = (code: string) => {
  switch (code) {
    case 'card':
      return <i className="fas fa-credit-card"></i>;
    case 'bank_transfer':
      return <i className="fas fa-university"></i>;
    case 'cod':
      return <i className="fas fa-money-bill-wave"></i>;
    case 'mobile_money':
      return <i className="fas fa-mobile-alt"></i>;
    case 'paypal':
      return <i className="fab fa-paypal"></i>;
    default:
      return <i className="fas fa-money-check"></i>;
  }
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [store, setStore] = useState<StoreAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<string>('home');
  const [processingOrder, setProcessingOrder] = useState(false);
  
  // Parse query parameters
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('payment');
        const addressId = params.get('address');
        const storeId = params.get('store');
        const delivery = params.get('delivery');
        
        if (!paymentId) {
          throw new Error('Payment method not specified');
        }
        
        // Set delivery option
        setDeliveryOption(delivery || 'home');
        
        // Fetch payment method
        const paymentMethodData = await PaymentService.getPaymentMethodById(paymentId);
        if (!paymentMethodData) {
          throw new Error('Invalid payment method');
        }
        setPaymentMethod(paymentMethodData);
        
        // Fetch address or store based on delivery option
        if (delivery === 'home') {
          if (!addressId) {
            throw new Error('Delivery address not specified');
          }
          
          const addressData = await AddressService.getAddressById(addressId);
          if (!addressData) {
            throw new Error('Invalid delivery address');
          }
          setAddress(addressData);
        } else if (delivery === 'pickup') {
          if (!storeId) {
            throw new Error('Pickup store not specified');
          }
          
          const storeData = await StoreAddressService.getStoreAddressById(storeId);
          if (!storeData) {
            throw new Error('Invalid pickup store');
          }
          setStore(storeData);
        }
      } catch (err) {
        console.error('Error setting up checkout:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during checkout setup');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckoutData();
  }, [location.search]);
  
  // Calculate order totals
  const subtotal = getCartTotal();
  const shipping = deliveryOption === 'home' ? 1000 : 0;
  
  // Calculate processing fee if applicable
  const processingFee = paymentMethod?.processingFee 
    ? (paymentMethod.processingFeeType === 'percentage' 
        ? (subtotal * paymentMethod.processingFee) / 100 
        : paymentMethod.processingFee)
    : 0;
  
  // Calculate final total
  const total = subtotal + shipping + processingFee;
  
  // Handle place order button click
  const handlePlaceOrder = async () => {
    try {
      setProcessingOrder(true);
      
      // In a real app, you would make an API call to create the order
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the cart
      clearCart();
      
      // Navigate to order confirmation page
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place your order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };
  
  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [cartItems, loading, navigate]);
  
  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <SectionContainer>
            <LoadingContainer>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <Text>Setting up your checkout...</Text>
            </LoadingContainer>
          </SectionContainer>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <SectionContainer>
            <ErrorContainer>
              <Text weight="500">Error: {error}</Text>
              <Spacer size={10} />
              <Button variant="outline" onClick={() => navigate('/cart')}>
                Return to Cart
              </Button>
            </ErrorContainer>
          </SectionContainer>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <SectionContainer>
          <PageTitle>Checkout</PageTitle>
          
          <CheckoutContainer>
            {/* Left Column - Checkout Details */}
            <div>
              {/* Delivery Information */}
              <CheckoutSection>
                <SectionTitle>Delivery Information</SectionTitle>
                
                <div>
                  <Text weight="500" style={{ marginBottom: '10px' }}>Delivery Method</Text>
                  <Text>{deliveryOption === 'home' ? 'Home Delivery' : 'Pick up at Store'}</Text>
                </div>
                
                {deliveryOption === 'home' && address && (
                  <div style={{ marginTop: '20px' }}>
                    <Text weight="500" style={{ marginBottom: '10px' }}>Delivery Address</Text>
                    <AddressCard>
                      <Text weight="500">{address.name}</Text>
                      <Text>{address.street}</Text>
                      <Text>{address.city}, {address.state}, {address.postalCode}</Text>
                      <Text>{address.phone}</Text>
                    </AddressCard>
                  </div>
                )}
                
                {deliveryOption === 'pickup' && store && (
                  <div style={{ marginTop: '20px' }}>
                    <Text weight="500" style={{ marginBottom: '10px' }}>Pickup Store</Text>
                    <AddressCard>
                      <Text weight="500">{store.name}</Text>
                      <Text>{store.street}</Text>
                      <Text>{store.city}, {store.state}, {store.postalCode}</Text>
                      <Text>{store.phone}</Text>
                      
                      {store.openingHours && (
                        <div style={{ marginTop: '10px' }}>
                          <Text weight="500">Opening Hours:</Text>
                          <Text>{getStoreHoursForToday(store)}</Text>
                        </div>
                      )}
                      
                      {store.pickupInstructions && (
                        <div style={{ marginTop: '10px' }}>
                          <Text weight="500">Pickup Instructions:</Text>
                          <Text>{store.pickupInstructions}</Text>
                        </div>
                      )}
                    </AddressCard>
                  </div>
                )}
              </CheckoutSection>
              
              {/* Payment Information */}
              <CheckoutSection>
                <SectionTitle>Payment Information</SectionTitle>
                
                {paymentMethod && (
                  <PaymentMethodCard>
                    <PaymentIcon>
                      {getPaymentIcon(paymentMethod.code)}
                    </PaymentIcon>
                    <PaymentDetails>
                      <PaymentName>{paymentMethod.name}</PaymentName>
                      <PaymentDescription>{paymentMethod.description}</PaymentDescription>
                    </PaymentDetails>
                  </PaymentMethodCard>
                )}
                
                {paymentMethod?.code === 'bank_transfer' && (
                  <div style={{ marginTop: '15px' }}>
                    <Text weight="500" style={{ marginBottom: '10px' }}>Bank Transfer Instructions</Text>
                    <Text>Please transfer the total amount to the following account:</Text>
                    <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px', margin: '10px 0' }}>
                      <Text>Bank: First Bank of Nigeria</Text>
                      <Text>Account Name: M-Mart Plus</Text>
                      <Text>Account Number: 1234567890</Text>
                      <Text>Reference: Your Order ID (will be provided after checkout)</Text>
                    </div>
                    <Text size="sm">Your order will be processed once payment is confirmed.</Text>
                  </div>
                )}
                
                {paymentMethod?.code === 'cod' && (
                  <div style={{ marginTop: '15px' }}>
                    <Text size="sm">Please have the exact amount ready when your order is delivered.</Text>
                  </div>
                )}
              </CheckoutSection>
              
              {/* Order Items */}
              <CheckoutSection>
                <SectionTitle>Order Items ({cartItems.length})</SectionTitle>
                
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '60px', height: '60px', marginRight: '15px' }}>
                      <img 
                        src={item.image || 'https://via.placeholder.com/60'} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text weight="500">{item.name}</Text>
                      <Text size="sm" style={{ color: '#666' }}>Quantity: {item.quantity}</Text>
                    </div>
                    <div>
                      <Text weight="500">{formatCurrency(item.price * item.quantity)}</Text>
                    </div>
                  </div>
                ))}
              </CheckoutSection>
            </div>
            
            {/* Right Column - Order Summary */}
            <div>
              <OrderSummary>
                <SectionTitle>Order Summary</SectionTitle>
                
                <SummaryRow>
                  <Text>Subtotal</Text>
                  <Text>{formatCurrency(subtotal)}</Text>
                </SummaryRow>
                
                <SummaryRow>
                  <Text>Shipping</Text>
                  <Text>{deliveryOption === 'home' ? formatCurrency(shipping) : 'Free'}</Text>
                </SummaryRow>
                
                {processingFee > 0 && (
                  <SummaryRow>
                    <Text>Processing Fee</Text>
                    <Text>{formatCurrency(processingFee)}</Text>
                  </SummaryRow>
                )}
                
                <TotalRow>
                  <Text>Total</Text>
                  <Text>{formatCurrency(total)}</Text>
                </TotalRow>
                
                <Spacer size={20} />
                
                <Button 
                  variant="primary" 
                  fullWidth={true}
                  onClick={handlePlaceOrder}
                  disabled={processingOrder}
                >
                  {processingOrder ? 'Processing...' : 'Place Order'}
                </Button>
                
                <Spacer size={15} />
                
                <Text size="sm" style={{ textAlign: 'center', color: '#666' }}>
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </Text>
              </OrderSummary>
            </div>
          </CheckoutContainer>
        </SectionContainer>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

// Helper function to get store hours for today
const getStoreHoursForToday = (store: StoreAddress) => {
  if (!store.openingHours) return 'Not available';
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const hours = store.openingHours[today as keyof typeof store.openingHours];
  
  if (!hours.isOpen) return 'Closed today';
  return `${hours.open} - ${hours.close}`;
};

export default CheckoutPage;
