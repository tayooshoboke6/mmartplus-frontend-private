import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { Text, Button } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';
import orderService, { OrderSummary, OrderFilterOptions, OrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';

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
      case 'shipped':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case 'delivered':
        return 'background-color: #e6f7e6; color: #1b5e20;';
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

function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<OrderFilterOptions>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders({
        ...filters,
        status: selectedStatus as OrderStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });
      setOrders(response.orders);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchOrders();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setFilters({ ...filters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const totalPages = Math.ceil(totalCount / (filters.limit || 10));

  return (
    <AdminLayout>
      <PageContainer>
        <Text size="xl" weight="bold">Orders</Text>

        <FiltersContainer>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
            <SearchInput
              type="text"
              placeholder="Search by order number or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>

          <FilterSelect value={selectedStatus} onChange={handleStatusChange}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>

          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            placeholder="Start Date"
          />

          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            placeholder="End Date"
          />
        </FiltersContainer>

        {loading ? (
          <div>Loading orders...</div>
        ) : (
          <>
            <OrdersTable>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.customer_name}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <StatusBadge status={order.status}>{order.status}</StatusBadge>
                    </td>
                    <td>{order.items_count} items</td>
                    <td>
                      <ActionButton onClick={() => window.location.href = `/admin/orders/${order.id}`}>
                        View Details
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </OrdersTable>

            <Pagination>
              <PageButton
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                &lt;
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PageButton
                  key={page}
                  active={page === filters.page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === totalPages}
              >
                &gt;
              </PageButton>
            </Pagination>
          </>
        )}
      </PageContainer>
    </AdminLayout>
  );
}

export default OrdersPage;
