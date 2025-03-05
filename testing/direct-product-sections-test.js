// Simple Product Sections API Test
import fetch from 'node-fetch';

// Configuration
const config = {
  apiUrl: 'http://localhost:8000/api',
  adminEmail: 'admin@example.com',
  adminPassword: 'password',
};

// Simple direct test
async function runDirectTest() {
  console.log('=== DIRECT PRODUCT SECTIONS API TEST ===');
  
  try {
    // Step 1: Login
    console.log('\n🔑 Logging in as admin...');
    const loginResponse = await fetch(`${config.apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: config.adminEmail,
        password: config.adminPassword,
      }),
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok || !loginData.token) {
      throw new Error(`Login failed: ${loginData.message || 'Unknown error'}`);
    }
    
    const token = loginData.token;
    console.log('✅ Login successful');
    
    // Step 2: Get product sections
    console.log('\n📋 Fetching product sections...');
    const sectionsResponse = await fetch(`${config.apiUrl}/admin/product-sections`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    const sectionsData = await sectionsResponse.json();
    if (!sectionsResponse.ok) {
      throw new Error(`Failed to fetch sections: ${sectionsData.message || 'Unknown error'}`);
    }
    
    const sections = sectionsData.data || [];
    console.log(`✅ Found ${sections.length} product sections`);
    console.log(sections.map(s => `  - ${s.title} (${s.active ? 'Active' : 'Inactive'})`).join('\n'));
    
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
  }
}

// Run the test
runDirectTest();
