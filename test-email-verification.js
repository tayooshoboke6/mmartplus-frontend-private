/**
 * Email Verification Test Script
 * 
 * This script tests the Brevo API integration for email verification
 * Run with: node test-email-verification.js
 */

// Import dotenv to read environment variables
require('dotenv').config();

// Check if Brevo API key is configured
if (!process.env.VITE_BREVO_API_KEY) {
  console.error('❌ Error: VITE_BREVO_API_KEY is not set in .env file');
  console.log('Please add your Brevo API key to the .env file:');
  console.log('VITE_BREVO_API_KEY=your_api_key_here');
  process.exit(1);
}

// Function to test the Brevo API connection
async function testBrevoApi() {
  try {
    const axios = require('axios');
    
    console.log('🔍 Testing Brevo API connection...');
    
    // Generate a test verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const testEmail = process.argv[2] || 'testcustomer@mmartplus.com';
    
    if (!process.argv[2]) {
      console.log('⚠️ No email provided. Using default test email.');
      console.log('To specify an email, run: node test-email-verification.js your@email.com');
    }
    
    console.log(`📧 Sending test verification email to: ${testEmail}`);
    console.log(`🔑 Using verification code: ${verificationCode}`);
    
    // Prepare the email request
    const emailRequest = {
      sender: {
        name: process.env.VITE_SENDER_NAME || 'M-Mart+ Team',
        email: process.env.VITE_SENDER_EMAIL || 'verification@mmartplus.com'
      },
      to: [
        {
          email: testEmail
        }
      ],
      subject: 'M-Mart+ - Test Verification Code',
      htmlContent: `
        <html>
          <body>
            <h2>Test Email Verification</h2>
            <p>This is a test email from the M-Mart+ team.</p>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>If you didn't request this test, please ignore this email.</p>
          </body>
        </html>
      `,
      textContent: `Your test verification code is: ${verificationCode}`
    };
    
    // Send the request to Brevo API
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailRequest,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.VITE_BREVO_API_KEY
        }
      }
    );
    
    console.log('✅ Test email sent successfully!');
    console.log('Response:', response.data);
    
    console.log('\n📝 CORS Configuration Check:');
    console.log('To ensure proper email verification, make sure your CORS configuration includes:');
    console.log('1. Frontend domain: ' + (process.env.VITE_FRONTEND_URL || 'https://m-martplus.com'));
    console.log('2. Any additional development domains (localhost, etc.)');
    
    console.log('\n🔧 To update CORS on your Digital Ocean server:');
    console.log('1. SSH into your server');
    console.log('2. Edit the CORS configuration in your Laravel app:');
    console.log('   nano /path/to/backend/config/cors.php');
    console.log('3. Add your domains to the allowed_origins array');
    console.log('4. Clear Laravel config cache:');
    console.log('   php artisan config:clear');
    console.log('   php artisan config:cache');
    console.log('5. Restart the web server if needed');
    
  } catch (error) {
    console.error('❌ Error testing Brevo API:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Check that your Brevo API key is correct');
    console.log('2. Verify your sender email domain is configured in Brevo');
    console.log('3. Check for API rate limiting issues');
  }
}

// Run the test
testBrevoApi();
