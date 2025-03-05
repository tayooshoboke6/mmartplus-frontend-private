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
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ContentCopy as ContentCopyIcon,
  FileDownload as FileDownloadIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { generateBulkVouchers } from '../../../services/VoucherService';

interface BulkVoucherFormData {
  prefix: string;
  type: 'percentage' | 'fixed';
  value: string;
  min_spend: string;
  expires_at: Date | null;
  quantity: string;
  code_length: string;
  max_usage_per_user: string;
  max_total_usage: string;
  description: string;
  category_ids: number[];
}

const BulkVoucherGenerator: React.FC = () => {
  const [formData, setFormData] = useState<BulkVoucherFormData>({
    prefix: '',
    type: 'percentage',
    value: '',
    min_spend: '',
    expires_at: null,
    quantity: '10',
    code_length: '8',
    max_usage_per_user: '1',
    max_total_usage: '',
    description: '',
    category_ids: [],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);

  // Fetch categories
  useEffect(() => {
    // Mock data for now - would be replaced with API call
    setCategories([
      { id: 1, name: 'Food & Groceries' },
      { id: 2, name: 'Electronics' },
      { id: 3, name: 'Household' },
      { id: 4, name: 'Clothing' },
      { id: 5, name: 'Health & Beauty' },
    ]);
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.prefix.trim()) {
      newErrors.prefix = 'Prefix is required';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.prefix)) {
      newErrors.prefix = 'Prefix can only contain uppercase letters, numbers, dashes and underscores';
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
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0 || Number(formData.quantity) > 1000) {
      newErrors.quantity = 'Quantity must be between 1 and 1000';
    }
    
    if (!formData.code_length) {
      newErrors.code_length = 'Code length is required';
    } else if (isNaN(Number(formData.code_length)) || Number(formData.code_length) < 4 || Number(formData.code_length) > 12) {
      newErrors.code_length = 'Code length must be between 4 and 12';
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
    setGeneratedCodes([]);
    
    try {
      // Prepare the form data
      const submitData = {
        ...formData,
        value: Number(formData.value),
        min_spend: formData.min_spend ? Number(formData.min_spend) : 0,
        quantity: Number(formData.quantity),
        code_length: Number(formData.code_length),
        max_usage_per_user: Number(formData.max_usage_per_user),
        max_total_usage: formData.max_total_usage ? Number(formData.max_total_usage) : null,
        expires_at: formData.expires_at ? formData.expires_at.toISOString().split('T')[0] : null,
      };
      
      const response = await generateBulkVouchers(submitData);
      
      if (response.status === 'success') {
        setSuccess(true);
        setGeneratedCodes(response.data?.voucher_codes || []);
        setExpanded(true);
      } else {
        setErrorMessage(response.message || 'Failed to generate vouchers. Please try again.');
      }
    } catch (error) {
      console.error('Error generating vouchers:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyAllCodes = () => {
    navigator.clipboard.writeText(generatedCodes.join('\n'));
    alert('All voucher codes copied to clipboard!');
  };

  const downloadCodesAsCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + generatedCodes.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `voucher-codes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box component={Paper} p={3}>
            <Typography variant="h6" gutterBottom>
              Bulk Voucher Generator
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
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
                    Voucher Configuration
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Voucher Code Prefix"
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.prefix}
                    helperText={errors.prefix || 'e.g., SUMMER, WELCOME, SALE'}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Code Length"
                    name="code_length"
                    value={formData.code_length}
                    onChange={handleInputChange}
                    variant="outlined"
                    type="number"
                    error={!!errors.code_length}
                    helperText={errors.code_length || 'Length of random part (4-12)'}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Quantity to Generate"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    variant="outlined"
                    type="number"
                    error={!!errors.quantity}
                    helperText={errors.quantity || 'Maximum 1000 vouchers at once'}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Usage Per Voucher"
                    name="max_total_usage"
                    value={formData.max_total_usage}
                    onChange={handleInputChange}
                    variant="outlined"
                    type="number"
                    error={!!errors.max_total_usage}
                    helperText={errors.max_total_usage || 'Leave empty for unlimited usage'}
                  />
                </Grid>
                
                <Grid item xs={12}>
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
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={2}
                    placeholder="e.g., 'Summer sale vouchers for email campaign'"
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
                    {loading ? 'Generating...' : 'Generate Vouchers'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Generated Voucher Codes
                </Typography>
                <Box>
                  <IconButton 
                    onClick={() => setExpanded(!expanded)}
                    sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Collapse in={expanded}>
                {success && generatedCodes.length > 0 ? (
                  <>
                    <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
                      <Tooltip title="Copy all codes">
                        <Button 
                          startIcon={<ContentCopyIcon />} 
                          onClick={copyAllCodes}
                          size="small"
                        >
                          Copy All
                        </Button>
                      </Tooltip>
                      <Tooltip title="Download as CSV">
                        <Button 
                          startIcon={<FileDownloadIcon />} 
                          onClick={downloadCodesAsCsv}
                          size="small"
                        >
                          Download
                        </Button>
                      </Tooltip>
                    </Box>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Voucher Code</TableCell>
                            <TableCell align="right">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {generatedCodes.map((code, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                <Typography variant="body2" fontFamily="monospace">
                                  {code}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton 
                                  size="small" 
                                  onClick={() => {
                                    navigator.clipboard.writeText(code);
                                    alert(`Copied: ${code}`);
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : success ? (
                  <Typography color="textSecondary" py={2} textAlign="center">
                    No voucher codes generated yet.
                  </Typography>
                ) : (
                  <Typography color="textSecondary" py={2} textAlign="center">
                    Fill out the form and click "Generate Vouchers" to create voucher codes.
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
          
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bulk Voucher Generation Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" paragraph>
              Bulk voucher generation is useful for creating promotions, campaigns, or distributing vouchers to specific user segments.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Best Practices:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Use descriptive prefixes to help identify the campaign (e.g., WELCOME25, SUMMER2025)
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Always set an expiry date for promotional vouchers
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Use longer code lengths (8+) for public promotions to prevent guessing
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Set usage limits to control promotion costs
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BulkVoucherGenerator;
