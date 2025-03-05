# M-Mart+ Admin Dashboard Testing Plan

## 1. Categories Management Testing

### CRUD Operations
- **Create Category Tests**
  - Create a new category with a unique name and validate success
  - Attempt to create a category with the same name as an existing one (should fail with meaningful error)
  - Create a category with special characters and validate slug generation
  - Test parent-child category relationships

### Validation Tests
- **Duplicate Detection**
  - Create two categories with names that would generate the same slug
  - Update a category to have a name that would generate a duplicate slug
  - Use the console script: `category-validation-test.js` to run automated validation tests

### Error Handling Tests
- **API Error Handling**
  - Simulate network disconnection and check error messages
  - Test malformed requests to verify error handling
  - Verify loading states and error UI are displayed appropriately

## 2. Development Mode Restrictions

### Security Tests
- **Production Mode Safeguards**
  - Execute `dev-mode-test.js` to verify development features are disabled in production mode
  - Verify that loginAsAdmin is properly restricted to development environments
  - Confirm localStorage settings are reset in production mode
  - Test that readonly config properties cannot be modified in production

### Feature Toggle Tests
- **Development Helper Functions**
  - Test config.development.resetDevSettings() functionality
  - Verify that toggling features in localStorage only works in development mode
  - Confirm that console logging is appropriate for the environment

## 3. Product Sections Page Implementation

The Product Sections page appears to be missing backend implementation. Here's what needs to be implemented:

### Backend Tasks
1. **Create Backend Models and Migrations**
   - Create ProductSection model with appropriate fields:
     - id, title, description, type, backgroundColor, textColor, productIds, displayOrder, active
   - Create migration for product_sections table

2. **Create API Controllers**
   - Implement ProductSectionController with CRUD operations
   - Add appropriate validation rules
   - Enforce authentication and authorization

3. **Define API Routes**
   - Add necessary routes in api.php for product sections:
     ```php
     Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum', 'admin']], function () {
         Route::apiResource('product-sections', ProductSectionController::class);
         Route::post('product-sections/reorder', [ProductSectionController::class, 'reorder']);
         Route::post('product-sections/{section}/toggle', [ProductSectionController::class, 'toggleStatus']);
     });
     ```

### Frontend Tasks
1. **Connect Frontend to Backend**
   - The frontend code already exists but needs to be properly connected to the backend
   - Update ProductSectionService.ts to handle API responses correctly
   - Ensure error handling is consistent with our updated approach

2. **Testing Requirements**
   - Verify CRUD operations for product sections
   - Test section reordering functionality
   - Confirm product selection and assignment to sections works properly
   - Validate color picker components for background and text colors

## 4. Testing Sequence

### Phase 1: Categories Testing
1. Run the automated category validation tests
2. Manually test edge cases not covered by the automated tests
3. Verify error messages are user-friendly and descriptive

### Phase 2: Development Mode Testing
1. Run the development mode restriction tests
2. Verify that the application behaves correctly in both development and simulated production modes

### Phase 3: Product Sections Implementation
1. Implement the required backend components
2. Connect the existing frontend to the new backend
3. Test the full functionality of the product sections page

## 5. Known Issues to Address

1. **Categories Management**:
   - Ensure duplicate slug validation is working on both create and update operations
   - Verify proper error handling for all edge cases

2. **Product Sections**:
   - Backend implementation is missing
   - Need to create the necessary models and controllers
   - Integration between frontend and backend needs to be established

## 6. Additional Notes

- All testing should be incremental - make small changes and test after each change
- Keep the development tools (test scripts) in place for future validation
- Document any new issues discovered during testing for future resolution
