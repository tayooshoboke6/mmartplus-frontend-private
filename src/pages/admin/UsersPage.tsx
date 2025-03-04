import React, { useState } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text, Button, Tooltip } from '../../styles/GlobalComponents';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 250px;
  flex-grow: 1;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  th, td {
    padding: 15px 20px;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 500;
  }
  
  tr {
    border-bottom: 1px solid #eee;
  }
  
  tr:last-child {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
`;

const UserAvatar = styled.div<{ bg?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.bg || '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch(props.role) {
      case 'admin':
        return 'background-color: #e3f2fd; color: #1565c0;';
      case 'store-manager':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case 'inventory-manager':
        return 'background-color: #fff8e1; color: #f57f17;';
      case 'cashier':
        return 'background-color: #f3e5f5; color: #7b1fa2;';
      case 'delivery-staff':
        return 'background-color: #e0f7fa; color: #0097a7;';
      case 'customer':
      default:
        return 'background-color: #f5f5f5; color: #757575;';
    }
  }}
`;

const ActivityBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 6px;
  
  ${props => {
    switch(props.type) {
      case 'high':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case 'medium':
        return 'background-color: #fff8e1; color: #f57f17;';
      case 'low':
        return 'background-color: #f5f5f5; color: #757575;';
      default:
        return 'background-color: #f5f5f5; color: #757575;';
    }
  }}
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #0066b2;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    text-decoration: underline;
  }
  
  &.delete {
    color: #dc3545;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? '#0066b2' : '#ddd'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#0066b2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0066b2' : '#f1f1f1'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Mock Users Data
const MOCK_USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-15',
    location: 'Lagos, Nigeria',
    lastActive: '2025-03-02',
    activityLevel: 'high',
    orderCount: 0
  },
  {
    id: 2,
    name: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    avatar: null,
    role: 'store-manager',
    status: 'active',
    createdAt: '2025-01-20',
    location: 'Abuja, Nigeria',
    lastActive: '2025-03-01',
    activityLevel: 'high',
    orderCount: 0
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: null,
    role: 'inventory-manager',
    status: 'active',
    createdAt: '2025-01-25',
    location: 'Lagos, Nigeria',
    lastActive: '2025-03-01',
    activityLevel: 'high',
    orderCount: 0
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: null,
    role: 'customer',
    status: 'active',
    createdAt: '2025-02-01',
    location: 'Port Harcourt, Nigeria',
    lastActive: '2025-03-02',
    activityLevel: 'high',
    orderCount: 12
  },
  {
    id: 5,
    name: 'David Clark',
    email: 'david.clark@example.com',
    avatar: null,
    role: 'customer',
    status: 'inactive',
    createdAt: '2025-02-05',
    location: 'Lagos, Nigeria',
    lastActive: '2025-02-15',
    activityLevel: 'low',
    orderCount: 2
  },
  {
    id: 6,
    name: 'Lisa Johnson',
    email: 'lisa.johnson@example.com',
    avatar: null,
    role: 'cashier',
    status: 'active',
    createdAt: '2025-02-10',
    location: 'Lagos, Nigeria',
    lastActive: '2025-03-02',
    activityLevel: 'medium',
    orderCount: 0
  },
  {
    id: 7,
    name: 'Robert Smith',
    email: 'robert.smith@example.com',
    avatar: null,
    role: 'delivery-staff',
    status: 'active',
    createdAt: '2025-02-15',
    location: 'Lagos, Nigeria',
    lastActive: '2025-03-02',
    activityLevel: 'high',
    orderCount: 0
  },
  {
    id: 8,
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    avatar: null,
    role: 'customer',
    status: 'active',
    createdAt: '2025-02-20',
    location: 'Ibadan, Nigeria',
    lastActive: '2025-03-01',
    activityLevel: 'medium',
    orderCount: 5
  },
  {
    id: 9,
    name: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    avatar: null,
    role: 'customer',
    status: 'active',
    createdAt: '2025-02-22',
    location: 'Lagos, Nigeria',
    lastActive: '2025-02-28',
    activityLevel: 'medium',
    orderCount: 8
  },
  {
    id: 10,
    name: 'Jennifer Davis',
    email: 'jennifer.davis@example.com',
    avatar: null,
    role: 'inventory-manager',
    status: 'active',
    createdAt: '2025-02-25',
    location: 'Abuja, Nigeria',
    lastActive: '2025-03-02',
    activityLevel: 'high',
    orderCount: 0
  }
];

