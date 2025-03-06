/**
 * Script to create a production testing environment
 * Run with: node scripts/prod-test.js
 */

import { writeFile } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setupProdTestEnv() {
  try {
    // Environment variables content
    const envContent = `# Production testing environment
# Created: ${new Date().toISOString()}

# API URL - pointing to production
VITE_API_URL=https://api.m-martplus.com/api

# Disable debug mode to use real API calls
VITE_DEBUG=false

# Other settings
VITE_USE_MOCK_DATA_ON_FAILURE=false
VITE_DEBUG_MODE=false
VITE_SHOW_API_ERRORS=true
`;

    // Write the file to the project root
    await writeFile(new URL('../.env.local', import.meta.url), envContent);

    console.log('✅ Created .env.local for production testing');
    console.log('ℹ️ Please rebuild the app with: npm run build && npm run preview');
  } catch (error) {
    console.error('Error creating environment file:', error);
  }
}

setupProdTestEnv();
