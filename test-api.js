import https from 'node:https';
import http from 'node:http';

// Function to make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
          if (data) {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } else {
            resolve({ status: 'success', statusCode: res.statusCode });
          }
        } catch (e) {
          console.log('Response is not JSON:', data);
          resolve({ 
            status: 'success', 
            statusCode: res.statusCode,
            rawData: data 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.method === 'POST' && options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function getCsrfCookie() {
  try {
    console.log('Getting CSRF cookie...');
    const csrfOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    // Get CSRF cookie
    const csrfResult = await makeRequest('http://localhost:8000/sanctum/csrf-cookie', csrfOptions);
    console.log('CSRF cookie result:', csrfResult);
    
    return true;
  } catch (error) {
    console.error('Error getting CSRF cookie:', error);
    return false;
  }
}

async function login() {
  try {
    // First get CSRF cookie
    await getCsrfCookie();
    
    console.log('Attempting to login...');
    const loginUrl = 'http://localhost:8000/api/login';
    const loginData = JSON.stringify({
      email: 'admin-test@example.com', // Updated to use our new test admin
      password: 'password' // Default password from the seeder
    });
    
    const loginOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: loginData
    };
    
    const response = await makeRequest(loginUrl, loginOptions);
    console.log('Login response:', response);
    
    if (response.status === 'success' && response.data?.token) {
      console.log('Login successful, received token:', response.data.token.substring(0, 15) + '...');
      await testAdminOrdersAPI(response.data.token);
    } else {
      console.log('Login failed or token not received');
    }
  } catch (error) {
    console.error('Login attempt failed:', error);
  }
}

async function testAdminOrdersAPI(token) {
  try {
    console.log('Testing admin orders API...');
    const ordersUrl = 'http://localhost:8000/api/admin/orders';
    const ordersOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const ordersData = await makeRequest(ordersUrl, ordersOptions);
    console.log('Admin Orders API response:');
    console.log(JSON.stringify(ordersData, null, 2).substring(0, 500) + '...');
    
    console.log('\nAdmin Orders API test completed');
  } catch (error) {
    console.error('Admin Orders API test failed:', error);
  }
}

async function testAPI() {
  try {
    console.log('Testing products API...');
    const productsData = await makeRequest('http://localhost:8000/api/products');
    console.log('Products API response:');
    console.log(JSON.stringify(productsData, null, 2).substring(0, 500) + '...');
    
    // Now test the admin login and orders API
    await login();
    
    console.log('\nAPI tests completed');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Run the test
testAPI();
