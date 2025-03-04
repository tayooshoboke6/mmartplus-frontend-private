import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0066B2;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SocialLoginContainer = styled.div`
  margin: 30px 0;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &:before, &:after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  span {
    padding: 0 10px;
    font-size: 14px;
    color: #666;
  }
`;

const SocialButton = styled.button<{ provider: 'google' | 'apple' }>`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${props => props.provider === 'google' ? '#ffffff' : '#000000'};
  color: ${props => props.provider === 'google' ? '#000000' : '#ffffff'};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  
  &:hover {
    background-color: ${props => props.provider === 'google' ? '#f5f5f5' : '#333333'};
  }
`;

const ErrorMessage = styled.div`
  background-color: #FFEBEE;
  color: #D32F2F;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-bottom: 20px;
  
  a {
    color: #0077C8;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 30px;
  
  a {
    color: #0077C8;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 30px;
  
  a {
    color: #0077C8;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Login page component
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle, loginWithApple, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';
  
  // If already authenticated, redirect to the redirect path
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    try {
      await login({ email, password });
      // Redirect will happen in the useEffect above
    } catch (err) {
      // Error will be handled by the AuthContext
      // Check if this is an email verification error
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.toLowerCase().includes('email verification') || 
          errorMessage.toLowerCase().includes('verify your email')) {
        // Navigate to email verification page with the email
        navigate('/verify-email', { state: { email } });
      }
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination);
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle Apple login
  const handleAppleLogin = async () => {
    setIsSubmitting(true);
    try {
      const user = await loginWithApple();
      if (user) {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination);
      }
    } catch (error) {
      console.error('Apple login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageContainer>
      {/* Logo */}
      <Logo>
        <img src="https://shop.mmartplus.com/images/white-logo.png" alt="M-Mart+" style={{ width: '120px', height: 'auto' }} />
      </Logo>
      
      {/* Heading */}
      <Heading>Welcome Back</Heading>
      <SubHeading>Enter the fields below to get started</SubHeading>
      
      {/* Error message */}
      {error && (
        <ErrorMessage onClick={clearError}>
          {error}
        </ErrorMessage>
      )}
      
      {/* Login form */}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email Address*</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password*</Label>
          <PasswordInput>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <TogglePasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </TogglePasswordButton>
          </PasswordInput>
        </FormGroup>
        
        <ForgotPassword>
          <Link to="/forgot-password">Forgot Password?</Link>
        </ForgotPassword>
        
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      
      {/* Social login options */}
      <SocialLoginContainer>
        <OrDivider>
          <span>OR</span>
        </OrDivider>
        
        <SocialButton type="button" onClick={handleGoogleLogin} provider="google">
          <img src="/google-icon.png" alt="Google" />
          Sign in with Google
        </SocialButton>
        
        <SocialButton type="button" onClick={handleAppleLogin} provider="apple">
          <img src="/apple-icon.png" alt="Apple" />
          Sign in with Apple
        </SocialButton>
      </SocialLoginContainer>
      
      {/* Sign up prompt */}
      <SignupPrompt>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </SignupPrompt>
      
      {/* Terms and conditions */}
      <TermsText>
        By continuing you agree to M-Mart+'s <Link to="/terms">Terms and Conditions</Link>
      </TermsText>
    </PageContainer>
  );
};

export default LoginPage;
