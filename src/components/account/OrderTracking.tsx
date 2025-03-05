import React from 'react';
import styled from 'styled-components';
import { OrderStatus, OrderStatusEnum } from '../../services/orderService';
import { 
  FaClipboardCheck, 
  FaCog, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle 
} from 'react-icons/fa';

const TrackingContainer = styled.div`
  margin: 20px 0;
`;

const TrackingTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
`;

const TrackingSteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ddd;
    z-index: 1;
  }
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  position: relative;
  z-index: 2;
`;

const StepIcon = styled.div<{ active: boolean; completed: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.completed) return '#4CAF50';
    if (props.active) return '#0066cc';
    return '#f5f5f5';
  }};
  color: ${props => (props.completed || props.active) ? '#fff' : '#999'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => {
    if (props.completed) return '#4CAF50';
    if (props.active) return '#0066cc';
    return '#ddd';
  }};
`;

const StepLabel = styled.div<{ active: boolean; completed: boolean }>`
  font-size: 14px;
  font-weight: ${props => (props.completed || props.active) ? '500' : 'normal'};
  color: ${props => {
    if (props.completed) return '#4CAF50';
    if (props.active) return '#0066cc';
    return '#777';
  }};
  text-align: center;
`;

const TrackingInfo = styled.div`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-top: 20px;
`;

const TrackingNumber = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const DeliveryInfo = styled.div`
  font-size: 14px;
  color: #555;
`;

interface OrderTrackingProps {
  status: OrderStatus;
  trackingNumber?: string;
  expectedDelivery?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ 
  status,
  trackingNumber,
  expectedDelivery
}) => {
  // Determine which steps are active and completed based on order status
  const getStepStatus = (stepStatus: OrderStatus) => {
    const statusOrder = {
      [OrderStatusEnum.PENDING]: 0,
      [OrderStatusEnum.PROCESSING]: 1,
      [OrderStatusEnum.SHIPPED]: 2,
      [OrderStatusEnum.DELIVERED]: 3,
      [OrderStatusEnum.CANCELLED]: 4
    };
    
    // If order is cancelled, only the cancelled step is active
    if (status === OrderStatusEnum.CANCELLED) {
      return {
        active: stepStatus === OrderStatusEnum.CANCELLED,
        completed: false
      };
    }
    
    const currentStatusOrder = statusOrder[status];
    const stepStatusOrder = statusOrder[stepStatus];
    
    return {
      active: currentStatusOrder === stepStatusOrder,
      completed: currentStatusOrder > stepStatusOrder
    };
  };
  
  // Format expected delivery date
  const formatDeliveryDate = (dateString?: string) => {
    if (!dateString) return 'Estimated delivery date not available';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <TrackingContainer>
      <TrackingTitle>Order Tracking</TrackingTitle>
      
      <TrackingSteps>
        <Step 
          active={getStepStatus(OrderStatusEnum.PENDING).active}
          completed={getStepStatus(OrderStatusEnum.PENDING).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatusEnum.PENDING).active}
            completed={getStepStatus(OrderStatusEnum.PENDING).completed}
          >
            <FaClipboardCheck size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatusEnum.PENDING).active}
            completed={getStepStatus(OrderStatusEnum.PENDING).completed}
          >
            Order Placed
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatusEnum.PROCESSING).active}
          completed={getStepStatus(OrderStatusEnum.PROCESSING).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatusEnum.PROCESSING).active}
            completed={getStepStatus(OrderStatusEnum.PROCESSING).completed}
          >
            <FaCog size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatusEnum.PROCESSING).active}
            completed={getStepStatus(OrderStatusEnum.PROCESSING).completed}
          >
            Processing
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatusEnum.SHIPPED).active}
          completed={getStepStatus(OrderStatusEnum.SHIPPED).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatusEnum.SHIPPED).active}
            completed={getStepStatus(OrderStatusEnum.SHIPPED).completed}
          >
            <FaTruck size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatusEnum.SHIPPED).active}
            completed={getStepStatus(OrderStatusEnum.SHIPPED).completed}
          >
            Shipped
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatusEnum.DELIVERED).active}
          completed={getStepStatus(OrderStatusEnum.DELIVERED).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatusEnum.DELIVERED).active}
            completed={getStepStatus(OrderStatusEnum.DELIVERED).completed}
          >
            <FaCheckCircle size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatusEnum.DELIVERED).active}
            completed={getStepStatus(OrderStatusEnum.DELIVERED).completed}
          >
            Delivered
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatusEnum.CANCELLED).active}
          completed={getStepStatus(OrderStatusEnum.CANCELLED).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatusEnum.CANCELLED).active}
            completed={getStepStatus(OrderStatusEnum.CANCELLED).completed}
          >
            <FaTimesCircle size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatusEnum.CANCELLED).active}
            completed={getStepStatus(OrderStatusEnum.CANCELLED).completed}
          >
            Cancelled
          </StepLabel>
        </Step>
      </TrackingSteps>
      
      {trackingNumber && (
        <TrackingInfo>
          <TrackingNumber>
            Tracking Number: {trackingNumber}
          </TrackingNumber>
          {expectedDelivery && (
            <DeliveryInfo>
              Expected Delivery: {formatDeliveryDate(expectedDelivery)}
            </DeliveryInfo>
          )}
        </TrackingInfo>
      )}
    </TrackingContainer>
  );
};

export default OrderTracking;
