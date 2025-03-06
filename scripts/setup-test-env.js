/**
 * Script to create a local environment file for testing with production API
 * Run with: node scripts/setup-test-env.js
 */

import { writeFile } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setupTestEnv() {
  try {
    // Environment variables content
    const envContent = `# Local testing with production API
# Created: ${new Date().toISOString()}

# API URL - pointing to production
VITE_API_URL=https://api.m-martplus.com/api

# For debugging
VITE_DEBUG=true
`;

    // Write the file to the project root
    await writeFile(new URL('../.env.development.local', import.meta.url), envContent);

    console.log('✅ Created .env.development.local with production API URL');
    console.log('ℹ️ You can now run "npm run dev" to test locally with the production backend');
  } catch (error) {
    console.error('Error creating environment file:', error);
  }
}

setupTestEnv();
