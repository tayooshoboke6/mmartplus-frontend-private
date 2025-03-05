import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Search as SearchIcon,
  BarChart as BarChartIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { getVouchers, getVoucherStats } from '../../../services/VoucherService';
import { formatCurrency } from '../../../utils/formatters';

interface Voucher {
  id: number | string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_spend: number;
  expires_at: string | null;
  is_active: boolean;
  max_usage_per_user: number;
  total_usage: number;
  max_total_usage: number | null;
  description: string | null;
  qualification_type: 'manual' | 'automatic' | 'targeted';
  created_at: string;
}

interface VoucherStats {
  code: string;
  total_usage: number;
  max_total_usage: number | null;
  is_active: boolean;
  expires_at: string | null;
  total_discount_amount: number;
  unique_users: number;
  recent_usages: Array<{
    id: number;
    amount: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    created_at: string;
  }>;
}

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedVoucherStats, setSelectedVoucherStats] = useState<VoucherStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch vouchers on component mount
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const data = await getVouchers();
        setVouchers(data);
        setFilteredVouchers(data);
      } catch (err) {
        console.error('Error fetching vouchers:', err);
        setError('Failed to load vouchers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Filter vouchers when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVouchers(vouchers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = vouchers.filter(
        voucher => 
          voucher.code.toLowerCase().includes(term) ||
          (voucher.description && voucher.description.toLowerCase().includes(term))
      );
      setFilteredVouchers(filtered);
    }
  }, [searchTerm, vouchers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewStats = async (voucherId: number | string) => {
    try {
      setLoadingStats(true);
      const stats = await getVoucherStats(Number(voucherId));
      if (stats.status === 'success') {
        setSelectedVoucherStats(stats.data);
        setStatsDialogOpen(true);
      } else {
        setError('Failed to load voucher statistics.');
      }
    } catch (err) {
      console.error('Error fetching voucher stats:', err);
      setError('Failed to load voucher statistics.');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleCloseStatsDialog = () => {
    setStatsDialogOpen(false);
    setSelectedVoucherStats(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="h2">
          All Vouchers ({vouchers.length})
        </Typography>
        <TextField
          placeholder="Search vouchers..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Min. Spend</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVouchers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {voucher.code}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {voucher.qualification_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {voucher.type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount'}
                  </TableCell>
                  <TableCell>
                    {voucher.type === 'percentage' 
                      ? `${voucher.value}%` 
                      : formatCurrency(voucher.value)
                    }
                  </TableCell>
                  <TableCell>
                    {voucher.min_spend > 0 ? formatCurrency(voucher.min_spend) : 'None'}
                  </TableCell>
                  <TableCell>
                    {voucher.total_usage} / {voucher.max_total_usage || '∞'}
                  </TableCell>
                  <TableCell>
                    {formatDate(voucher.expires_at)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={voucher.is_active ? 'Active' : 'Inactive'} 
                      color={voucher.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewStats(voucher.id)}
                      disabled={loadingStats}
                    >
                      <BarChartIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="secondary"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredVouchers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary" py={3}>
                    No vouchers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredVouchers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Voucher Stats Dialog */}
      <Dialog
        open={statsDialogOpen}
        onClose={handleCloseStatsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Voucher Statistics
          {selectedVoucherStats && (
            <Typography variant="h6" component="span">
              : {selectedVoucherStats.code}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {loadingStats ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : selectedVoucherStats ? (
            <Box>
              <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                <Paper sx={{ p: 2, flexGrow: 1, minWidth: '200px' }}>
                  <Typography variant="body2" color="textSecondary">Total Usages</Typography>
                  <Typography variant="h5">{selectedVoucherStats.total_usage}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flexGrow: 1, minWidth: '200px' }}>
                  <Typography variant="body2" color="textSecondary">Unique Users</Typography>
                  <Typography variant="h5">{selectedVoucherStats.unique_users}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flexGrow: 1, minWidth: '200px' }}>
                  <Typography variant="body2" color="textSecondary">Total Discount Amount</Typography>
                  <Typography variant="h5">{formatCurrency(selectedVoucherStats.total_discount_amount)}</Typography>
                </Paper>
              </Box>

              <Typography variant="h6" gutterBottom>Recent Usage</Typography>
              {selectedVoucherStats.recent_usages.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedVoucherStats.recent_usages.map((usage) => (
                        <TableRow key={usage.id}>
                          <TableCell>{usage.user.name}</TableCell>
                          <TableCell>{usage.user.email}</TableCell>
                          <TableCell>{formatCurrency(usage.amount)}</TableCell>
                          <TableCell>{formatDate(usage.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No recent usage data available
                </Typography>
              )}
            </Box>
          ) : (
            <Typography>No statistics available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherList;
