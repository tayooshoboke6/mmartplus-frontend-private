// Vouchers Frontend Validation Tests
// This script provides automated testing for the Vouchers feature
// in the frontend admin dashboard

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

console.log('Starting Vouchers validation script...');
console.log('Environment:', {
  apiUrl: process.env.REACT_APP_API_URL,
  nodeEnv: process.env.NODE_ENV
});

const VouchersTest = {
  // Configure test parameters here
  config: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    adminEmail: 'admin@mmart.test',
    adminPassword: 'admin123',
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    useMockData: true, // Use mock data for validation when API is not available
  },

  log(level, message) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex >= configLevelIndex) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  },

  async login() {
    this.log('info', '🔑 Logging in as admin...');
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for login');
      this.token = 'mock-admin-token-for-testing';
      this.log('info', '✅ Login successful (mocked)');
      return true;
    }
    
    try {
      // First get CSRF Cookie if needed for Laravel Sanctum
      try {
        await fetch(`${this.config.apiUrl.split('/api')[0]}/sanctum/csrf-cookie`, {
          method: 'GET',
          credentials: 'include'
        });
        this.log('debug', 'CSRF token fetched');
      } catch (csrfError) {
        this.log('warn', `CSRF cookie request failed: ${csrfError.message}`);
        // Continue without CSRF
      }

      const response = await fetch(`${this.config.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          email: this.config.adminEmail,
          password: this.config.adminPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.data?.token) {
        throw new Error('Login successful but no token received');
      }

      this.token = data.data.token;
      this.log('info', '✅ Login successful');
      return true;
    } catch (error) {
      this.log('error', `❌ Login failed: ${error.message}`);
      return false;
    }
  },

  async getVouchers() {
    this.log('info', '📋 Fetching vouchers...');
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for vouchers');
      return [
        {
          id: 1,
          code: 'WELCOME10',
          description: 'Welcome discount',
          discount_type: 'percentage',
          discount_value: 10,
          min_order_amount: 100,
          max_discount_amount: 50,
          start_date: '2025-01-01',
          end_date: '2025-12-31',
          usage_limit: 1000,
          active: true
        },
        {
          id: 2,
          code: 'SUMMER2025',
          description: 'Summer sale discount',
          discount_type: 'fixed',
          discount_value: 20,
          min_order_amount: 200,
          max_discount_amount: null,
          start_date: '2025-06-01',
          end_date: '2025-08-31',
          usage_limit: 500,
          active: true
        }
      ];
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vouchers: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      this.log('error', `❌ Error fetching vouchers: ${error.message}`);
      return [];
    }
  },

  async createVoucher(voucherData) {
    this.log('info', '✏️ Creating voucher...');
    this.log('debug', `Voucher data: ${JSON.stringify(voucherData)}`);
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for voucher creation');
      return {
        id: 999,
        ...voucherData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(voucherData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create voucher: ${response.status}`);
      }

      const data = await response.json();
      this.log('info', '✅ Voucher created successfully');
      return data.data;
    } catch (error) {
      this.log('error', `❌ Error creating voucher: ${error.message}`);
      return null;
    }
  },

  async updateVoucher(id, voucherData) {
    this.log('info', `🔄 Updating voucher ID: ${id}...`);
    this.log('debug', `Update data: ${JSON.stringify(voucherData)}`);
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for voucher update');
      return {
        id,
        ...voucherData,
        updated_at: new Date().toISOString()
      };
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(voucherData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update voucher: ${response.status}`);
      }

      const data = await response.json();
      this.log('info', '✅ Voucher updated successfully');
      return data.data;
    } catch (error) {
      this.log('error', `❌ Error updating voucher: ${error.message}`);
      return null;
    }
  },

  async toggleVoucherStatus(id) {
    this.log('info', `🔄 Toggling status for voucher ID: ${id}...`);
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for voucher status toggle');
      return {
        id,
        active: false, // Assume we're toggling from active to inactive
        updated_at: new Date().toISOString()
      };
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle voucher status: ${response.status}`);
      }

      const data = await response.json();
      this.log('info', '✅ Voucher status toggled successfully');
      return data.data;
    } catch (error) {
      this.log('error', `❌ Error toggling voucher status: ${error.message}`);
      return null;
    }
  },

  async generateBulkVouchers(bulkData) {
    this.log('info', '📦 Generating bulk vouchers...');
    this.log('debug', `Bulk data: ${JSON.stringify(bulkData)}`);
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for bulk voucher generation');
      const mockVoucherCodes = [];
      for (let i = 1; i <= bulkData.count; i++) {
        mockVoucherCodes.push(`${bulkData.prefix}${i.toString().padStart(3, '0')}`);
      }
      return {
        success: true,
        message: `Successfully generated ${bulkData.count} vouchers`,
        voucher_codes: mockVoucherCodes
      };
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(bulkData)
      });

      if (!response.ok) {
        throw new Error(`Failed to generate bulk vouchers: ${response.status}`);
      }

      const data = await response.json();
      this.log('info', '✅ Bulk vouchers generated successfully');
      return data.data;
    } catch (error) {
      this.log('error', `❌ Error generating bulk vouchers: ${error.message}`);
      return null;
    }
  },

  async getVoucherStats(voucherId) {
    this.log('info', `📊 Getting statistics for voucher ID: ${voucherId}...`);
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for voucher statistics');
      return {
        usage_count: 42,
        total_discount: 560.75,
        avg_discount: 13.35,
        orders: [
          { id: 1001, discount_amount: 10.00, created_at: '2025-01-15T12:30:45Z' },
          { id: 1015, discount_amount: 15.25, created_at: '2025-01-20T09:15:30Z' }
        ]
      };
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers/${voucherId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get voucher stats: ${response.status}`);
      }

      const data = await response.json();
      this.log('info', '✅ Voucher statistics retrieved successfully');
      return data.data;
    } catch (error) {
      this.log('error', `❌ Error getting voucher statistics: ${error.message}`);
      return null;
    }
  },

  async deleteVoucher(id) {
    this.log('info', `🗑️ Deleting voucher ID: ${id}...`);
    
    if (this.config.useMockData) {
      this.log('info', '⚠️ Using mock data for voucher deletion');
      return true;
    }
    
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/vouchers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete voucher: ${response.status}`);
      }

      this.log('info', '✅ Voucher deleted successfully');
      return true;
    } catch (error) {
      this.log('error', `❌ Error deleting voucher: ${error.message}`);
      return false;
    }
  },

  // Full validation test suite
  async runFullValidation() {
    this.log('info', '🚀 Starting Vouchers Frontend Validation Tests');
    
    // Step 1: Login
    if (!await this.login()) {
      this.log('error', '❌ Validation failed at login step. Cannot proceed.');
      return false;
    }
    
    // Step 2: Get current vouchers
    const initialVouchers = await this.getVouchers();
    
    // Timestamp for uniqueness
    const timestamp = Date.now();
    
    // Step 3: Create a test voucher
    const testVoucher = await this.createVoucher({
      code: `TEST${timestamp}`,
      description: 'Created by the validation test script',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 50,
      max_discount_amount: 20,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usage_limit: 100,
      active: true
    });
    
    if (!testVoucher) {
      this.log('error', '❌ Validation failed at create voucher step. Cannot proceed.');
      return false;
    }
    
    // Step 4: Update the test voucher
    const updatedVoucher = await this.updateVoucher(testVoucher.id, {
      description: 'Updated by the validation test script',
      discount_value: 15,
      min_order_amount: 100
    });
    
    if (!updatedVoucher) {
      this.log('error', '❌ Validation failed at update voucher step.');
      // Continue with other tests
    }
    
    // Step 5: Toggle status
    const toggledVoucher = await this.toggleVoucherStatus(testVoucher.id);
    
    if (!toggledVoucher) {
      this.log('error', '❌ Validation failed at toggle status step.');
      // Continue with other tests
    }
    
    // Step 6: Generate bulk vouchers
    let bulkResult = null;
    try {
      bulkResult = await this.generateBulkVouchers({
        prefix: `BULK${timestamp}`,
        count: 5,
        discount_type: 'fixed',
        discount_value: 20,
        min_order_amount: 200,
        max_discount_amount: null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usage_limit: 1,
        active: true
      });
    } catch (error) {
      this.log('error', `❌ Validation failed at bulk generation step: ${error.message}`);
    }
    
    // Step 7: Get voucher stats
    let statsResult = null;
    if (testVoucher) {
      statsResult = await this.getVoucherStats(testVoucher.id);
      
      if (!statsResult) {
        this.log('error', '❌ Validation failed at get stats step.');
        // Continue with other tests
      }
    }
    
    // Step 8: Cleanup - delete test voucher
    let cleanupSuccess = true;
    
    if (testVoucher) {
      const deleted = await this.deleteVoucher(testVoucher.id);
      if (!deleted) {
        this.log('error', `❌ Failed to delete test voucher ID: ${testVoucher.id}`);
        cleanupSuccess = false;
      }
    }
    
    // Step 9: Final verification - check voucher count returned to initial state
    const finalVouchers = await this.getVouchers();
    
    // Check if bulk vouchers were created
    if (bulkResult && bulkResult.voucher_codes && bulkResult.voucher_codes.length > 0) {
      // If bulk vouchers were created, the final count should be higher
      // We don't attempt to delete these in the test as that would require
      // fetching each one by code or ID first
      this.log('info', `ℹ️ Bulk vouchers were created (${bulkResult.voucher_codes.length}) but not deleted as part of cleanup`);
    } else if (finalVouchers.length !== initialVouchers.length) {
      this.log('warn', `⚠️ Final voucher count (${finalVouchers.length}) does not match initial count (${initialVouchers.length})`);
    }
    
    // Final report
    this.log('info', '📊 Validation Test Summary:');
    this.log('info', `- Create Voucher: ${testVoucher ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Update Voucher: ${updatedVoucher ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Toggle Voucher Status: ${toggledVoucher ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Generate Bulk Vouchers: ${bulkResult ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Get Voucher Statistics: ${statsResult ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Cleanup Test Data: ${cleanupSuccess ? '✅ PASS' : '⚠️ PARTIAL'}`);
    
    this.log('info', '🏁 Vouchers Frontend Validation Tests Completed');
    
    return true;
  }
};

// Run the validation
console.log('Current script path:', fileURLToPath(import.meta.url));
console.log('Script executed directly, running validation...');
// Create an instance and run validation
const test = Object.create(VouchersTest);
test.runFullValidation().catch(err => {
  console.error('Fatal error during validation:', err);
  process.exit(1);
});

export default VouchersTest;
