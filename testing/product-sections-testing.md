# Product Sections Testing Plan

## Overview
This testing plan outlines the steps to validate the Product Sections feature in the M-Mart+ admin dashboard. The Product Sections feature allows admin users to create and manage product sections that appear on the storefront, such as Featured Products, Hot Deals, New Arrivals, etc.

## Prerequisites
1. Admin access to the M-Mart+ dashboard
2. At least 5 products created in the database
3. The latest codebase with the Product Sections feature implemented

## Backend Testing

### 1. Database Migration and Model
- [x] Verify that the `product_sections` table has been created in the database
- [x] Confirm that the `ProductSection` model is properly defined with fillable attributes
- [x] Test the model's relationship with products through the `product_ids` attribute

### 2. API Endpoints
- [ ] Verify that all required API endpoints are registered:
  - [ ] GET `/api/admin/product-sections` - Index
  - [ ] POST `/api/admin/product-sections` - Create
  - [ ] GET `/api/admin/product-sections/{id}` - Show
  - [ ] PUT `/api/admin/product-sections/{id}` - Update
  - [ ] DELETE `/api/admin/product-sections/{id}` - Delete
  - [ ] PATCH `/api/admin/product-sections/{id}/toggle` - Toggle active status
  - [ ] POST `/api/admin/product-sections/reorder` - Reorder sections

### 3. Controller Functionality
- [ ] Test creating a product section with valid data
- [ ] Test validation rules for title uniqueness
- [ ] Test updating a product section
- [ ] Test adding and removing products from a section
- [ ] Test reordering product sections
- [ ] Test toggling a product section's active status
- [ ] Test deleting a product section

## Frontend Testing

### 1. Product Sections Page
- [ ] Verify that the Product Sections page loads without errors
- [ ] Check that existing product sections are displayed correctly
- [ ] Test the create section form with valid and invalid data
- [ ] Verify that error messages are displayed appropriately
- [ ] Test updating a section's details

### 2. Product Management
- [ ] Test adding products to a section
- [ ] Test removing products from a section
- [ ] Verify that product search functionality works correctly
- [ ] Test the product preview in the section editor

### 3. Section Ordering
- [ ] Test that sections can be reordered via drag and drop
- [ ] Verify the order is persisted after page reload
- [ ] Test reordering multiple sections at once

### 4. Section Status Toggle
- [ ] Test toggling a section's active status
- [ ] Verify the status change is reflected immediately in the UI
- [ ] Confirm inactive sections are properly indicated in the UI

## Integration Testing

### 1. Storefront Display
- [ ] Verify product sections appear correctly on the storefront
- [ ] Test that only active sections are displayed
- [ ] Confirm sections are displayed in the correct order
- [ ] Verify section styling (background color, text color) is applied correctly

### 2. Performance
- [ ] Test loading time with many product sections (10+)
- [ ] Verify pagination or lazy loading works correctly for large product lists
- [ ] Test the system with sections containing many products (20+)

## Edge Cases and Error Handling

### 1. Empty Sections
- [ ] Test creating a section with no products
- [ ] Verify appropriate UI feedback when a section has no products

### 2. Deleted Products
- [ ] Test what happens when a product in a section is deleted
- [ ] Verify the system handles missing products gracefully

### 3. Concurrent Editing
- [ ] Test what happens when two admins edit the same section simultaneously
- [ ] Verify appropriate error messages are shown

## Regression Testing
- [ ] Verify that other parts of the admin dashboard continue to function correctly
- [ ] Test that category management still works properly
- [ ] Confirm that product management is not affected

## Sign-off Criteria
- [ ] All test cases pass
- [ ] No critical or high-priority bugs
- [ ] Performance meets acceptable standards
- [ ] UI/UX is consistent with the rest of the admin dashboard
