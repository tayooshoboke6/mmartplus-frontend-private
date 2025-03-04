import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Button, Space, Card, Typography, Divider, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { DeliverySettings, OrderValueAdjustment } from '../../models/StoreAddress';

const { Title, Text } = Typography;
const { Option } = Select;

interface DeliverySettingsFormProps {
  initialValues: DeliverySettings;
  onChange: (values: DeliverySettings) => void;
}

const DeliverySettingsForm: React.FC<DeliverySettingsFormProps> = ({ 
  initialValues, 
  onChange 
}) => {
  const [form] = Form.useForm();
  const [adjustments, setAdjustments] = useState<OrderValueAdjustment[]>(
    initialValues.orderValueAdjustments || []
  );

  // Update form when initial values change
  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      orderValueAdjustments: undefined // We handle this separately
    });
    setAdjustments(initialValues.orderValueAdjustments || []);
  }, [initialValues, form]);

  // Handler for form values change
  const handleValuesChange = () => {
    const currentValues = form.getFieldsValue();
    onChange({
      ...currentValues,
      orderValueAdjustments: adjustments
    });
  };

  // Add a new blank order value adjustment
  const handleAddAdjustment = () => {
    const newAdjustment: OrderValueAdjustment = {
      orderValueThreshold: 5000, // Default ₦50
      adjustmentType: 'percentage',
      adjustmentValue: 10 // Default 10%
    };
    
    const updatedAdjustments = [...adjustments, newAdjustment];
    setAdjustments(updatedAdjustments);
    
    onChange({
      ...form.getFieldsValue(),
      orderValueAdjustments: updatedAdjustments
    });
  };

  // Remove an order value adjustment
  const handleRemoveAdjustment = (index: number) => {
    const updatedAdjustments = [...adjustments];
    updatedAdjustments.splice(index, 1);
    setAdjustments(updatedAdjustments);
    
    onChange({
      ...form.getFieldsValue(),
      orderValueAdjustments: updatedAdjustments
    });
  };

  // Update a specific adjustment
  const handleAdjustmentChange = (index: number, key: keyof OrderValueAdjustment, value: any) => {
    const updatedAdjustments = [...adjustments];
    updatedAdjustments[index] = {
      ...updatedAdjustments[index],
      [key]: value
    };
    
    setAdjustments(updatedAdjustments);
    
    onChange({
      ...form.getFieldsValue(),
      orderValueAdjustments: updatedAdjustments
    });
  };

  // Format currency for display
  const formatCurrency = (cents: number) => {
    return `₦${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card className="mb-4 rounded-lg shadow-md">
      <Title level={4} className="mb-4">Delivery Fee Settings</Title>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
        className="max-w-3xl"
      >
        <Form.Item 
          name="enableDelivery"
          valuePropName="checked"
          className="mb-6"
        >
          <Switch 
            checkedChildren="Delivery Enabled" 
            unCheckedChildren="Delivery Disabled" 
          />
          <Text className="ml-2">Enable delivery services for this store</Text>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Base Fee"
            name="baseFee"
            rules={[{ required: true, message: 'Please enter base fee' }]}
            tooltip="The starting fee for all deliveries from this store"
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const parsed = Number(value!.replace(/₦\s?|(,*)/g, '')) * 100;
                return isNaN(parsed) ? 0 : parsed;
              }}
              step={50} // ₦0.50 increments
            />
          </Form.Item>

          <Form.Item
            label="Per KM Charge"
            name="perKmCharge"
            rules={[{ required: true, message: 'Please enter per KM charge' }]}
            tooltip="Additional fee charged per kilometer of delivery distance"
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const parsed = Number(value!.replace(/₦\s?|(,*)/g, '')) * 100;
                return isNaN(parsed) ? 0 : parsed;
              }}
              step={25} // ₦0.25 increments
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Maximum Delivery Distance (km)"
            name="maxDeliveryDistanceKm"
            rules={[{ required: true, message: 'Please enter maximum delivery distance' }]}
            tooltip="Maximum distance (in km) beyond the geofence for delivery"
          >
            <InputNumber
              className="w-full"
              min={0}
              step={1}
            />
          </Form.Item>

          <Form.Item
            label="Outside Geofence Fee"
            name="outsideGeofenceFee"
            rules={[{ required: true, message: 'Please enter outside geofence fee' }]}
            tooltip="Additional fee charged for deliveries outside the geofence"
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const parsed = Number(value!.replace(/₦\s?|(,*)/g, '')) * 100;
                return isNaN(parsed) ? 0 : parsed;
              }}
              step={50} // ₦0.50 increments
            />
          </Form.Item>
        </div>

        <Divider orientation="left">Order Value Adjustments</Divider>
        <Text type="secondary" className="mb-4 block">
          Adjust delivery fees based on order value. For example, offer 50% off delivery for orders over ₦50, or free delivery for orders over ₦100.
        </Text>

        {adjustments.map((adjustment, index) => (
          <div key={index} className="flex flex-wrap items-end gap-3 mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
            <div className="min-w-[180px]">
              <label className="block text-sm mb-1">Order Value Threshold</label>
              <InputNumber
                className="w-full"
                min={0}
                value={adjustment.orderValueThreshold / 100}
                formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value!.replace(/₦\s?|(,*)/g, '')) || 0}
                onChange={(value) => handleAdjustmentChange(index, 'orderValueThreshold', (value || 0) * 100)}
                step={5}
              />
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm mb-1">Adjustment Type</label>
              <Select
                className="w-full"
                value={adjustment.adjustmentType}
                onChange={(value) => handleAdjustmentChange(index, 'adjustmentType', value)}
              >
                <Option value="percentage">Percentage Discount</Option>
                <Option value="fixed">Fixed Price</Option>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm mb-1">
                {adjustment.adjustmentType === 'percentage' ? 'Discount %' : 'Fixed Fee'}
              </label>
              {adjustment.adjustmentType === 'percentage' ? (
                <InputNumber
                  className="w-full"
                  min={0}
                  max={100}
                  value={adjustment.adjustmentValue}
                  formatter={(value) => `${value}%`}
                  parser={(value) => Number(value!.replace('%', '')) || 0}
                  onChange={(value) => handleAdjustmentChange(index, 'adjustmentValue', value || 0)}
                />
              ) : (
                <InputNumber
                  className="w-full"
                  min={0}
                  value={adjustment.adjustmentValue / 100}
                  formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => Number(value!.replace(/₦\s?|(,*)/g, '')) * 100 || 0}
                  onChange={(value) => handleAdjustmentChange(index, 'adjustmentValue', (value || 0) * 100)}
                  step={0.50}
                />
              )}
            </div>

            <Button 
              danger
              icon={<DeleteOutlined />} 
              onClick={() => handleRemoveAdjustment(index)}
              className="mb-3 md:mb-0"
            >
              Remove
            </Button>
          </div>
        ))}

        <Button 
          type="dashed" 
          onClick={handleAddAdjustment} 
          icon={<PlusOutlined />} 
          className="mb-4"
        >
          Add Order Value Adjustment
        </Button>
      </Form>
    </Card>
  );
};

export default DeliverySettingsForm;
