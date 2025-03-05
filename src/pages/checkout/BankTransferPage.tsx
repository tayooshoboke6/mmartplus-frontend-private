import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Alert, message, Divider, Spin, Steps } from 'antd';
import { 
  CopyOutlined, 
  ArrowLeftOutlined, 
  WhatsAppOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useOrder } from '../../contexts/OrderContext';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface LocationState {
  orderId: string;
  amount: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: string;
  deliveryMethod: string;
  paymentMethod: {
    code: string;
    name: string;
  };
}

const BankTransferPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state: LocationState };
  const { getOrderById } = useOrder();

  const bankDetails = {
    bankName: 'Monipoint Bank',
    accountName: 'M-Mart',
    accountNumber: '2345635643',
    whatsappNumber: '09033483394'
  };

  useEffect(() => {
    const validateState = () => {
      if (!state) {
        message.error('Missing order information');
        navigate('/cart');
        return false;
      }

      const { orderId, amount, customerDetails, deliveryAddress, deliveryMethod } = state;
      
      if (!orderId || !amount || !customerDetails || !deliveryAddress || !deliveryMethod) {
        message.error('Incomplete order information');
        navigate('/cart');
        return false;
      }

      const order = getOrderById(orderId);
      if (!order) {
        message.error('Order not found');
        navigate('/cart');
        return false;
      }

      return true;
    };

    validateState();
  }, [state, navigate, getOrderById]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
  };

  const handleWhatsAppClick = () => {
    const messageText = `Hello M-Mart! I've made a bank transfer for my order.\n\n` +
      `Order ID: ${state.orderId}\n` +
      `Amount: ₦${state.amount.toFixed(2)}\n` +
      `Name: ${state.customerDetails.name}\n` +
      `Phone: ${state.customerDetails.phone}\n\n` +
      `I'm attaching my payment receipt.`;
    
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${bankDetails.whatsappNumber.replace(/^0/, '234')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewOrders = () => {
    navigate('/account/orders');
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-md rounded-lg">
        <Steps current={3} className="mb-8">
          <Step title="Cart" status="finish" icon={<ShoppingCartOutlined />} />
          <Step title="Delivery" status="finish" icon={<CarOutlined />} />
          <Step title="Payment" status="finish" icon={<CreditCardOutlined />} />
          <Step title="Confirmation" status="process" icon={<CheckCircleOutlined />} />
        </Steps>

        <div className="text-center mb-6">
          <Title level={3} className="text-gray-800">Bank Transfer Details</Title>
          <Text type="secondary" className="text-lg">
            Please make a transfer of <span className="font-semibold text-blue-600">₦{state.amount.toFixed(2)}</span> to complete your order
          </Text>
        </div>

        <Alert
          message={
            <div className="flex items-center gap-2">
              <BankOutlined className="text-blue-600 text-lg" />
              <span className="font-medium">Important Instructions</span>
            </div>
          }
          description={
            <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-600">
              <li>Make the transfer using the details below</li>
              <li>Take a screenshot or photo of your payment receipt</li>
              <li>Click the WhatsApp button to send your receipt</li>
              <li>Your order will remain pending until confirmed by admin</li>
            </ul>
          }
          type="info"
          showIcon={false}
          className="mb-6 border-blue-100 bg-blue-50"
        />

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text strong className="text-gray-700">Bank Name</Text>
                <div className="flex items-center gap-2">
                  <Text copyable className="text-gray-800">{bankDetails.bankName}</Text>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Text strong className="text-gray-700">Account Name</Text>
                <div className="flex items-center gap-2">
                  <Text copyable className="text-gray-800">{bankDetails.accountName}</Text>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Text strong className="text-gray-700">Account Number</Text>
                <div className="flex items-center gap-2">
                  <Text className="text-gray-800">{bankDetails.accountNumber}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined className="text-blue-600" />}
                    onClick={() => handleCopy(bankDetails.accountNumber)}
                  />
                </div>
              </div>

              <Divider className="my-4" />

              <div className="flex justify-between items-center">
                <Text strong className="text-gray-700">Amount to Pay</Text>
                <Text className="text-xl font-semibold text-blue-600">₦{state.amount.toFixed(2)}</Text>
              </div>

              <div className="flex justify-between items-center">
                <Text strong className="text-gray-700">Order ID</Text>
                <div className="flex items-center gap-2">
                  <Text copyable className="text-gray-800">{state.orderId}</Text>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <Title level={5} className="text-gray-800 mb-4">Order Summary</Title>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text className="text-gray-600">Delivery Method</Text>
                <Text strong className="text-gray-800">{state.deliveryMethod}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Delivery Address</Text>
                <Text strong className="text-gray-800 text-right max-w-[60%]">{state.deliveryAddress}</Text>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4 mt-8">
            <Paragraph className="text-gray-600">
              After making the transfer, click the WhatsApp button below to send your payment receipt.
              Your order will be processed once we confirm your payment.
            </Paragraph>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<WhatsAppOutlined />}
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 h-12 px-8 rounded-lg flex items-center justify-center"
              >
                Send Receipt via WhatsApp
              </Button>

              <Button
                type="primary"
                size="large"
                onClick={handleViewOrders}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-lg flex items-center justify-center"
              >
                View My Orders
              </Button>
            </div>

            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/cart')}
              className="text-gray-500 hover:text-gray-700"
            >
              Return to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BankTransferPage;
