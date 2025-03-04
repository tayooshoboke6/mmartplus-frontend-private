import React from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';

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
  // Mock data for recent orders
  const recentOrders = [
    { id: 'ORD93849', customer: 'John Doe', date: '2025-03-01', total: 12500, status: 'completed', items: 7 },
    { id: 'ORD93820', customer: 'Sarah Miller', date: '2025-03-01', total: 8750, status: 'processing', items: 5 },
    { id: 'ORD93810', customer: 'Michael Brown', date: '2025-02-28', total: 32000, status: 'pending', items: 12 },
    { id: 'ORD93788', customer: 'Emma Wilson', date: '2025-02-28', total: 5300, status: 'completed', items: 3 },
    { id: 'ORD93774', customer: 'David Clark', date: '2025-02-27', total: 18900, status: 'cancelled', items: 8 },
  ];
  
  // Mock data for popular categories
  const popularCategories = [
    { 
      name: 'Fresh Produce', 
      count: 124, 
      sales: 875000, 
      percentage: '75%', 
      color: '#4CAF50',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5"/>
        </svg>
      )
    },
    { 
      name: 'Dairy & Eggs', 
      count: 86, 
      sales: 650000, 
      percentage: '62%', 
      color: '#2196F3',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5"/>
        </svg>
      ) 
    },
    { 
      name: 'Meat & Seafood', 
      count: 78, 
      sales: 520000, 
      percentage: '58%', 
      color: '#F44336',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5"/>
        </svg>
      ) 
    },
    { 
      name: 'Household Supplies', 
      count: 95, 
      sales: 480000, 
      percentage: '45%', 
      color: '#FF9800',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5"/>
        </svg>
      ) 
    },
  ];
  
  // Mock data for low stock alerts
  const lowStockAlerts = [
    { name: 'Fresh Milk (1L)', current: 5, minimum: 10 },
    { name: 'Premium Rice (5kg)', current: 3, minimum: 15 },
    { name: 'Laundry Detergent', current: 8, minimum: 20 },
  ];
  
  return (
    <AdminLayout title="Dashboard">
      <DashboardGrid>
        <StatCard>
          <StatLabel>Total Revenue</StatLabel>
          <StatValue>{formatCurrency(2485000)}</StatValue>
          <StatChangeIndicator isPositive={true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
            </svg>
            18% from last month
          </StatChangeIndicator>
        </StatCard>
        
        <StatCard>
          <StatLabel>Orders</StatLabel>
          <StatValue>184</StatValue>
          <StatChangeIndicator isPositive={true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
            </svg>
            12% from last month
          </StatChangeIndicator>
        </StatCard>
        
        <StatCard>
          <StatLabel>Products</StatLabel>
          <StatValue>856</StatValue>
          <Text size="sm" color="#666">
            24 new products added this month
          </Text>
        </StatCard>
        
        <StatCard>
          <StatLabel>Low Stock Items</StatLabel>
          <StatValue>15</StatValue>
          <StatChangeIndicator isPositive={false}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
            5 more than last week
          </StatChangeIndicator>
        </StatCard>
      </DashboardGrid>
      
      <ChartRowGrid>
        <OrderListContainer>
          <FlexBox justify="space-between" align="center" style={{ marginBottom: '15px' }}>
            <Text size="lg" weight="bold">Recent Orders</Text>
            <a href="/admin/orders" style={{ color: '#0066b2', textDecoration: 'none' }}>View All</a>
          </FlexBox>
          
          <RecentOrdersTable>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>{order.date}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <StatusBadge status={order.status}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </RecentOrdersTable>
          
          <MobileOrderList>
            {recentOrders.map(order => (
              <OrderItem key={order.id}>
                <div>
                  <Text size="sm" weight="bold">#{order.id}</Text>
                  <Text size="sm">{order.customer} • {order.date}</Text>
                  <Text size="sm">{order.items} items</Text>
                </div>
                <div>
                  <Text size="md" weight="bold">{formatCurrency(order.total)}</Text>
                  <StatusBadge status={order.status}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </StatusBadge>
                </div>
              </OrderItem>
            ))}
          </MobileOrderList>
        </OrderListContainer>
        
        <ChartContainer>
          <Text size="lg" weight="bold" style={{ marginBottom: '15px' }}>Sales Overview</Text>
          <ChartPlaceholder>
            Sales Chart will be displayed here
          </ChartPlaceholder>
        </ChartContainer>
      </ChartRowGrid>
      
      <ChartRowGrid>
        <ChartContainer>
          <Text size="lg" weight="bold" style={{ marginBottom: '15px' }}>Popular Categories</Text>
          
          {popularCategories.map((category, index) => (
            <CategoryCard key={index}>
              <CategoryIcon>
                {category.icon}
              </CategoryIcon>
              <CategoryInfo>
                <Text size="md" weight="bold">{category.name}</Text>
                <Text size="sm" color="#666">{category.count} products • {formatCurrency(category.sales)}</Text>
                <CategoryProgressOuter>
                  <CategoryProgressInner width={category.percentage} color={category.color} />
                </CategoryProgressOuter>
              </CategoryInfo>
            </CategoryCard>
          ))}
        </ChartContainer>
        
        <ChartContainer>
          <FlexBox justify="space-between" align="center" style={{ marginBottom: '15px' }}>
            <Text size="lg" weight="bold">Inventory Alerts</Text>
            <a href="/admin/products" style={{ color: '#0066b2', textDecoration: 'none' }}>View All</a>
          </FlexBox>
          
          {lowStockAlerts.map((item, index) => (
            <InventoryAlertCard key={index}>
              <Text size="md" weight="bold">{item.name}</Text>
              <FlexBox justify="space-between" align="center" style={{ marginTop: '5px' }}>
                <Text size="sm" color="#666">Current Stock: <strong>{item.current}</strong></Text>
                <Text size="sm" color="#666">Minimum Required: <strong>{item.minimum}</strong></Text>
              </FlexBox>
              <FlexBox justify="flex-end" style={{ marginTop: '10px' }}>
                <a href={`/admin/products`} style={{ fontSize: '14px', color: '#0066b2', textDecoration: 'none' }}>
                  Restock Now
                </a>
              </FlexBox>
            </InventoryAlertCard>
          ))}
          
          <FlexBox justify="center" style={{ marginTop: '15px' }}>
            <a href="/admin/products" style={{ color: '#0066b2', textDecoration: 'none' }}>
              View All Low Stock Items
            </a>
          </FlexBox>
        </ChartContainer>
      </ChartRowGrid>
    </AdminLayout>
  );
};

export default DashboardPage;
