import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { users, findUserByEmail, createUser } from '../mocks/data/users';
import { v4 as uuidv4 } from 'uuid';

// Mock register data type
interface RegisterData {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
  password_confirmation: string;
}

// Mock auth response type
interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token?: string;
  success: boolean;
  message: string;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  padding-top: 120px; /* Add padding to accommodate fixed header */
  
  @media (max-width: 768px) {
    padding-top: 110px;
  }
  
  @media (max-width: 480px) {
    padding-top: 100px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 40px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 0 15px 30px;
  }
  
  @media (max-width: 768px) {
    padding: 0 15px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 10px 15px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const DebugSection = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    
    h2 {
      font-size: 18px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  
  label {
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  input, select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    max-width: 300px;
  }
  
  @media (max-width: 480px) {
    input, select {
      max-width: 100%;
    }
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  pre {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 13px;
    max-height: 400px;
    overflow-y: auto;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  margin-top: 10px;
  font-size: 14px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #43a047;
  margin-top: 10px;
  font-size: 14px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
`;

const SignupApiDebugPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  
  // Email verification states
  const [userId, setUserId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  
  // Password reset states
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState<string>('');
  
  const clearResults = () => {
    setResult(null);
    setError(null);
    setSuccess(null);
  };
  
  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      setError('Name, email, password, and password confirmation are required');
      return;
    }
    
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Check if user already exists in mock data
      const existingUser = findUserByEmail(email);
      
      if (existingUser) {
        setError('Email already exists in mock data');
        setLoading(false);
        return;
      }
      
      // Split name into first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Create a new user in mock data
      const newUser = {
        email,
        password,
        firstName,
        lastName,
        role: 'user' as const
      };
      
      // Create the user
      const createdUser = createUser(newUser);
      
      // Create a mock response
      const mockResponse: AuthResponse = {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          role: createdUser.role
        },
        token: 'mock-jwt-token-' + Date.now(),
        success: true,
        message: 'Registration successful'
      };
      
      setResult(mockResponse);
      setSuccess('Registration successful with mock data');
      setUserId(createdUser.id); // Set the user ID for verification
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Error during registration: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyEmail = async () => {
    if (!userId || !verificationCode) {
      setError('User ID and verification code are required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Mock email verification
      if (verificationCode === '123456' || verificationCode === 'valid') {
        const mockResponse = {
          success: true,
          message: 'Email verified successfully'
        };
        
        setResult(mockResponse);
        setSuccess('Email verification successful with mock data');
      } else {
        setError('Invalid verification code in mock verification');
      }
    } catch (err) {
      console.error('Error during email verification:', err);
      setError('Error during email verification: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Email is required for password reset');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Check if user exists in mock data
      const user = findUserByEmail(resetEmail);
      
      if (user) {
        // Generate a mock reset token
        const mockToken = 'reset-' + uuidv4().substring(0, 8);
        
        const mockResponse = {
          success: true,
          message: 'Password reset email sent',
          reset_token: mockToken
        };
        
        setResult(mockResponse);
        setSuccess('Password reset email sent successfully in mock data');
        setResetToken(mockToken); // Set the reset token for the next step
      } else {
        setError('Email not found in mock data');
      }
    } catch (err) {
      console.error('Error during forgot password:', err);
      setError('Error during forgot password: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !newPasswordConfirmation) {
      setError('Reset token, new password, and password confirmation are required');
      return;
    }
    
    if (newPassword !== newPasswordConfirmation) {
      setError('New passwords do not match');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Mock password reset
      if (resetToken.startsWith('reset-')) {
        const mockResponse = {
          success: true,
          message: 'Password reset successful'
        };
        
        setResult(mockResponse);
        setSuccess('Password reset successful with mock data');
      } else {
        setError('Invalid reset token in mock reset');
      }
    } catch (err) {
      console.error('Error during password reset:', err);
      setError('Error during password reset: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDirectRegisterApiCall = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Mock a direct API call response
      const mockResponse = {
        success: true,
        message: 'Mock API call successful',
        timestamp: new Date().toISOString(),
        data: {
          availableUsers: users.map(u => ({ id: u.id, email: u.email })).slice(0, 3),
          registrationEndpoint: '/api/auth/register'
        }
      };
      
      setResult(mockResponse);
      setSuccess('Direct API call simulated successfully with mock data');
    } catch (err) {
      console.error('Error making direct API call:', err);
      setError('Error making direct API call: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckMockApiSetup = () => {
    clearResults();
    
    try {
      // Check if mock data is properly set up
      setResult({
        mockUsersCount: users.length,
        mockUsersSample: users.map(u => ({ id: u.id, email: u.email })).slice(0, 3),
        mockVerificationCode: '123456',
        mockResetTokenFormat: 'reset-xxxxxxxx'
      });
      setSuccess('Mock API setup checked successfully');
    } catch (err) {
      console.error('Error checking mock API setup:', err);
      setError('Error checking mock API setup: ' + (err instanceof Error ? err.message : String(err)));
    }
  };
  
  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <PageTitle>Signup API Debug Page</PageTitle>
        
        <DebugSection>
          <h2>Registration Test Controls</h2>
          
          <ButtonGroup>
            <Button onClick={handleRegister} disabled={loading}>
              Test Register
            </Button>
            <Button onClick={handleDirectRegisterApiCall} disabled={loading}>
              Test Direct Register API Call
            </Button>
            <Button onClick={handleCheckMockApiSetup} disabled={loading}>
              Check Mock API Setup
            </Button>
          </ButtonGroup>
          
          <div>
            <InputGroup>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="passwordConfirmation">Confirm Password:</label>
              <input
                type="password"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </InputGroup>
          </div>
        </DebugSection>
        
        <DebugSection>
          <h2>Email Verification Test Controls</h2>
          
          <ButtonGroup>
            <Button onClick={handleVerifyEmail} disabled={loading}>
              Test Verify Email
            </Button>
          </ButtonGroup>
          
          <div>
            <InputGroup>
              <label htmlFor="userId">User ID:</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="verificationCode">Verification Code:</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </InputGroup>
          </div>
        </DebugSection>
        
        <DebugSection>
          <h2>Password Reset Test Controls</h2>
          
          <ButtonGroup>
            <Button onClick={handleForgotPassword} disabled={loading}>
              Test Forgot Password
            </Button>
            <Button onClick={handleResetPassword} disabled={loading}>
              Test Reset Password
            </Button>
          </ButtonGroup>
          
          <div>
            <InputGroup>
              <label htmlFor="resetEmail">Email:</label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="resetToken">Reset Token:</label>
              <input
                type="text"
                id="resetToken"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="newPasswordConfirmation">Confirm New Password:</label>
              <input
                type="password"
                id="newPasswordConfirmation"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              />
            </InputGroup>
          </div>
        </DebugSection>
        
        {loading && <div>Loading...</div>}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        {result && (
          <ResultContainer>
            <h3>API Response:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </ResultContainer>
        )}
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default SignupApiDebugPage;
