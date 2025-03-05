// Product Sections Frontend Validation Tests
// This script provides automated testing for the Product Sections feature
// in the frontend admin dashboard

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

console.log('Starting Product Sections validation script...');

const ProductSectionsTest = {
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

  async getProductSections() {
    this.log('info', '📋 Fetching product sections...');
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/product-sections`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product sections');
      }

      const sections = data.data || [];
      this.log('info', `✅ Found ${sections.length} product sections`);
      return sections;
    } catch (error) {
      this.log('error', `❌ Failed to fetch product sections: ${error.message}`);
      return [];
    }
  },

  async createProductSection(sectionData) {
    this.log('info', `📝 Creating new product section: ${sectionData.title}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/product-sections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product section');
      }

      this.log('info', `✅ Product section created with ID: ${data.data.id}`);
      return data.data;
    } catch (error) {
      this.log('error', `❌ Failed to create product section: ${error.message}`);
      return null;
    }
  },

  async updateProductSection(id, sectionData) {
    this.log('info', `🔄 Updating product section ID: ${id}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/product-sections/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product section');
      }

      this.log('info', `✅ Product section updated successfully`);
      return data.data;
    } catch (error) {
      this.log('error', `❌ Failed to update product section: ${error.message}`);
      return null;
    }
  },

  async toggleProductSectionStatus(id) {
    this.log('info', `🔄 Toggling status for product section ID: ${id}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/product-sections/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle product section status');
      }

      this.log('info', `✅ Product section status toggled to: ${data.data.active ? 'Active' : 'Inactive'}`);
      return data.data;
    } catch (error) {
      this.log('error', `❌ Failed to toggle product section status: ${error.message}`);
      return null;
    }
  },

  async reorderProductSections(sectionIds) {
    this.log('info', `🔄 Reordering product sections...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/product-sections/reorder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ section_ids: sectionIds }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reorder product sections');
      }

      this.log('info', `✅ Product sections reordered successfully`);
      return data.data;
    } catch (error) {
      this.log('error', `❌ Failed to reorder product sections: ${error.message}`);
      return null;
    }
  },

  async deleteProductSection(id) {
    this.log('info', `🗑️ Deleting product section ID: ${id}...`);
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/product-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product section');
      }

      this.log('info', `✅ Product section deleted successfully`);
      return true;
    } catch (error) {
      this.log('error', `❌ Failed to delete product section: ${error.message}`);
      return false;
    }
  },

  // Full validation test suite
  async runFullValidation() {
    this.log('info', '🚀 Starting Product Sections Frontend Validation Tests');
    
    // Step 1: Login
    if (!await this.login()) {
      this.log('error', '❌ Validation failed at login step. Cannot proceed.');
      return false;
    }
    
    // Step 2: Get current product sections
    const initialSections = await this.getProductSections();
    
    // Step 3: Create a test product section
    const testSection = await this.createProductSection({
      title: `Test Section ${Date.now()}`,
      description: 'Created by the validation test script',
      type: 'featured',
      product_ids: [1, 2, 3], // Assuming these product IDs exist
      background_color: '#e6f7ff',
      text_color: '#005b9f',
      display_order: 999,
      active: true,
    });
    
    if (!testSection) {
      this.log('error', '❌ Validation failed at create section step. Cannot proceed.');
      return false;
    }
    
    // Step 4: Update the test section
    const updatedSection = await this.updateProductSection(testSection.id, {
      description: 'Updated by the validation test script',
      background_color: '#fff0e6',
      text_color: '#9f2b00',
    });
    
    if (!updatedSection) {
      this.log('error', '❌ Validation failed at update section step.');
      // Continue with other tests
    }
    
    // Step 5: Toggle status
    const toggledSection = await this.toggleProductSectionStatus(testSection.id);
    
    if (!toggledSection) {
      this.log('error', '❌ Validation failed at toggle status step.');
      // Continue with other tests
    }
    
    // Step 6: Create a second section for reordering
    const testSection2 = await this.createProductSection({
      title: `Test Section 2 ${Date.now()}`,
      description: 'Second test section for reordering',
      type: 'new_arrivals',
      product_ids: [4, 5, 6], // Assuming these product IDs exist
      background_color: '#f0ffe6',
      text_color: '#2b9f00',
      display_order: 998,
      active: true,
    });
    
    if (!testSection2) {
      this.log('error', '❌ Validation failed at create second section step.');
      // Continue with other tests
    }
    
    // Initialize reorderedSections variable
    let reorderedSections = null;
    
    // Step 7: Test reordering (only if we have both sections)
    if (testSection && testSection2) {
      const allSections = await this.getProductSections();
      const sectionIds = allSections.map(section => section.id);
      
      // Move our test sections to different positions
      if (sectionIds.includes(testSection.id) && sectionIds.includes(testSection2.id)) {
        // Swap their positions in the array
        const index1 = sectionIds.indexOf(testSection.id);
        const index2 = sectionIds.indexOf(testSection2.id);
        [sectionIds[index1], sectionIds[index2]] = [sectionIds[index2], sectionIds[index1]];
        
        reorderedSections = await this.reorderProductSections(sectionIds);
        
        if (!reorderedSections) {
          this.log('error', '❌ Validation failed at reorder sections step.');
          // Continue with other tests
        }
      }
    }
    
    // Step 8: Cleanup - delete test sections
    let cleanupSuccess = true;
    
    if (testSection) {
      const deleted1 = await this.deleteProductSection(testSection.id);
      if (!deleted1) {
        this.log('error', `❌ Failed to delete test section ID: ${testSection.id}`);
        cleanupSuccess = false;
      }
    }
    
    if (testSection2) {
      const deleted2 = await this.deleteProductSection(testSection2.id);
      if (!deleted2) {
        this.log('error', `❌ Failed to delete test section ID: ${testSection2.id}`);
        cleanupSuccess = false;
      }
    }
    
    // Step 9: Final verification
    const finalSections = await this.getProductSections();
    
    // Check if we have the same number of sections as when we started
    // (accounting for any sections that may have been added/removed during testing)
    const testSectionIds = [
      testSection ? testSection.id : null,
      testSection2 ? testSection2.id : null,
    ].filter(Boolean);
    
    const finalValidSections = finalSections.filter(section => !testSectionIds.includes(section.id));
    
    if (finalValidSections.length !== initialSections.length) {
      this.log('warn', `⚠️ Final section count (${finalValidSections.length}) does not match initial count (${initialSections.length})`);
    }
    
    // Final report
    this.log('info', '📊 Validation Test Summary:');
    this.log('info', `- Create Product Section: ${testSection ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Update Product Section: ${updatedSection ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Toggle Section Status: ${toggledSection ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Create Second Section: ${testSection2 ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Reorder Sections: ${reorderedSections ? '✅ PASS' : '❌ FAIL'}`);
    this.log('info', `- Cleanup Test Data: ${cleanupSuccess ? '✅ PASS' : '⚠️ PARTIAL'}`);
    
    this.log('info', '🏁 Product Sections Frontend Validation Tests Completed');
    
    return true;
  }
};

// Automatically run the validation if this script is executed directly
if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
  console.log('Script executed directly, running validation...');
  ProductSectionsTest.runFullValidation().catch(error => {
    console.error('Validation failed with error:', error);
  });
}

// Export for use in other tests
export default ProductSectionsTest;
