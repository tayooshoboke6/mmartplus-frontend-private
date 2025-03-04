import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, Steps, Button, Form, Input, message, Spin, Alert, Divider, Typography } from 'antd';
import { 
  ShoppingCartOutlined, 
  CarOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  BankOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import { PaymentMethod } from '../../models/PaymentMethod';
import { PaymentService } from '../../services/PaymentService';
import PaystackPaymentHandler from '../../components/payment/PaystackPaymentHandler';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';

const { Step } = Steps;
const { Text } = Typography;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showPaystackHandler, setShowPaystackHandler] = useState(false);
  const { cart, total = 0, clearCart } = useCart();
  const { createOrder, updateOrderStatus } = useOrder();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // Get parameters from URL
  const paymentCode = searchParams.get('payment');
  const addressId = searchParams.get('address');
  const deliveryMethod = searchParams.get('delivery');

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Validate required parameters
        if (!paymentCode || !addressId || !deliveryMethod) {
          message.error('Missing required checkout information');
          navigate('/cart');
          return;
        }

        // Get available payment methods
        const methods = await PaymentService.getPaymentMethods();
        const selectedMethod = methods.find(m => m.code === paymentCode);
        
        if (!selectedMethod) {
          message.error('Invalid payment method');
          navigate('/cart');
          return;
        }

        setPaymentMethod(selectedMethod);

        // Pre-fill form with user information
        if (user) {
          form.setFieldsValue({
            email: user.email,
            name: user.name,
            phone: user.phone
          });
        }
      } catch (error) {
        console.error('Error initializing checkout:', error);
        message.error('Failed to initialize checkout');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [paymentCode, addressId, deliveryMethod, form, user, navigate]);

  const calculateTotal = () => {
    if (typeof total !== 'number') return 0;
    const processingFee = paymentMethod ? 
      PaymentService.calculateProcessingFee(paymentMethod.code, total) : 0;
    return total + processingFee;
  };

  const handleSubmit = async (values: any) => {
    if (!paymentMethod) {
      message.error('Payment method not selected');
      return;
    }

    setLoading(true);
    try {
      // Validate cart is not empty
      if (!cart.length) {
        throw new Error('Cart is empty');
      }

      // Create initial order
      const order = await createOrder({
        items: cart,
        total: calculateTotal(),
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        deliveryAddress: addressId,
        deliveryMethod,
        customerDetails: {
          name: values.name,
          email: values.email,
          phone: values.phone
        }
      });

      // Handle different payment methods
      if (paymentMethod.code === 'card_paystack') {
        setShowPaystackHandler(true);
      } else if (paymentMethod.code === 'bank_transfer') {
        navigate('/checkout/bank-transfer', {
          state: {
            orderId: order.id,
            amount: calculateTotal(),
            customerDetails: values,
            deliveryAddress: addressId,
            deliveryMethod,
            paymentMethod
          }
        });
      } else if (paymentMethod.code === 'cod') {
        updateOrderStatus(order.id, 'processing');
        await clearCart();
        
        navigate('/checkout/success', {
          state: {
            orderId: order.id,
            paymentMethod,
            amount: calculateTotal()
          }
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      message.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (showPaystackHandler) {
    return (
      <PaystackPaymentHandler
        email={form.getFieldValue('email')}
        amount={calculateTotal()}
        onSuccess={(reference) => {
          // Handle Paystack success
        }}
        onError={() => {
          // Handle Paystack error
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-md rounded-lg">
        <Steps current={2} className="mb-8">
          <Step title="Cart" status="finish" icon={<ShoppingCartOutlined />} />
          <Step title="Delivery" status="finish" icon={<CarOutlined />} />
          <Step title="Payment" status="process" icon={<CreditCardOutlined />} />
          <Step title="Confirmation" icon={<CheckCircleOutlined />} />
        </Steps>

        {paymentMethod && (
          <Alert
            message={
              <div className="flex items-center space-x-2">
                <BankOutlined className="text-blue-600" />
                <span className="font-medium">Payment Method: {paymentMethod.name}</span>
              </div>
            }
            description={
              <div className="mt-2 text-gray-600">
                {paymentMethod.description}
              </div>
            }
            type="info"
            showIcon={false}
            className="mb-6 border-blue-100 bg-blue-50"
          />
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₦{total.toFixed(2)}</span>
            </div>
            {paymentMethod?.processingFee && (
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Processing Fee:</span>
                <span className="font-medium">
                  {paymentMethod.processingFeeType === 'percentage'
                    ? `${paymentMethod.processingFee}%`
                    : `₦${paymentMethod.processingFee}`}
                </span>
              </div>
            )}
            <Divider className="my-3" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-gray-800">Total:</span>
              <span className="font-semibold text-blue-600">₦{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Information</h3>
            <div className="grid gap-6">
              <Form.Item
                name="name"
                label={<span className="text-gray-700">Full Name</span>}
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input 
                  size="large"
                  placeholder="Enter your full name"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-gray-700">Email</span>}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  size="large"
                  placeholder="Enter your email address"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<span className="text-gray-700">Phone Number</span>}
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input 
                  size="large"
                  placeholder="Enter your phone number"
                  className="rounded-md"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-medium rounded-lg flex items-center justify-center"
              icon={<LockOutlined />}
            >
              Complete Order
            </Button>
            <div className="text-center mt-4">
              <Text type="secondary" className="flex items-center justify-center gap-1">
                <LockOutlined /> Secure checkout powered by Paystack
              </Text>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CheckoutPage;
