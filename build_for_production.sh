#!/bin/bash

# Script to build M-Mart+ frontend for production
# This will disable development mode and ensure it uses the real API

echo "==== Building M-Mart+ Frontend for Production ===="

# 1. Make sure we're in the frontend directory
cd "$(dirname "$0")"

# 2. Create a production .env file
echo "# Production Environment Configuration
# Created on $(date)

# API Base URL - Use the correct URL structure without duplicate /api
VITE_API_BASE_URL=https://api.m-martplus.com
NODE_ENV=production
VITE_APP_ENV=production" > .env.production

# 3. Install dependencies if needed
if [ ! -d "node_modules" ] || [ "$1" == "--force-install" ]; then
  echo "Installing dependencies..."
  npm install
fi

# 4. Build for production
echo "Building production bundle..."
npm run build

# 5. Verify build was successful
if [ -d "dist" ]; then
  echo ""
  echo "==== Production Build Successful ===="
  echo "The application has been built for production mode and will now use real API data."
  echo ""
  echo "To deploy the built application:"
  echo "1. Copy the contents of the 'dist' directory to your web server"
  echo "2. Configure your web server to serve the application"
  echo ""
  echo "For testing locally, you can use:"
  echo "npx serve -s dist"
else
  echo "Error: Production build failed!"
  exit 1
fi
