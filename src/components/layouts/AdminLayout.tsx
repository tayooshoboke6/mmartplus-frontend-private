import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiUsers, FiSettings, FiBox, FiTag, FiLogOut, FiChevronDown, FiMap, FiPackage, FiMessageSquare, FiClipboard, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 250px;
  background-color: #0066b2; /* Blue theme color */
  color: #fff;
  transition: all 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: 260px;
    left: ${props => (props.isOpen ? '0' : '-260px')};
    box-shadow: ${props => (props.isOpen ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none')};
  }
`;

const MainContent = styled.div<{ isSidebarOpen: boolean }>`
  flex: 1;
  margin-left: 250px;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 16px;
  }
`;

const Logo = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  a {
    color: #ffd700; /* Yellow highlight color */
    font-weight: 700;
    font-size: 20px;
    text-decoration: none;
    display: flex;
    align-items: center;
    
    img {
      height: 32px;
      margin-right: 10px;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  display: none;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    color: #fff;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${props => (props.$active ? '#ffd700' : 'rgba(255, 255, 255, 0.7)')};
  text-decoration: none;
  transition: all 0.2s ease;
  background-color: ${props => (props.$active ? 'rgba(255, 255, 255, 0.05)' : 'transparent')};
  border-left: ${props => (props.$active ? '3px solid #ffd700' : '3px solid transparent')};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
  
  svg {
    margin-right: 12px;
    font-size: 18px;
  }
`;

const SubMenu = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  max-height: ${props => (props.isOpen ? '500px' : '0')};
  transition: max-height 0.3s ease;
  background-color: rgba(0, 0, 0, 0.1);
`;

const SubNavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 10px 20px 10px 52px;
  color: ${props => (props.$active ? '#ffd700' : 'rgba(255, 255, 255, 0.7)')};
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 14px;
  
  &:hover {
    color: #fff;
  }
`;

const NavHeader = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  width: 100%;
  background-color: ${props => (props.$active ? 'rgba(255, 255, 255, 0.05)' : 'transparent')};
  color: ${props => (props.$active ? '#ffd700' : 'rgba(255, 255, 255, 0.7)')};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: ${props => (props.$active ? '3px solid #ffd700' : '3px solid transparent')};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
  
  svg.icon {
    margin-right: 12px;
    font-size: 18px;
  }
  
  svg.arrow {
    transition: transform 0.3s ease;
    transform: ${props => (props.$active ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
  }
  
  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  border: none;
  background: none;
  color: #1e293b;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #0066b2;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066b2;
  font-weight: 600;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
  
  p {
    margin: 0;
    
    &.name {
      font-weight: 500;
      color: #fff;
    }
    
    &.role {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #fff;
  }
`;

const HightlightIndicator = styled.div<{ $active?: boolean }>`
  width: 3px;
  height: 100%;
  background-color: ${props => (props.$active ? '#ffd700' : 'transparent')};
  position: absolute;
  left: 0;
  top: 0;
  transition: background-color 0.2s ease;
`;

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Dashboard', description }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleSubMenu = (key: string) => {
    setExpandedMenus({
      ...expandedMenus,
      [key]: !expandedMenus[key]
    });
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isMenuActive = (basePath: string) => {
    return location.pathname.startsWith(basePath);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'A';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <Logo>
          <Link to="/admin">
            <span>M-Mart+ Admin</span>
          </Link>
          <CloseButton onClick={toggleSidebar}>
            <FiX />
          </CloseButton>
        </Logo>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/admin" $active={isActive('/admin')}>
              <FiHome />
              Dashboard
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/products" $active={isMenuActive('/admin/products')}>
              <FiBox />
              Products
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/categories" $active={isMenuActive('/admin/categories')}>
              <FiTag />
              Categories
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/product-sections" $active={isMenuActive('/admin/product-sections')}>
              <FiPackage />
              Product Sections
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/promotions" $active={isMenuActive('/admin/promotions')}>
              <FiTag />
              Promotions
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/vouchers" $active={isMenuActive('/admin/vouchers')}>
              <FiCreditCard />
              Vouchers
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/voucher-management" $active={isMenuActive('/admin/voucher-management')}>
              <FiClipboard />
              Voucher Management
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/message-campaigns" $active={isMenuActive('/admin/message-campaigns')}>
              <FiMessageSquare />
              Message Campaigns
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/store-addresses" $active={isMenuActive('/admin/store-addresses')}>
              <FiMap />
              Store Addresses
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/orders" $active={isMenuActive('/admin/orders')}>
              <FiShoppingBag />
              Orders
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/users" $active={isMenuActive('/admin/users')}>
              <FiUsers />
              Users
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/admin/settings" $active={isMenuActive('/admin/settings')}>
              <FiSettings />
              Settings
            </NavLink>
          </NavItem>
        </NavMenu>
        
        <UserProfile>
          <Avatar>{getUserInitials()}</Avatar>
          <UserInfo>
            <p className="name">{user?.name || 'Admin User'}</p>
            <p className="role">Administrator</p>
          </UserInfo>
          <LogoutButton onClick={handleLogout} title="Logout">
            <FiLogOut />
          </LogoutButton>
        </UserProfile>
      </Sidebar>
      
      <MainContent isSidebarOpen={isSidebarOpen}>
        <TopBar>
          <PageTitle>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </PageTitle>
          
          <MobileMenuButton onClick={toggleSidebar}>
            <FiMenu />
          </MobileMenuButton>
        </TopBar>
        
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
