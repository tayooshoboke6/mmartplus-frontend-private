import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/layouts/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import SalesChart from '../../components/admin/SalesChart';
import RecentOrdersTable from '../../components/admin/RecentOrdersTable';
import PopularProductsTable from '../../components/admin/PopularProductsTable';
import LowStockTable from '../../components/admin/LowStockTable';
import { FiDollarSign, FiShoppingBag, FiUsers, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DashboardStats } from '../../types/order';
import orderService from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for development mode
const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_sales: 15789.50,
  daily_sales: [
    { date: '2023-01-01', total_sales: 2100 },
    { date: '2023-01-02', total_sales: 1800 },
    { date: '2023-01-03', total_sales: 2400 },
    { date: '2023-01-04', total_sales: 2700 },
    { date: '2023-01-05', total_sales: 3000 },
    { date: '2023-01-06', total_sales: 2800 },
    { date: '2023-01-07', total_sales: 3500 },
    { date: '2023-01-08', total_sales: 3200 },
    { date: '2023-01-09', total_sales: 3800 },
    { date: '2023-01-10', total_sales: 4000 },
    { date: '2023-01-11', total_sales: 3600 },
    { date: '2023-01-12', total_sales: 4200 },
  ],
  total_orders: 263,
  pending_orders: 12,
  total_customers: 182,
  recent_orders: [
    { id: 1, order_number: 'ORD-001', user: { name: 'John Doe' }, total: 100, status: 'Completed', created_at: '2023-01-01' },
    { id: 2, order_number: 'ORD-002', user: { name: 'Jane Doe' }, total: 200, status: 'Processing', created_at: '2023-01-02' },
    { id: 3, order_number: 'ORD-003', user: { name: 'Bob Smith' }, total: 300, status: 'Pending', created_at: '2023-01-03' },
    { id: 4, order_number: 'ORD-004', user: { name: 'Alice Johnson' }, total: 400, status: 'Cancelled', created_at: '2023-01-04' },
  ],
  popular_products: [
    { id: 1, name: 'Organic Almond Milk', total_quantity_sold: 87 },
    { id: 2, name: 'Fresh Farm Eggs', total_quantity_sold: 72 },
    { id: 3, name: 'Organic Bananas', total_quantity_sold: 68 },
    { id: 4, name: 'Whole Grain Bread', total_quantity_sold: 65 },
    { id: 5, name: 'Free Range Chicken', total_quantity_sold: 54 },
  ],
  low_stock_products: [
    { id: 1, name: 'Organic Almond Milk', stock: 10, min_stock: 5 },
    { id: 2, name: 'Fresh Farm Eggs', stock: 20, min_stock: 10 },
    { id: 3, name: 'Organic Bananas', stock: 30, min_stock: 15 },
    { id: 4, name: 'Whole Grain Bread', stock: 40, min_stock: 20 },
    { id: 5, name: 'Free Range Chicken', stock: 50, min_stock: 25 },
  ]
};

const Dashboard = styled.div`
  margin: 0;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
  }
`;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ErrorContainer = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  color: #b91c1c;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }
  
  p {
    margin: 0 0 16px 0;
  }
`;

const RetryButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #dc2626;
  }
`;

const AdminDevControls = styled.div`
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #0e9f86;
  }
`;

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isAdmin, loginAsAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Development mode check
  const isDevelopment = import.meta.env.DEV;
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we're using a development token
      const token = localStorage.getItem('mmartToken');
      const isDevelopmentToken = token && token.includes('dev-admin-token');
      
      if (isDevelopmentToken && process.env.NODE_ENV === 'development') {
        // Use mock data in development mode
        console.log('Using mock dashboard stats for development');
        setStats(MOCK_DASHBOARD_STATS);
        setLoading(false);
        return;
      }
      
      // Fetch real data from API
      const response = await orderService.getDashboardStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      
      // If this error was due to our development token, use mock data
      if (err.isDevelopmentError) {
        console.log('Using mock data instead due to development mode');
        setStats(MOCK_DASHBOARD_STATS);
      } else {
        setError(err.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle admin login for development testing
  const handleAdminLogin = async () => {
    if (isDevelopment) {
      const result = await loginAsAdmin();
      if (result.success) {
        alert('Successfully logged in as admin for development testing');
        window.location.reload(); // Reload to apply changes
      } else {
        alert(`Admin login failed: ${result.error}`);
      }
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title="Dashboard" description="Overview of your store's performance">
        <LoadingContainer>
          <LoadingSpinner size="lg" />
        </LoadingContainer>
      </AdminLayout>
    );
  }

  if (error && !stats) {
    return (
      <AdminLayout title="Dashboard" description="Overview of your store's performance">
        <ErrorContainer>
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <RetryButton onClick={fetchDashboardStats}>Retry</RetryButton>
        </ErrorContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" description="Overview of your store's performance">
      <Dashboard>
        {stats && (
          <>
            <GridContainer>
              <StatsCard
                title="Total Sales"
                value={`₦${stats.total_sales.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                icon={<FiDollarSign size={24} />}
                color="#10b981"
              />
              <StatsCard
                title="Total Orders"
                value={stats.total_orders.toString()}
                icon={<FiShoppingBag size={24} />}
                color="#3b82f6"
              />
              <StatsCard
                title="Total Customers"
                value={stats.total_customers.toString()}
                icon={<FiUsers size={24} />}
                color="#8b5cf6"
              />
              <StatsCard
                title="Pending Orders"
                value={stats.pending_orders.toString()}
                icon={<FiClock size={24} />}
                color="#f59e0b"
              />
            </GridContainer>
            
            <Card>
              <h2>Sales Overview</h2>
              <SalesChart data={stats.daily_sales.map(item => ({
                date: item.date,
                amount: item.total_sales
              }))} />
            </Card>
            
            <TwoColumns>
              <Card>
                <h2>Recent Orders</h2>
                <RecentOrdersTable orders={stats.recent_orders.map(order => ({
                  id: order.id,
                  order_number: order.order_number,
                  customer_name: order.user?.name || order.customer_name || 'Anonymous',
                  total: order.total,
                  status: order.status,
                  created_at: order.created_at
                }))} />
              </Card>
              
              <Card>
                <h2>Popular Products</h2>
                <PopularProductsTable products={stats.popular_products.map(product => ({
                  id: product.id,
                  name: product.name,
                  image: '',  // The backend doesn't provide images, use empty string or default image
                  price: 0,   // The backend doesn't provide price information
                  quantity_sold: product.total_quantity_sold
                }))} />
              </Card>
            </TwoColumns>
            
            <Card>
              <h2>Low Stock Products</h2>
              <LowStockTable products={stats.low_stock_products.map(product => ({
                id: product.id,
                name: product.name,
                image: '',  // The backend doesn't provide images, use empty string or default image
                current_stock: product.stock,
                min_stock: 10  // Fixed default value as backend doesn't provide min_stock
              }))} />
            </Card>
          </>
        )}
        
        {/* Admin Controls - only shown in development mode */}
        {isDevelopment && (
          <AdminDevControls>
            <h3>Development Controls</h3>
            <p>These controls are only visible in development mode</p>
            
            {!isAuthenticated || !isAdmin ? (
              <Button onClick={handleAdminLogin}>
                Login as Admin for Testing
              </Button>
            ) : (
              <div>
                <p><strong>Status:</strong> Logged in as Admin</p>
                <Button onClick={fetchDashboardStats}>
                  Refresh Dashboard Data
                </Button>
              </div>
            )}
          </AdminDevControls>
        )}
      </Dashboard>
    </AdminLayout>
  );
};

export default DashboardPage;
