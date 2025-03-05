import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import AddressAutocomplete from '../components/auth/AddressAutocomplete';
import SelfieCapture from '../components/auth/SelfieCapture';
import AvatarGenerator from '../components/auth/AvatarGenerator';

// Styled components (reusing styles from LoginPage)
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

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  flex: 1;
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

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  
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

const LoginPrompt = styled.div`
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

const ValidationMessage = styled.p`
  color: #D32F2F;
  font-size: 12px;
  margin-top: 5px;
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

// Signup page component
const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    gender: undefined as 'male' | 'female' | 'other' | undefined,
    profile_picture: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState<boolean>(false);
  const [captureStep, setCaptureStep] = useState<'initial' | 'capture' | 'generate'>('initial');
  
  const { register, loginWithGoogle, loginWithApple, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    // Password validation (at least 8 characters, with numbers and letters)
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Password matching
    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('Submitting registration data:', formData);
      
      // Map frontend field names to backend field names expected by the API
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: confirmPassword,
        profile_picture: formData.profile_picture
      };
      
      console.log('Mapped to backend fields:', registrationData);
      await register(registrationData);
      
      // After successful registration, redirect to email verification page
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error('Registration error:', err);
      // Error will be handled by the AuthContext
    }
  };
  
  // Handle Google signup
  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination);
      }
    } catch (error) {
      console.error('Google signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle Apple signup
  const handleAppleSignup = async () => {
    setIsSubmitting(true);
    try {
      const user = await loginWithApple();
      if (user) {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination);
      }
    } catch (error) {
      console.error('Apple signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle selfie capture
  const handleSelfieCaptured = (imageData: string) => {
    setSelfieImage(imageData);
    setShowAvatarGenerator(true);
    setCaptureStep('generate');
  };
  
  // Handle avatar generation
  const handleAvatarGenerated = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, profile_picture: avatarUrl }));
    setCaptureStep('initial');
  };
  
  // Handle retaking selfie
  const handleRetakeSelfie = () => {
    setSelfieImage(null);
    setShowAvatarGenerator(false);
    setCaptureStep('capture');
  };
  
  // Start selfie capture
  const startSelfieCapture = () => {
    setCaptureStep('capture');
  };
  
  return (
    <PageContainer>
      {/* Logo */}
      <Logo>
        <img src="https://shop.mmartplus.com/images/white-logo.png" alt="M-Mart+" style={{ width: '120px', height: 'auto' }} />
      </Logo>
      
      {/* Heading */}
      <Heading>Create an Account</Heading>
      <SubHeading>Fill in your details to get started</SubHeading>
      
      {/* Error message */}
      {error && (
        <ErrorMessage onClick={clearError}>
          {error}
        </ErrorMessage>
      )}
      
      {/* Signup form */}
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label htmlFor="firstName">First Name*</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
            {formErrors.firstName && <ValidationMessage>{formErrors.firstName}</ValidationMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
            {formErrors.lastName && <ValidationMessage>{formErrors.lastName}</ValidationMessage>}
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label htmlFor="email">Email Address*</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
          {formErrors.email && <ValidationMessage>{formErrors.email}</ValidationMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="profilePicture">Profile Picture</Label>
          {captureStep === 'initial' && (
            <div style={{ textAlign: 'center' }}>
              {formData.profile_picture ? (
                <div>
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    margin: '0 auto 15px' 
                  }}>
                    <img 
                      src={formData.profile_picture} 
                      alt="Your avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <SecondaryButton 
                    type="button" 
                    onClick={startSelfieCapture}
                    style={{ margin: '0 auto' }}
                  >
                    Change Profile Picture
                  </SecondaryButton>
                </div>
              ) : (
                <div>
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 15px' 
                  }}>
                    <FaUser size={40} color="#ccc" />
                  </div>
                  <SecondaryButton 
                    type="button" 
                    onClick={startSelfieCapture}
                    style={{ margin: '0 auto' }}
                  >
                    Take Selfie for Avatar
                  </SecondaryButton>
                </div>
              )}
              <div style={{ textAlign: 'center', margin: '10px 0', color: '#666', fontSize: '14px' }}>
                Profile picture is optional. If you don't upload one, a default avatar will be used.
              </div>
            </div>
          )}
          
          {captureStep === 'capture' && (
            <SelfieCapture onImageCaptured={handleSelfieCaptured} />
          )}
          
          {captureStep === 'generate' && selfieImage && (
            <AvatarGenerator 
              selfieImage={selfieImage}
              onAvatarGenerated={handleAvatarGenerated}
              onRetakeSelfie={handleRetakeSelfie}
            />
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="address">Address</Label>
          <AddressAutocomplete
            value={formData.address || ''}
            onChange={(address) => setFormData(prev => ({ ...prev, address }))}
            placeholder="123 Main St, City, State"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="gender">Gender</Label>
          <Select
            id="gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password*</Label>
          <PasswordInput>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
          {formErrors.password && <ValidationMessage>{formErrors.password}</ValidationMessage>}
          <ValidationMessage>
            Password must be at least 8 characters
          </ValidationMessage>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password*</Label>
          <PasswordInput>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <TogglePasswordButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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
          {formErrors.confirmPassword && <ValidationMessage>{formErrors.confirmPassword}</ValidationMessage>}
        </FormGroup>
        
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Creating account...' : 'Sign Up'}
        </Button>
      </Form>
      
      {/* Social login options */}
      <SocialLoginContainer>
        <OrDivider>
          <span>OR</span>
        </OrDivider>
        
        <SocialButton type="button" onClick={handleGoogleSignup} provider="google">
          <img src="/google-icon.png" alt="Google" />
          Sign up with Google
        </SocialButton>
        
        <SocialButton type="button" onClick={handleAppleSignup} provider="apple">
          <img src="/apple-icon.png" alt="Apple" />
          Sign up with Apple
        </SocialButton>
      </SocialLoginContainer>
      
      {/* Login prompt */}
      <LoginPrompt>
        Already have an account? <Link to="/login">Login</Link>
      </LoginPrompt>
      
      {/* Terms and conditions */}
      <TermsText>
        By continuing you agree to M-Mart+'s <Link to="/terms">Terms and Conditions</Link>
      </TermsText>
    </PageContainer>
  );
};

export default SignupPage;
