import React from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f8fafc;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  
  ${({ status }) => {
    switch (status) {
      case 'completed':
        return 'background-color: #ecfdf5; color: #10b981;';
      case 'processing':
        return 'background-color: #eff6ff; color: #3b82f6;';
      case 'pending':
        return 'background-color: #fffbeb; color: #f59e0b;';
      case 'cancelled':
        return 'background-color: #fef2f2; color: #ef4444;';
      default:
        return 'background-color: #f1f5f9; color: #64748b;';
    }
  }}
`;

const EmptyMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <EmptyMessage>No recent orders found</EmptyMessage>;
  }

  // Helper function to safely format the price
  const formatPrice = (price: any): string => {
    if (price === undefined || price === null) {
      return '₦0.00';
    }
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(numPrice) ? '₦0.00' : `₦${numPrice.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  // Helper function to safely format dates
  const formatDate = (dateStr: string): string => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Order #</Th>
          <Th>Customer</Th>
          <Th>Status</Th>
          <Th>Amount</Th>
          <Th>Date</Th>
        </tr>
      </Thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <Td>{order.order_number || 'N/A'}</Td>
            <Td>{order.customer_name || 'Anonymous'}</Td>
            <Td>
              <StatusBadge status={order.status || 'unknown'}>
                {order.status 
                  ? order.status.charAt(0).toUpperCase() + order.status.slice(1) 
                  : 'Unknown'}
              </StatusBadge>
            </Td>
            <Td>{formatPrice(order.total)}</Td>
            <Td>{formatDate(order.created_at)}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RecentOrdersTable;
