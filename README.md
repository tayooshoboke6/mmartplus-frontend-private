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
