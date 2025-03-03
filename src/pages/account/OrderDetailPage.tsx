import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaShoppingBag, 
  FaArrowLeft, 
  FaPrint, 
  FaFileInvoice, 
  FaBan,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import orderService, { Order, OrderStatus } from '../../services/orderService';
import AccountSidebar from '../../components/account/AccountSidebar';
import OrderStatusBadge from '../../components/account/OrderStatusBadge';
import OrderTracking from '../../components/account/OrderTracking';
import OrderItemList from '../../components/account/OrderItemList';
import { formatCurrency } from '../../utils/formatCurrency';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OrderContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #0066cc;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 500;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContentHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OrderMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderId = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 14px;
`;

const OrderStatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const OrderSummary = styled.div`
  margin-bottom: 20px;
`;

const OrderSummaryTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
`;

const OrderSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ItemName = styled.div`
  font-size: 14px;
  color: #666;
`;

const ItemValue = styled.div`
  font-size: 14px;
  color: #333;
`;

const OrderSection = styled.div`
  margin-bottom: 20px;
`;

const OrderSectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
`;

const AddressBox = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
`;

const AddressTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
`;

const AddressText = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const OrderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  background-color: #fff;
  color: #0066cc;
  border: 1px solid #0066cc;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f7ff;
  }
  
  svg {
    margin-right: 8px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: #fff;
    }
  }
`;

const DangerButton = styled(ActionButton)`
  color: #d32f2f;
  border-color: #d32f2f;
  
  &:hover {
    background-color: #fff8f8;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: #666;
  font-size: 16px;
`;

interface RouteParams {
  id: string;
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchOrderDetail(parseInt(id));
    }
  }, [id]);
  
  const fetchOrderDetail = async (orderId: number) => {
    setLoading(true);
    try {
      // In a real app, you would use the API call:
      // const response = await orderService.getOrderDetail(orderId);
      
      // For development, we'll use mock data
      const response = orderService.getMockOrderDetail(orderId);
      setOrder(response.order);
    } catch (error) {
      setError(`Error fetching order #${orderId}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        // In a real app, you would use the API call:
        // await orderService.cancelOrder(order.id);
        
        // For development, we'll just update the local state
        setOrder({
          ...order,
          status: OrderStatus.CANCELLED
        });
      } catch (error) {
        setError(`Error cancelling order #${order.id}: ${error.message}`);
      }
    }
  };
  
  // Check if order can be cancelled
  const canCancel = () => {
    if (!order) return false;
    
    return order.status === OrderStatus.PENDING || 
           order.status === OrderStatus.PROCESSING;
  };
  
  // Handle print order
  const handlePrintOrder = () => {
    window.print();
  };
  
  return (
    <PageContainer>
      <title>Order Details | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <BackLink to="/account/orders">
          <FaArrowLeft />
          Back to Orders
        </BackLink>
        
        <ContentContainer>
          <AccountSidebar />
          
          <OrderContent>
            {loading ? (
              <Loader>Loading order details...</Loader>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : order ? (
              <>
                <ContentHeader>
                  <HeaderTitle>
                    <FaShoppingBag size={20} />
                    Order Details
                  </HeaderTitle>
                </ContentHeader>
                
                <OrderInfo>
                  <OrderMeta>
                    <OrderId>Order #{order.id}</OrderId>
                    <OrderDate>Placed on {formatDate(order.created_at)}</OrderDate>
                  </OrderMeta>
                  <OrderStatusContainer>
                    <OrderStatusBadge status={order.status} />
                  </OrderStatusContainer>
                </OrderInfo>
                
                <OrderSummary>
                  <OrderSummaryTitle>
                    Order Summary
                  </OrderSummaryTitle>
                  <OrderSummaryItem>
                    <ItemName>Order ID:</ItemName>
                    <ItemValue>{order.id}</ItemValue>
                  </OrderSummaryItem>
                  <OrderSummaryItem>
                    <ItemName>Date:</ItemName>
                    <ItemValue>{formatDate(order.created_at)}</ItemValue>
                  </OrderSummaryItem>
                  <OrderSummaryItem>
                    <ItemName>Total:</ItemName>
                    <ItemValue>{formatCurrency(order.total)}</ItemValue>
                  </OrderSummaryItem>
                  <OrderSummaryItem>
                    <ItemName>Payment Method:</ItemName>
                    <ItemValue>{order.payment_method}</ItemValue>
                  </OrderSummaryItem>
                </OrderSummary>
                
                <OrderTracking 
                  status={order.status}
                  trackingNumber={order.tracking_number}
                  expectedDelivery={order.expected_delivery_date}
                />
                
                <OrderSection>
                  <OrderSectionTitle>Items in Your Order</OrderSectionTitle>
                  <OrderItemList 
                    items={order.items}
                    shippingFee={order.shipping_fee}
                    total={order.total}
                  />
                </OrderSection>
                
                <OrderSection>
                  <OrderSectionTitle>Shipping Details</OrderSectionTitle>
                  <AddressBox>
                    <AddressTitle>
                      <FaMapMarkerAlt size={16} />
                      Shipping Address
                    </AddressTitle>
                    <AddressText>
                      {order.shipping_address.address}<br />
                      {order.shipping_address.city}, {order.shipping_address.state}<br />
                      {order.shipping_address.postal_code}<br />
                      {order.shipping_address.country}
                    </AddressText>
                  </AddressBox>
                </OrderSection>
                
                <OrderActions>
                  <ActionButton onClick={handlePrintOrder}>
                    <FaPrint />
                    Print Order
                  </ActionButton>
                  <ActionButton>
                    <FaFileInvoice />
                    Download Invoice
                  </ActionButton>
                  <DangerButton 
                    onClick={handleCancelOrder}
                    disabled={!canCancel}
                  >
                    <FaBan />
                    Cancel Order
                  </DangerButton>
                  <ActionButton>
                    <FaEnvelope />
                    Contact Support
                  </ActionButton>
                </OrderActions>
              </>
            ) : (
              <div>Order not found.</div>
            )}
          </OrderContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default OrderDetailPage;
