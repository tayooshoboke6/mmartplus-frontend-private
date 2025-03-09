import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Styled components
const PageContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const Form = styled.form`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #0077C8;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #0077C8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #005ca1;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 14px;
  margin-top: 5px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginAsAdmin, isAuthenticated, isAdmin, isLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Clear any auth errors when component mounts
  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, [clearError]);
  
  // Check if user is already logged in and is admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log('User is authenticated and is admin, redirecting to dashboard');
      navigate('/admin');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log("Attempting admin login with:", email);
      
      // Use the appropriate login method
      const isDevelopment = import.meta.env.DEV;
      let result;
      
      if (isDevelopment && email === 'admin@example.com') {
        console.log("Using development admin login");
        result = await loginAsAdmin();
      } else {
        result = await login({ email, password });
      }
      
      console.log("Login result:", result);
      
      if (result && result.success) {
        // Check if user is admin
        if (result.user?.isAdmin) {
          console.log("Admin login successful, redirecting to dashboard");
          navigate('/admin');
        } else {
          console.log("User is not admin:", result.user);
          setError('You do not have admin privileges');
        }
      } else {
        console.log("Login failed:", result?.error);
        setError(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading indicator when authenticating or navigating
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '20px' }}>Authenticating...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Logo>
        <img src="/images/logo.png" alt="M-Mart+ Logo" onError={(e) => e.currentTarget.src = '/logo192.png'} />
      </Logo>
      
      <Heading>Admin Login</Heading>
      <SubHeading>Sign in to access the admin dashboard</SubHeading>
      
      <Form onSubmit={handleSubmit}>
        {(error || authError) && (
          <ErrorMessage>{error || authError}</ErrorMessage>
        )}
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>
    </PageContainer>
  );
};

export default AdminLoginPage;
