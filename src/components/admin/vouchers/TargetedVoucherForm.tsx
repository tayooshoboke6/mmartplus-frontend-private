import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import UserSegmentSelector from './UserSegmentSelector';
import VoucherConfigForm from './VoucherConfigForm';
import DistributionOptions from './DistributionOptions';
import UserPreview from './UserPreview';
import { previewTargetedUsers, createTargetedVoucherCampaign } from '../../../services/VoucherService';

const TargetedVoucherForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<{[key: string]: {[key: string]: string}}>({
    0: {}, // User segment errors
    1: {}, // Voucher config errors
    2: {}, // Distribution errors
  });

  // User segment state
  const [segmentType, setSegmentType] = useState('all_users');
  const [segmentOptions, setSegmentOptions] = useState<any>({
    newUserDays: 30,
    inactiveDays: 90,
    orderCount: 5,
    loyaltyPeriod: 90,
    minSpend: '50000',
    spendPeriod: 90,
    abandonedDays: 7,
    categoryIds: [],
    categoryPurchasePeriod: 90,
    birthdayMonth: new Date().getMonth() + 1
  });

  // Voucher configuration state
  const [voucherConfig, setVoucherConfig] = useState({
    prefix: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_spend: '',
    expires_at: null as Date | null,
    max_usage_per_user: '1',
    max_total_usage: '',
    description: '',
    is_active: true
  });

  // Distribution options state
  const [distributionConfig, setDistributionConfig] = useState({
    method: 'email' as 'email' | 'sms' | 'in_app' | 'manual',
    emailTemplate: 'default_voucher',
    emailSubject: '',
    notifyUsers: true,
    scheduleDelivery: false,
    deliveryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // Tomorrow
  });

  // User preview state
  const [previewUsers, setPreviewUsers] = useState<any[]>([]);
  const [totalEligibleUsers, setTotalEligibleUsers] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const steps = ['Select User Segment', 'Configure Vouchers', 'Set Distribution Method', 'Review & Create'];

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateCurrentStep = () => {
    let isValid = true;
    const newErrors: {[key: string]: string} = {};
    
    if (activeStep === 0) {
      // Validate user segment
      if (segmentType === 'specific_category_buyers' && (!segmentOptions.categoryIds || segmentOptions.categoryIds.length === 0)) {
        newErrors.categoryIds = 'Select at least one category';
        isValid = false;
      } else if (segmentType === 'custom_list' && !segmentOptions.customListFile) {
        newErrors.customListFile = 'Please upload a file with user emails';
        isValid = false;
      }
    } else if (activeStep === 1) {
      // Validate voucher config
      if (!voucherConfig.prefix.trim()) {
        newErrors.prefix = 'Voucher code prefix is required';
        isValid = false;
      } else if (!/^[A-Z0-9_-]+$/.test(voucherConfig.prefix)) {
        newErrors.prefix = 'Prefix can only contain uppercase letters, numbers, dashes and underscores';
        isValid = false;
      }
      
      if (!voucherConfig.value) {
        newErrors.value = 'Value is required';
        isValid = false;
      } else if (isNaN(Number(voucherConfig.value)) || Number(voucherConfig.value) <= 0) {
        newErrors.value = 'Value must be a positive number';
        isValid = false;
      } else if (voucherConfig.type === 'percentage' && Number(voucherConfig.value) > 100) {
        newErrors.value = 'Percentage cannot exceed 100%';
        isValid = false;
      }
      
      if (voucherConfig.min_spend && (isNaN(Number(voucherConfig.min_spend)) || Number(voucherConfig.min_spend) < 0)) {
        newErrors.min_spend = 'Minimum spend must be a non-negative number';
        isValid = false;
      }
      
      if (voucherConfig.max_usage_per_user && (isNaN(Number(voucherConfig.max_usage_per_user)) || Number(voucherConfig.max_usage_per_user) <= 0)) {
        newErrors.max_usage_per_user = 'Maximum usage per user must be a positive number';
        isValid = false;
      }
      
      if (voucherConfig.max_total_usage && (isNaN(Number(voucherConfig.max_total_usage)) || Number(voucherConfig.max_total_usage) <= 0)) {
        newErrors.max_total_usage = 'Maximum total usage must be a positive number';
        isValid = false;
      }
    } else if (activeStep === 2) {
      // Validate distribution options
      if (distributionConfig.method === 'email') {
        if (!distributionConfig.emailTemplate) {
          newErrors.emailTemplate = 'Please select an email template';
          isValid = false;
        }
        
        if (!distributionConfig.emailSubject.trim()) {
          newErrors.emailSubject = 'Email subject is required';
          isValid = false;
        }
      }
      
      if (distributionConfig.scheduleDelivery && !distributionConfig.deliveryDate) {
        newErrors.deliveryDate = 'Please select a delivery date';
        isValid = false;
      }
    }
    
    setStepErrors((prev) => ({
      ...prev,
      [activeStep]: newErrors
    }));
    
    return isValid;
  };

  const handleUserSegmentChange = (type: string) => {
    setSegmentType(type);
  };

  const handleSegmentOptionsChange = (options: any) => {
    setSegmentOptions(options);
  };

  const handleLoadPreview = async () => {
    try {
      setPreviewLoading(true);
      setPreviewError(null);
      
      const response = await previewTargetedUsers({
        segment_type: segmentType,
        segment_options: segmentOptions
      });
      
      if (response.status === 'success') {
        setPreviewUsers(response.data.users || []);
        setTotalEligibleUsers(response.data.total_count || 0);
      } else {
        setPreviewError(response.message || 'Failed to load user preview');
      }
    } catch (error) {
      console.error('Error loading user preview:', error);
      setPreviewError('An unexpected error occurred. Please try again.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        segment_type: segmentType,
        segment_options: segmentOptions,
        voucher_config: {
          ...voucherConfig,
          value: Number(voucherConfig.value),
          min_spend: voucherConfig.min_spend ? Number(voucherConfig.min_spend) : 0,
          max_usage_per_user: Number(voucherConfig.max_usage_per_user),
          max_total_usage: voucherConfig.max_total_usage ? Number(voucherConfig.max_total_usage) : null,
          expires_at: voucherConfig.expires_at ? voucherConfig.expires_at.toISOString().split('T')[0] : null,
        },
        distribution: distributionConfig
      };
      
      const response = await createTargetedVoucherCampaign(payload);
      
      if (response.status === 'success') {
        setSuccess(true);
        
        // Reset form
        setActiveStep(0);
        setSegmentType('all_users');
        setSegmentOptions({
          newUserDays: 30,
          inactiveDays: 90,
          orderCount: 5,
          loyaltyPeriod: 90,
          minSpend: '50000',
          spendPeriod: 90,
          abandonedDays: 7,
          categoryIds: [],
          categoryPurchasePeriod: 90,
          birthdayMonth: new Date().getMonth() + 1
        });
        setVoucherConfig({
          prefix: '',
          type: 'percentage',
          value: '',
          min_spend: '',
          expires_at: null,
          max_usage_per_user: '1',
          max_total_usage: '',
          description: '',
          is_active: true
        });
        setDistributionConfig({
          method: 'email',
          emailTemplate: 'default_voucher',
          emailSubject: '',
          notifyUsers: true,
          scheduleDelivery: false,
          deliveryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
        });
        setPreviewUsers([]);
        setTotalEligibleUsers(0);
      } else {
        setError(response.message || 'Failed to create voucher campaign');
      }
    } catch (err) {
      console.error('Error creating voucher campaign:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <UserSegmentSelector
            segmentType={segmentType}
            onSegmentTypeChange={handleUserSegmentChange}
            segmentOptions={segmentOptions}
            onSegmentOptionsChange={handleSegmentOptionsChange}
            error={Object.values(stepErrors[0])[0]}
          />
        );
      case 1:
        return (
          <VoucherConfigForm
            config={voucherConfig}
            onChange={setVoucherConfig}
            errors={stepErrors[1]}
          />
        );
      case 2:
        return (
          <DistributionOptions
            config={distributionConfig}
            onChange={setDistributionConfig}
            errors={stepErrors[2]}
          />
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Campaign Summary</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary">Target Segment</Typography>
                    <Typography variant="body1" gutterBottom>
                      {segmentType.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary" mt={2}>Total Users</Typography>
                    <Typography variant="body1" gutterBottom>{totalEligibleUsers}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary">Voucher Value</Typography>
                    <Typography variant="body1" gutterBottom>
                      {voucherConfig.type === 'percentage' 
                        ? `${voucherConfig.value}% discount` 
                        : `₦${Number(voucherConfig.value).toLocaleString()} discount`
                      }
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary" mt={2}>Voucher Code Format</Typography>
                    <Typography variant="body1" gutterBottom>
                      {voucherConfig.prefix}-XXXXXXXX
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary">Distribution Method</Typography>
                    <Typography variant="body1" gutterBottom>
                      {distributionConfig.method === 'email' 
                        ? 'Email notification' 
                        : distributionConfig.method === 'sms' 
                          ? 'SMS notification'
                          : distributionConfig.method === 'in_app'
                            ? 'In-app notification'
                            : 'Manual distribution'
                      }
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary" mt={2}>Expiration</Typography>
                    <Typography variant="body1" gutterBottom>
                      {voucherConfig.expires_at 
                        ? new Date(voucherConfig.expires_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'No expiration'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <UserPreview
                loading={previewLoading}
                users={previewUsers}
                totalUsers={totalEligibleUsers}
                segmentType={segmentType}
                onPreviewUsers={handleLoadPreview}
                error={previewError || undefined}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Voucher campaign created successfully! Vouchers have been generated for {totalEligibleUsers} users.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent()}
      
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || previewLoading || totalEligibleUsers === 0}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TargetedVoucherForm;
