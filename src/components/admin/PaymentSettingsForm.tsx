import React, { useState, useEffect } from 'react';
import { Form, Card, Typography, Switch, InputNumber, Button, message, Tooltip } from 'antd';
import { InfoCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { PaymentMethod } from '../../models/PaymentMethod';
import { PaymentService } from '../../services/PaymentService';

const { Title, Text } = Typography;

interface PaymentSettingsFormProps {
  onSave?: () => void;
}

const PaymentSettingsForm: React.FC<PaymentSettingsFormProps> = ({ onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [taxRate, setTaxRate] = useState<number>(7.5); // Default to 7.5%

  // Load payment methods and settings
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        setLoading(true);
        const methods = await PaymentService.getPaymentMethods();
        const enabledMethods = new Set(methods.filter(m => m.enabled).map(m => m.code));
        
        setPaymentMethods(methods);
        
        // Set initial form values based on enabled methods
        form.setFieldsValue({
          taxRate: taxRate,
          paymentMethods: methods.reduce((acc, method) => {
            acc[method.code] = enabledMethods.has(method.code);
            return acc;
          }, {} as Record<string, boolean>)
        });
      } catch (error) {
        console.error('Error fetching payment settings:', error);
        message.error('Failed to load payment settings');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSettings();
  }, [form]);

  // Handle form submission
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // In a real app, we'd send this data to the server
      message.success('Payment settings updated successfully');
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Card className="shadow-md rounded-lg">
      <Title level={4} className="mb-6">Payment Settings</Title>
      
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
      >
        <div className="mb-6">
          <Title level={5} className="mb-4">Available Payment Methods</Title>
          
          {paymentMethods.map(method => (
            <Form.Item 
              name={['paymentMethods', method.code]} 
              valuePropName="checked"
              key={method.code}
            >
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <Text>{method.name}</Text>
                <Switch />
              </div>
            </Form.Item>
          ))}
        </div>
        
        <Form.Item
          label={
            <span>
              Tax Rate (%)
              <Tooltip title="Tax rate applied to orders">
                <InfoCircleOutlined className="ml-1" />
              </Tooltip>
            </span>
          }
          name="taxRate"
          rules={[{ required: true, message: 'Please enter tax rate' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            max={100}
            step={0.1}
            precision={1}
            formatter={value => `${value}%`}
            parser={value => Number(value!.replace('%', ''))}
          />
        </Form.Item>

        <Form.Item className="mt-6">
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={loading}
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PaymentSettingsForm;
