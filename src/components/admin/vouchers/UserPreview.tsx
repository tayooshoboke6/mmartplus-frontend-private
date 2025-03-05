import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TablePagination,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
  orders_count: number;
  total_spent: number;
  last_order_date: string | null;
  created_at: string;
}

interface UserPreviewProps {
  loading: boolean;
  users: User[];
  totalUsers: number;
  segmentType: string;
  onPreviewUsers: () => void;
  error?: string;
}

const UserPreview: React.FC<UserPreviewProps> = ({
  loading,
  users,
  totalUsers,
  segmentType,
  onPreviewUsers,
  error
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSegmentDescription = () => {
    switch (segmentType) {
      case 'all_users':
        return 'All registered users';
      case 'new_users':
        return 'Recently registered users';
      case 'inactive_users':
        return 'Users who haven\'t placed an order recently';
      case 'loyal_customers':
        return 'Users who have placed multiple orders';
      case 'big_spenders':
        return 'Users who have spent significant amounts';
      case 'abandoned_cart':
        return 'Users with abandoned shopping carts';
      case 'specific_category_buyers':
        return 'Users who have purchased from specific categories';
      case 'birthday_month':
        return 'Users with birthdays in the selected month';
      case 'custom_list':
        return 'Manually selected users';
      default:
        return 'Selected user segment';
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Target User Preview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Segment: <Chip label={getSegmentDescription()} size="small" />
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Total eligible users: {loading ? '...' : totalUsers}
            </Typography>
          </Box>
          
          <Button 
            variant="outlined" 
            onClick={onPreviewUsers} 
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading Preview
              </>
            ) : (
              'Refresh Preview'
            )}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {users.length > 0 && (
          <>
            <Box mb={2}>
              <TextField
                placeholder="Search users..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Total Spent</TableCell>
                    <TableCell align="right">Last Order</TableCell>
                    <TableCell align="right">Registered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          No users match your search
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell align="right">{user.orders_count}</TableCell>
                          <TableCell align="right">{formatCurrency(user.total_spent)}</TableCell>
                          <TableCell align="right">{formatDate(user.last_order_date)}</TableCell>
                          <TableCell align="right">{formatDate(user.created_at)}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        
        {!loading && users.length === 0 && !error && (
          <Box textAlign="center" py={3}>
            <Typography variant="body1" color="textSecondary">
              Click "Refresh Preview" to see eligible users based on your criteria
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPreview;
