import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface VoucherConfig {
  prefix: string;
  type: 'percentage' | 'fixed';
  value: string;
  min_spend: string;
  expires_at: Date | null;
  max_usage_per_user: string;
  max_total_usage: string;
  description: string;
  is_active: boolean;
}

interface VoucherConfigFormProps {
  config: VoucherConfig;
  onChange: (config: VoucherConfig) => void;
  errors: {[key: string]: string};
}

const VoucherConfigForm: React.FC<VoucherConfigFormProps> = ({
  config,
  onChange,
  errors
}) => {
  const handleChange = (field: keyof VoucherConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleChange(name as keyof VoucherConfig, checked);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Voucher Configuration
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Voucher Code Prefix"
              name="prefix"
              value={config.prefix}
              onChange={(e) => handleChange('prefix', e.target.value)}
              variant="outlined"
              error={!!errors.prefix}
              helperText={errors.prefix || 'E.g., TARGET, WELCOME, LOYAL'}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.type}>
              <InputLabel>Voucher Type</InputLabel>
              <Select
                label="Voucher Type"
                name="type"
                value={config.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="percentage">Percentage Discount</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Value"
              name="value"
              value={config.value}
              onChange={(e) => handleChange('value', e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {config.type === 'percentage' ? '%' : '₦'}
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
              value={config.min_spend}
              onChange={(e) => handleChange('min_spend', e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₦</InputAdornment>
                ),
              }}
              error={!!errors.min_spend}
              helperText={errors.min_spend || 'Minimum purchase amount to use voucher'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Usage Per User"
              name="max_usage_per_user"
              value={config.max_usage_per_user}
              onChange={(e) => handleChange('max_usage_per_user', e.target.value)}
              variant="outlined"
              size="small"
              type="number"
              error={!!errors.max_usage_per_user}
              helperText={errors.max_usage_per_user || 'How many times each user can use the voucher'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Total Usage"
              name="max_total_usage"
              value={config.max_total_usage}
              onChange={(e) => handleChange('max_total_usage', e.target.value)}
              variant="outlined"
              size="small"
              type="number"
              error={!!errors.max_total_usage}
              helperText={errors.max_total_usage || 'Leave empty for unlimited total usage'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expiry Date"
                value={config.expires_at}
                onChange={(date) => handleChange('expires_at', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    error: !!errors.expires_at,
                    helperText: errors.expires_at || 'When vouchers will expire'
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
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              variant="outlined"
              size="small"
              multiline
              rows={2}
              placeholder="E.g., 'Special discount for loyal customers'"
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={config.is_active} 
                  onChange={handleSwitchChange}
                  name="is_active"
                  color="primary"
                />
              }
              label="Activate vouchers immediately"
            />
            <Typography variant="caption" color="textSecondary" display="block">
              If turned off, vouchers will be created but not active until manually activated
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VoucherConfigForm;
