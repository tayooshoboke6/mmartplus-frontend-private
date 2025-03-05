# M-Mart+ Deployment Checklist

Use this checklist to ensure both the frontend and backend are ready for deployment.

## Frontend (Vercel) Checklist

### Code Quality
- [ ] No console errors or warnings in production build
- [ ] Code passes all linting checks (`npm run lint`)
- [ ] All unused code and commented-out sections removed
- [ ] All TODO comments addressed

### Environment Configuration
- [ ] `.env.production` file properly configured
- [ ] API URL points to production backend (`https://api.mmartplus.com/api`)
- [ ] Debug mode disabled in production
- [ ] Mock data fallbacks disabled in production

### Build Process
- [ ] Build completes without errors (`npm run build`)
- [ ] Bundle size optimized (check Vite build output)
- [ ] No development dependencies in production build

### Feature Verification
- [ ] User authentication (login/signup) works
- [ ] Password reset functionality works
- [ ] Product browsing and search works
- [ ] Product filtering and sorting works
- [ ] Shopping cart functionality works
- [ ] Checkout process works
- [ ] User account management works
- [ ] Admin features work (for admin users)

### Performance
- [ ] Images optimized and properly sized
- [ ] Lazy loading implemented for non-critical components
- [ ] Bundle splitting configured correctly
- [ ] Critical CSS inlined

### Security
- [ ] No sensitive information in client-side code
- [ ] Authentication tokens stored securely
- [ ] CSRF protection implemented
- [ ] Proper input validation on all forms

### SEO & Accessibility
- [ ] Meta tags properly configured
- [ ] Semantic HTML used throughout
- [ ] Alt tags on all images
- [ ] Proper heading hierarchy
- [ ] Color contrast meets WCAG guidelines

## Backend (DigitalOcean) Checklist

### Code Quality
- [ ] All debug statements removed
- [ ] Error handling implemented for all API endpoints
- [ ] Code passes all tests (`php artisan test`)

### Environment Configuration
- [ ] Production `.env` file configured (but not committed to git)
- [ ] App environment set to production (`APP_ENV=production`)
- [ ] Debug mode disabled (`APP_DEBUG=false`)
- [ ] Proper database credentials configured
- [ ] Queue and cache drivers configured for production

### Database
- [ ] All migrations run successfully
- [ ] Seeders run for required initial data
- [ ] Database indexes created for performance
- [ ] Database backup strategy in place

### API & Integration
- [ ] All API endpoints tested
- [ ] Rate limiting configured
- [ ] CORS properly configured for production domains
- [ ] 3rd party API keys valid and configured

### Security
- [ ] HTTPS configured on all endpoints
- [ ] API authentication working correctly
- [ ] Role-based access control tested
- [ ] Password policies enforced
- [ ] SQL injection protection verified
- [ ] File upload validation and sanitization

### Server Configuration
- [ ] PHP configured with appropriate memory limits
- [ ] OPcache enabled for performance
- [ ] Nginx/Apache configured properly
- [ ] Server monitoring set up
- [ ] Error logging configured
- [ ] Firewall rules set up
- [ ] Regular security updates scheduled

### Performance
- [ ] Database queries optimized
- [ ] Caching implemented for frequent queries
- [ ] Queue workers configured for background processing
- [ ] Response compression enabled

## Integration Checklist

- [ ] Frontend successfully communicates with backend API
- [ ] Authentication flow works end-to-end
- [ ] File uploads and downloads work
- [ ] Real-time features work (if applicable)
- [ ] Third-party integrations tested (payment, email, etc.)
- [ ] Cross-browser testing completed

## Final Pre-deployment Steps

### Frontend
1. [ ] Merge all feature branches to main
2. [ ] Run final build and verify
3. [ ] Set up Vercel project with all environment variables
4. [ ] Configure custom domain

### Backend
1. [ ] Merge all feature branches to main
2. [ ] Set up server with required software
3. [ ] Configure web server and SSL
4. [ ] Set up database with proper privileges
5. [ ] Deploy code and run migrations
6. [ ] Configure cron jobs and queue workers
7. [ ] Set up monitoring and logging

### Post-deployment
1. [ ] Verify all features work in production
2. [ ] Monitor error logs for any issues
3. [ ] Check performance metrics
4. [ ] Verify SSL certificates are valid
5. [ ] Test backup and restore procedures
