import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Spin } from 'antd';
import { PaystackService } from '../../services/PaystackService';
import { useOrder } from '../../contexts/OrderContext';

const PaystackVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateOrderStatus, updatePaymentStatus, orders } = useOrder();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference');
        if (!reference) {
          throw new Error('No reference found');
        }

        // Find the order with this reference
        const order = orders.find(o => o.reference === reference);
        if (!order) {
          throw new Error('Order not found');
        }

        const response = await PaystackService.verifyTransaction(reference);

        if (response.data.status === 'success') {
          // Update order status
          updateOrderStatus(order.id, 'completed');
          updatePaymentStatus(order.id, 'paid');

          // Navigate to success page
          navigate('/checkout/success', {
            state: {
              orderId: order.id,
              reference: reference,
              amount: response.data.amount / 100, // Convert back from kobo/cents
              paymentMethod: order.paymentMethod
            }
          });
        } else {
          // Update order status to failed
          updateOrderStatus(order.id, 'failed');
          updatePaymentStatus(order.id, 'failed');
          
          throw new Error(response.data.gateway_response || 'Payment failed');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Payment verification failed');
        setTimeout(() => {
          navigate('/cart');
        }, 3000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, updateOrderStatus, updatePaymentStatus, orders]);

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Payment Failed"
        subTitle={error}
        extra={[
          <p key="redirect" className="text-gray-600">
            Redirecting you back to cart...
          </p>
        ]}
      />
    );
  }

  return null;
};

export default PaystackVerificationPage;
