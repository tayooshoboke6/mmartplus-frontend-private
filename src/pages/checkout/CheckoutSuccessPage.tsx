import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Card, Typography, Divider } from 'antd';
import { ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
import { useOrder } from '../../contexts/OrderContext';

const { Text, Title } = Typography;

interface LocationState {
  orderId: string;
  reference?: string;
  paymentMethod?: {
    name: string;
    code: string;
  };
  amount?: number;
}

const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const { state } = location as { state: LocationState };
  const order = state.orderId ? getOrderById(state.orderId) : null;

  const getSuccessMessage = () => {
    if (state?.paymentMethod?.code === 'cod') {
      return 'Your order has been placed successfully! You will pay on delivery.';
    } else if (state?.paymentMethod?.code === 'bank_transfer') {
      return 'Your order has been placed successfully! Please complete the bank transfer using the details provided.';
    } else {
      return 'Payment successful! Your order has been confirmed.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Result
          status="success"
          title="Order Successful!"
          subTitle={getSuccessMessage()}
          extra={[
            <Button
              key="orders"
              type="primary"
              onClick={() => navigate('/orders')}
              icon={<FileTextOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View Orders
            </Button>,
            <Button
              key="shop"
              onClick={() => navigate('/')}
              icon={<ShoppingOutlined />}
            >
              Continue Shopping
            </Button>,
          ]}
        />

        {order && (
          <Card className="mt-8 shadow-sm">
            <Title level={4}>Order Details</Title>
            <div className="space-y-4">
              <div>
                <Text strong>Order ID: </Text>
                <Text copyable>{order.id}</Text>
              </div>

              {state.reference && (
                <div>
                  <Text strong>Payment Reference: </Text>
                  <Text copyable>{state.reference}</Text>
                </div>
              )}

              <div>
                <Text strong>Payment Method: </Text>
                <Text>{state.paymentMethod?.name || order.paymentMethod.name}</Text>
              </div>

              <div>
                <Text strong>Amount: </Text>
                <Text>₦{(state.amount || order.total).toFixed(2)}</Text>
              </div>

              <Divider />

              <div>
                <Text strong>Delivery Method: </Text>
                <Text>{order.deliveryMethod}</Text>
              </div>

              <div>
                <Text strong>Delivery Address: </Text>
                <Text>{order.deliveryAddress}</Text>
              </div>

              <Divider />

              <div>
                <Text strong>Items:</Text>
                <div className="mt-2 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <Text>{item.name} x {item.quantity}</Text>
                      <Text>₦{(item.price * item.quantity).toFixed(2)}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
