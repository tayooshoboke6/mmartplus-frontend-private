import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createVoucher } from '../../../services/voucherService';

interface Category {
  id: number;
  name: string;
}

const CreateVoucherForm: React.FC = () => {
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_spend: '',
    expires_at: null as Date | null,
    is_active: true,
    max_usage_per_user: '1',
    max_total_usage: '',
    description: '',
    qualification_type: 'manual',
    category_ids: [] as number[],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        // This would be replaced with your actual API call
        // const response = await api.get('/categories');
        // setCategories(response.data);
        
        // Mock data for now
        setCategories([
          { id: 1, name: 'Food & Groceries' },
          { id: 2, name: 'Electronics' },
          { id: 3, name: 'Household' },
          { id: 4, name: 'Clothing' },
          { id: 5, name: 'Health & Beauty' },
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Voucher code is required';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Code can only contain uppercase letters, numbers, dashes and underscores';
    }
    
    if (!formData.value) {
      newErrors.value = 'Value is required';
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = 'Value must be a positive number';
    } else if (formData.type === 'percentage' && Number(formData.value) > 100) {
      newErrors.value = 'Percentage cannot exceed 100%';
    }
    
    if (formData.min_spend && (isNaN(Number(formData.min_spend)) || Number(formData.min_spend) < 0)) {
      newErrors.min_spend = 'Minimum spend must be a non-negative number';
    }
    
    if (formData.max_usage_per_user && (isNaN(Number(formData.max_usage_per_user)) || Number(formData.max_usage_per_user) <= 0)) {
      newErrors.max_usage_per_user = 'Maximum usage per user must be a positive number';
    }
    
    if (formData.max_total_usage && (isNaN(Number(formData.max_total_usage)) || Number(formData.max_total_usage) <= 0)) {
      newErrors.max_total_usage = 'Maximum total usage must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, expires_at: date }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({ ...prev, category_ids: event.target.value as number[] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccess(false);
    setErrorMessage(null);
    
    try {
      // Prepare the form data
      const submitData = {
        ...formData,
        value: Number(formData.value),
        min_spend: formData.min_spend ? Number(formData.min_spend) : 0,
        max_usage_per_user: Number(formData.max_usage_per_user),
        max_total_usage: formData.max_total_usage ? Number(formData.max_total_usage) : null,
        expires_at: formData.expires_at ? formData.expires_at.toISOString().split('T')[0] : null,
      };
      
      const response = await createVoucher(submitData);
      
      if (response.status === 'success') {
        setSuccess(true);
        // Reset form
        setFormData({
          code: '',
          type: 'percentage',
          value: '',
          min_spend: '',
          expires_at: null,
          is_active: true,
          max_usage_per_user: '1',
          max_total_usage: '',
          description: '',
          qualification_type: 'manual',
          category_ids: [],
        });
      } else {
        setErrorMessage(response.message || 'Failed to create voucher. Please try again.');
      }
    } catch (error) {
      console.error('Error creating voucher:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component={Paper} p={3}>
      <Typography variant="h6" gutterBottom>
        Create New Voucher
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Voucher created successfully!
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Voucher Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.code}
              helperText={errors.code || 'Use uppercase letters, numbers, dashes and underscores only'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="e.g., 'Welcome discount for new customers'"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Voucher Type</InputLabel>
              <Select
                label="Voucher Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <MenuItem value="percentage">Percentage Discount</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {formData.type === 'percentage' ? '%' : '₦'}
                  </InputAdornment>
                ),
              }}
              error={!!errors.value}
              helperText={errors.value}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Minimum Spend"
              name="min_spend"
              value={formData.min_spend}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₦</InputAdornment>
                ),
              }}
              error={!!errors.min_spend}
              helperText={errors.min_spend}
            />
          </Grid>
          
          {/* Usage Limitations */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Usage Limitations
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Usage Per User"
              name="max_usage_per_user"
              value={formData.max_usage_per_user}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              error={!!errors.max_usage_per_user}
              helperText={errors.max_usage_per_user}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Total Usage"
              name="max_total_usage"
              value={formData.max_total_usage}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              error={!!errors.max_total_usage}
              helperText={errors.max_total_usage || 'Leave empty for unlimited usage'}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expiry Date"
                value={formData.expires_at}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    helperText: 'Leave empty for no expiry',
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Eligibility */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Eligibility & Visibility
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Qualification Type</InputLabel>
              <Select
                label="Qualification Type"
                name="qualification_type"
                value={formData.qualification_type}
                onChange={handleInputChange}
              >
                <MenuItem value="manual">Manual (Code Entry Required)</MenuItem>
                <MenuItem value="automatic">Automatic (Available to All Users)</MenuItem>
                <MenuItem value="targeted">Targeted (Assigned to Specific Users)</MenuItem>
              </Select>
              <FormHelperText>
                How users will qualify for this voucher
              </FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Applicable Categories</InputLabel>
              <Select
                multiple
                label="Applicable Categories"
                value={formData.category_ids}
                onChange={handleCategoryChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map((categoryId) => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <Chip key={categoryId} label={category.name} size="small" />
                      ) : null;
                    })}
                  </Box>
                )}
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading categories...
                  </MenuItem>
                ) : categories.length === 0 ? (
                  <MenuItem disabled>No categories available</MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>
                Leave empty to apply to all products
              </FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.is_active} 
                  onChange={handleSwitchChange}
                  name="is_active"
                  color="primary"
                />
              }
              label="Voucher is active and ready to use"
            />
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Creating...' : 'Create Voucher'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateVoucherForm;
