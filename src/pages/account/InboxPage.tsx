import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaTrash, FaStar, FaArchive, FaBullhorn, FaBell, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountSidebar from '../../components/account/AccountSidebar';
import inboxService, { InboxMessage } from '../../services/inboxService';
import { Modal, Button } from 'antd';

// Types for messages
interface Message {
  id: number;
  subject: string;
  content: string;
  sender: string;
  date: string;
  read: boolean;
  starred: boolean;
  campaignId?: string;
  messageType?: 'system' | 'campaign' | 'notification';
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InboxContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const ContentHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  svg {
    margin-right: 10px;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const InboxTools = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ToolButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const MessageList = styled.div`
  margin-bottom: 20px;
`;

const MessageItem = styled.div<{ read: boolean; messageType?: string }>`
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  background-color: ${props => {
    if (!props.read) return '#f5f9ff';
    if (props.messageType === 'campaign') return '#fdf9e8';
    return '#fff';
  }};
  
  &:hover {
    background-color: #f0f4f9;
    cursor: pointer;
  }
`;

const MessageIcon = styled.div<{ messageType?: string }>`
  margin-right: 10px;
  color: ${props => {
    switch (props.messageType) {
      case 'campaign': return '#e67e22';
      case 'notification': return '#3498db';
      case 'system': return '#27ae60';
      default: return '#0066cc';
    }
  }};
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageSubject = styled.div<{ read: boolean }>`
  font-weight: ${props => props.read ? 'normal' : 'bold'};
  margin-bottom: 5px;
`;

const MessagePreview = styled.div`
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageMeta = styled.div`
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #666;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  color: #ccc;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
`;

const EmptyText = styled.p`
  text-align: center;
  margin: 0;
  color: #666;
`;

const MessageModalHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
`;

const MessageModalSubject = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const MessageModalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
`;

const MessageModalContent = styled.div`
  min-height: 200px;
`;

const MessageTag = styled.span<{ type: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 10px;
  background-color: ${props => {
    switch (props.type) {
      case 'campaign': return '#fff3cd';
      case 'notification': return '#cce5ff';
      case 'system': return '#d4edda';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'campaign': return '#856404';
      case 'notification': return '#004085';
      case 'system': return '#155724';
      default: return '#383d41';
    }
  }};
`;

const InboxPage: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  
  useEffect(() => {
    const fetchInboxMessages = async () => {
      setLoading(true);
      try {
        const inboxMessages = await inboxService.getInboxMessages();
        setMessages(inboxMessages);
      } catch (error) {
        console.error('Error fetching inbox messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInboxMessages();
  }, []);
  
  const toggleMessageRead = async (id: number) => {
    try {
      // Find the message
      const message = messages.find(msg => msg.id === id);
      if (!message) return;
      
      // If it's already read, no need to mark it as read again
      if (!message.read) {
        await inboxService.markAsRead(id);
      }
      
      // Update local state
      setMessages(messages.map(message => 
        message.id === id ? { ...message, read: true } : message
      ));
      
      // Open the message modal
      setSelectedMessage(message);
      setModalVisible(true);
    } catch (error) {
      console.error('Error toggling message read status:', error);
    }
  };
  
  const deleteMessages = async () => {
    try {
      // Delete each selected message
      for (const messageId of selectedMessages) {
        await inboxService.deleteMessage(messageId);
      }
      
      // Update local state
      setMessages(messages.filter(message => !selectedMessages.includes(message.id)));
      setSelectedMessages([]);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };
  
  const markAsRead = async () => {
    try {
      // Mark each selected message as read
      for (const messageId of selectedMessages) {
        await inboxService.markAsRead(messageId);
      }
      
      // Update local state
      setMessages(messages.map(message => 
        selectedMessages.includes(message.id) ? { ...message, read: true } : message
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  const getMessageIcon = (messageType?: string) => {
    switch (messageType) {
      case 'campaign':
        return <FaBullhorn />;
      case 'notification':
        return <FaBell />;
      case 'system':
        return <FaInfoCircle />;
      default:
        return <FaEnvelope />;
    }
  };
  
  const getMessageTypeLabel = (messageType?: string) => {
    switch (messageType) {
      case 'campaign':
        return 'Campaign';
      case 'notification':
        return 'Notification';
      case 'system':
        return 'System';
      default:
        return 'Message';
    }
  };
  
  return (
    <PageContainer>
      <title>My Inbox | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <InboxContent>
            <ContentHeader>
              <FaEnvelope size={20} />
              <HeaderTitle>Inbox</HeaderTitle>
            </ContentHeader>
            
            {loading ? (
              <div>Loading messages...</div>
            ) : messages.length > 0 ? (
              <>
                <InboxTools>
                  <ToolButton onClick={markAsRead}>
                    <FaEnvelope size={14} />
                    Mark as Read
                  </ToolButton>
                  <ToolButton onClick={deleteMessages}>
                    <FaTrash size={14} />
                    Delete
                  </ToolButton>
                  <ToolButton>
                    <FaArchive size={14} />
                    Archive
                  </ToolButton>
                </InboxTools>
                
                <MessageList>
                  {messages.map(message => (
                    <MessageItem 
                      key={message.id} 
                      read={message.read}
                      messageType={message.messageType}
                      onClick={() => toggleMessageRead(message.id)}
                    >
                      <MessageIcon messageType={message.messageType}>
                        {getMessageIcon(message.messageType)}
                      </MessageIcon>
                      <MessageContent>
                        <MessageSubject read={message.read}>
                          {message.subject}
                          {message.messageType && (
                            <MessageTag type={message.messageType || 'default'}>
                              {getMessageTypeLabel(message.messageType)}
                            </MessageTag>
                          )}
                        </MessageSubject>
                        <MessagePreview>
                          {message.content.replace(/<[^>]*>?/gm, '')}
                        </MessagePreview>
                      </MessageContent>
                      <MessageMeta>
                        {message.date}
                      </MessageMeta>
                    </MessageItem>
                  ))}
                </MessageList>
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaEnvelope />
                </EmptyIcon>
                <EmptyTitle>Your inbox is empty</EmptyTitle>
                <EmptyText>
                  You will receive important notifications about your orders, promotions, and account updates here.
                </EmptyText>
              </EmptyState>
            )}
          </InboxContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
      
      <Modal
        title="Message Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="delete" 
            danger 
            onClick={() => {
              if (selectedMessage) {
                inboxService.deleteMessage(selectedMessage.id);
                setMessages(messages.filter(m => m.id !== selectedMessage.id));
                setModalVisible(false);
              }
            }}
          >
            Delete
          </Button>
        ]}
        width={700}
      >
        {selectedMessage && (
          <>
            <MessageModalHeader>
              <MessageModalSubject>
                {selectedMessage.subject}
                {selectedMessage.messageType && (
                  <MessageTag type={selectedMessage.messageType || 'default'}>
                    {getMessageTypeLabel(selectedMessage.messageType)}
                  </MessageTag>
                )}
              </MessageModalSubject>
              <MessageModalMeta>
                <div>From: {selectedMessage.sender}</div>
                <div>Date: {selectedMessage.date}</div>
              </MessageModalMeta>
            </MessageModalHeader>
            <MessageModalContent 
              dangerouslySetInnerHTML={{ __html: selectedMessage.content }} 
            />
          </>
        )}
      </Modal>
    </PageContainer>
  );
};

export default InboxPage;
