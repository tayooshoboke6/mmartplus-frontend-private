// Application configuration
const config = {
  // API URLs
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    adminUrl: '/admin', // This will be appended to baseUrl in API calls
    authUrl: '/auth',
  },
  
  // Feature flags
  features: {
    useMockData: import.meta.env.DEV && (localStorage.getItem('useMockDataOnFailure') !== 'false'),
    enableSocialLogin: true,
    skipAuthForAdmin: import.meta.env.DEV && (localStorage.getItem('skipAuthForAdmin') === 'true'),
    debugApiResponses: import.meta.env.DEV && (localStorage.getItem('debugApiResponses') === 'true' || import.meta.env.VITE_DEBUG_MODE === 'true'),
  },
  
  // Development helpers
  development: {
    mockAdminToken: 'dev-admin-token-for-testing',
    mockUserToken: 'dev-user-token-for-testing',
  },
};

// Initialize feature flags from environment if in development
if (import.meta.env.DEV) {
  // Set debug mode from environment
  if (import.meta.env.VITE_DEBUG_MODE === 'true') {
    localStorage.setItem('debugApiResponses', 'true');
  }
  
  // Default to skipping auth for admin routes if using mock data
  if (config.features.useMockData && localStorage.getItem('skipAuthForAdmin') === null) {
    localStorage.setItem('skipAuthForAdmin', 'true');
  }
  
  console.log('Development mode enabled with config:', {
    apiBaseUrl: config.api.baseUrl,
    useMockData: config.features.useMockData,
    skipAuthForAdmin: config.features.skipAuthForAdmin,
    debugApiResponses: config.features.debugApiResponses,
  });
}

export default config;
