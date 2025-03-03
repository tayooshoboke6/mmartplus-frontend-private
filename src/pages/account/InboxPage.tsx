import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaTrash, FaStar, FaArchive } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountSidebar from '../../components/account/AccountSidebar';

// Types for messages
interface Message {
  id: number;
  subject: string;
  content: string;
  sender: string;
  date: string;
  read: boolean;
  starred: boolean;
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

const MessageItem = styled.div<{ read: boolean }>`
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  background-color: ${props => props.read ? '#fff' : '#f5f9ff'};
  
  &:hover {
    background-color: #f0f4f9;
    cursor: pointer;
  }
`;

const MessageIcon = styled.div`
  margin-right: 10px;
  color: #0066cc;
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

const InboxPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  
  useEffect(() => {
    // Simulate API call to fetch messages
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          subject: 'Welcome to M-Mart+',
          content: 'Thank you for creating an account with M-Mart+. We are excited to have you on board!',
          sender: 'M-Mart+ Team',
          date: '2025-02-25',
          read: false,
          starred: false
        },
        {
          id: 2,
          subject: 'Your order #MM78945 has been shipped',
          content: 'We are pleased to inform you that your order has been shipped and is on its way to you.',
          sender: 'M-Mart+ Orders',
          date: '2025-02-28',
          read: true,
          starred: true
        },
        {
          id: 3,
          subject: 'Special Discount on Groceries',
          content: 'Enjoy up to 25% off on all groceries this weekend! Shop now and save big on your favorite items.',
          sender: 'M-Mart+ Promotions',
          date: '2025-03-01',
          read: false,
          starred: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const toggleMessageRead = (id: number) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, read: !message.read } : message
    ));
  };
  
  const toggleMessageStar = (id: number) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, starred: !message.starred } : message
    ));
  };
  
  const deleteMessages = () => {
    setMessages(messages.filter(message => !selectedMessages.includes(message.id)));
    setSelectedMessages([]);
  };
  
  const markAsRead = () => {
    setMessages(messages.map(message => 
      selectedMessages.includes(message.id) ? { ...message, read: true } : message
    ));
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
                      onClick={() => toggleMessageRead(message.id)}
                    >
                      <MessageIcon>
                        <FaEnvelope />
                      </MessageIcon>
                      <MessageContent>
                        <MessageSubject read={message.read}>
                          {message.subject}
                        </MessageSubject>
                        <MessagePreview>
                          {message.content}
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
                  You don't have any messages yet. Messages from M-Mart+ will appear here.
                </EmptyText>
              </EmptyState>
            )}
          </InboxContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default InboxPage;
