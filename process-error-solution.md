# Solution for "process is not defined" Error

## Issue Description

You encountered the error "Uncaught ReferenceError: process is not defined" in the AddressAutocomplete component. This occurs because:

1. Your application is using Vite as a build tool
2. The AddressAutocomplete component was attempting to access `process.env.REACT_APP_GOOGLE_MAPS_API_KEY`
3. Vite doesn't automatically polyfill the Node.js `process` object like Create React App does

## Changes Made

I've implemented the following changes to fix this issue:

### 1. Updated the AddressAutocomplete Component

Changed how the Google Maps API key is accessed in `AddressAutocomplete.tsx`:

```typescript
// BEFORE
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;

// AFTER
script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
```

### 2. Updated Vite Configuration

Modified `vite.config.ts` to provide an empty process.env object for compatibility:

```typescript
export default defineConfig({
  // ... existing config
  define: {
    // Handle process.env for libraries that still use it
    'process.env': {}
  }
})
```

## Required Actions from You

To complete the fix, you need to:

1. Create a `.env` file in the root of your frontend project with the correct environment variables:

```
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Base URL
VITE_API_BASE_URL=http://localhost:8000/api
```

2. Restart your development server:

```bash
npm run dev
```

## How Vite Environment Variables Work

In Vite projects:

1. Environment variables must be prefixed with `VITE_` to be exposed to client code
2. Access variables using `import.meta.env.VITE_VARIABLE_NAME` instead of `process.env.VARIABLE_NAME`
3. Variables defined in `.env` files are loaded automatically based on the current mode (development/production)

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Migration from Create React App to Vite](https://vitejs.dev/guide/migration-from-cra.html)

This solution should resolve the "process is not defined" error while ensuring your AddressAutocomplete component continues to work as expected.
