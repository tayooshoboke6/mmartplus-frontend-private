import React from 'react';
import styled from 'styled-components';
import { OrderStatus, OrderStatusEnum } from '../../services/orderService';

const StatusBadge = styled.span<{ status: OrderStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  
  ${({ status }) => {
    switch (status) {
      case OrderStatusEnum.PENDING:
        return `
          background-color: #FFF8E1;
          color: #FFA000;
          border: 1px solid #FFE082;
        `;
      case OrderStatusEnum.PROCESSING:
        return `
          background-color: #E3F2FD;
          color: #1976D2;
          border: 1px solid #BBDEFB;
        `;
      case OrderStatusEnum.SHIPPED:
        return `
          background-color: #E8F5E9;
          color: #388E3C;
          border: 1px solid #C8E6C9;
        `;
      case OrderStatusEnum.DELIVERED:
        return `
          background-color: #E0F2F1;
          color: #00796B;
          border: 1px solid #B2DFDB;
        `;
      case OrderStatusEnum.CANCELLED:
        return `
          background-color: #FFEBEE;
          color: #D32F2F;
          border: 1px solid #FFCDD2;
        `;
      default:
        return `
          background-color: #F5F5F5;
          color: #757575;
          border: 1px solid #E0E0E0;
        `;
    }
  }}
`;

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  // Function to make status more readable
  const formatStatus = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  return (
    <StatusBadge status={status}>
      {formatStatus(status)}
    </StatusBadge>
  );
};

export default OrderStatusBadge;
