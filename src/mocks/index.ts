/**
 * Mock API for M-Mart+ Frontend
 * 
 * This module sets up a mock API using MSW (Mock Service Worker) to intercept
 * API requests and provide mock responses until the actual backend is ready.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Start the MSW worker in development mode only
export async function setupMockApi() {
  // Only run in development environment
  if (import.meta.env.DEV) {
    console.log('Setting up mock API...');
    
    if (isBrowser) {
      const { worker } = await import('./browser');
      
      // Start the worker
      await worker.start({
        // Show console logs for debugging
        onUnhandledRequest: 'warn',
        // Don't warn about these requests
        quiet: true,
      });
      
      console.log('Mock API is running');
      
      return worker;
    }
  }
  
  return null;
}

// Export a function to check if the mock API is enabled
export function isMockApiEnabled() {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';
}
