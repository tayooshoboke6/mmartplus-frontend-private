import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PaymentMethod } from '../../models/PaymentMethod';
import PaymentService from '../../services/PaymentService';
import { formatCurrency } from '../../utils/formatCurrency';

interface CheckoutOptionsProps {
  subtotal: number;
  onClose: () => void;
  onProceed: (paymentMethodId: string) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
`;

const OptionsList = styled.div`
  margin-bottom: 20px;
`;

const PaymentOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid ${props => props.selected ? '#0071BC' : '#ddd'};
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#f0f7ff' : 'white'};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.selected ? '#0071BC' : '#bbb'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const PaymentIconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const PaymentIcon = styled.div`
  font-size: 20px;
  color: #555;
`;

const PaymentDetails = styled.div`
  flex: 1;
`;

const PaymentName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const PaymentDescription = styled.div`
  font-size: 13px;
  color: #666;
`;

const PaymentFee = styled.div`
  font-size: 13px;
  color: #666;
  margin-top: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' 
    ? `
      background-color: #0071BC;
      color: white;
      border: 1px solid #0071BC;
      
      &:hover {
        background-color: #005a9e;
      }
      
      &:disabled {
        background-color: #ccc;
        border-color: #ccc;
        cursor: not-allowed;
      }
    ` 
    : `
      background-color: white;
      color: #0071BC;
      border: 1px solid #ddd;
      
      &:hover {
        border-color: #0071BC;
      }
    `
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: #666;
`;

// Helper function to get icon element based on payment method code
const getPaymentIcon = (code: string) => {
  switch (code) {
    case 'card':
      return <i className="fas fa-credit-card"></i>;
    case 'bank_transfer':
      return <i className="fas fa-university"></i>;
    case 'cod':
      return <i className="fas fa-money-bill-wave"></i>;
    case 'mobile_money':
      return <i className="fas fa-mobile-alt"></i>;
    case 'paypal':
      return <i className="fab fa-paypal"></i>;
    default:
      return <i className="fas fa-money-check"></i>;
  }
};

const CheckoutOptions: React.FC<CheckoutOptionsProps> = ({ 
  subtotal, 
  onClose, 
  onProceed 
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const methods = await PaymentService.getPaymentMethods();
        setPaymentMethods(methods);
        
        // Set default selected method if available
        if (methods.length > 0) {
          const settings = await PaymentService.getPaymentSettings();
          const defaultMethod = methods.find(m => m.code === settings.defaultPaymentMethod);
          if (defaultMethod) {
            setSelectedMethod(defaultMethod.id);
          } else {
            setSelectedMethod(methods[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Failed to load payment options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleProceed = () => {
    if (selectedMethod) {
      onProceed(selectedMethod);
    }
  };

  // Calculate processing fee for the selected method
  const getProcessingFee = (methodId: string): number => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method || !method.processingFee) return 0;
    
    if (method.processingFeeType === 'percentage') {
      return (subtotal * method.processingFee) / 100;
    } else {
      return method.processingFee;
    }
  };

  // Format processing fee display text
  const formatProcessingFee = (methodId: string): string => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method || !method.processingFee) return '';
    
    if (method.processingFeeType === 'percentage') {
      return `${method.processingFee}% processing fee (${formatCurrency(getProcessingFee(methodId))})`;
    } else {
      return `${formatCurrency(method.processingFee)} processing fee`;
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Select Payment Method</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        {loading ? (
          <LoadingContainer>Loading payment options...</LoadingContainer>
        ) : error ? (
          <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : (
          <>
            <OptionsList>
              {paymentMethods.map((method) => (
                <PaymentOption 
                  key={method.id} 
                  selected={selectedMethod === method.id}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <PaymentIconContainer>
                    <PaymentIcon>
                      {getPaymentIcon(method.code)}
                    </PaymentIcon>
                  </PaymentIconContainer>
                  <PaymentDetails>
                    <PaymentName>{method.name}</PaymentName>
                    <PaymentDescription>{method.description}</PaymentDescription>
                    {method.processingFee && (
                      <PaymentFee>{formatProcessingFee(method.id)}</PaymentFee>
                    )}
                  </PaymentDetails>
                </PaymentOption>
              ))}
            </OptionsList>
            
            <ActionButtons>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleProceed}
                disabled={!selectedMethod}
              >
                Continue to Payment
              </Button>
            </ActionButtons>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CheckoutOptions;
