import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Divider,
  FormHelperText
} from '@mui/material';

interface DistributionConfig {
  method: 'email' | 'sms' | 'in_app' | 'manual';
  emailTemplate: string;
  emailSubject: string;
  notifyUsers: boolean;
  scheduleDelivery: boolean;
  deliveryDate: string;
}

interface DistributionOptionsProps {
  config: DistributionConfig;
  onChange: (config: DistributionConfig) => void;
  errors: {[key: string]: string};
}

const DistributionOptions: React.FC<DistributionOptionsProps> = ({
  config,
  onChange,
  errors
}) => {
  const handleChange = (field: keyof DistributionConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleChange(name as keyof DistributionConfig, checked);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Distribution Method
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            name="method"
            value={config.method}
            onChange={(e) => handleChange('method', e.target.value)}
          >
            <FormControlLabel
              value="email"
              control={<Radio />}
              label="Email"
            />
            
            <Box ml={4} mb={2} mt={1} display={config.method === 'email' ? 'block' : 'none'}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Email Template</InputLabel>
                <Select
                  label="Email Template"
                  value={config.emailTemplate}
                  onChange={(e) => handleChange('emailTemplate', e.target.value)}
                  error={!!errors.emailTemplate}
                >
                  <MenuItem value="default_voucher">Default Voucher Template</MenuItem>
                  <MenuItem value="special_offer">Special Offer Template</MenuItem>
                  <MenuItem value="birthday_voucher">Birthday Voucher Template</MenuItem>
                  <MenuItem value="welcome_back">Welcome Back Template</MenuItem>
                </Select>
                {errors.emailTemplate && <FormHelperText error>{errors.emailTemplate}</FormHelperText>}
              </FormControl>
              
              <TextField
                fullWidth
                label="Email Subject"
                value={config.emailSubject}
                onChange={(e) => handleChange('emailSubject', e.target.value)}
                variant="outlined"
                size="small"
                error={!!errors.emailSubject}
                helperText={errors.emailSubject || 'E.g., "Your Special Discount is Here!"'}
                sx={{ mb: 2 }}
              />
            </Box>
            
            <FormControlLabel
              value="sms"
              control={<Radio />}
              label="SMS"
            />
            
            <FormControlLabel
              value="in_app"
              control={<Radio />}
              label="In-App Notification"
            />
            
            <FormControlLabel
              value="manual"
              control={<Radio />}
              label="Manual Distribution (No Automatic Delivery)"
            />
          </RadioGroup>
        </FormControl>
        
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Notification Options
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={config.notifyUsers} 
                onChange={handleSwitchChange}
                name="notifyUsers"
                color="primary"
                disabled={config.method === 'manual'}
              />
            }
            label="Notify users about their vouchers"
          />
          
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Delivery Scheduling
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={config.scheduleDelivery} 
                  onChange={handleSwitchChange}
                  name="scheduleDelivery"
                  color="primary"
                  disabled={config.method === 'manual'}
                />
              }
              label="Schedule for later delivery"
            />
            
            {config.scheduleDelivery && config.method !== 'manual' && (
              <Box mt={1}>
                <TextField
                  type="datetime-local"
                  label="Delivery Date & Time"
                  value={config.deliveryDate}
                  onChange={(e) => handleChange('deliveryDate', e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.deliveryDate}
                  helperText={errors.deliveryDate}
                />
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DistributionOptions;
