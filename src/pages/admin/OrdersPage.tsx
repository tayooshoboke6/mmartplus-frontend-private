import React, { useState } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { Text, Button } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 250px;
  flex-grow: 1;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
`;

const DateInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  th, td {
    padding: 15px 20px;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 500;
  }
  
  tr {
    border-bottom: 1px solid #eee;
  }
  
  tr:last-child {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: #f9f9f9;
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
      case 'out-for-delivery':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case 'delivered':
        return 'background-color: #e6f7e6; color: #1b5e20;';
      case 'ready-for-pickup':
        return 'background-color: #f3e5f5; color: #7b1fa2;';
      case 'refunded':
        return 'background-color: #ffebee; color: #c62828;';
      default:
        return 'background-color: #f5f5f5; color: #757575;';
    }
  }}
`;

const DeliveryMethodBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 5px;
  
  ${props => {
    switch(props.type) {
      case 'home-delivery':
        return 'background-color: #e8eaf6; color: #3949ab;';
      case 'pickup':
        return 'background-color: #fff3e0; color: #ef6c00;';
      case 'express':
        return 'background-color: #fce4ec; color: #c2185b;';
      default:
        return 'background-color: #f5f5f5; color: #757575;';
    }
  }}
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #0066b2;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? '#0066b2' : '#ddd'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#0066b2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0066b2' : '#f1f1f1'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Mock Orders Data
const MOCK_ORDERS = [
  {
    id: 'ORD93849',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    date: '2025-03-02',
    total: 12500,
    status: 'completed',
    items: 7,
    deliveryMethod: 'home-delivery',
    products: [
      { name: 'Fresh Whole Milk', quantity: 2 },
      { name: 'Organic Bananas', quantity: 1 },
      { name: 'Whole Wheat Bread', quantity: 1 },
      { name: 'Free-Range Eggs', quantity: 1 },
      { name: 'Ground Beef', quantity: 1 },
      { name: 'Fresh Spinach', quantity: 1 }
    ]
  },
  {
    id: 'ORD93820',
    customer: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    date: '2025-03-01',
    total: 15400,
    status: 'processing',
    items: 5,
    deliveryMethod: 'express',
    products: [
      { name: 'Organic Chicken Breast', quantity: 2 },
      { name: 'Rice (5kg)', quantity: 1 },
      { name: 'Olive Oil', quantity: 1 },
      { name: 'Frozen Mixed Vegetables', quantity: 1 }
    ]
  },
  {
    id: 'ORD93810',
    customer: 'Michael Brown',
    email: 'michael.brown@example.com',
    date: '2025-02-28',
    total: 8500,
    status: 'pending',
    items: 3,
    deliveryMethod: 'home-delivery',
    products: [
      { name: 'Washing Powder', quantity: 1 },
      { name: 'Dish Soap', quantity: 1 },
      { name: 'Paper Towels', quantity: 1 }
    ]
  },
  {
    id: 'ORD93788',
    customer: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    date: '2025-02-28',
    total: 18200,
    status: 'out-for-delivery',
    items: 8,
    deliveryMethod: 'home-delivery',
    products: [
      { name: 'Tomatoes', quantity: 2 },
      { name: 'Onions', quantity: 1 },
      { name: 'Potatoes', quantity: 1 },
      { name: 'Carrots', quantity: 1 },
      { name: 'Bell Peppers', quantity: 2 },
      { name: 'Fresh Garlic', quantity: 1 }
    ]
  },
  {
    id: 'ORD93774',
    customer: 'David Clark',
    email: 'david.clark@example.com',
    date: '2025-02-27',
    total: 9900,
    status: 'cancelled',
    items: 2,
    deliveryMethod: 'pickup',
    products: [
      { name: 'Cooking Oil (5L)', quantity: 1 },
      { name: 'Rice (10kg)', quantity: 1 }
    ]
  },
  {
    id: 'ORD93762',
    customer: 'Lisa Johnson',
    email: 'lisa.johnson@example.com',
    date: '2025-02-27',
    total: 7400,
    status: 'ready-for-pickup',
    items: 4,
    deliveryMethod: 'pickup',
    products: [
      { name: 'Fresh Orange Juice', quantity: 1 },
      { name: 'Yogurt', quantity: 2 },
      { name: 'Cereal', quantity: 1 }
    ]
  },
  {
    id: 'ORD93750',
    customer: 'Robert Smith',
    email: 'robert.smith@example.com',
    date: '2025-02-26',
    total: 22500,
    status: 'delivered',
    items: 10,
    deliveryMethod: 'home-delivery',
    products: [
      { name: 'Assorted Fresh Fruits', quantity: 1 },
      { name: 'Fresh Vegetables Pack', quantity: 1 },
      { name: 'Milk', quantity: 2 },
      { name: 'Eggs', quantity: 1 },
      { name: 'Bread', quantity: 1 },
      { name: 'Pasta', quantity: 2 },
      { name: 'Tomato Sauce', quantity: 2 }
    ]
  },
  {
    id: 'ORD93741',
    customer: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    date: '2025-02-26',
    total: 12800,
    status: 'delivered',
    items: 6,
    deliveryMethod: 'express',
    products: [
      { name: 'Premium Cheese Selection', quantity: 1 },
      { name: 'Fresh Baguette', quantity: 2 },
      { name: 'Red Wine', quantity: 1 },
      { name: 'Grapes', quantity: 1 },
      { name: 'Crackers', quantity: 1 }
    ]
  },
  {
    id: 'ORD93732',
    customer: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    date: '2025-02-25',
    total: 16600,
    status: 'refunded',
    items: 3,
    deliveryMethod: 'home-delivery',
    products: [
      { name: 'Premium Beef Steak', quantity: 2 },
      { name: 'Fresh Herbs Pack', quantity: 1 }
    ]
  },
  {
    id: 'ORD93725',
    customer: 'Jennifer Davis',
    email: 'jennifer.davis@example.com',
    date: '2025-02-25',
    total: 13200,
    status: 'completed',
    items: 4,
    deliveryMethod: 'pickup',
    products: [
      { name: 'Household Cleaning Kit', quantity: 1 },
      { name: 'Laundry Detergent', quantity: 1 },
      { name: 'Fabric Softener', quantity: 1 },
      { name: 'Air Freshener', quantity: 1 }
    ]
  }
];

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleViewOrder = (orderId: string) => {
    // In a real app, this would navigate to order details
    console.log(`View order details for: ${orderId}`);
  };

  const filteredOrders = MOCK_ORDERS.filter(order => {
    // Filter by search query (order ID or customer name)
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    
    // Filter by delivery method
    const matchesDeliveryMethod = deliveryMethodFilter === '' || 
      order.deliveryMethod === deliveryMethodFilter;
    
    // Filter by date range
    const orderDate = new Date(order.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    const matchesDateRange = 
      (!fromDate || orderDate >= fromDate) && 
      (!toDate || orderDate <= toDate);
    
    return matchesSearch && matchesStatus && matchesDeliveryMethod && matchesDateRange;
  });
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDeliveryMethodFilter('');
    setDateFrom('');
    setDateTo('');
  };
  
  return (
    <AdminLayout title="Orders">
      <PageContainer>
        <FiltersContainer>
          <SearchInput 
            type="text" 
            placeholder="Search orders by ID or customer..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          
          <FilterSelect 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="ready-for-pickup">Ready for Pickup</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </FilterSelect>
          
          <FilterSelect
            value={deliveryMethodFilter}
            onChange={(e) => setDeliveryMethodFilter(e.target.value)}
          >
            <option value="">All Delivery Methods</option>
            <option value="home-delivery">Home Delivery</option>
            <option value="pickup">Pickup</option>
            <option value="express">Express Delivery</option>
          </FilterSelect>
          
          <DateInput 
            type="date" 
            placeholder="From Date" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)} 
          />
          
          <DateInput 
            type="date" 
            placeholder="To Date" 
            value={dateTo} 
            onChange={(e) => setDateTo(e.target.value)} 
          />
          
          <Button variant="outline" onClick={handleResetFilters}>Reset</Button>
        </FiltersContainer>
        
        <Text size="md">Showing {filteredOrders.length} orders</Text>
        
        <OrdersTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <div>{order.customer}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{order.email}</div>
                </td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>
                  <StatusBadge status={order.status}>
                    {order.status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </StatusBadge>
                </td>
                <td>
                  <DeliveryMethodBadge type={order.deliveryMethod}>
                    {order.deliveryMethod === 'home-delivery' ? 'Home Delivery' :
                     order.deliveryMethod === 'pickup' ? 'Store Pickup' :
                     order.deliveryMethod === 'express' ? 'Express' : order.deliveryMethod}
                  </DeliveryMethodBadge>
                </td>
                <td>
                  <ActionButton onClick={() => handleViewOrder(order.id)}>
                    View
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </OrdersTable>
        
        <Pagination>
          <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
            &lt;
          </PageButton>
          
          {[1, 2, 3].map(page => (
            <PageButton 
              key={page} 
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton onClick={() => setCurrentPage(prev => prev + 1)}>
            &gt;
          </PageButton>
        </Pagination>
      </PageContainer>
    </AdminLayout>
  );
};

export default OrdersPage;
