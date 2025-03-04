import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import { PaystackService } from '../../services/PaystackService';

interface PaystackPaymentHandlerProps {
  email: string;
  amount: number;
  onSuccess: (reference: string) => void;
  onError: (error: any) => void;
}

const PaystackPaymentHandler: React.FC<PaystackPaymentHandlerProps> = ({
  email,
  amount,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const reference = PaystackService.generateReference();
        const callback_url = `${window.location.origin}/checkout/verify/paystack`;

        const response = await PaystackService.initializeTransaction(
          email,
          amount,
          reference,
          callback_url
        );

        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } catch (error) {
        message.error('Failed to initialize payment');
        onError(error);
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [email, amount, onSuccess, onError, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaystackPaymentHandler;
