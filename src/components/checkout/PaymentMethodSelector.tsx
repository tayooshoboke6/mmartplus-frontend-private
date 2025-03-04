import React, { useState, useEffect } from 'react';
import { Modal, Radio, Space, Button, Typography, Spin } from 'antd';
import { PaymentMethod } from '../../models/PaymentMethod';
import { PaymentService } from '../../services/PaymentService';

const { Text, Title } = Typography;
const { Group, Button: RadioButton } = Radio;

interface PaymentMethodSelectorProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (paymentMethod: PaymentMethod) => void;
  orderTotal: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  visible,
  onCancel,
  onSelect,
  orderTotal
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const methods = await PaymentService.getPaymentMethods();
        setPaymentMethods(methods);
        
        // Set default selected method
        if (methods.length > 0) {
          setSelectedMethod(methods[0].code);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchPaymentMethods();
    }
  }, [visible]);

  const handleSelect = () => {
    const method = paymentMethods.find(m => m.code === selectedMethod);
    if (method) {
      onSelect(method);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate and display processing fee
  const renderProcessingFee = (method: PaymentMethod) => {
    if (!method.processingFee) return null;
    
    let feeAmount = 0;
    if (method.processingFeeType === 'percentage') {
      feeAmount = (orderTotal * method.processingFee) / 100;
    } else {
      feeAmount = method.processingFee;
    }
    
    return `${method.processingFeeType === 'percentage' ? `${method.processingFee}% processing fee` : 'Processing fee'} (${formatCurrency(feeAmount)})`;
  };

  return (
    <Modal
      title="Select Payment Method"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="select" 
          type="primary" 
          onClick={handleSelect}
          disabled={!selectedMethod || loading}
        >
          Continue to Payment
        </Button>
      ]}
      width={500}
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        <Radio.Group 
          value={selectedMethod} 
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {paymentMethods.map(method => (
              <div
                key={method.code}
                className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${selectedMethod === method.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSelectedMethod(method.code)}
              >
                <Radio value={method.code} className="mb-0">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <Title level={5} className="mb-0">{method.name}</Title>
                      <Text className="block text-gray-500">{method.description}</Text>
                      {method.processingFee ? (
                        <Text type="secondary" className="text-sm">
                          {renderProcessingFee(method)}
                        </Text>
                      ) : null}
                    </div>
                  </div>
                </Radio>
              </div>
            ))}
          </Space>
        </Radio.Group>
      )}
    </Modal>
  );
};

export default PaymentMethodSelector;
