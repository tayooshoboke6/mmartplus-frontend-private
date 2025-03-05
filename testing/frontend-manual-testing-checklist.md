# Frontend Manual Testing Checklist

This document provides a systematic approach to manually validate the Product Sections and Promotions features in the admin dashboard and storefront. Use this checklist alongside the automated validation scripts to ensure comprehensive testing coverage.

## Product Sections Testing

### Admin Dashboard - Product Sections List View

- [ ] **Navigation**
  - [ ] Navigate to the Product Sections page in the admin dashboard
  - [ ] Verify the page loads without errors
  - [ ] Check that the list of product sections displays correctly

- [ ] **List Display**
  - [ ] Verify column headers are correct (Title, Type, Products, Status, Actions)
  - [ ] Confirm sections are displayed in the correct order
  - [ ] Check that the status indicator accurately shows active/inactive state
  - [ ] Verify background/text color preview displays correctly
  - [ ] Test pagination if there are multiple pages of sections

- [ ] **Search & Filter**
  - [ ] Test search functionality by section title
  - [ ] Verify filtering by section type works correctly
  - [ ] Test filtering by active/inactive status

### Admin Dashboard - Create Product Section

- [ ] **Form Elements**
  - [ ] Verify all form fields are present (title, description, type, colors, products)
  - [ ] Check that the form validation works correctly (required fields, format validation)
  - [ ] Test the product selector with search functionality
  - [ ] Verify color pickers work for both background and text colors

- [ ] **Submission**
  - [ ] Create a new section with minimum required fields
  - [ ] Create a section with all fields populated
  - [ ] Verify appropriate success message appears
  - [ ] Confirm the new section appears in the list view
  - [ ] Check that the section is created with the correct initial order

### Admin Dashboard - Edit Product Section

- [ ] **Editing Flow**
  - [ ] Click edit on an existing section
  - [ ] Verify all fields are populated with the correct existing data
  - [ ] Test updating each field individually
  - [ ] Verify form validation works during updates

- [ ] **Save Changes**
  - [ ] Save updated section and verify success message
  - [ ] Confirm changes are reflected in the list view
  - [ ] Verify changes persist after page refresh

### Admin Dashboard - Section Management

- [ ] **Status Toggle**
  - [ ] Test toggling section status (active/inactive) 
  - [ ] Verify the UI updates to reflect the new status
  - [ ] Confirm status changes persist after page refresh

- [ ] **Reordering**
  - [ ] Test drag-and-drop reordering of sections
  - [ ] Verify the new order is saved correctly
  - [ ] Refresh the page and confirm the new order persists

- [ ] **Deletion**
  - [ ] Test deleting a section
  - [ ] Verify confirmation dialog appears
  - [ ] Confirm the section is removed from the list after deletion
  - [ ] Check that remaining sections maintain their correct order

### Storefront - Product Sections Display

- [ ] **Visibility Rules**
  - [ ] Verify only active sections appear on the storefront
  - [ ] Confirm sections display in the correct order

- [ ] **Visual Appearance**
  - [ ] Check that background and text colors are applied correctly
  - [ ] Verify section title and description display properly
  - [ ] Confirm products within the section are displayed correctly

- [ ] **Responsiveness**
  - [ ] Test section appearance on desktop
  - [ ] Check mobile responsiveness
  - [ ] Verify tablet layout

## Promotions Testing

### Admin Dashboard - Banners Management

- [ ] **Banner List View**
  - [ ] Verify all banners are displayed in the list
  - [ ] Check that status indicators show active/inactive state correctly
  - [ ] Confirm banner labels and titles are displayed properly

- [ ] **Create Banner**
  - [ ] Test the banner creation form
  - [ ] Verify all fields are present (label, title, description, image, colors, link)
  - [ ] Check form validation for required fields
  - [ ] Test image upload functionality
  - [ ] Verify color pickers work correctly

- [ ] **Edit Banner**
  - [ ] Click edit on an existing banner
  - [ ] Verify all fields are populated with the correct data
  - [ ] Test updating each field
  - [ ] Confirm image preview updates when changing images
  - [ ] Verify color changes are reflected in the preview

- [ ] **Banner Management**
  - [ ] Test toggling banner status
  - [ ] Verify the UI updates to reflect the new status
  - [ ] Test deleting a banner
  - [ ] Confirm the banner is removed from the list after deletion

### Admin Dashboard - Notification Bar Management

- [ ] **Notification Bar Display**
  - [ ] Verify notification bar settings are displayed correctly
  - [ ] Check that status indicator shows active/inactive state

- [ ] **Edit Notification Bar**
  - [ ] Test updating the notification message
  - [ ] Verify link text and URL can be changed
  - [ ] Confirm background color picker works
  - [ ] Test saving changes and verify success message

- [ ] **Status Toggle**
  - [ ] Test toggling notification bar status
  - [ ] Verify the UI updates to reflect the new status
  - [ ] Confirm status change persists after page refresh

### Storefront - Promotions Display

- [ ] **Banner Display**
  - [ ] Verify only active banners appear on the storefront
  - [ ] Check that banner title, description, and image display correctly
  - [ ] Confirm background and image background colors are applied
  - [ ] Test banner link functionality

- [ ] **Notification Bar**
  - [ ] Verify the notification bar appears when active
  - [ ] Check that the message displays correctly
  - [ ] Confirm link text and URL work properly
  - [ ] Verify background color is applied correctly

- [ ] **Responsiveness**
  - [ ] Test banner appearance on desktop
  - [ ] Check mobile responsiveness
  - [ ] Verify tablet layout for both banners and notification bar

## Integration Testing

- [ ] **Product Sections with Banners**
  - [ ] Create a banner that links to a specific product section
  - [ ] Verify clicking the banner navigates to the correct section
  - [ ] Check that the visual styles are complementary

- [ ] **Multiple Active Promotions**
  - [ ] Test having multiple active banners and notification bar simultaneously
  - [ ] Verify all elements display correctly without conflicts

- [ ] **User Experience Flow**
  - [ ] Test the complete user journey from seeing promotions to browsing product sections
  - [ ] Verify performance with all promotional elements active

## Error Handling

- [ ] **Network Issues**
  - [ ] Test behavior when API requests fail
  - [ ] Verify appropriate error messages are displayed
  - [ ] Check recovery behavior when connection is restored

- [ ] **Invalid Data**
  - [ ] Test form submission with invalid data
  - [ ] Verify validation error messages are clear and helpful
  - [ ] Check behavior when receiving malformed data from the API

## Additional Notes

**Browser Testing**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

**Device Testing**
- [ ] Desktop (large screen)
- [ ] Laptop (medium screen)
- [ ] Tablet (landscape and portrait)
- [ ] Mobile phone

**Test Results Documentation**
- Document any issues encountered during testing
- Note browser/device specific issues separately
- Create tickets for any bugs that need to be addressed
