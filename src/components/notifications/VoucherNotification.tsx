import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGift, FaClock } from 'react-icons/fa';

interface VoucherNotificationProps {
  id: string;
  voucherCode: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  expiryDate: string;
  message?: string;
  isRead: boolean;
  date: string;
}

const NotificationContainer = styled.div<{ isRead: boolean }>`
  background-color: ${props => props.isRead ? '#ffffff' : '#f0f7ff'};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border-left: 3px solid #0071BC;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.h3`
  margin: 0;
  color: #0071BC;
  font-size: 16px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const Date = styled.span`
  font-size: 12px;
  color: #666;
`;

const VoucherCode = styled.div`
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: monospace;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin: 12px 0;
  letter-spacing: 1px;
`;

const Message = styled.p`
  margin: 12px 0;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
`;

const ExpiryInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
  margin-top: 8px;
  
  svg {
    margin-right: 6px;
    color: #f57c00;
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: #0071BC;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #005a9e;
  }
`;

const VoucherNotification: React.FC<VoucherNotificationProps> = ({
  id,
  voucherCode,
  discount,
  discountType,
  expiryDate,
  message,
  isRead,
  date
}) => {
  const discountDisplay = discountType === 'percentage' ? `${discount}%` : `RM${discount}`;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const formattedExpiryDate = new Date(expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <NotificationContainer isRead={isRead}>
      <NotificationHeader>
        <Title>
          <FaGift /> New Voucher: {discountDisplay} Off
        </Title>
        <Date>{formattedDate}</Date>
      </NotificationHeader>
      
      <VoucherCode>{voucherCode}</VoucherCode>
      
      {message && <Message>{message}</Message>}
      
      <ExpiryInfo>
        <FaClock /> Valid until {formattedExpiryDate}
      </ExpiryInfo>
      
      <ActionButton to="/account/vouchers">
        View My Vouchers
      </ActionButton>
    </NotificationContainer>
  );
};

export default VoucherNotification;
