import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Text, Button } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';
import orderService, { OrderSummary, OrderFilterOptions, OrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';
import { Modal, Select as AntSelect, Spin, Tooltip } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

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
  cursor: pointer;
  
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
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [updateLoading, setUpdateLoading] = useState(false);

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

  const openStatusModal = (order: OrderSummary) => {
    setSelectedOrder(order);
    setNewStatus(order.status as OrderStatus);
    setStatusModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdateLoading(true);
    try {
      const result = await orderService.updateOrderStatus(selectedOrder.id, newStatus as OrderStatus);
      if (result.success) {
        toast.success(result.message || 'Order status updated successfully');
        setStatusModalVisible(false);
        
        // Update the order in the list with the new status
        setOrders(orders.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, status: newStatus as OrderStatus } 
            : order
        ));
      } else {
        toast.error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
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
            <option value="completed">Completed</option>
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
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin size="large" tip="Loading orders..." />
          </div>
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <Tooltip title="Click to change status">
                          <StatusBadge 
                            status={order.status} 
                            onClick={() => openStatusModal(order)}
                          >
                            {order.status}
                          </StatusBadge>
                        </Tooltip>
                      </td>
                      <td>{order.items_count} items</td>
                      <td>
                        <ActionButton onClick={() => window.location.href = `/admin/orders/${order.id}`}>
                          View Details
                        </ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </OrdersTable>

            <Pagination>
              <PageButton
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                &lt;
              </PageButton>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first page, last page, and pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page! <= 3) {
                  pageNum = i + 1;
                } else if (filters.page! >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = filters.page! - 2 + i;
                }
                
                return (
                  <PageButton
                    key={pageNum}
                    active={pageNum === filters.page}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PageButton>
                );
              })}
              
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

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        visible={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStatusModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="submit" 
            onClick={handleStatusUpdate}
            disabled={updateLoading}
          >
            {updateLoading ? <SyncOutlined spin /> : <CheckCircleOutlined />} Update Status
          </Button>
        ]}
      >
        <div style={{ padding: '10px 0' }}>
          <p>Order: <strong>{selectedOrder?.order_number}</strong></p>
          <p>Current Status: <StatusBadge status={selectedOrder?.status || ''}>{selectedOrder?.status}</StatusBadge></p>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>New Status:</label>
            <AntSelect
              style={{ width: '100%' }}
              value={newStatus}
              onChange={(value) => setNewStatus(value as OrderStatus)}
              placeholder="Select new status"
            >
              <AntSelect.Option value="pending">Pending</AntSelect.Option>
              <AntSelect.Option value="processing">Processing</AntSelect.Option>
              <AntSelect.Option value="shipped">Shipped</AntSelect.Option>
              <AntSelect.Option value="delivered">Delivered</AntSelect.Option>
              <AntSelect.Option value="completed">Completed</AntSelect.Option>
              <AntSelect.Option value="cancelled">Cancelled</AntSelect.Option>
            </AntSelect>
          </div>
          
          {newStatus === 'cancelled' && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff8e8', borderRadius: '4px' }}>
              <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
              Warning: Cancelling an order cannot be undone and may affect inventory.
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default OrdersPage;
