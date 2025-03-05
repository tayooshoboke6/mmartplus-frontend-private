import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaEnvelope, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaPaperPlane, 
  FaClock, 
  FaSearch,
  FaFilter,
  FaUsers,
  FaUserTag
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import adminMessageService, { CampaignMessage } from '../../services/adminMessageService';
import { Tabs, Tab, Button, Input, Select, Table, DatePicker, Modal, Form, message } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import RichTextEditor from '../../components/common/RichTextEditor';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 24px;
  }
`;

const ToolBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 8px;
  width: 60%;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EditorContainer = styled.div`
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

const SegmentItem = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SegmentIcon = styled.div`
  margin-right: 12px;
  color: #1890ff;
`;

const SegmentInfo = styled.div`
  flex: 1;
`;

const SegmentName = styled.div`
  font-weight: 500;
`;

const SegmentDescription = styled.div`
  font-size: 12px;
  color: #888;
`;

const SegmentCount = styled.div`
  font-size: 12px;
  background-color: #1890ff;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
`;

const PreviewContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
  background-color: #f9f9f9;
`;

const MessagePreviewHeader = styled.div`
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
  margin-bottom: 16px;
`;

const MessageSubject = styled.h3`
  margin: 0 0 8px 0;
`;

const MessageMetadata = styled.div`
  font-size: 12px;
  color: #888;
`;

const MessageContent = styled.div`
  padding: 16px;
  background: white;
  border-radius: 4px;
