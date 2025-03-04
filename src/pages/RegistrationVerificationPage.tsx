import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import emailVerificationService from '../services/emailVerificationService';
import { getTestVerificationCode, isTestEmail } from '../utils/test-verification';

// Styled components
const PageContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  img {
    max-width: 150px;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  color: #0077C8;
  margin-bottom: 10px;
`;

const SubHeading = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0077C8;
    box-shadow: 0 0 0 2px rgba(0, 119, 200, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #0077C8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 15px;
  font-size: 16px;
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

const SecondaryButton = styled(Button)`
  background-color: #f8f9fa;
  color: #0077C8;
  border: 1px solid #0077C8;
  margin-top: 10px;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const StatusMessage = styled.div<{ isError?: boolean }>`
  padding: 15px;
  margin: 20px 0;
  background-color: ${props => props.isError ? '#ffebee' : '#e3f2fd'};
  border-radius: 4px;
  color: ${props => props.isError ? '#c62828' : '#0277bd'};
  text-align: center;
`;

const TimerText = styled.div`
  text-align: center;
  margin: 10px 0;
  color: #666;
  font-size: 14px;
`;

// Interface for location state
interface LocationState {
  email?: string;
}

// Email verification page component for newly registered users
const RegistrationVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  // Get email from location state
  const [email, setEmail] = useState<string>(state?.email || '');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  
  // Handle code input change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
    setCode(value);
  };
  
  // Send verification code
  const handleSendCode = async () => {
    if (!email) {
      setMessage('Email address is required.');
      setIsError(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // For test emails, show a message about using the test code
      if (isTestEmail(email)) {
        setMessage('Test email detected! Use code 123456 for verification.');
        setIsError(false);
        setCountdown(30); // Still use cooldown for consistency
      } else {
        // For real emails, send actual verification code
        const response = await emailVerificationService.sendVerificationCodeByEmail(email);
        setMessage(response.message);
        setIsError(false);
        setCountdown(30); // 30 seconds cooldown
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to send verification code.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Verify code
  const handleVerify = async () => {
    if (!email) {
      setMessage('Email address is required.');
      setIsError(true);
      return;
    }
    
    if (code.length !== 6) {
      setMessage('Please enter a 6-digit verification code.');
      setIsError(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // For test emails with the correct test code, bypass API call
      const testCode = getTestVerificationCode(email);
      if (testCode && code === testCode) {
        setMessage('Email verification successful!');
        setIsError(false);
        setIsVerified(true);
        
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // For real emails or wrong test code, call the API
        const response = await emailVerificationService.verifyEmailWithCode(email, code);
        setMessage(response.message);
        setIsError(false);
        setIsVerified(true);
        
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      setMessage(error.message || 'Invalid or expired verification code.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Send verification code automatically when page loads if email is provided
  useEffect(() => {
    if (email && !isVerified && countdown === 0) {
      handleSendCode();
    }
  }, [email]);
  
  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // If no email is provided, ask the user to enter it
  const renderEmailInput = () => {
    if (!email) {
      return (
        <FormGroup>
          <Label htmlFor="email">Please enter your email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
          />
        </FormGroup>
      );
    }
    return null;
  };
  
  return (
    <PageContainer>
      <Logo>
        <img src="/logo.png" alt="M-Mart+ Logo" />
      </Logo>
      
      <Heading>Verify Your Email</Heading>
      <SubHeading>
        Please verify your email address to complete your registration
      </SubHeading>
      
      {message && (
        <StatusMessage isError={isError}>
          {message}
        </StatusMessage>
      )}
      
      {isVerified ? (
        <div>
          <StatusMessage>
            Your email has been verified successfully. Redirecting to login...
          </StatusMessage>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      ) : (
        <>
          {renderEmailInput()}
          
          <FormGroup>
            <Label htmlFor="verificationCode">
              Enter the 6-digit verification code sent to {email || 'your email'}
            </Label>
            <Input
              id="verificationCode"
              type="text"
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              disabled={loading || !email}
            />
          </FormGroup>
          
          <Button 
            onClick={handleVerify} 
            disabled={loading || code.length !== 6 || !email}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
          
          {countdown > 0 ? (
            <TimerText>
              You can request a new code in {countdown} seconds
            </TimerText>
          ) : (
            <SecondaryButton 
              onClick={handleSendCode} 
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Resend Verification Code'}
            </SecondaryButton>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default RegistrationVerificationPage;
