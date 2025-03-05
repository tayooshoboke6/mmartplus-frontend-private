import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  Chip, 
  Divider,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface UserSegmentSelectorProps {
  segmentType: string;
  onSegmentTypeChange: (type: string) => void;
  segmentOptions: any;
  onSegmentOptionsChange: (options: any) => void;
  error?: string;
}

const UserSegmentSelector: React.FC<UserSegmentSelectorProps> = ({
  segmentType,
  onSegmentTypeChange,
  segmentOptions,
  onSegmentOptionsChange,
  error
}) => {
  const handleSegmentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSegmentTypeChange(event.target.value);
  };

  const handleOptionChange = (field: string, value: any) => {
    onSegmentOptionsChange({
      ...segmentOptions,
      [field]: value
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Target User Segment
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <FormControl component="fieldset" fullWidth error={!!error}>
          <RadioGroup
            name="segmentType"
            value={segmentType}
            onChange={handleSegmentTypeChange}
          >
            <FormControlLabel 
              value="all_users" 
              control={<Radio />} 
              label="All Users" 
            />
            
            <FormControlLabel 
              value="new_users" 
              control={<Radio />} 
              label="New Users" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'new_users' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Users who registered within:
              </Typography>
              <FormControl size="small" sx={{ width: 200 }}>
                <Select
                  value={segmentOptions.newUserDays || 30}
                  onChange={(e) => handleOptionChange('newUserDays', e.target.value)}
                >
                  <MenuItem value={7}>Last 7 days</MenuItem>
                  <MenuItem value={14}>Last 14 days</MenuItem>
                  <MenuItem value={30}>Last 30 days</MenuItem>
                  <MenuItem value={60}>Last 60 days</MenuItem>
                  <MenuItem value={90}>Last 90 days</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel 
              value="inactive_users" 
              control={<Radio />} 
              label="Inactive Users" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'inactive_users' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Users who haven't placed an order in:
              </Typography>
              <FormControl size="small" sx={{ width: 200 }}>
                <Select
                  value={segmentOptions.inactiveDays || 90}
                  onChange={(e) => handleOptionChange('inactiveDays', e.target.value)}
                >
                  <MenuItem value={30}>30+ days</MenuItem>
                  <MenuItem value={60}>60+ days</MenuItem>
                  <MenuItem value={90}>90+ days</MenuItem>
                  <MenuItem value={180}>180+ days</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel 
              value="loyal_customers" 
              control={<Radio />} 
              label="Loyal Customers" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'loyal_customers' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Users who have placed:
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <FormControl size="small" sx={{ width: 200 }}>
                  <Select
                    value={segmentOptions.orderCount || 5}
                    onChange={(e) => handleOptionChange('orderCount', e.target.value)}
                  >
                    <MenuItem value={3}>3+ orders</MenuItem>
                    <MenuItem value={5}>5+ orders</MenuItem>
                    <MenuItem value={10}>10+ orders</MenuItem>
                    <MenuItem value={20}>20+ orders</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="textSecondary">
                  in the last
                </Typography>
                <FormControl size="small" sx={{ width: 200 }}>
                  <Select
                    value={segmentOptions.loyaltyPeriod || 90}
                    onChange={(e) => handleOptionChange('loyaltyPeriod', e.target.value)}
                  >
                    <MenuItem value={30}>30 days</MenuItem>
                    <MenuItem value={90}>90 days</MenuItem>
                    <MenuItem value={180}>180 days</MenuItem>
                    <MenuItem value={365}>1 year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <FormControlLabel 
              value="big_spenders" 
              control={<Radio />} 
              label="Big Spenders" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'big_spenders' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Users who have spent at least:
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  value={segmentOptions.minSpend || 50000}
                  onChange={(e) => handleOptionChange('minSpend', e.target.value)}
                  type="number"
                  size="small"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 0.5 }}>₦</Typography>,
                  }}
                  sx={{ width: 200 }}
                />
                <Typography variant="body2" color="textSecondary">
                  in the last
                </Typography>
                <FormControl size="small" sx={{ width: 200 }}>
                  <Select
                    value={segmentOptions.spendPeriod || 90}
                    onChange={(e) => handleOptionChange('spendPeriod', e.target.value)}
                  >
                    <MenuItem value={30}>30 days</MenuItem>
                    <MenuItem value={90}>90 days</MenuItem>
                    <MenuItem value={180}>180 days</MenuItem>
                    <MenuItem value={365}>1 year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <FormControlLabel 
              value="abandoned_cart" 
              control={<Radio />} 
              label="Abandoned Cart Users" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'abandoned_cart' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Users who abandoned their cart in:
              </Typography>
              <FormControl size="small" sx={{ width: 200 }}>
                <Select
                  value={segmentOptions.abandonedDays || 7}
                  onChange={(e) => handleOptionChange('abandonedDays', e.target.value)}
                >
                  <MenuItem value={1}>Last 24 hours</MenuItem>
                  <MenuItem value={3}>Last 3 days</MenuItem>
                  <MenuItem value={7}>Last 7 days</MenuItem>
                  <MenuItem value={14}>Last 14 days</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel 
              value="specific_category_buyers" 
              control={<Radio />} 
              label="Buyers of Specific Category" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'specific_category_buyers' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Users who have purchased items from:
              </Typography>
              <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                <InputLabel id="categories-select-label">Categories</InputLabel>
                <Select
                  labelId="categories-select-label"
                  multiple
                  value={segmentOptions.categoryIds || []}
                  onChange={(e) => handleOptionChange('categoryIds', e.target.value)}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as number[]).map((value) => {
                        // Mock mapping - in real app would get name from category list
                        const categoryMap: {[key: number]: string} = {
                          1: 'Food & Groceries',
                          2: 'Electronics',
                          3: 'Household',
                          4: 'Clothing',
                          5: 'Health & Beauty'
                        };
                        return <Chip key={value} label={categoryMap[value] || `Category ${value}`} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {/* Mock categories - replace with actual data */}
                  <MenuItem value={1}>
                    <Checkbox checked={(segmentOptions.categoryIds || []).indexOf(1) > -1} />
                    <ListItemText primary="Food & Groceries" />
                  </MenuItem>
                  <MenuItem value={2}>
                    <Checkbox checked={(segmentOptions.categoryIds || []).indexOf(2) > -1} />
                    <ListItemText primary="Electronics" />
                  </MenuItem>
                  <MenuItem value={3}>
                    <Checkbox checked={(segmentOptions.categoryIds || []).indexOf(3) > -1} />
                    <ListItemText primary="Household" />
                  </MenuItem>
                  <MenuItem value={4}>
                    <Checkbox checked={(segmentOptions.categoryIds || []).indexOf(4) > -1} />
                    <ListItemText primary="Clothing" />
                  </MenuItem>
                  <MenuItem value={5}>
                    <Checkbox checked={(segmentOptions.categoryIds || []).indexOf(5) > -1} />
                    <ListItemText primary="Health & Beauty" />
                  </MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Within time period:
              </Typography>
              <FormControl size="small" sx={{ width: 200 }}>
                <Select
                  value={segmentOptions.categoryPurchasePeriod || 90}
                  onChange={(e) => handleOptionChange('categoryPurchasePeriod', e.target.value)}
                >
                  <MenuItem value={30}>Last 30 days</MenuItem>
                  <MenuItem value={90}>Last 90 days</MenuItem>
                  <MenuItem value={180}>Last 180 days</MenuItem>
                  <MenuItem value={365}>Last 1 year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControlLabel 
              value="birthday_month" 
              control={<Radio />} 
              label="Birthday Month" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'birthday_month' ? 'block' : 'none'}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['month']}
                  label="Select Month"
                  value={segmentOptions.birthdayMonth ? new Date(2023, segmentOptions.birthdayMonth - 1, 1) : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      handleOptionChange('birthdayMonth', newValue.getMonth() + 1);
                    }
                  }}
                  slotProps={{
                    textField: {
                      helperText: 'Target users with birthdays in this month',
                      size: 'small',
                      sx: { width: 200 }
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            
            <FormControlLabel 
              value="custom_list" 
              control={<Radio />} 
              label="Manual User Selection" 
            />
            
            <Box ml={4} mb={2} mt={1} display={segmentType === 'custom_list' ? 'block' : 'none'}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Upload a CSV file with user emails or IDs:
              </Typography>
              <TextField
                type="file"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                InputProps={{
                  inputProps: {
                    accept: '.csv'
                  }
                }}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleOptionChange('customListFile', file);
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                File format: One email or user ID per line
              </Typography>
            </Box>
          </RadioGroup>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default UserSegmentSelector;