// Generate Avatar Background Color based on user's name
const getAvatarBg = (name: string) => {
  const colors = ['#1abc9c', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c', '#2ecc71', '#1f3a93', '#96281b', '#674172'];
  const firstChar = name.charAt(0).toUpperCase();
  const charCode = firstChar.charCodeAt(0);
  return colors[charCode % colors.length];
};

// Get initials from full name
const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleEditUser = (userId: number) => {
    // In a real app, this would navigate to edit user form
    console.log(`Edit user with ID: ${userId}`);
  };
  
  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, this would call an API to delete the user
      console.log(`Delete user with ID: ${userId}`);
    }
  };
  
  // Filter users based on search query, role, status, and activity
  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || user.status === statusFilter;
    const matchesActivity = activityFilter === '' || user.activityLevel === activityFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesActivity;
  });
  
  return (
    <AdminLayout title="Users">
      <PageContainer>
        <FlexBox justify="space-between" align="center">
          <Text size="xl" weight="bold">Manage Users</Text>
          <Tooltip 
            content="Create a new user account"
            position="left"
          >
            <Button variant="primary" onClick={() => console.log('Add user clicked')}>
              Add New User
            </Button>
          </Tooltip>
        </FlexBox>
        
        <FiltersContainer>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tooltip 
              content="Search by name or email (case-insensitive)"
              position="bottom"
            >
              <SearchInput 
                type="text" 
                placeholder="Search users by name or email..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </Tooltip>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Tooltip 
              content="Filter users by their system role and permissions"
              position="bottom"
            >
              <FilterSelect 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="store-manager">Store Manager</option>
                <option value="inventory-manager">Inventory Manager</option>
                <option value="cashier">Cashier</option>
                <option value="delivery-staff">Delivery Staff</option>
                <option value="customer">Customer</option>
              </FilterSelect>
            </Tooltip>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Tooltip 
              content="Filter by account status (active or inactive)"
              position="bottom"
            >
              <FilterSelect 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </FilterSelect>
            </Tooltip>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Tooltip 
              content="Filter by how frequently users engage with the system"
              position="bottom"
            >
              <FilterSelect 
                value={activityFilter} 
                onChange={(e) => setActivityFilter(e.target.value)}
              >
                <option value="">All Activity Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </FilterSelect>
            </Tooltip>
          </div>
        </FiltersContainer>
        
        <Text size="md">Showing {filteredUsers.length} users</Text>
        
        <UsersTable>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <UserAvatar bg={getAvatarBg(user.name)}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      getInitials(user.name)
                    )}
                  </UserAvatar>
                </td>
                <td>
                  {user.name}
                  {user.role === 'customer' && 
                    <span style={{ fontSize: '12px', color: '#666', display: 'block', marginTop: '3px' }}>
                      {user.orderCount} orders
                    </span>
                  }
                </td>
                <td>{user.email}</td>
                <td>
                  <RoleBadge role={user.role}>
                    {user.role.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </RoleBadge>
                  <ActivityBadge type={user.activityLevel}>
                    {user.activityLevel.charAt(0).toUpperCase() + user.activityLevel.slice(1)}
                  </ActivityBadge>
                </td>
                <td>{user.location}</td>
                <td>
                  <span style={{ 
                    color: user.status === 'active' ? '#2e7d32' : '#b71c1c',
                    fontWeight: 500 
                  }}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td>{user.lastActive}</td>
                <td>
                  <ActionButton onClick={() => handleEditUser(user.id)}>
                    Edit
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </UsersTable>
        
        <Pagination>
          <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
            &lt;
          </PageButton>
          
          {[1, 2, 3].map(page => (
            <PageButton 
              key={page} 
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton onClick={() => setCurrentPage(prev => prev + 1)}>
            &gt;
          </PageButton>
        </Pagination>
      </PageContainer>
    </AdminLayout>
  );
};

export default UsersPage;
