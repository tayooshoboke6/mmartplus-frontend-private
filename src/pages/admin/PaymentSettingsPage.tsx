import React from 'react';
import { Typography, Breadcrumb, Divider } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layouts/AdminLayout';
import PaymentSettingsForm from '../../components/admin/PaymentSettingsForm';

const { Title } = Typography;

const PaymentSettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item href="/admin">
            <HomeOutlined />
            <span className="ml-1">Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <SettingOutlined />
            <span className="ml-1">Payment Settings</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} className="mb-6">Payment Settings</Title>
        
        <div className="mb-4">
          <p className="text-gray-500">
            Configure payment methods and settings for your store. Enable or disable payment options and set the tax rate.
          </p>
        </div>
        
        <Divider />
        
        <PaymentSettingsForm />
      </div>
    </AdminLayout>
  );
};

export default PaymentSettingsPage;
