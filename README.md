# M-Mart+ Frontend

This is the frontend application for M-Mart+, built with React, TypeScript, and Vite.

## Deployment to Vercel

This application is configured for deployment to Vercel. Key features:

- React 18 with TypeScript
- Vite for fast builds and development
- Material UI components
- Styled Components for styling
- React Router for navigation
- Optimized build configuration for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Icon System

All icons in the application use direct links from the shop.mmartplus.com website for:

- Contact information icons (phone, email, location)
- Payment method icons (Visa, Mastercard, Verve)
- App store icons (Google Play, App Store)
- Social media icons (Facebook, Twitter, Instagram, YouTube, TikTok)

## Vercel Deployment Notes

1. The application uses route rewrites to support client-side routing
2. API requests are proxied through the `/api` path
3. Security headers are configured in vercel.json

## Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file based on the `.env.example` template for local development.

### Required Environment Variables

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key (required for address autocomplete and maps functionality)

### Setting Up Environment Variables

#### For Local Development

1. Copy the `.env.example` file to `.env.local`
2. Replace placeholder values with your actual API keys and configuration

#### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" section
3. Add each required variable with its value
4. Deploy or redeploy your application

### Security Note

Never commit actual API keys to your repository. The `.env.local` file and other `.env.*` files (except `.env.example`) are gitignored by default.
