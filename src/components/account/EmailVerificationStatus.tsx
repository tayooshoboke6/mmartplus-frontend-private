import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import emailVerificationService from '../../services/emailVerificationService';
import { toast } from 'react-toastify';

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

const VerificationCode = styled.div`
  margin-top: 15px;
`;

const CodeInput = styled.input`
  width: 100%;
  max-width: 200px;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

interface EmailVerificationStatusProps {
  onUpdate?: () => void;
}

const EmailVerificationStatus: React.FC<EmailVerificationStatusProps> = ({ onUpdate }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [verifyingCode, setVerifyingCode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [countdown, setCountdown] = useState(0);
  
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Check verification status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await emailVerificationService.checkVerificationStatus();
        
        // Check if user has email_verified_at in their profile
        if (user?.email_verified_at) {
          setIsVerified(true);
        } 
        // Or if the response indicates the email is verified
        else if (response.data?.verified) {
          setIsVerified(true);
          // Update user profile if verified in backend but not in frontend state
          if (user && !user.email_verified_at && updateUser) {
            updateUser({
              ...user,
              email_verified_at: new Date().toISOString()
            });
          }
        } 
        // Check if response message indicates already verified
        else if (response.message?.toLowerCase().includes('already verified')) {
          setIsVerified(true);
          // Update user profile
          if (user && !user.email_verified_at && updateUser) {
            updateUser({
              ...user,
              email_verified_at: new Date().toISOString()
            });
          }
        }
      } catch (error: any) {
        console.error('Failed to check verification status:', error);
        
        // Even if there's an error, check if the error message indicates the email is verified
        if (error.response?.data?.message?.toLowerCase().includes('already verified')) {
          setIsVerified(true);
          // Update user profile
          if (user && !user.email_verified_at && updateUser) {
            updateUser({
              ...user,
              email_verified_at: new Date().toISOString()
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      checkStatus();
    }
  }, [user, updateUser]);
  
  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Handle sending verification code
  const handleSendCode = async () => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }
    
    try {
      setSendingCode(true);
      setMessage('');
      
      const response = await emailVerificationService.sendVerificationCodeByEmail(user.email);
      
      if (response.status === 'success') {
        // If message indicates email is already verified
        if (response.message?.toLowerCase().includes('already verified')) {
          toast.info('Your email is already verified');
          setIsVerified(true);
          if (updateUser) {
            updateUser({
              ...user,
              email_verified_at: new Date().toISOString()
            });
          }
        } else {
          toast.success('Verification code sent to your email');
          setMessage('Verification code sent to your email.');
          setShowCodeInput(true);
          setCountdown(60); // 60 second cooldown
        }
      } else {
        toast.error(response.message || 'Failed to send verification code');
        setMessage(response.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to send verification code:', error);
      
      // Check if error message indicates email is already verified
      if (error.response?.data?.message?.toLowerCase().includes('already verified')) {
        toast.info('Your email is already verified');
        setIsVerified(true);
        if (user && updateUser) {
          updateUser({
            ...user,
            email_verified_at: new Date().toISOString()
          });
        }
      } else {
        toast.error(error.message || 'Failed to send verification code');
        setMessage('Failed to send verification code. Please try again.');
      }
    } finally {
      setSendingCode(false);
      if (onUpdate) onUpdate();
    }
  };
  
  // Handle verifying code
  const handleVerifyCode = async () => {
    if (!user?.email || !verificationCode) {
      toast.error('Please enter verification code');
      return;
    }
    
    try {
      setVerifyingCode(true);
      setMessage('');
      
      const response = await emailVerificationService.verifyEmailWithCode(
        user.email, 
        verificationCode
      );
      
      if (response.status === 'success') {
        toast.success('Email verified successfully!');
        setIsVerified(true);
        setShowCodeInput(false);
        setVerificationCode('');
        
        // Update user object with verified email
        if (updateUser) {
          updateUser({
            ...user,
            email_verified_at: new Date().toISOString()
          });
        }
      } else {
        toast.error(response.message || 'Verification failed');
        setMessage(response.message || 'Verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to verify code:', error);
      
      // Check if error indicates email is already verified
      if (error.response?.data?.message?.toLowerCase().includes('already verified')) {
        toast.info('Your email is already verified');
        setIsVerified(true);
        if (updateUser) {
          updateUser({
            ...user,
            email_verified_at: new Date().toISOString()
          });
        }
      } else {
        toast.error(error.message || 'Verification failed');
        setMessage('Failed to verify code. Please check the code and try again.');
      }
    } finally {
      setVerifyingCode(false);
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
        <>
          {!showCodeInput ? (
            <Button 
              onClick={handleSendCode} 
              disabled={sendingCode || countdown > 0}
            >
              {sendingCode 
                ? 'Sending...' 
                : countdown > 0 
                  ? `Resend in ${countdown}s` 
                  : 'Verify Now'}
            </Button>
          ) : (
            <VerificationCode>
              <StatusMessage>
                Enter the 6-digit code sent to your email:
              </StatusMessage>
              <CodeInput
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
              />
              <ActionButtons>
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={verifyingCode || verificationCode.length !== 6}
                >
                  {verifyingCode ? 'Verifying...' : 'Submit'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowCodeInput(false);
                    setVerificationCode('');
                  }}
                  style={{ backgroundColor: '#6c757d' }}
                >
                  Cancel
                </Button>
              </ActionButtons>
            </VerificationCode>
          )}
        </>
      )}
      
      {message && <StatusMessage>{message}</StatusMessage>}
    </Container>
  );
};

export default EmailVerificationStatus;
