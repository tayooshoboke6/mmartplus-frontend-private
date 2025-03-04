import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaShoppingBag } from 'react-icons/fa';
import orderService, { OrderSummary, OrderFilterOptions } from '../../services/orderService';
import AccountSidebar from '../../components/account/AccountSidebar';
import OrderCard from '../../components/account/OrderCard';
import OrderFilters from '../../components/account/OrderFilters';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { toast } from 'react-toastify';

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

const ContentHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  svg {
    margin-right: 10px;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const FilterContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    margin-bottom: 20px;
  }
`;

const OrdersList = styled.div``;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 40px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #ccc;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const EmptyText = styled.p`
  color: #666;
  margin: 0 0 20px 0;
`;

const EmptyButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0055b3;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: #666;
  font-size: 16px;
`;

const OrdersContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<OrderFilterOptions>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  
  useEffect(() => {
    fetchOrders();
  }, [filters]);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching orders with filters:', filters);
      const response = await orderService.getOrders(filters);
      console.log('Orders response:', response);
      
      if (response && response.orders) {
        setOrders(response.orders);
        setTotalCount(response.total_count || 0);
        // Log order details for debugging
        if (response.orders.length > 0) {
          console.log('First order sample:', response.orders[0]);
        } else {
          console.log('No orders returned from API');
        }
      } else {
        console.error('Invalid response format from orders API:', response);
        setOrders([]);
        setTotalCount(0);
        toast.error('Received invalid data from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setTotalCount(0);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: OrderFilterOptions) => {
    setFilters({ ...filters, ...newFilters, page: 1 }); // Reset to first page when filters change
  };
  
  // Function to redirect to shop page
  const goToShop = () => {
    window.location.href = '/';
  };
  
  return (
    <PageContainer>
      <title>My Orders | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <OrdersContent>
            <ContentHeader>
              <FaShoppingBag size={20} />
              <HeaderTitle>Orders</HeaderTitle>
            </ContentHeader>
            
            <FilterContainer>
              <OrderFilters onFilterChange={handleFilterChange} />
            </FilterContainer>
            
            <OrdersList>
              {loading ? (
                <Loader>Loading orders...</Loader>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <EmptyState>
                  <EmptyIcon>
                    <FaShoppingBag />
                  </EmptyIcon>
                  <EmptyTitle>No orders yet</EmptyTitle>
                  <EmptyText>
                    You haven't placed any orders yet. Start shopping to fill your pantry!
                  </EmptyText>
                  <EmptyButton onClick={goToShop}>
                    Start Shopping
                  </EmptyButton>
                </EmptyState>
              )}
            </OrdersList>
          </OrdersContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default OrdersPage;
