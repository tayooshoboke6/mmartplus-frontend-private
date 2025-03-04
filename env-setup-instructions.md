# Environment Variable Setup Instructions

I've updated the AddressAutocomplete component to use Vite's environment variable format, but you need to create a local `.env` file with the correct variable names for it to work properly.

## Steps to Fix the Process Error:

1. Create a new file named `.env` in the root directory of your frontend project
2. Add the following content to the file (replace with your actual API key):

```
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Base URL (update this to your actual backend URL)
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Save the file
4. Restart your development server:
   ```
   npm run dev
   ```

## Important Notes:

- In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code
- The environment variables are accessed using `import.meta.env.VITE_VARIABLE_NAME` instead of `process.env.VARIABLE_NAME`
- The error "process is not defined" occurs because Vite doesn't automatically polyfill the Node.js `process` object

## Additional Environment Variables:

You may need these additional variables depending on your configuration:

```
# Other environment variables
VITE_APP_NAME=M-Mart+
VITE_APP_VERSION=1.0.0
```

After making these changes, the AddressAutocomplete component should work correctly.
