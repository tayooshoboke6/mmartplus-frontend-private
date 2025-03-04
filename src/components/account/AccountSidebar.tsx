import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUser, 
  FaShoppingBag, 
  FaEnvelope,
  FaStar, 
  FaTicketAlt, 
  FaHeart, 
  FaEye,
  FaWallet 
} from 'react-icons/fa';

const SidebarContainer = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  width: 100%;
  height: auto;
  max-height: fit-content;
  display: flex;
  flex-direction: column;
`;

const UserInfo = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  background-color: #0071BC;
  color: white;
`;

const UserIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #0071BC;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 0;
`;

const MenuItem = styled.li<{ active: boolean }>`
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }

  a {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: ${props => props.active ? 'white' : '#333'};
    background-color: ${props => props.active ? '#0071BC' : 'transparent'};
    text-decoration: none;
    font-weight: ${props => props.active ? '600' : 'normal'};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${props => props.active ? '#0071BC' : '#f5f9ff'};
      color: ${props => props.active ? 'white' : '#0071BC'};
    }

    svg {
      margin-right: 10px;
      color: ${props => props.active ? 'white' : '#0071BC'};
    }
  }
`;

const AccountSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: '/account', label: 'My Profile', icon: <FaUser size={18} /> },
    { path: '/account/orders', label: 'Orders', icon: <FaShoppingBag size={18} /> },
    { path: '/account/inbox', label: 'Inbox', icon: <FaEnvelope size={18} /> },
    { path: '/account/reviews', label: 'Pending Reviews', icon: <FaStar size={18} /> },
    { path: '/account/vouchers', label: 'Vouchers', icon: <FaTicketAlt size={18} /> },
    { path: '/account/wishlist', label: 'Wishlist', icon: <FaHeart size={18} /> },
    { path: '/account/recently-viewed', label: 'Recently Viewed', icon: <FaEye size={18} /> },
    { path: '/account/wallet', label: 'Wallet', icon: <FaWallet size={18} /> }
  ];

  // Determine if a menu item is active, considering parent paths for nested routes
  const isActive = (path: string): boolean => {
    if (path === '/account' && currentPath === '/account') {
      return true;
    }
    
    if (path !== '/account' && currentPath.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <SidebarContainer>
      <UserInfo>
        <UserIcon>
          <FaUser size={16} />
        </UserIcon>
        <span>My M-Mart+ Account</span>
      </UserInfo>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem 
            key={item.path} 
            active={isActive(item.path)}
          >
            <Link to={item.path}>
              {item.icon}
              {item.label}
            </Link>
          </MenuItem>
        ))}
      </MenuList>
    </SidebarContainer>
  );
};

export default AccountSidebar;
