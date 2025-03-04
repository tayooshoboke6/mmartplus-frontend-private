import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { SectionContainer } from '../../styles/GlobalComponents';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #0066b2;
  color: #fff;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 60px;
    padding: 20px 0;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 10px 0;
    position: sticky;
    top: 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    color: #ffd700;
    margin: 0;
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 10px 20px;
    
    h2 {
      font-size: 0;
      
      &:before {
        content: 'M+';
        font-size: 1.5rem;
      }
    }
  }
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  @media (max-width: 480px) {
    display: flex;
    overflow-x: auto;
    padding: 0 10px;
    
    &::-webkit-scrollbar {
      height: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }
  }
`;

const MenuLabel = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.li<{ active?: boolean }>`
  a {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    color: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.7)'};
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid ${props => props.active ? '#ffd700' : 'transparent'};
    
    svg {
      margin-right: 10px;
      
      @media (max-width: 768px) {
        margin-right: 0;
      }
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
  }
  
  @media (max-width: 768px) {
    a {
      justify-content: center;
      padding: 12px;
    }
  }
  
  @media (max-width: 480px) {
    a {
      padding: 8px 12px;
      border-left: none;
      border-bottom: 3px solid ${props => props.active ? '#ffd700' : 'transparent'};
    }
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.header`
  background-color: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 12px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  
  @media (max-width: 480px) {
    margin-bottom: 10px;
    font-size: 1.3rem;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  return (
    <AdminContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>M-Mart+ Admin</h2>
        </SidebarHeader>
        
        <SidebarMenu>
          <MenuItem active={location.pathname === '/admin'}>
            <Link to="/admin">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
              <MenuLabel>Dashboard</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/products')}>
            <Link to="/admin/products">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z"/>
                <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
              </svg>
              <MenuLabel>Products</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/categories')}>
            <Link to="/admin/categories">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2h2v2H2V2Z"/>
                <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"/>
                <path d="M6 10v6H0v-6h6Zm5 1v4h-4V11h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1h2v-1Zm-4 0v-1H8v1h2Zm-4 0v-1H3v2h1v-1h2Zm-3 0v-1H0v2h2v-1h1Z"/>
              </svg>
              <MenuLabel>Categories</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/product-sections')}>
            <Link to="/admin/product-sections">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 10.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
              </svg>
              <MenuLabel>Product Sections</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/promotions')}>
            <Link to="/admin/promotions">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm6 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-6 0A.5.5 0 0 1 2.5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm9 1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-9 0A.5.5 0 0 1 2.5 5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm9 1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-9 0A.5.5 0 0 1 2.5 6h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm9 1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-9 0A.5.5 0 0 1 2.5 7h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm9 1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-9 0A.5.5 0 0 1 2.5 8h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm6.5 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-6.5 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/>
              </svg>
              <MenuLabel>Promotions</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/vouchers')}>
            <Link to="/admin/vouchers">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
              </svg>
              <MenuLabel>Vouchers</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/store-addresses')}>
            <Link to="/admin/store-addresses">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
              <MenuLabel>Store Addresses</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/orders')}>
            <Link to="/admin/orders">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <MenuLabel>Orders</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/users')}>
            <Link to="/admin/users">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
              </svg>
              <MenuLabel>Users</MenuLabel>
            </Link>
          </MenuItem>
          
          <MenuItem active={location.pathname.startsWith('/admin/settings')}>
            <Link to="/admin/settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.292-.16c.893-1.64-.902-3.433-2.541-2.54l-.159.292a.873.873 0 0 1-1.255-.52l-.319-.094zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 3.06 4.377l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 2.693l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
              </svg>
              <MenuLabel>Settings</MenuLabel>
            </Link>
          </MenuItem>
        </SidebarMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>{title}</PageTitle>
          <UserMenu>
            <Link to="/" style={{ marginRight: '15px', color: '#0066b2', textDecoration: 'none' }}>
              View Store
            </Link>
            <UserAvatar>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
            </UserAvatar>
          </UserMenu>
        </Header>
        
        <SectionContainer>
          {children}
        </SectionContainer>
      </Content>
    </AdminContainer>
  );
};

export default AdminLayout;
