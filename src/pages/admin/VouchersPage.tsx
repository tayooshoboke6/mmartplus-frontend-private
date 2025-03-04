import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button, Table, Modal, Form, Input, DatePicker, Select, Switch, message, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
import VoucherService from '../../services/VoucherService';
import { Voucher, Customer, VoucherNotification } from '../../models/Voucher';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// Mock data for vouchers
const initialVouchers = [
  {
    id: '1',
    code: 'WELCOME10',
    discount: 10,
    discountType: 'percentage',
    minPurchase: 50,
    maxDiscount: 100,
    startDate: '2025-03-01',
    endDate: '2025-04-01',
    status: 'active',
    assignedTo: 'all',
    usageLimit: 1,
    description: 'Welcome discount for new customers'
  },
  {
    id: '2',
    code: 'SUMMER25',
    discount: 25,
    discountType: 'percentage',
    minPurchase: 100,
    maxDiscount: 250,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'inactive',
    assignedTo: 'selected',
    usageLimit: 3,
    description: 'Summer sale discount'
  }
];

// Mock data for customers
const customers = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '3', name: 'Robert Johnson', email: 'robert.johnson@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: '5', name: 'Michael Wilson', email: 'michael.wilson@example.com' }
];

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  margin-left: 8px;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 20px;
  }
