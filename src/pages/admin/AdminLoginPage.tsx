import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

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
  font-weight: 500;
  margin-bottom: 8px;
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
    box-shadow: 0 0 0 1px #0077C8;
  }
`;

const PasswordInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 12px 15px;
    padding-right: 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #0077C8;
      box-shadow: 0 0 0 1px #0077C8;
    }
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
    background-color: #005fa3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#666666"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C20.23 13.42 19.29 14.65 18.11 15.59L19.77 17.25C21.46 15.83 22.73 14 23.5 12C21.77 7.61 17.39 4.5 12 4.5C10.73 4.5 9.51 4.73 8.36 5.15L10.01 6.8C10.66 6.6 11.32 6.5 12 6.5Z" fill="#666666"/>
    <path d="M10.93 7.72L13.21 10C13.14 10 13.07 10 13 10C11.34 10 10 11.34 10 13C10 13.07 10 13.14 10 13.21L7.72 10.93C7.26 11.55 7 12.28 7 13C7 15.76 9.24 18 12 18C12.72 18 13.45 17.74 14.07 17.28L15.55 18.76C14.45 19.24 13.25 19.5 12 19.5C6.21 19.5 2.73 16.39 1 12C1.69 10.24 2.79 8.69 4.19 7.49L5.34 8.64L7.72 10.93Z" fill="#666666"/>
    <path d="M2.81 2.81L1.75 3.87L4.53 6.65C3.05 7.89 1.91 9.62 1.27 11.58C3 16.01 7.33 19.18 12.27 19.18C13.96 19.18 15.57 18.84 17.03 18.21L19.13 20.31L20.19 19.25L2.81 2.81ZM7.53 9.65L9.74 11.86C9.68 12.14 9.65 12.43 9.65 12.73C9.65 15.25 11.69 17.29 14.21 17.29C14.51 17.29 14.8 17.26 15.08 17.2L17.29 19.41C15.72 19.89 14.04 20.13 12.27 20.13C8.13 20.13 4.52 17.51 3.07 13.82C3.66 12.07 4.66 10.56 5.95 9.43L7.53 9.65Z" fill="#666666"/>
    <path d="M12 7C11.43 7 10.87 7.12 10.36 7.32L15.07 12.03C15.27 11.52 15.39 10.97 15.39 10.39C15.39 8.5 13.89 7 12 7Z" fill="#666666"/>
    <path d="M8.61 10.44L13.94 15.77C13.44 15.92 12.94 16 12.39 16C10.5 16 9 14.5 9 12.61C9 12.06 9.08 11.56 8.61 10.44Z" fill="#666666"/>
  </svg>
);

/**
 * Admin Login Page Component
 * Provides a dedicated login page for admin users
 */
const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, isAdmin, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState<string>('admin@mmartplus.com');
  const [password, setPassword] = useState<string>('Admin123@');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to admin dashboard
  const from = (location.state as any)?.from?.pathname || '/admin';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log("Admin authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);
  
  // Reset errors when component mounts
  useEffect(() => {
    clearError();
    setError(null);
  }, [clearError]);
  
  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
      
      // Error messages will be set by the auth context
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <PageContainer>
      <Logo>
        <img src="https://shop.mmartplus.com/images/white-logo.png" alt="M-Mart+ Admin" style={{ width: '120px', height: 'auto' }} />
      </Logo>
      
      <Heading>Admin Login</Heading>
      <SubHeading>Sign in to access the admin dashboard</SubHeading>
      
      {/* Display error messages */}
      {(error || authError) && (
        <ErrorMessage>
          {error || authError}
        </ErrorMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={isSubmitting}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <PasswordInput>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            <TogglePasswordButton
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </TogglePasswordButton>
          </PasswordInput>
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </Form>
    </PageContainer>
  );
};

export default AdminLoginPage;
