// Type definitions for the application configuration

// API URLs configuration
export interface ApiConfig {
  baseUrl: string;
  adminUrl: string;
  authUrl: string;
}

// Google Maps configuration
export interface GoogleMapsConfig {
  apiKey: string;
}

// Application information configuration
export interface AppConfig {
  name: string;
  version: string;
  environment: string;
}

// Feature flags configuration
export interface FeaturesConfig {
  useMockData: boolean;
  enableSocialLogin: boolean;
  skipAuthForAdmin: boolean;
  debugApiResponses: boolean;
}

// Development helpers configuration
export interface DevelopmentConfig {
  mockAdminToken: string | null;
  mockUserToken: string | null;
  mockApiDelay: number;
  resetDevSettings: () => void;
}

// Complete application configuration
export interface Config {
  api: ApiConfig;
  googleMaps: GoogleMapsConfig;
  app: AppConfig;
  features: FeaturesConfig;
  development: DevelopmentConfig;
}

// Export default empty object to avoid import errors
export default {};