`;

// Message Campaigns Page
const MessageCampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [campaigns, setCampaigns] = useState<CampaignMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // For modal form
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('Create New Campaign Message');
  const [editingCampaign, setEditingCampaign] = useState<CampaignMessage | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [userSegments, setUserSegments] = useState<string[]>([]);

  useEffect(() => {
    fetchCampaigns();
    fetchUserSegments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await adminMessageService.getAllCampaignMessages();
      setCampaigns(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      message.error('Failed to load campaign messages');
      setLoading(false);
    }
  };

  const fetchUserSegments = async () => {
    try {
      const segments = await adminMessageService.getUserSegments();
      setUserSegments(segments);
    } catch (error) {
      console.error('Error fetching user segments:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredCampaigns = campaigns
    .filter(campaign => 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(campaign => statusFilter === 'all' || campaign.status === statusFilter);

  const showCreateModal = () => {
    setModalTitle('Create New Campaign Message');
    setEditingCampaign(null);
    setEditorContent('');
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = async (id: string) => {
    try {
      const campaign = await adminMessageService.getCampaignMessageById(id);
      if (campaign) {
        setModalTitle('Edit Campaign Message');
        setEditingCampaign(campaign);
        setEditorContent(campaign.content);
        form.setFieldsValue({
          title: campaign.title,
          subject: campaign.subject,
          sendToEmail: campaign.sendToEmail,
          sendToInbox: campaign.sendToInbox,
          userSegment: campaign.recipients.userSegment || 'all',
          scheduledDate: campaign.scheduledDate ? new Date(campaign.scheduledDate) : undefined
        });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      message.error('Failed to load campaign details');
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this campaign?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await adminMessageService.deleteCampaignMessage(id);
          message.success('Campaign message deleted successfully');
          fetchCampaigns();
        } catch (error) {
          console.error('Error deleting campaign:', error);
          message.error('Failed to delete campaign message');
        }
      }
    });
  };

  const handleSend = (id: string) => {
    confirm({
      title: 'Are you sure you want to send this campaign now?',
      content: 'This will immediately send the message to all selected recipients.',
      okText: 'Yes, send it',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await adminMessageService.sendCampaignMessage(id);
          message.success('Campaign message sent successfully');
          fetchCampaigns();
        } catch (error) {
          console.error('Error sending campaign:', error);
          message.error('Failed to send campaign message');
        }
      }
    });
  };

  const handleSave = async (values: any) => {
    try {
      const campaignData: CampaignMessage = {
        title: values.title,
        subject: values.subject,
        content: editorContent,
        recipients: {
          id: '1', // Temporary ID
          userSegment: values.userSegment
        },
        sendToEmail: values.sendToEmail,
        sendToInbox: values.sendToInbox,
        scheduledDate: values.scheduledDate ? values.scheduledDate.toISOString() : undefined
      };

      if (editingCampaign?.id) {
        await adminMessageService.updateCampaignMessage(editingCampaign.id, campaignData);
        message.success('Campaign message updated successfully');
      } else {
        await adminMessageService.createCampaignMessage(campaignData);
        message.success('Campaign message created successfully');
      }

      setModalVisible(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      message.error('Failed to save campaign message');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Recipients',
      key: 'recipients',
      render: (_, record: CampaignMessage) => (
        <span>
          {record.recipients.all 
            ? 'All Users' 
            : record.recipients.userSegment 
              ? `Segment: ${record.recipients.userSegment}` 
              : `Selected Users (${record.recipients.userIds?.length || 0})`}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status) {
          case 'draft':
            color = '#faad14';
            break;
          case 'scheduled':
            color = '#1890ff';
            break;
          case 'sent':
            color = '#52c41a';
            break;
          case 'cancelled':
            color = '#ff4d4f';
            break;
        }
        return <span style={{ color }}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
      },
    },
    {
      title: 'Scheduled/Sent Date',
      key: 'date',
      render: (_, record: CampaignMessage) => (
        <span>
          {record.sentAt 
            ? new Date(record.sentAt).toLocaleString() 
            : record.scheduledDate 
              ? new Date(record.scheduledDate).toLocaleString()
              : '-'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: CampaignMessage) => (
        <ActionButtons>
          <Button 
            icon={<FaEdit />} 
            onClick={() => showEditModal(record.id!)}
            disabled={record.status === 'sent'} 
          />
          <Button 
            icon={<FaTrash />} 
            danger
            onClick={() => handleDelete(record.id!)} 
            disabled={record.status === 'sent'} 
          />
          <Button 
            icon={<FaPaperPlane />} 
            type="primary" 
            onClick={() => handleSend(record.id!)}
            disabled={record.status === 'sent'} 
          />
        </ActionButtons>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Content style={{ padding: '24px' }}>
        <PageHeader>
          <Title>Message Campaigns</Title>
          <Button 
            type="primary" 
            icon={<FaPlus />} 
            onClick={showCreateModal}
          >
            Create Campaign
          </Button>
        </PageHeader>

        <StyledTabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="All Messages" key="1">
            <ToolBar>
              <SearchBox>
                <Input 
                  placeholder="Search by title or subject" 
                  prefix={<FaSearch />} 
                  onChange={e => handleSearch(e.target.value)}
                  value={searchTerm}
                />
                <Select 
                  defaultValue="all" 
                  style={{ width: 150 }} 
                  onChange={handleFilterChange}
                  value={statusFilter}
                >
                  <Option value="all">All Status</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="sent">Sent</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </SearchBox>
              <Button icon={<FaFilter />}>More Filters</Button>
            </ToolBar>

            <Table 
              columns={columns} 
              dataSource={filteredCampaigns} 
              rowKey="id"
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                onChange: (page) => setCurrentPage(page),
                onShowSizeChange: (_, size) => setPageSize(size),
              }}
            />
          </TabPane>
        </StyledTabs>

        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="preview" onClick={togglePreview}>
              {previewVisible ? 'Hide Preview' : 'Show Preview'}
            </Button>,
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="save" onClick={() => form.submit()} type="primary">
              Save
            </Button>,
          ]}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              sendToInbox: true,
              sendToEmail: false,
              userSegment: 'all'
            }}
          >
            <StyledFormItem
              name="title"
              label="Campaign Title"
              rules={[{ required: true, message: 'Please enter the campaign title' }]}
            >
              <Input placeholder="Enter a title for internal reference" />
            </StyledFormItem>

            <StyledFormItem
              name="subject"
              label="Message Subject"
              rules={[{ required: true, message: 'Please enter the message subject' }]}
            >
              <Input placeholder="Enter the subject line for the message" />
            </StyledFormItem>

            <StyledFormItem label="Message Content" required>
              <EditorContainer>
                <RichTextEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                />
              </EditorContainer>
            </StyledFormItem>

            <StyledFormItem name="userSegment" label="Select Recipients">
              <Select placeholder="Select user segment">
                <Option value="all">All Users</Option>
                {userSegments.map(segment => (
                  <Option key={segment} value={segment}>{segment}</Option>
                ))}
              </Select>
            </StyledFormItem>

            <StyledFormItem name="scheduledDate" label="Schedule Date (Optional)">
              <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </StyledFormItem>

            <StyledFormItem name="sendToInbox" valuePropName="checked">
              <Form.Checkbox>Send to User Dashboard Inbox</Form.Checkbox>
            </StyledFormItem>

            <StyledFormItem name="sendToEmail" valuePropName="checked">
              <Form.Checkbox>Send to User Email</Form.Checkbox>
            </StyledFormItem>
          </Form>

          {previewVisible && (
            <PreviewContainer>
              <MessagePreviewHeader>
                <MessageSubject>{form.getFieldValue('subject') || 'Message Subject'}</MessageSubject>
                <MessageMetadata>
                  From: M-Mart+ Team · To: Selected Recipients
                </MessageMetadata>
              </MessagePreviewHeader>
              <MessageContent dangerouslySetInnerHTML={{ __html: editorContent }} />
            </PreviewContainer>
          )}
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default MessageCampaignsPage;
