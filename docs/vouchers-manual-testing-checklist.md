# Vouchers Feature - Manual Testing Checklist

## Admin Dashboard - Voucher Management

### Voucher Listing
- [ ] Voucher list displays correctly with all columns (Code, Description, Type, Value, Min Purchase, Status, Actions)
- [ ] Pagination works correctly for a large number of vouchers
- [ ] Sorting functions work on applicable columns
- [ ] Search/filter functions work to find specific vouchers
- [ ] Status indicators clearly show active vs. inactive vouchers
- [ ] Actions (Edit, Delete, Toggle status) are visible and properly aligned

### Create Voucher
- [ ] "Create Voucher" button is clearly visible
- [ ] Voucher creation form loads with all required fields
- [ ] Form validation works for:
  - [ ] Code uniqueness (cannot duplicate existing codes)
  - [ ] Required fields (code, discount type, value, dates)
  - [ ] Numeric constraints (min purchase amount, discount value)
  - [ ] Date validation (start date must be before end date)
- [ ] Discount type selector (percentage/fixed) works correctly
- [ ] Submitting valid form creates a new voucher
- [ ] Success message appears after creation
- [ ] New voucher appears in the voucher list immediately

### Edit Voucher
- [ ] Edit button/link opens edit form
- [ ] Form is pre-populated with voucher data
- [ ] All fields can be properly modified
- [ ] Form validation works for all fields
- [ ] Submitting updated form saves changes
- [ ] Success message appears after update
- [ ] List view reflects updated information immediately

### Delete Voucher
- [ ] Delete action prompts for confirmation
- [ ] Cancelling deletion keeps voucher
- [ ] Confirming deletion removes the voucher
- [ ] Success message appears after deletion
- [ ] Voucher no longer appears in list after deletion

### Toggle Voucher Status
- [ ] Status toggle button/switch is clearly visible
- [ ] Clicking toggle changes voucher status immediately
- [ ] Visual indication of status change is clear
- [ ] Toggling works in both directions (active to inactive and vice versa)

### Generate Bulk Vouchers
- [ ] Bulk generation option is available
- [ ] Form includes fields for:
  - [ ] Prefix
  - [ ] Number of vouchers to generate
  - [ ] Common voucher properties (discount type, value, etc.)
- [ ] Validation works for all fields
- [ ] Submitting form generates expected number of vouchers
- [ ] Success message displays with number of vouchers created
- [ ] List view updates to include newly generated vouchers
- [ ] Generated vouchers follow the specified prefix pattern

### Voucher Statistics
- [ ] Voucher usage statistics are accessible
- [ ] Usage count displays correctly
- [ ] Total discount amount is calculated correctly
- [ ] Usage trends/graphs display correctly if implemented
- [ ] Data refreshes when actions are taken that should affect statistics

## Storefront - Customer Experience

### Voucher Application
- [ ] Voucher code input field is clearly visible during checkout
- [ ] Apply button works correctly
- [ ] Invalid voucher code shows appropriate error message
- [ ] Valid voucher code applies discount correctly
- [ ] Applied voucher shows in order summary
- [ ] Discount amount displays correctly based on voucher type
- [ ] Minimum purchase requirements are enforced
- [ ] Maximum discount cap is enforced (for percentage vouchers)
- [ ] Expired vouchers are rejected with appropriate message
- [ ] Inactive vouchers are rejected with appropriate message

### Voucher Removal
- [ ] Applied voucher can be removed
- [ ] Removing voucher updates order total correctly
- [ ] New voucher can be applied after removal

### User Account - My Vouchers
- [ ] Available vouchers section displays in user account
- [ ] Vouchers show with useful information (value, expiry date, etc.)
- [ ] Visual distinction between active and expired vouchers
- [ ] Voucher codes can be copied or easily used from this page
- [ ] Voucher details/terms are clearly presented

## Integration Testing

### Cart Integration
- [ ] Voucher applied in cart persists through checkout
- [ ] Cart total updates real-time when voucher is applied/removed
- [ ] Voucher validity is re-checked if cart contents change
- [ ] Adding/removing items that affect minimum purchase recalculates voucher eligibility

### Order Processing
- [ ] Voucher is recorded with the order
- [ ] Order summary shows voucher details
- [ ] Receipt/invoice includes voucher information
- [ ] Voucher usage count increments when order is placed

### User Restrictions
- [ ] Vouchers with usage limits cannot be used beyond their limit
- [ ] User-specific vouchers can only be used by designated users
- [ ] One-time-use vouchers cannot be reused

## Edge Cases

### Error Handling
- [ ] Network errors during voucher operations show appropriate messages
- [ ] Concurrent voucher operations (2 users trying to use same one-time voucher) handled correctly
- [ ] System gracefully handles invalid server responses

### Performance
- [ ] Voucher operations respond quickly even with large number of vouchers
- [ ] Bulk operations complete in reasonable time
- [ ] UI remains responsive during voucher operations

## Accessibility

- [ ] Voucher form fields have appropriate labels
- [ ] Error messages are clear and descriptive
- [ ] Color is not the only means of indicating voucher status
- [ ] Interactive elements are keyboard accessible
- [ ] Screen reader compatibility for crucial elements

## Notes:
- Record any unexpected behavior encountered during testing
- Document any performance issues or UI inconsistencies
- Note any implementation differences from the documented requirements