`;

const VouchersPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [form] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(false);

  // Fetch vouchers and customers on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vouchersData = await VoucherService.getVouchers();
        const customersData = await VoucherService.getCustomers();
        setVouchers(vouchersData);
        setCustomerList(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load data');
        // Fallback to initial data if API fails
        setVouchers(initialVouchers);
        setCustomerList(customers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (editingVoucher) {
      form.setFieldsValue({
        ...editingVoucher,
        startDate: moment(editingVoucher.startDate),
        endDate: moment(editingVoucher.endDate),
      });
    } else {
      form.resetFields();
    }
  }, [editingVoucher, form]);

  const showModal = (voucher = null) => {
    setEditingVoucher(voucher);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVoucher(null);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const formattedValues = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };

    try {
      if (editingVoucher) {
        // Update existing voucher
        const updatedVoucher = await VoucherService.updateVoucher(editingVoucher.id, formattedValues);
        if (updatedVoucher) {
          setVouchers(vouchers.map(v => v.id === editingVoucher.id ? updatedVoucher : v));
          message.success('Voucher updated successfully');
        }
      } else {
        // Create new voucher
        const newVoucher = await VoucherService.createVoucher(formattedValues);
        setVouchers([...vouchers, newVoucher]);
        message.success('Voucher created successfully');
      }
      setIsModalVisible(false);
      setEditingVoucher(null);
    } catch (error) {
      console.error('Error saving voucher:', error);
      message.error('Failed to save voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this voucher?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true);
        try {
          const success = await VoucherService.deleteVoucher(id);
          if (success) {
            setVouchers(vouchers.filter(v => v.id !== id));
            message.success('Voucher deleted successfully');
          } else {
            message.error('Failed to delete voucher');
          }
        } catch (error) {
          console.error('Error deleting voucher:', error);
          message.error('Failed to delete voucher');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleStatusToggle = async (id: string, checked: boolean) => {
    setLoading(true);
    try {
      const updatedVoucher = await VoucherService.toggleVoucherStatus(id, checked);
      if (updatedVoucher) {
        setVouchers(vouchers.map(v => v.id === id ? updatedVoucher : v));
        message.success(`Voucher ${checked ? 'activated' : 'deactivated'} successfully`);
      } else {
        message.error(`Failed to ${checked ? 'activate' : 'deactivate'} voucher`);
      }
    } catch (error) {
      console.error('Error updating voucher status:', error);
      message.error(`Failed to ${checked ? 'activate' : 'deactivate'} voucher`);
    } finally {
      setLoading(false);
    }
  };

  const showNotificationModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsNotificationModalVisible(true);
  };

  const handleNotificationCancel = () => {
    setIsNotificationModalVisible(false);
    notificationForm.resetFields();
  };

  const handleSendNotification = async (values: any) => {
    if (!editingVoucher) return;
    
    setLoading(true);
    try {
      const notification: VoucherNotification = {
        voucherId: editingVoucher.id,
        recipients: values.recipients,
        selectedRecipients: values.recipients === 'selected' ? values.selectedRecipients : undefined,
        channels: values.channels,
        message: values.message
      };
      
      const success = await VoucherService.sendVoucherNotification(notification);
      if (success) {
        message.success(`Notification sent to ${values.recipients === 'all' ? 'all customers' : 'selected customers'}`);
      } else {
        message.error('Failed to send notification');
      }
      setIsNotificationModalVisible(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      message.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (record: any) => (
        <span>{record.discount}{record.discountType === 'percentage' ? '%' : ' RM'}</span>
      ),
    },
    {
      title: 'Min Purchase',
      dataIndex: 'minPurchase',
      key: 'minPurchase',
      render: (value: number) => `RM ${value}`,
    },
    {
      title: 'Valid Period',
      key: 'period',
      render: (record: any) => (
        <span>{record.startDate} to {record.endDate}</span>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (value: string) => value === 'all' ? 'All Customers' : 'Selected Customers',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => (
        <Switch 
          checked={record.status === 'active'} 
          onChange={(checked) => handleStatusToggle(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <>
          <ActionButton 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showModal(record)}
          />
          <ActionButton 
            icon={<SendOutlined />} 
            size="small" 
            onClick={() => showNotificationModal(record)}
          />
          <ActionButton 
            danger 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => handleDelete(record.id)}
          />
        </>
      ),
    },
  ];

  const filteredVouchers = vouchers.filter(v => 
    activeTab === 'all' || 
    (activeTab === 'active' && v.status === 'active') || 
    (activeTab === 'inactive' && v.status === 'inactive')
  );

  return (
    <AdminLayout title="Voucher Management">
      <PageHeader>
        <StyledTabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
        >
          <TabPane tab="Active Vouchers" key="active" />
          <TabPane tab="Inactive Vouchers" key="inactive" />
          <TabPane tab="All Vouchers" key="all" />
        </StyledTabs>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
        >
          Create Voucher
        </Button>
      </PageHeader>

      <Table 
        columns={columns} 
        dataSource={filteredVouchers} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      {/* Voucher Form Modal */}
      <Modal
        title={editingVoucher ? "Edit Voucher" : "Create Voucher"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            discountType: 'percentage',
            status: 'active',
            assignedTo: 'all',
            usageLimit: 1,
          }}
        >
          <Form.Item
            name="code"
            label="Voucher Code"
            rules={[{ required: true, message: 'Please enter voucher code' }]}
          >
            <Input placeholder="e.g. SUMMER25" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={2} placeholder="Describe the purpose of this voucher" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="discount"
              label="Discount Value"
              rules={[{ required: true, message: 'Please enter discount value' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="discountType"
              label="Discount Type"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Option value="percentage">Percentage (%)</Option>
                <Option value="fixed">Fixed Amount (RM)</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="minPurchase"
              label="Minimum Purchase (RM)"
              rules={[{ required: true, message: 'Please enter minimum purchase amount' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="maxDiscount"
              label="Maximum Discount (RM)"
              style={{ flex: 1 }}
            >
              <Input type="number" min={0} placeholder="Optional" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select end date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="usageLimit"
              label="Usage Limit Per Customer"
              rules={[{ required: true, message: 'Please enter usage limit' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" min={1} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              style={{ flex: 1 }}
            >
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="assignedTo"
            label="Assign Voucher To"
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => setSelectedCustomers(value === 'selected' ? ['1', '2'] : [])}>
              <Option value="all">All Customers</Option>
              <Option value="selected">Selected Customers</Option>
            </Select>
          </Form.Item>

          {form.getFieldValue('assignedTo') === 'selected' && (
            <Form.Item
              name="selectedCustomers"
              label="Select Customers"
              rules={[{ required: true, message: 'Please select at least one customer' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select customers"
                style={{ width: '100%' }}
                value={selectedCustomers}
                onChange={setSelectedCustomers}
              >
                {customerList.map(customer => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingVoucher ? 'Update Voucher' : 'Create Voucher'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Notification Modal */}
      <Modal
        title="Send Voucher Notification"
        visible={isNotificationModalVisible}
        onCancel={handleNotificationCancel}
        footer={null}
      >
        <Form
          form={notificationForm}
          layout="vertical"
          onFinish={handleSendNotification}
          initialValues={{
            recipients: 'all',
            channels: ['email', 'inbox']
          }}
        >
          <Form.Item
            label="Voucher"
          >
            <Input value={editingVoucher?.code} disabled />
          </Form.Item>

          <Form.Item
            name="recipients"
            label="Recipients"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="all">All Customers</Option>
              <Option value="selected">Selected Customers</Option>
            </Select>
          </Form.Item>

          {notificationForm.getFieldValue('recipients') === 'selected' && (
            <Form.Item
              name="selectedRecipients"
              label="Select Recipients"
              rules={[{ required: true, message: 'Please select at least one recipient' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select customers"
                style={{ width: '100%' }}
              >
                {customerList.map(customer => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="channels"
            label="Notification Channels"
            rules={[{ required: true, message: 'Please select at least one channel' }]}
          >
            <Select mode="multiple">
              <Option value="email">Email</Option>
              <Option value="inbox">Site Inbox</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="message"
            label="Custom Message"
          >
            <TextArea 
              rows={4} 
              placeholder="Enter a custom message to include with the voucher notification"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleNotificationCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Send Notification
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default VouchersPage;
