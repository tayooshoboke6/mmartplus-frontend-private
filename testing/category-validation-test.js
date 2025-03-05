// Category Validation Test Script
// Run this in the browser console while on the admin categories page

// Helper functions
async function createCategory(name, description = '', parentId = null, color = '#000000') {
  console.log(`Attempting to create category: ${name}`);
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      },
      body: JSON.stringify({
        name,
        description,
        parent_id: parentId,
        color,
        is_active: true
      })
    });
    
    const data = await response.json();
    console.log(`Create category result:`, data);
    return { success: response.ok, data };
  } catch (error) {
    console.error(`Error creating category ${name}:`, error);
    return { success: false, error };
  }
}

async function updateCategory(id, name, description = '', parentId = null, color = '#000000') {
  console.log(`Attempting to update category ${id} to: ${name}`);
  try {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      },
      body: JSON.stringify({
        name,
        description,
        parent_id: parentId,
        color,
        is_active: true
      })
    });
    
    const data = await response.json();
    console.log(`Update category result:`, data);
    return { success: response.ok, data };
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    return { success: false, error };
  }
}

async function deleteCategory(id) {
  console.log(`Attempting to delete category: ${id}`);
  try {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    });
    
    const data = await response.json();
    console.log(`Delete category result:`, data);
    return { success: response.ok, data };
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return { success: false, error };
  }
}

// Test cases
async function runDuplicateNameTest() {
  console.log('=== Running duplicate name test ===');
  const testName = `Test Category ${Date.now()}`;
  
  // Create first category
  const result1 = await createCategory(testName);
  
  // Try to create duplicate
  const result2 = await createCategory(testName);
  
  return {
    testName,
    firstCreation: result1,
    duplicateCreation: result2,
    success: !result2.success, // Test passes if second creation fails
    expectedError: 'This name generates a slug that is already in use'
  };
}

async function runRaceConditionTest() {
  console.log('=== Running race condition test ===');
  const baseName = `Race Test ${Date.now()}`;
  
  // Create 5 categories with similar names simultaneously
  const promises = [];
  for (let i = 1; i <= 5; i++) {
    promises.push(createCategory(`${baseName} ${i}`));
  }
  
  const results = await Promise.all(promises);
  
  // Check if all were created or if we have any errors
  const allSucceeded = results.every(r => r.success);
  const errors = results.filter(r => !r.success);
  
  return {
    baseName,
    results,
    allSucceeded,
    errors,
    success: allSucceeded
  };
}

async function runUpdateToDuplicateTest(categoryId) {
  console.log('=== Running update to duplicate name test ===');
  const uniqueName1 = `Unique Test A ${Date.now()}`;
  const uniqueName2 = `Unique Test B ${Date.now()}`;
  
  // Create two categories with unique names
  const result1 = await createCategory(uniqueName1);
  const result2 = await createCategory(uniqueName2);
  
  if (!result1.success || !result2.success) {
    console.error('Failed to create test categories');
    return { success: false, error: 'Failed to create test categories' };
  }
  
  // Now try to update the second category to have the same name as the first
  const updateResult = await updateCategory(
    result2.data.data.id,
    uniqueName1
  );
  
  return {
    uniqueName1,
    uniqueName2,
    firstCreation: result1,
    secondCreation: result2,
    updateResult,
    success: !updateResult.success, // Test passes if update fails
    expectedError: 'This name generates a slug that is already in use'
  };
}

// Main test runner
async function runAllTests() {
  console.log('======= Running all category validation tests =======');
  const results = {
    duplicateNameTest: await runDuplicateNameTest(),
    raceConditionTest: await runRaceConditionTest(),
  };
  
  // Only run update test if we have created categories
  if (results.duplicateNameTest.firstCreation.success) {
    results.updateToDuplicateTest = await runUpdateToDuplicateTest(
      results.duplicateNameTest.firstCreation.data.data.id
    );
  }
  
  console.log('======= Test results =======', results);
  return results;
}

// To run all tests, call:
// runAllTests().then(results => console.table(results));
