import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import emailVerificationService from '../../services/emailVerificationService';

const Container = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StatusTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ verified: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  background-color: ${props => props.verified ? '#d4edda' : '#f8d7da'};
  color: ${props => props.verified ? '#155724' : '#721c24'};
`;

const StatusMessage = styled.p`
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #6c757d;
`;

const Button = styled.button`
  background-color: #0077C8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #005fa3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

interface EmailVerificationStatusProps {
  onUpdate?: () => void;
}

const EmailVerificationStatus: React.FC<EmailVerificationStatusProps> = ({ onUpdate }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  const { user, sendVerificationCode } = useAuth();
  const navigate = useNavigate();
  
  // Check verification status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await emailVerificationService.checkVerificationStatus();
        setIsVerified(!!response.data?.verified);
      } catch (error) {
        console.error('Failed to check verification status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      checkStatus();
    }
  }, [user]);
  
  // Handle sending verification code
  const handleSendCode = async () => {
    try {
      setSendingCode(true);
      await sendVerificationCode();
      setMessage('Verification code sent to your email.');
      navigate('/email-verification');
    } catch (error) {
      console.error('Failed to send verification code:', error);
      setMessage('Failed to send verification code. Please try again.');
    } finally {
      setSendingCode(false);
      if (onUpdate) onUpdate();
    }
  };
  
  if (loading) {
    return <Container>Loading verification status...</Container>;
  }
  
  return (
    <Container>
      <StatusHeader>
        <StatusTitle>Email Verification</StatusTitle>
        <StatusBadge verified={isVerified}>
          {isVerified ? 'Verified' : 'Not Verified'}
        </StatusBadge>
      </StatusHeader>
      
      <StatusMessage>
        {isVerified 
          ? 'Your email has been verified. You will receive order notifications and updates.' 
          : 'Please verify your email address to receive order notifications and updates.'}
      </StatusMessage>
      
      {!isVerified && (
        <Button 
          onClick={handleSendCode} 
          disabled={sendingCode}
        >
          {sendingCode ? 'Sending...' : 'Verify Now'}
        </Button>
      )}
      
      {message && <StatusMessage>{message}</StatusMessage>}
    </Container>
  );
};

export default EmailVerificationStatus;
