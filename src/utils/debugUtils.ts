/**
 * Utility functions for debugging API responses and validation errors
 */

/**
 * Formats Laravel validation errors in a more readable format for debugging
 * @param errorResponse - The error response from Laravel
 * @returns Formatted error object with field names and error messages
 */
export const formatValidationErrors = (errorResponse: any): Record<string, string[]> => {
  if (!errorResponse || !errorResponse.errors) {
    return {};
  }

  // Laravel usually returns errors in format: { errors: { field: [messages] } }
  return errorResponse.errors;
};

/**
 * Logs API error details to the console in a formatted way
 * @param error - The error caught from an API request
 */
export const logApiError = (error: any): void => {
  console.group('🔍 API Error Details');
  
  console.log('📌 Error:', error.message || 'Unknown error');
  
  if (error.response) {
    console.log('📊 Status:', error.response.status);
    console.log('🔖 Status Text:', error.response.statusText);
    
    if (error.response.data) {
      console.log('📋 Response Data:', error.response.data);
      
      // If it's a validation error with an errors object
      if (error.response.data.errors) {
        console.log('❌ Validation Errors:', formatValidationErrors(error.response.data));
      }
      
      // If it has a message property
      if (error.response.data.message) {
        console.log('📝 Error Message:', error.response.data.message);
      }
    }
  }
  
  console.log('🔗 Request URL:', error.config?.url || 'Unknown URL');
  console.log('📦 Request Data:', error.config?.data ? JSON.parse(error.config.data) : 'No data');
  
  console.groupEnd();
};

/**
 * Debug logger with conditional logging based on environment
 */
export const debugLog = (...args: any[]): void => {
  if (import.meta.env.VITE_DEBUG === 'true') {
    console.log(...args);
  }
};

export default {
  formatValidationErrors,
  logApiError,
  debugLog
};
