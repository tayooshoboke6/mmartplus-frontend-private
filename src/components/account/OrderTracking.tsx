import React from 'react';
import styled from 'styled-components';
import { OrderStatus } from '../../services/orderService';
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
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PROCESSING]: 1,
      [OrderStatus.SHIPPED]: 2,
      [OrderStatus.DELIVERED]: 3,
      [OrderStatus.CANCELLED]: 4
    };
    
    // If order is cancelled, only the cancelled step is active
    if (status === OrderStatus.CANCELLED) {
      return {
        active: stepStatus === OrderStatus.CANCELLED,
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
          active={getStepStatus(OrderStatus.PENDING).active}
          completed={getStepStatus(OrderStatus.PENDING).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatus.PENDING).active}
            completed={getStepStatus(OrderStatus.PENDING).completed}
          >
            <FaClipboardCheck size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatus.PENDING).active}
            completed={getStepStatus(OrderStatus.PENDING).completed}
          >
            Order Placed
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatus.PROCESSING).active}
          completed={getStepStatus(OrderStatus.PROCESSING).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatus.PROCESSING).active}
            completed={getStepStatus(OrderStatus.PROCESSING).completed}
          >
            <FaCog size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatus.PROCESSING).active}
            completed={getStepStatus(OrderStatus.PROCESSING).completed}
          >
            Processing
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatus.SHIPPED).active}
          completed={getStepStatus(OrderStatus.SHIPPED).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatus.SHIPPED).active}
            completed={getStepStatus(OrderStatus.SHIPPED).completed}
          >
            <FaTruck size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatus.SHIPPED).active}
            completed={getStepStatus(OrderStatus.SHIPPED).completed}
          >
            Shipped
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatus.DELIVERED).active}
          completed={getStepStatus(OrderStatus.DELIVERED).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatus.DELIVERED).active}
            completed={getStepStatus(OrderStatus.DELIVERED).completed}
          >
            <FaCheckCircle size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatus.DELIVERED).active}
            completed={getStepStatus(OrderStatus.DELIVERED).completed}
          >
            Delivered
          </StepLabel>
        </Step>
        
        <Step 
          active={getStepStatus(OrderStatus.CANCELLED).active}
          completed={getStepStatus(OrderStatus.CANCELLED).completed}
        >
          <StepIcon 
            active={getStepStatus(OrderStatus.CANCELLED).active}
            completed={getStepStatus(OrderStatus.CANCELLED).completed}
          >
            <FaTimesCircle size={24} />
          </StepIcon>
          <StepLabel 
            active={getStepStatus(OrderStatus.CANCELLED).active}
            completed={getStepStatus(OrderStatus.CANCELLED).completed}
          >
            Cancelled
          </StepLabel>
        </Step>
      </TrackingSteps>
      
      {(trackingNumber || expectedDelivery) && (
        <TrackingInfo>
          {trackingNumber && (
            <TrackingNumber>
              Tracking Number: <strong>{trackingNumber}</strong>
            </TrackingNumber>
          )}
          
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
