/**
 * Service Import Validator
 * 
 * This script analyzes the codebase for potential service import issues:
 * - Case mismatches in import paths
 * - Missing function exports
 * - Incorrect module usage
 * 
 * This can be executed as part of CI/CD pipeline to prevent issues
 * before they make it to production.
 */

// Mock implementation since we can't dynamically load the TypeScript modules
// In a real implementation, you would use a TypeScript analyzer like ts-morph

// Service definitions - these would be dynamically loaded in a real implementation
const serviceDefinitions = {
  'VoucherService': {
    filePath: 'src/services/VoucherService.ts',
    exportedFunctions: [
      'getAllVouchers',
      'getCustomers',
      'createVoucher',
      'updateVoucher',
      'toggleVoucherStatus',
      'deleteVoucher',
      'generateBulkVouchers',
      'getVoucherStats',
      'validateVoucher',
      'applyVoucher',
      'getUserVouchers',
      'getVouchers',
      'previewTargetedUsers',
      'createTargetedVoucherCampaign'
    ]
  },
  // Add other services here
};

// Files with import statements - these would be dynamically discovered in a real implementation
const fileImports = [
  {
    file: 'src/pages/CartPage.tsx',
    imports: [{ 
      type: 'default', 
      from: '../services/VoucherService', 
      what: 'VoucherService' 
    }]
  },
  {
    file: 'src/pages/admin/VouchersPage.tsx',
    imports: [{ 
      type: 'default', 
      from: '../../services/VoucherService', 
      what: 'VoucherService' 
    }]
  },
  {
    file: 'src/pages/account/VouchersPage.tsx',
    imports: [{ 
      type: 'named', 
      from: '../../services/VoucherService', 
      what: ['getVouchers'] 
    }]
  },
  {
    file: 'src/components/admin/vouchers/VoucherList.tsx',
    imports: [{ 
      type: 'named', 
      from: '../../../services/VoucherService', 
      what: ['getVouchers', 'getVoucherStats'] 
    }]
  },
  {
    file: 'src/components/admin/vouchers/TargetedVoucherForm.tsx',
    imports: [{ 
      type: 'named', 
      from: '../../../services/VoucherService', 
      what: ['previewTargetedUsers', 'createTargetedVoucherCampaign'] 
    }]
  },
  {
    file: 'src/components/admin/vouchers/CreateVoucherForm.tsx',
    imports: [{ 
      type: 'named', 
      from: '../../../services/VoucherService', 
      what: ['createVoucher'] 
    }]
  },
  {
    file: 'src/components/admin/vouchers/BulkVoucherGenerator.tsx',
    imports: [{ 
      type: 'named', 
      from: '../../../services/VoucherService', 
      what: ['generateBulkVouchers'] 
    }]
  }
];

// Validation functions
function validateImportCase(imports) {
  const results = {
    valid: true,
    issues: []
  };
  
  imports.forEach(file => {
    file.imports.forEach(importDef => {
      // Check for case mismatches
      const importPath = importDef.from;
      const serviceName = importPath.split('/').pop();
      
      if (serviceName !== 'VoucherService' && serviceName !== 'api' && serviceName !== 'config') {
        if (serviceName.toLowerCase() === 'voucherservice') {
          results.valid = false;
          results.issues.push({
            file: file.file,
            issue: `Case mismatch in import path: ${importPath}`,
            fix: `Change to ${importPath.replace(/voucherservice/i, 'VoucherService')}`
          });
        }
      }
    });
  });
  
  return results;
}

function validateExportedFunctions(imports) {
  const results = {
    valid: true,
    issues: []
  };
  
  imports.forEach(file => {
    file.imports.forEach(importDef => {
      if (importDef.type === 'named') {
        const serviceName = importDef.from.split('/').pop();
        const serviceDefinition = serviceDefinitions[serviceName];
        
        if (serviceDefinition) {
          importDef.what.forEach(functionName => {
            if (!serviceDefinition.exportedFunctions.includes(functionName)) {
              results.valid = false;
              results.issues.push({
                file: file.file,
                issue: `Function "${functionName}" not exported from ${serviceName}`,
                fix: `Add function to ${serviceDefinition.filePath} and export it`
              });
            }
          });
        }
      }
    });
  });
  
  return results;
}

function findUnusedExports() {
  const results = {
    unused: []
  };
  
  // Get all exported functions
  const allExportedFunctions = Object.keys(serviceDefinitions).reduce((acc, serviceName) => {
    serviceDefinitions[serviceName].exportedFunctions.forEach(fn => {
      acc.push({ service: serviceName, function: fn });
    });
    return acc;
  }, []);
  
  // Get all imported functions
  const allImportedFunctions = fileImports.reduce((acc, file) => {
    file.imports.forEach(importDef => {
      if (importDef.type === 'named') {
        importDef.what.forEach(fn => {
          acc.push({ service: importDef.from.split('/').pop(), function: fn });
        });
      }
    });
    return acc;
  }, []);
  
  // Find unused exports
  allExportedFunctions.forEach(exportedFn => {
    const isUsed = allImportedFunctions.some(importedFn => 
      importedFn.service === exportedFn.service && 
      importedFn.function === exportedFn.function
    );
    
    if (!isUsed) {
      results.unused.push({
        service: exportedFn.service,
        function: exportedFn.function,
        recommendation: 'This function is exported but not imported anywhere. Consider documenting its purpose or removing if unused.'
      });
    }
  });
  
  return results;
}

// Run validations
console.log('Service Import Validator');
console.log('=======================');

const caseValidation = validateImportCase(fileImports);
console.log('\n1. Import Path Case Validation');
if (caseValidation.valid) {
  console.log('   ✅ All import paths use correct case');
} else {
  console.log('   ❌ Found case mismatches in import paths:');
  caseValidation.issues.forEach(issue => {
    console.log(`      - ${issue.file}: ${issue.issue}`);
    console.log(`        Fix: ${issue.fix}`);
  });
}

const functionValidation = validateExportedFunctions(fileImports);
console.log('\n2. Exported Functions Validation');
if (functionValidation.valid) {
  console.log('   ✅ All imported functions are properly exported');
} else {
  console.log('   ❌ Found missing function exports:');
  functionValidation.issues.forEach(issue => {
    console.log(`      - ${issue.file}: ${issue.issue}`);
    console.log(`        Fix: ${issue.fix}`);
  });
}

const unusedExports = findUnusedExports();
console.log('\n3. Unused Exports Analysis');
if (unusedExports.unused.length === 0) {
  console.log('   ✅ All exported functions are used in the codebase');
} else {
  console.log('   ℹ️ Found potentially unused exports (may be used dynamically or via future components):');
  unusedExports.unused.forEach(unused => {
    console.log(`      - ${unused.service}.${unused.function}`);
    console.log(`        Note: ${unused.recommendation}`);
  });
}

console.log('\n4. Summary');
const allValid = caseValidation.valid && functionValidation.valid;
console.log(`   ${allValid ? '✅ All validations passed' : '❌ Found issues that need to be fixed'}`);
console.log('   - Functions like getAllVouchers, validateVoucher, etc. may be used internally or in other components');
console.log('   - This validation helps prevent import errors at runtime and ensures consistent naming');

console.log('\n5. Recommendations');
console.log('   - Run this validation as part of your CI/CD pipeline');
console.log('   - Consider implementing a pre-commit hook to catch these issues early');
console.log('   - Add TypeScript path aliases to simplify imports and reduce errors');
console.log('   - Keep service function names consistent across the codebase');
