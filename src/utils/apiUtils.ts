import { AxiosError } from 'axios';

/**
 * Format error messages from API responses
 */
export const formatApiError = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  const axiosError = error as AxiosError<any>;
  
  // If we have a response with errors
  if (axiosError.response?.data) {
    const { data } = axiosError.response;
    
    // Handle Laravel validation errors
    if (data.errors && typeof data.errors === 'object') {
      // Extract all validation messages and join them
      const errorMessages = Object.values(data.errors)
        .flat()
        .filter((msg): msg is string => typeof msg === 'string');
      
      if (errorMessages.length) {
        return errorMessages.join('. ');
      }
    }
    
    // Handle simple message response
    if (data.message) {
      return data.message;
    }
    
    // Handle array of messages
    if (Array.isArray(data.messages)) {
      return data.messages.join('. ');
    }
  }
  
  // Handle network errors
  if (axiosError.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  
  if (axiosError.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection.';
  }
  
  // Default error message with status text if available
  if (axiosError.response?.statusText) {
    return `Error: ${axiosError.response.statusText}`;
  }
  
  // Fallback to axios message or generic message
  return axiosError.message || 'An unknown error occurred';
};

/**
 * Handle API errors consistently across the app
 */
export const handleApiError = (error: unknown, setError?: (message: string) => void): string => {
  const errorMessage = formatApiError(error);
  
  // If a setError function is provided, use it
  if (setError) {
    setError(errorMessage);
  }
  
  // Log the error for debugging
  console.error('API Error:', error);
  
  return errorMessage;
};

/**
 * Create a URL with query parameters
 */
export const createUrlWithParams = (
  baseUrl: string, 
  params: Record<string, string | number | boolean | undefined>
): string => {
  const url = new URL(baseUrl, window.location.origin);
  
  // Add all non-undefined parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};
