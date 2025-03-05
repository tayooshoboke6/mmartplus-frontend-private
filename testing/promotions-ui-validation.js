// Promotions Frontend Validation Tests
// This script provides automated testing for the Promotions features
// in the frontend admin dashboard and storefront

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const PromotionsTest = {
  // Configure test parameters here
  config: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    adminEmail: 'admin@example.com',
    adminPassword: 'password',
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
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
    try {
      const response = await fetch(`${this.config.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.config.adminEmail,
          password: this.config.adminPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.token) {
        throw new Error('Login failed');
      }

      this.token = data.token;
      this.log('info', '✅ Login successful');
      return true;
    } catch (error) {
      this.log('error', `❌ Login failed: ${error.message}`);
      return false;
    }
  },

  // Banner API Tests

  async getBanners() {
    this.log('info', '📋 Fetching all banners...');
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/banners`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch banners');
      }

      const banners = data.banners || [];
      this.log('info', `✅ Found ${banners.length} banners`);
      return banners;
    } catch (error) {
      this.log('error', `❌ Failed to fetch banners: ${error.message}`);
      return [];
    }
  },

  async getActiveBanners() {
    this.log('info', '📋 Fetching active banners for storefront...');
    try {
      const response = await fetch(`${this.config.apiUrl}/banners`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch active banners');
      }

      const banners = data.banners || [];
      this.log('info', `✅ Found ${banners.length} active banners`);
      return banners;
    } catch (error) {
      this.log('error', `❌ Failed to fetch active banners: ${error.message}`);
      return [];
    }
  },

  async createBanner(bannerData) {
    this.log('info', `📝 Creating new banner: ${bannerData.label}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/banners`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create banner');
      }

      this.log('info', `✅ Banner created with ID: ${data.banner.id}`);
      return data.banner;
    } catch (error) {
      this.log('error', `❌ Failed to create banner: ${error.message}`);
      return null;
    }
  },

  async updateBanner(banner) {
    this.log('info', `🔄 Updating banner ID: ${banner.id}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(banner),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update banner');
      }

      this.log('info', `✅ Banner updated successfully`);
      return data.banner;
    } catch (error) {
      this.log('error', `❌ Failed to update banner: ${error.message}`);
      return null;
    }
  },

  async toggleBannerStatus(id) {
    this.log('info', `🔄 Toggling status for banner ID: ${id}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/banners/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle banner status');
      }

      this.log('info', `✅ Banner status toggled to: ${data.banner.active ? 'Active' : 'Inactive'}`);
      return data.banner;
    } catch (error) {
      this.log('error', `❌ Failed to toggle banner status: ${error.message}`);
      return null;
    }
  },

  async deleteBanner(id) {
    this.log('info', `🗑️ Deleting banner ID: ${id}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete banner');
      }

      this.log('info', `✅ Banner deleted successfully`);
      return true;
    } catch (error) {
      this.log('error', `❌ Failed to delete banner: ${error.message}`);
      return false;
    }
  },

  // Notification Bar API Tests

  async getNotificationBar() {
    this.log('info', '📋 Fetching notification bar...');
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/notification-bar`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notification bar');
      }

      this.log('info', `✅ Notification bar retrieved successfully`);
      return data.notificationBar || null;
    } catch (error) {
      this.log('error', `❌ Failed to fetch notification bar: ${error.message}`);
      return null;
    }
  },

  async getActiveNotificationBar() {
    this.log('info', '📋 Fetching active notification bar for storefront...');
    try {
      const response = await fetch(`${this.config.apiUrl}/notification-bar`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notification bar');
      }

      this.log('info', `✅ Active notification bar retrieved successfully`);
      return data.notificationBar || null;
    } catch (error) {
      this.log('error', `❌ Failed to fetch active notification bar: ${error.message}`);
      return null;
    }
  },

  async updateNotificationBar(notificationBarData) {
    this.log('info', `🔄 Updating notification bar...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/notification-bar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(notificationBarData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update notification bar');
      }

      this.log('info', `✅ Notification bar updated successfully`);
      return data.notificationBar;
    } catch (error) {
      this.log('error', `❌ Failed to update notification bar: ${error.message}`);
      return null;
    }
  },

  async toggleNotificationBarStatus() {
    this.log('info', `🔄 Toggling notification bar status...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/notification-bar/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle notification bar status');
      }

      this.log('info', `✅ Notification bar status toggled to: ${data.notificationBar.active ? 'Active' : 'Inactive'}`);
      return data.notificationBar;
    } catch (error) {
      this.log('error', `❌ Failed to toggle notification bar status: ${error.message}`);
      return null;
    }
  },

  // Integration Testing

  async verifyStorefrontIntegration() {
    this.log('info', '🔍 Verifying storefront integration...');
    
    // Check if active banners appear on storefront
    const activeBanners = await this.getActiveBanners();
    if (activeBanners.length > 0) {
      this.log('info', `✅ ${activeBanners.length} active banners are available for the storefront`);
    } else {
      this.log('warn', `⚠️ No active banners found for the storefront`);
    }
    
    // Check if active notification bar appears on storefront
    const activeNotificationBar = await this.getActiveNotificationBar();
    if (activeNotificationBar) {
      this.log('info', `✅ Active notification bar is available for the storefront`);
    } else {
      this.log('warn', `⚠️ No active notification bar found for the storefront`);
    }
    
    return {
      hasBanners: activeBanners.length > 0,
      hasNotificationBar: !!activeNotificationBar
    };
  },

  // Full validation test suite
  async runFullValidation() {
    this.log('info', '🚀 Starting Promotions Frontend Validation Tests');
    
    // Step 1: Login
    if (!await this.login()) {
      this.log('error', '❌ Validation failed at login step. Cannot proceed.');
      return false;
    }
    
    // Banner Tests
    
    // Step 2: Get current banners
    const initialBanners = await this.getBanners();
    const initialBannerCount = initialBanners.length;
    
    // Step 3: Create a test banner
    const testBanner = await this.createBanner({
      label: `Test Banner ${Date.now()}`,
      title: 'VALIDATION TEST BANNER',
      description: 'This banner was created by the validation script',
      image: '/test/test-banner.jpg',
      bgColor: '#e6f7ff',
      imgBgColor: '#005b9f',
      link: '/test-link',
      active: true
    });
    
    if (!testBanner) {
      this.log('error', '❌ Validation failed at create banner step.');
      return false;
    }
    
    // Step 4: Update the test banner
    const updatedBanner = await this.updateBanner({
      id: testBanner.id,
      label: testBanner.label,
      title: 'UPDATED TEST BANNER',
      description: testBanner.description,
      image: testBanner.image,
      bgColor: '#fff0e6',
      imgBgColor: '#9f2b00',
      link: testBanner.link,
      active: testBanner.active
    });
    
    if (!updatedBanner) {
      this.log('error', '❌ Validation failed at update banner step.');
    }
    
    // Step 5: Toggle banner status
    const toggledBanner = await this.toggleBannerStatus(testBanner.id);
    
    if (!toggledBanner) {
      this.log('error', '❌ Validation failed at toggle banner status step.');
    }
    
    // Notification Bar Tests
    
    // Step 6: Get current notification bar
    const notificationBar = await this.getNotificationBar();
    
    if (!notificationBar) {
      this.log('warn', '⚠️ No notification bar found. Test will be limited.');
    } else {
      // Step 7: Update notification bar
      const updatedNotificationBar = await this.updateNotificationBar({
        id: notificationBar.id,
        message: `Updated notification message ${Date.now()}`,
        linkText: notificationBar.linkText,
        linkUrl: notificationBar.linkUrl,
        bgColor: '#e6ffe6',
        active: notificationBar.active
      });
      
      if (!updatedNotificationBar) {
        this.log('error', '❌ Validation failed at update notification bar step.');
      }
      
      // Step 8: Toggle notification bar status
      const toggledNotificationBar = await this.toggleNotificationBarStatus();
      
      if (!toggledNotificationBar) {
        this.log('error', '❌ Validation failed at toggle notification bar status step.');
      }
    }
    
    // Step 9: Verify storefront integration
    const storefrontStatus = await this.verifyStorefrontIntegration();
    
    // Step 10: Cleanup - delete test banner
    if (testBanner) {
      const deleted = await this.deleteBanner(testBanner.id);
      if (!deleted) {
        this.log('error', `❌ Failed to delete test banner ID: ${testBanner.id}`);
      }
    }
    
    // Step 11: Final verification
    const finalBanners = await this.getBanners();
    
    // Check if we have the same number of banners as when we started
    if (finalBanners.length !== initialBannerCount) {
      this.log('warn', `⚠️ Final banner count (${finalBanners.length}) does not match initial count (${initialBannerCount})`);
    }
    
    // Final report
    this.log('info', '📊 Validation Test Summary:');
    this.log('info', `- Create Banner: ${testBanner ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Update Banner: ${updatedBanner ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Toggle Banner Status: ${toggledBanner ? '✅ PASS' : '❌ FAIL'}`);
    
    if (notificationBar) {
      this.log('info', `- Update Notification Bar: ${updatedNotificationBar ? '✅ PASS' : '❌ FAIL'}`);
      this.log('info', `- Toggle Notification Bar Status: ${toggledNotificationBar ? '✅ PASS' : '❌ FAIL'}`);
    } else {
      this.log('info', `- Notification Bar Tests: ⚠️ SKIPPED (No notification bar found)`);
    }
    
    this.log('info', `- Storefront Integration: ${storefrontStatus.hasBanners || storefrontStatus.hasNotificationBar ? '✅ PASS' : '⚠️ PARTIAL'}`);
    this.log('info', `- Cleanup Test Data: ${finalBanners.length === initialBannerCount ? '✅ PASS' : '⚠️ PARTIAL'}`);
    
    this.log('info', '🏁 Promotions Frontend Validation Tests Completed');
    
    return true;
  }
};

// Automatically run the validation if this script is executed directly
if (import.meta.url === fileURLToPath(import.meta.url)) {
  PromotionsTest.runFullValidation();
}

// Export for use in other tests
export default PromotionsTest;
