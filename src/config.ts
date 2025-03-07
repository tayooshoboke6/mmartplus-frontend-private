// Application configuration
const config = {
  // API URLs
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.m-martplus.com/api',
    adminUrl: '/admin', // This will be appended to baseUrl in API calls
    authUrl: '/auth',
  },
  
  // Google Maps configuration
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  },
  
  // Application information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'M-Mart+',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Email configuration
  email: {
    brevoApiKey: import.meta.env.VITE_BREVO_API_KEY || '',
    senderEmail: import.meta.env.VITE_SENDER_EMAIL || 'verification@mmartplus.com',
    senderName: import.meta.env.VITE_SENDER_NAME || 'M-Mart+ Team',
  },
  
  // Feature flags - strictly enforced to be disabled in production
  features: {
    // Mock data is only enabled in dev mode if explicitly set to true in environment
    useMockData: import.meta.env.DEV && (import.meta.env.VITE_USE_MOCK_DATA_ON_FAILURE === 'true'),
    
    // Social login can be enabled in any environment
    enableSocialLogin: true,
    
    // Admin auth skipping is ONLY allowed in dev mode
    skipAuthForAdmin: import.meta.env.DEV && (localStorage.getItem('skipAuthForAdmin') === 'true'),
    
    // API response debugging is ONLY allowed in dev mode
    debugApiResponses: import.meta.env.DEV && (
      localStorage.getItem('debugApiResponses') === 'true' || 
      import.meta.env.VITE_DEBUG_MODE === 'true'
    ),
  },
  
  // Development helpers - ONLY used in development mode
  development: {
    mockAdminToken: import.meta.env.DEV ? 'dev-admin-token-for-testing' : null,
    mockUserToken: import.meta.env.DEV ? 'dev-user-token-for-testing' : null,
    
    // Function to clear development localStorage settings - for clean slate testing
    resetDevSettings: () => {
      if (import.meta.env.DEV) {
        localStorage.removeItem('useMockDataOnFailure');
        localStorage.removeItem('skipAuthForAdmin');
        localStorage.removeItem('debugApiResponses');
        console.log('Development settings have been reset to defaults');
      }
    }
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
} else {
  // In production, force-disable all development features
  // This provides an extra layer of safety to ensure dev features cannot be enabled
  Object.defineProperties(config.features, {
    'useMockData': { value: false, writable: false },
    'skipAuthForAdmin': { value: false, writable: false },
    'debugApiResponses': { value: false, writable: false }
  });
  
  // Clear any development-related localStorage that might have persisted
  localStorage.removeItem('useMockDataOnFailure');
  localStorage.removeItem('skipAuthForAdmin');
  localStorage.removeItem('debugApiResponses');
}

export default config;
