import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';
import SalesChart from '../../components/admin/SalesChart';
import orderService, { DashboardStats } from '../../services/orderService';
import { toast } from 'react-toastify';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
  color: #0066b2;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const StatChangeIndicator = styled.div<{ isPositive?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.isPositive ? '#28a745' : '#dc3545'};
  font-size: 14px;
  
  svg {
    margin-right: 4px;
  }
`;

const ChartRowGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  min-height: 300px;
  
  @media (max-width: 768px) {
    padding: 15px;
    min-height: 250px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    min-height: 200px;
  }
`;

const ChartPlaceholder = styled.div`
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    height: 200px;
  }
  
  @media (max-width: 480px) {
    height: 180px;
  }
`;

const OrderListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 100%;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const RecentOrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 500;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr:hover {
    background-color: #f9f9f9;
  }
  
  @media (max-width: 768px) {
    th, td {
      padding: 10px;
    }
  }
  
  @media (max-width: 480px) {
    display: none; /* Hide table on small screens */
  }
`;

const OrderItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MobileOrderList = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
  }
`;

const CategoryCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background-color: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  svg {
    color: #0066b2;
    width: 22px;
    height: 22px;
  }
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryProgressOuter = styled.div`
  height: 6px;
  background-color: #f1f1f1;
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
`;

const CategoryProgressInner = styled.div<{ width: string, color: string }>`
  height: 100%;
  width: ${props => props.width};
  background-color: ${props => props.color};
  border-radius: 3px;
`;

const InventoryAlertCard = styled.div`
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  border-left: 4px solid #f57f17;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch(props.status) {
      case 'completed':
        return 'background-color: #e6f7e6; color: #2e7d32;';
      case 'processing':
        return 'background-color: #e3f2fd; color: #1565c0;';
      case 'pending':
        return 'background-color: #fff8e1; color: #f57f17;';
      case 'cancelled':
        return 'background-color: #feebee; color: #b71c1c;';
      default:
        return 'background-color: #f5f5f5; color: #757575;';
    }
  }}
`;

const DashboardPage: React.FC = () => {
  const [salesData, setSalesData] = useState<Array<{ date: string; amount: number }>>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [salesStats, stats] = await Promise.all([
          orderService.getSalesStats(),
          orderService.getDashboardStats()
        ]);
        
        setSalesData(salesStats.daily_sales);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <Text size="xl" weight="bold" style={{ marginBottom: '20px' }}>
          Dashboard
        </Text>
        <div>Loading dashboard data...</div>
      </AdminLayout>
    );
  }

  if (!dashboardStats) {
    return (
      <AdminLayout>
        <Text size="xl" weight="bold" style={{ marginBottom: '20px' }}>
          Dashboard
        </Text>
        <div>Error loading dashboard data. Please refresh the page.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Text size="xl" weight="bold" style={{ marginBottom: '20px' }}>
        Dashboard
      </Text>

      <DashboardGrid>
        <StatCard>
          <StatLabel>Total Revenue</StatLabel>
          <StatValue>{formatCurrency(dashboardStats.total_revenue)}</StatValue>
          <StatChangeIndicator isPositive={dashboardStats.revenue_change > 0}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d={dashboardStats.revenue_change > 0 ? "M6 2L10 6L6 10" : "M6 10L2 6L6 2"} 
                stroke="currentColor" 
                strokeWidth="2"
              />
            </svg>
            {Math.abs(dashboardStats.revenue_change)}% from last month
          </StatChangeIndicator>
        </StatCard>

        <StatCard>
          <StatLabel>Orders</StatLabel>
          <StatValue>{dashboardStats.total_orders}</StatValue>
          <StatChangeIndicator isPositive={dashboardStats.orders_change > 0}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d={dashboardStats.orders_change > 0 ? "M6 2L10 6L6 10" : "M6 10L2 6L6 2"} 
                stroke="currentColor" 
                strokeWidth="2"
              />
            </svg>
            {Math.abs(dashboardStats.orders_change)}% from last month
          </StatChangeIndicator>
        </StatCard>

        <StatCard>
          <StatLabel>Products</StatLabel>
          <StatValue>{dashboardStats.total_products}</StatValue>
          <Text size="sm" color="gray">{dashboardStats.new_products_count} new products added this month</Text>
        </StatCard>

        <StatCard>
          <StatLabel>Low Stock Items</StatLabel>
          <StatValue>{dashboardStats.low_stock_items}</StatValue>
          <StatChangeIndicator isPositive={dashboardStats.low_stock_change <= 0}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d={dashboardStats.low_stock_change <= 0 ? "M6 2L10 6L6 10" : "M6 10L2 6L6 2"} 
                stroke="currentColor" 
                strokeWidth="2"
              />
            </svg>
            {Math.abs(dashboardStats.low_stock_change)} {dashboardStats.low_stock_change > 0 ? 'more' : 'fewer'} than last week
          </StatChangeIndicator>
        </StatCard>
      </DashboardGrid>

      <ChartRowGrid>
        <ChartContainer>
          <SalesChart data={salesData} />
        </ChartContainer>

        <OrderListContainer>
          <FlexBox justify="space-between" align="center" style={{ marginBottom: '15px' }}>
            <Text size="lg" weight="medium">Recent Orders</Text>
            <Text size="sm" color="primary" as="a" href="/admin/orders">
              View All
            </Text>
          </FlexBox>

          <RecentOrdersTable>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.recent_orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.items_count}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td><StatusBadge status={order.status}>{order.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </RecentOrdersTable>

          <MobileOrderList>
            {dashboardStats.recent_orders.map((order) => (
              <OrderItem key={order.id}>
                <div>
                  <Text size="sm" weight="medium">{order.order_number}</Text>
                  <Text size="sm" color="gray">{order.customer_name}</Text>
                </div>
                <div>
                  <Text size="sm">{formatCurrency(order.total)}</Text>
                  <StatusBadge status={order.status}>{order.status}</StatusBadge>
                </div>
              </OrderItem>
            ))}
          </MobileOrderList>
        </OrderListContainer>
      </ChartRowGrid>
    </AdminLayout>
  );
};

export default DashboardPage;
