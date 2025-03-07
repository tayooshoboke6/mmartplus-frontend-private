import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FaShoppingBag, FaExclamationTriangle, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import orderService, { OrderSummary, OrderFilterOptions } from '../../services/orderService';
import AccountSidebar from '../../components/account/AccountSidebar';
import OrderCard from '../../components/account/OrderCard';
import OrderFilters from '../../components/account/OrderFilters';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { getCsrfCookie } from '../../utils/authUtils';

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
`;

const HeaderTitle = styled.h2`
  margin: 0 0 0 10px;
  font-size: 18px;
`;

const OrdersContent = styled.div`
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  margin-top: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #ccc;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  color: #777;
  margin-bottom: 20px;
`;

const EmptyButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const Loader = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: #fff8f8;
  border: 1px solid #ffdddd;
  border-radius: 5px;
  margin-top: 20px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 20px;
`;

const ErrorTitle = styled.h3`
  color: #e74c3c;
  font-size: 20px;
  margin-bottom: 10px;
`;

const ErrorText = styled.p`
  color: #777;
  margin-bottom: 20px;
`;

const ErrorButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0 10px;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);
  const [filters, setFilters] = useState<OrderFilterOptions>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Initialization function to ensure authentication is properly set up
  const initializeAuth = async () => {
    try {
      // Ensure CSRF cookie is set
      await getCsrfCookie();
      
      // Check for token in localStorage
      const token = localStorage.getItem('mmartToken');
      
      if (!token && !isAuthenticated) {
        setLoading(false);
        setAuthError(true);
        setError("You must be logged in to view your orders");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Authentication initialization error:', error);
      setLoading(false);
      setAuthError(true);
      setError("Authentication error. Please try logging in again.");
      return false;
    }
  };
  
  useEffect(() => {
    // Initialize authentication and then fetch orders if authenticated
    const setup = async () => {
      const isAuth = await initializeAuth();
      if (isAuth) {
        fetchOrders();
      }
    };
    
    setup();
  }, [filters]);
  
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    setAuthError(false);
    
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
        setError('Received invalid data from the server');
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setTotalCount(0);
      
      if (error.response?.status === 401) {
        setAuthError(true);
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error.message || 'Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: OrderFilterOptions) => {
    setFilters({ ...filters, ...newFilters, page: 1 }); // Reset to first page when filters change
  };
  
  const goToShop = () => {
    navigate('/');
  };
  
  const goToLogin = () => {
    // Store the current location to redirect back after login
    navigate('/login', { state: { from: '/account/orders' } });
  };
  
  const handleRetry = () => {
    fetchOrders();
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
            
            {!authError && (
              <FilterContainer>
                <OrderFilters onFilterChange={handleFilterChange} />
              </FilterContainer>
            )}
            
            <OrdersList>
              {loading ? (
                <Loader>Loading orders...</Loader>
              ) : authError ? (
                <ErrorContainer>
                  <ErrorIcon>
                    <FaSignInAlt />
                  </ErrorIcon>
                  <ErrorTitle>Authentication Required</ErrorTitle>
                  <ErrorText>
                    {error || 'You need to be logged in to view your orders.'}
                  </ErrorText>
                  <ErrorButton onClick={goToLogin}>
                    Sign In
                  </ErrorButton>
                </ErrorContainer>
              ) : error ? (
                <ErrorContainer>
                  <ErrorIcon>
                    <FaExclamationTriangle />
                  </ErrorIcon>
                  <ErrorTitle>Something went wrong</ErrorTitle>
                  <ErrorText>
                    {error}
                  </ErrorText>
                  <ErrorButton onClick={handleRetry}>
                    Try Again
                  </ErrorButton>
                  <EmptyButton onClick={goToShop}>
                    Continue Shopping
                  </EmptyButton>
                </ErrorContainer>
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
