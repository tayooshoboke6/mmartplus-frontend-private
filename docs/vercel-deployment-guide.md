# M-Mart+ Frontend Deployment Guide for Vercel

This guide outlines the steps to deploy the M-Mart+ frontend React application to Vercel.

## Prerequisites

1. GitHub repository with your frontend code
2. Vercel account (can be created with GitHub authentication)
3. Updated environment variables for production

## Step 1: Prepare Your Frontend Code

Ensure your code is optimized for production:

1. Check for any console errors or warnings
2. Ensure all API endpoints point to production URLs
3. Remove any development-only code or features
4. Update your environment variables for production

## Step 2: Configure Environment Variables

Make sure your `.env.production` file has the correct variables:

```
VITE_API_URL=https://api.mmartplus.com/api
VITE_USE_MOCK_DATA_ON_FAILURE=false
VITE_DEBUG_MODE=false
VITE_SHOW_API_ERRORS=false
```

These will be transferred to Vercel's environment variables during deployment.

## Step 3: Verify Build Process

Test your build process locally:

```bash
npm run build
```

This will create a production build in the `dist` directory. Ensure there are no errors during this process.

## Step 4: Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel
```

4. Follow the prompts to configure your project.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub

2. Login to [Vercel](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Configure project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.production` file

7. Click "Deploy"

## Step 5: Configure Custom Domain

1. In your Vercel project dashboard, go to "Settings" > "Domains"

2. Add your custom domain (e.g., `mmartplus.com` or `app.mmartplus.com`)

3. Follow the DNS configuration instructions provided by Vercel

4. Verify domain ownership

## Step 6: Verify Deployment

1. Visit your deployed site to ensure everything is working correctly

2. Test critical features:
   - User authentication
   - Product browsing
   - Shopping cart functionality
   - Checkout process

3. Check browser console for any errors

## Step 7: Set Up Continuous Deployment

With Vercel and GitHub integration, continuous deployment is set up automatically:

1. When you push changes to your main branch, Vercel will automatically deploy them
2. For feature branches, Vercel creates preview deployments

## Performance Optimization

1. **Enable Vercel Edge Network**:
   - In your project settings, ensure "Edge Network" is enabled for global CDN distribution

2. **Image Optimization**:
   - Leverage Vercel's image optimization by using the Next.js Image component or similar approaches

3. **Caching Strategy**:
   - Configure appropriate cache headers in your `vercel.json` file:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)\\.(.*)$",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are correctly specified in package.json
   - Verify build commands are correct

2. **Missing Environment Variables**:
   - Check if all required environment variables are set in Vercel project settings
   - Ensure variable names match what your application expects

3. **API Connection Issues**:
   - Verify CORS settings on your backend allow requests from your Vercel domain
   - Check API URL configuration

4. **404 Errors on Route Navigation**:
   - Ensure your `vercel.json` has the proper rewrites configuration:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Monitoring and Analytics

1. **Set Up Vercel Analytics**:
   - Enable Vercel Analytics in your project settings for performance monitoring

2. **Integrate with External Services** (optional):
   - Google Analytics
   - Sentry for error tracking
   - LogRocket for session replay

## Security Best Practices

1. Ensure sensitive API keys are only used server-side, not exposed in client code
2. Enable content security policies via headers in `vercel.json`
3. Set up proper authentication flows and token management
4. Use HTTPS for all resources and API calls
