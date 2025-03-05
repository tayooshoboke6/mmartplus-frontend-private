/**
 * Environment variables utility functions
 */

/**
 * Gets an environment variable with a fallback value
 * @param name The name of the environment variable
 * @param fallback Fallback value if the environment variable is not set
 * @returns The environment variable value or fallback
 */
export const getEnvVariable = (name: string, fallback: string = ''): string => {
  const value = import.meta.env[name] || fallback;
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`Environment variable ${name} is not set. Using fallback value.`);
  }
  return value;
};

/**
 * Gets the Google Maps API key from environment variables
 * @returns The Google Maps API key
 */
export const getGoogleMapsApiKey = (): string => {
  const key = getEnvVariable('VITE_GOOGLE_MAPS_API_KEY');
  if (!key) {
    console.error(`
      ========================================================================
      ERROR: Google Maps API Key is not set in your environment variables.
      
      To fix this issue:
      
      1. Create a .env file in the project root if it doesn't exist
      2. Add the following line to .env file:
         VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
      3. Replace 'your_google_maps_api_key_here' with your actual API key
      4. Restart your development server
      
      To get a Google Maps API key:
      1. Go to https://console.cloud.google.com/
      2. Create a new project or select an existing one
      3. Enable Google Maps JavaScript API, Places API, and Geocoding API
      4. Create credentials to get an API key
      ========================================================================
    `);
  } else {
    console.log(`Google Maps API Key is available`);
  }
  return key;
};

/**
 * Gets the API base URL from environment variables
 * @returns The API base URL
 */
export const getApiBaseUrl = (): string => {
  return getEnvVariable('VITE_API_BASE_URL', 'http://localhost:8000/api');
};
