import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs, 
  Tab, 
  Paper, 
  Container
} from '@mui/material';
import AdminLayout from '../../components/layouts/AdminLayout';
import VoucherList from '../../components/admin/vouchers/VoucherList';
import CreateVoucherForm from '../../components/admin/vouchers/CreateVoucherForm';
import BulkVoucherGenerator from '../../components/admin/vouchers/BulkVoucherGenerator';
import TargetedVoucherForm from '../../components/admin/vouchers/TargetedVoucherForm';

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`voucher-tabpanel-${index}`}
      aria-labelledby={`voucher-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `voucher-tab-${index}`,
    'aria-controls': `voucher-tabpanel-${index}`,
  };
};

const VoucherManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <AdminLayout title="Voucher Management">
      <Container maxWidth="xl">
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="voucher management tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Vouchers" {...a11yProps(0)} />
              <Tab label="Create Voucher" {...a11yProps(1)} />
              <Tab label="Bulk Generator" {...a11yProps(2)} />
              <Tab label="Targeted Campaign" {...a11yProps(3)} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <VoucherList />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <CreateVoucherForm />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <BulkVoucherGenerator />
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <TargetedVoucherForm 
              // Add props here if needed
            />
          </TabPanel>
        </Paper>
      </Container>
    </AdminLayout>
  );
};

export default VoucherManagementPage;
