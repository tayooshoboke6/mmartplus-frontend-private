/**
 * Script to create a special debug environment for email verification testing
 * Run with: node scripts/fix-cors.js
 */

import { writeFile } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setupDebugEnv() {
  try {
    // Environment variables content
    const envContent = `# Debug environment for CORS testing
# Created: ${new Date().toISOString()}

# API URL - pointing to production
VITE_API_URL=https://api.m-martplus.com/api

# Enable debug mode - this is critical for the email verification service
VITE_DEBUG=true

# Other settings
VITE_USE_MOCK_DATA_ON_FAILURE=true
VITE_DEBUG_MODE=true
VITE_SHOW_API_ERRORS=true
`;

    // Write the file to the project root
    await writeFile(new URL('../.env.local', import.meta.url), envContent);

    console.log('✅ Created .env.local with debug mode enabled');
    console.log('ℹ️ Please rebuild the app with: npm run build && npm run preview');
  } catch (error) {
    console.error('Error creating environment file:', error);
  }
}

setupDebugEnv();
