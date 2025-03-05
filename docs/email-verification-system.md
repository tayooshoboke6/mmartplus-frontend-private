# M-Mart+ Frontend Email Verification System

## Overview

The M-Mart+ frontend includes a complete email verification flow that integrates with the backend email verification API. This document describes the components, workflow, and implementation details of the email verification system in the frontend application.

## Components

### Pages
- **SignupPage**: Handles user registration and redirects to the verification page
- **LoginPage**: Checks email verification status on login attempts
- **RegistrationVerificationPage**: Displays UI for entering and verifying email verification codes

### Services
- **emailVerificationService**: Service for interacting with the email verification API endpoints
  - `sendVerificationCode()`: Sends a verification code to the authenticated user
  - `sendVerificationCodeByEmail()`: Sends a verification code to a specific email (non-authenticated)
  - `verifyCode()`: Verifies a code for an authenticated user
  - `verifyEmailWithCode()`: Verifies a code for a specific email (non-authenticated)
  - `checkVerificationStatus()`: Checks if the authenticated user's email is verified

## Workflow

### Registration & Verification Flow
1. User completes registration form on SignupPage
2. Upon successful registration, user is redirected to RegistrationVerificationPage
3. RegistrationVerificationPage automatically sends a verification code to the user's email
4. User receives email with verification code
5. User enters code in the verification page
6. Upon successful verification, user is redirected to LoginPage
7. User can now log in with their verified credentials

### Login Flow with Verification Check
1. User attempts to log in on LoginPage
2. If credentials are valid but email is not verified, user receives an error message
3. User is prompted to verify their email before logging in
4. User can click on "Verify Email" to be redirected to the RegistrationVerificationPage

## Implementation Details

### SignupPage
```typescript
// Successful registration handler in SignupPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Register user
    const response = await authService.register(formData);
    
    // Redirect to verification page with email
    navigate('/verify-email', { state: { email: formData.email } });
  } catch (error) {
    // Handle registration error
  }
};
```

### RegistrationVerificationPage
```typescript
// Verification code handler in RegistrationVerificationPage.tsx
const handleVerify = async () => {
  if (!email || code.length !== 6) {
    return;
  }
  
  try {
    setLoading(true);
    // Call API to verify email with code
    const response = await emailVerificationService.verifyEmailWithCode(email, code);
    setIsVerified(true);
    
    // Redirect to login after successful verification
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  } catch (error) {
    // Handle verification error
  } finally {
    setLoading(false);
  }
};
```

### LoginPage
```typescript
// Login handler in LoginPage.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Attempt login
    const response = await authService.login(formData);
    // Successful login handling
  } catch (error) {
    // Check if error is due to email not being verified
    if (error.response?.data?.message.includes('verify your email')) {
      setEmailVerificationNeeded(true);
    }
    // Handle other login errors
  }
};
```

## API Integration

### Email Verification Service
```typescript
// emailVerificationService.ts
const emailVerificationService = {
  // Send verification code to a specific email (non-authenticated)
  sendVerificationCodeByEmail: async (email: string): Promise<VerificationResponse> => {
    try {
      const response = await api.post<VerificationResponse>('/email/non-auth/send', { email });
      return response.data;
    } catch (error) {
      // Handle and transform error
      throw {
        status: 'error',
        message: error.response?.status === 404
          ? 'Email address not found.'
          : 'Failed to send verification code. Please try again.'
      };
    }
  },
  
  // Verify email with verification code (non-authenticated)
  verifyEmailWithCode: async (email: string, code: string): Promise<VerificationResponse> => {
    try {
      const response = await api.post<VerificationResponse>('/email/non-auth/verify', { email, code });
      return response.data;
    } catch (error) {
      // Handle and transform error
      throw {
        status: 'error',
        message: 'Invalid or expired verification code. Please try again.'
      };
    }
  },
  
  // Other methods...
};
```

## UI Components

The RegistrationVerificationPage includes:
- Email input (if not provided via navigation state)
- Verification code input field (6-digit numeric input)
- "Verify Email" button
- "Resend Verification Code" button with cooldown timer
- Success/error status messages

## Error Handling

- Invalid or expired verification codes
- Non-existent email addresses
- Already verified email addresses
- Network or server errors

## Styling

- Responsive design for all screen sizes
- Consistent styling with the rest of the application
- Clear visual feedback for success and error states
- Easy-to-read verification code format

## Testing

When testing the email verification flow:
1. Register a new user
2. Make sure you are redirected to the verification page
3. Check the frontend console and backend logs for any errors
4. Verify that the code is sent successfully
5. Enter the verification code and submit
6. Confirm successful verification and redirection to login
7. Log in with the verified credentials

## Troubleshooting

- If the verification code is not being sent, check the backend logs and API responses
- If verification always fails, ensure the code format and API endpoints are correct
- If redirection after verification doesn't work, check the navigation logic
