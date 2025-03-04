import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Button, Switch, Modal, Form, Input, Tabs, Space, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import { StoreAddress, StoreAddressFormData, defaultOpeningHours } from '../../models/StoreAddress';
import StoreAddressService from '../../services/StoreAddressService';
import StoreAddressForm from '../../components/admin/StoreAddressForm';

const { TabPane } = Tabs;
const { confirm } = Modal;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const StyledTable = styled(Table)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.active ? '#e6f7ed' : '#fff1f0'};
  color: ${props => props.active ? '#52c41a' : '#ff4d4f'};
`;

const PickupBadge = styled.span<{ enabled: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.enabled ? '#e6f7ff' : '#f5f5f5'};
  color: ${props => props.enabled ? '#1890ff' : '#8c8c8c'};
`;

const ActionButton = styled(Button)`
  margin-left: 8px;
`;

const StoreAddressesPage: React.FC = () => {
  const [storeAddresses, setStoreAddresses] = useState<StoreAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<StoreAddress | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchStoreAddresses();
  }, []);

  const fetchStoreAddresses = async () => {
    try {
      setLoading(true);
      const addresses = await StoreAddressService.getStoreAddresses();
      setStoreAddresses(addresses);
    } catch (error) {
      console.error('Error fetching store addresses:', error);
      message.error('Failed to load store addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setCurrentAddress(null);
    setModalVisible(true);
  };

  const handleEditAddress = (address: StoreAddress) => {
    setCurrentAddress(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = (address: StoreAddress) => {
    confirm({
      title: 'Are you sure you want to delete this store address?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await StoreAddressService.deleteStoreAddress(address.id);
          message.success('Store address deleted successfully');
          fetchStoreAddresses();
        } catch (error) {
          console.error('Error deleting store address:', error);
          message.error('Failed to delete store address');
        }
      }
    });
  };

  const handleToggleStatus = async (address: StoreAddress) => {
    try {
      await StoreAddressService.toggleStoreAddressStatus(address.id);
      message.success(`Store ${address.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchStoreAddresses();
    } catch (error) {
      console.error('Error toggling store status:', error);
      message.error('Failed to update store status');
    }
  };

  const handleTogglePickup = async (address: StoreAddress) => {
    try {
      await StoreAddressService.toggleStoreAddressPickup(address.id);
      message.success(`In-store pickup ${address.allowsPickup ? 'disabled' : 'enabled'} successfully`);
      fetchStoreAddresses();
    } catch (error) {
      console.error('Error toggling pickup status:', error);
      message.error('Failed to update pickup status');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = async (values: StoreAddressFormData) => {
    try {
      if (currentAddress) {
        // Update existing address
        await StoreAddressService.updateStoreAddress(currentAddress.id, values);
        message.success('Store address updated successfully');
      } else {
        // Create new address
        await StoreAddressService.createStoreAddress(values);
        message.success('Store address created successfully');
      }
      setModalVisible(false);
      fetchStoreAddresses();
    } catch (error) {
      console.error('Error saving store address:', error);
      message.error('Failed to save store address');
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const getFilteredAddresses = () => {
    switch (activeTab) {
      case 'active':
        return storeAddresses.filter(address => address.isActive);
      case 'pickup':
        return storeAddresses.filter(address => address.isActive && address.allowsPickup);
      case 'inactive':
        return storeAddresses.filter(address => !address.isActive);
      default:
        return storeAddresses;
    }
  };

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: StoreAddress, b: StoreAddress) => a.name.localeCompare(b.name)
    },
    {
      title: 'Address',
      key: 'address',
      render: (text: string, record: StoreAddress) => (
        <span>{`${record.street}, ${record.city}, ${record.state}`}</span>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: string, record: StoreAddress) => (
        <StatusBadge active={record.isActive}>
          {record.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value: boolean | string, record: StoreAddress) => record.isActive === value
    },
    {
      title: 'Pickup',
      key: 'pickup',
      render: (text: string, record: StoreAddress) => (
        <PickupBadge enabled={record.allowsPickup}>
          {record.allowsPickup ? 'Enabled' : 'Disabled'}
        </PickupBadge>
      ),
      filters: [
        { text: 'Enabled', value: true },
        { text: 'Disabled', value: false }
      ],
      onFilter: (value: boolean | string, record: StoreAddress) => record.allowsPickup === value
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: StoreAddress) => (
        <Space>
          <Tooltip title="Toggle Status">
            <Switch 
              checked={record.isActive} 
              onChange={() => handleToggleStatus(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Toggle Pickup">
            <Switch 
              checked={record.allowsPickup} 
              onChange={() => handleTogglePickup(record)}
              size="small"
              disabled={!record.isActive}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <ActionButton 
              icon={<EditOutlined />} 
              type="primary" 
              size="small" 
              onClick={() => handleEditAddress(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <ActionButton 
              icon={<DeleteOutlined />} 
              type="primary" 
              danger 
              size="small" 
              onClick={() => handleDeleteAddress(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <AdminLayout title="Store Addresses">
      <PageHeader>
        <Title>Store Addresses</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddAddress}
        >
          Add New Store
        </Button>
      </PageHeader>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="All Stores" key="all" />
        <TabPane tab="Active Stores" key="active" />
        <TabPane tab="Pickup Enabled" key="pickup" />
        <TabPane tab="Inactive Stores" key="inactive" />
      </Tabs>

      <StyledTable
        columns={columns}
        dataSource={getFilteredAddresses()}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentAddress ? 'Edit Store Address' : 'Add New Store Address'}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <StoreAddressForm
          initialValues={currentAddress || { 
            isActive: true, 
            allowsPickup: true,
            country: 'Nigeria',
            openingHours: defaultOpeningHours
          }}
          onSubmit={handleFormSubmit}
          onCancel={handleModalCancel}
        />
      </Modal>
    </AdminLayout>
  );
};

export default StoreAddressesPage;
