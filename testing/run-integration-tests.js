#!/usr/bin/env node

// Integration Testing Script for M-Mart+
// This script runs both Product Sections and Promotions validations

import ProductSectionsTest from './product-sections-ui-validation.js';
import PromotionsTest from './promotions-ui-validation.js';

async function runFullIntegrationTest() {
  console.log('=== M-MART+ FRONTEND INTEGRATION TESTING ===\n');
  
  try {
    console.log('PART 1: Testing Product Sections...');
    await ProductSectionsTest.runFullValidation();
    
    console.log('\nPART 2: Testing Promotions...');
    await PromotionsTest.runFullValidation();
    
    console.log('\n=== INTEGRATION TESTING COMPLETE ===');
    console.log('All frontend services have been validated successfully.');
    console.log('Please also perform manual testing using the checklist in frontend-manual-testing-checklist.md');
  } catch (error) {
    console.error('\n❌ Integration testing failed with error:', error);
    console.error('Please check the specific feature tests for more details.');
  }
}

runFullIntegrationTest();
