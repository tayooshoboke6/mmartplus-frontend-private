import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import authService from '../../services/authService';
import emailVerificationService from '../../services/emailVerificationService';
import { Button, Text, Spacer, FlexBox } from '../ui';
import { toast } from 'react-toastify';

// Styled components
const VerificationContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CodeInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  text-align: center;
  letter-spacing: 3px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const StatusTag = styled.span<{ verified?: boolean }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => props.verified ? 'var(--success-color)' : 'var(--error-color)'};
  color: white;
  margin-left: 10px;
`;

interface EmailVerificationProps {
  email: string;
  onVerified?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onVerified }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check verification status on component mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if email is already verified
  const checkVerificationStatus = async () => {
    try {
      const response = await emailVerificationService.checkVerificationStatus();
      if (response.status === 'success' && response.data?.email) {
        setIsVerified(true);
        if (onVerified) onVerified();
      }
    } catch (error) {
      console.error('Failed to check verification status:', error);
      // Don't set error state here to avoid confusing the user
    }
  };

  // Send verification code
  const handleSendCode = async () => {
    setError(null);
    setIsSending(true);
    
    try {
      await emailVerificationService.sendVerificationCodeByEmail(email);
      toast.success('Verification code sent successfully. Please check your email.');
      
      // Set cooldown for resend button (60 seconds)
      setCountdown(60);
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code');
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setIsSending(false);
    }
  };

  // Verify the code
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError('Please enter a valid verification code');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const response = await emailVerificationService.verifyEmailWithCode(email, verificationCode);
      
      if (response.status === 'success') {
        toast.success('Email verified successfully!');
        setIsVerified(true);
        if (onVerified) onVerified();
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify code');
      toast.error(error.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VerificationContainer>
      <FlexBox align="center">
        <Text size="md" weight="bold">Email Verification</Text>
        {isVerified ? (
          <StatusTag verified>Verified</StatusTag>
        ) : (
          <StatusTag>Not Verified</StatusTag>
        )}
      </FlexBox>
      
      <Spacer size={10} />
      
      <Text size="sm">
        {isVerified 
          ? 'Your email has been verified. You will receive order notifications and updates.'
          : 'Please verify your email address to receive order notifications and updates.'}
      </Text>
      
      <Spacer size={20} />
      
      {!isVerified && (
        <>
          <FlexBox direction="column" gap="15px">
            <Text size="sm">Email: {email}</Text>
            
            <FlexBox gap="10px" wrap="wrap">
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleSendCode} 
                disabled={isSending || countdown > 0}
              >
                {isSending 
                  ? 'Sending...' 
                  : countdown > 0 
                    ? `Resend in ${countdown}s` 
                    : 'Send Verification Code'}
              </Button>
            </FlexBox>
            
            <Spacer size={10} />
            
            <Text size="sm">Enter the 6-digit code sent to your email:</Text>
            
            <CodeInput 
              type="text" 
              maxLength={6} 
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000"
            />
            
            {error && (
              <>
                <Text size="sm" color="var(--error-color)">{error}</Text>
                <Spacer size={10} />
              </>
            )}
            
            <Button 
              variant="filled" 
              onClick={handleVerifyCode} 
              disabled={isLoading || verificationCode.length < 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </FlexBox>
        </>
      )}
    </VerificationContainer>
  );
};

export default EmailVerification;
