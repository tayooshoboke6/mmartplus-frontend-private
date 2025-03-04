/**
 * Test Utility for Email Verification
 * 
 * This file provides a simple way to test the email verification flow
 * without needing to actually receive emails. It generates predictable
 * verification codes for test email addresses.
 */

/**
 * Get a deterministic verification code for testing purposes.
 * This should ONLY be used during development and testing.
 * 
 * The pattern is:
 * - Any email containing "test-" will return "123456"
 * - Any other email will need to use the actual verification code from the backend
 * 
 * @param email The email address to get a verification code for
 * @returns The verification code or null if this isn't a test email
 */
export const getTestVerificationCode = (email: string): string | null => {
  // Only work with test emails (emails containing "test-")
  if (email.includes('test-')) {
    // For testing purposes, we'll return a fixed code for test emails
    return '123456';
  }
  
  // For real emails, return null (user will need to check their email)
  return null;
};

/**
 * Determines if this is a test email address
 * 
 * @param email The email address to check
 * @returns True if this is a test email
 */
export const isTestEmail = (email: string): boolean => {
  return email.includes('test-');
};

/**
 * Instructions for the Test Flow:
 * 
 * 1. Register with an email containing "test-", like "test-user@example.com"
 * 2. When redirected to the verification page, enter the code "123456"
 * 3. Your email should be verified and you'll be redirected to login
 * 
 * Note: This won't work in production as this file should be removed before deployment
 */
