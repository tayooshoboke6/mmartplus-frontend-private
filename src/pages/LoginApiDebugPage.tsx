import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { users, findUserByEmail } from '../mocks/data/users';

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

// Mock login credentials type
interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
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

const LoginApiDebugPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  
  // Mock current user state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  
  const clearResults = () => {
    setResult(null);
    setError(null);
    setSuccess(null);
  };
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const user = findUserByEmail(email);
      
      if (user && user.password === password) {
        // Create a mock response
        const mockResponse: AuthResponse = {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token: 'mock-jwt-token-' + Date.now(),
          success: true,
          message: 'Login successful'
        };
        
        setResult(mockResponse);
        setSuccess('Login successful with mock data');
        setCurrentUser(mockResponse.user);
      } else {
        setError('Invalid email or password in mock data');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Error during login: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetCurrentUser = async () => {
    clearResults();
    setLoading(true);
    
    try {
      if (currentUser) {
        // Return the current user if logged in
        setResult({
          user: currentUser,
          success: true,
          message: 'Current user retrieved successfully'
        });
        setSuccess('Current user retrieved successfully from mock data');
      } else {
        setResult({
          success: false,
          message: 'No user is currently logged in'
        });
        setError('No user is currently logged in (mock session)');
      }
    } catch (err) {
      console.error('Error getting current user:', err);
      setError('Error getting current user: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Clear the current user
      setCurrentUser(null);
      
      // Create a mock response
      const mockResponse = {
        success: true,
        message: 'Logout successful'
      };
      
      setResult(mockResponse);
      setSuccess('Logout successful from mock session');
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Error during logout: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Mock a Google login response
      const mockUser = {
        id: 'google-user-123',
        email: 'google-user@example.com',
        firstName: 'Google',
        lastName: 'User',
        role: 'user'
      };
      
      const mockResponse = {
        user: mockUser,
        token: 'mock-google-jwt-token-' + Date.now(),
        success: true,
        message: 'Google login successful'
      };
      
      setResult(mockResponse);
      setSuccess('Google login simulated successfully with mock data');
      setCurrentUser(mockUser);
    } catch (err) {
      console.error('Error during Google login:', err);
      setError('Error during Google login: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleAppleLogin = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Mock an Apple login response
      const mockUser = {
        id: 'apple-user-123',
        email: 'apple-user@example.com',
        firstName: 'Apple',
        lastName: 'User',
        role: 'user'
      };
      
      const mockResponse = {
        user: mockUser,
        token: 'mock-apple-jwt-token-' + Date.now(),
        success: true,
        message: 'Apple login successful'
      };
      
      setResult(mockResponse);
      setSuccess('Apple login simulated successfully with mock data');
      setCurrentUser(mockUser);
    } catch (err) {
      console.error('Error during Apple login:', err);
      setError('Error during Apple login: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDirectLoginApiCall = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Mock a direct API call response
      const mockResponse = {
        success: true,
        message: 'Mock API call successful',
        timestamp: new Date().toISOString(),
        data: {
          availableUsers: users.map(u => ({ email: u.email, password: u.password })).slice(0, 3)
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
        mockUsersSample: users.map(u => ({ id: u.id, email: u.email, role: u.role })).slice(0, 3),
        currentUserStatus: currentUser ? 'Logged in' : 'Not logged in'
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
        <PageTitle>Login API Debug Page</PageTitle>
        
        <DebugSection>
          <h2>Test Controls</h2>
          
          <ButtonGroup>
            <Button onClick={handleLogin} disabled={loading}>
              Test Login
            </Button>
            <Button onClick={handleGetCurrentUser} disabled={loading}>
              Test Get Current User
            </Button>
            <Button onClick={handleLogout} disabled={loading}>
              Test Logout
            </Button>
            <Button onClick={handleGoogleLogin} disabled={loading}>
              Test Google Login
            </Button>
            <Button onClick={handleAppleLogin} disabled={loading}>
              Test Apple Login
            </Button>
            <Button onClick={handleDirectLoginApiCall} disabled={loading}>
              Test Direct API Call
            </Button>
            <Button onClick={handleCheckMockApiSetup} disabled={loading}>
              Check Mock API Setup
            </Button>
          </ButtonGroup>
          
          <div>
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
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember Me
              </label>
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

export default LoginApiDebugPage;
