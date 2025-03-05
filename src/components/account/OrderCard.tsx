import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { OrderSummary } from '../../services/orderService';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaMoneyBillWave, 
  FaEye,
  FaFileInvoice
} from 'react-icons/fa';

const Card = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  margin-bottom: 15px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
`;

const OrderNumber = styled.span`
  font-weight: 600;
  color: #333;
`;

const OrderDate = styled.span`
  color: #666;
  font-size: 14px;
`;

const CardBody = styled.div`
  padding: 15px;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const OrderTotal = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #0066cc;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  svg {
    margin-right: 5px;
  }
`;

const ItemsCount = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  background-color: #fff;
  color: #0066cc;
  border: 1px solid #0066cc;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f7ff;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const ViewButton = styled(Link)`
  background-color: #0066cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: #0055b3;
  }
  
  svg {
    margin-right: 5px;
  }
`;

interface OrderCardProps {
  order: OrderSummary;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  // Get payment method icon
  const getPaymentIcon = () => {
    const paymentMethod = order.payment_method || 'card';
    switch (paymentMethod) {
      case 'card':
        return <FaCreditCard />;
      case 'bank_transfer':
        return <FaUniversity />;
      case 'cash_on_delivery':
        return <FaMoneyBillWave />;
      default:
        return <FaCreditCard />;
    }
  };
  
  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    if (!method) return 'Unknown';
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  // Get the order number or ID
  const getOrderIdentifier = () => {
    return order.order_number || `Order #${order.id}`;
  };

  // Get items count safely
  const getItemsCount = () => {
    // Try to get items_count from order, or count items array if available, or default to 0
    const count = order.items_count || (order.items ? order.items.length : 0);
    return `${count} ${count === 1 ? 'item' : 'items'}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <OrderNumber>{getOrderIdentifier()}</OrderNumber>
        <OrderDate>{formatDate(order.created_at)}</OrderDate>
      </CardHeader>
      
      <CardBody>
        <OrderInfo>
          <OrderStatusBadge status={order.status || 'pending'} />
          <OrderTotal>{formatCurrency(order.total || 0)}</OrderTotal>
        </OrderInfo>
        
        <ItemsCount>
          {getItemsCount()}
        </ItemsCount>
        
        <PaymentMethod>
          {getPaymentIcon()}
          <span>{formatPaymentMethod(order.payment_method)}</span>
        </PaymentMethod>
      </CardBody>
      
      <CardFooter>
        <ActionButton>
          <FaFileInvoice />
          Download Invoice
        </ActionButton>
        
        <ViewButton to={`/account/orders/${order.id}`}>
          <FaEye />
          View Details
        </ViewButton>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
