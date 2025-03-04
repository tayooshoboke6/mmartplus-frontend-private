import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationBar } from '../../services/PromotionService';
import { NotificationBar } from '../../models/Promotion';

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

const TopBanner = styled.div`
  background-color: #e25822;
  color: white;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  
  a {
    color: white;
    text-decoration: underline;
    margin-left: 5px;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const HeaderContainer = styled.header`
  background-color: #0066b2;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #ffd700;
  text-decoration: none;
  
  span {
    margin-left: 5px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const SearchBar = styled.div`
  flex-grow: 1;
  margin: 0 20px;
  position: relative;
  max-width: 600px;
  
  input {
    width: 100%;
    padding: 10px 15px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
  }
  
  button {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #0066b2;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    margin: 0 10px;
  }
  
  @media (max-width: 640px) {
    order: 3;
    margin: 10px 0 0;
    width: 100%;
    max-width: 100%;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 640px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  
  span {
    margin-left: 5px;
  }
  
  @media (max-width: 640px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

const CartButton = styled(Link)`
  position: relative;
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  
  span {
    margin-left: 5px;
  }
  
  @media (max-width: 640px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

const CartCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ffd700;
  color: #0066b2;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const UserMenu = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 10px 0;
  min-width: 180px;
  z-index: 10;
  display: ${props => props.$visible ? 'block' : 'none'};
`;

const UserMenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 15px;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationBar, setNotificationBar] = useState<NotificationBar | null>(null);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  useEffect(() => {
    const notification = getNotificationBar();
    setNotificationBar(notification);
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <HeaderWrapper>
      {notificationBar && notificationBar.active && (
        <TopBanner style={{ backgroundColor: notificationBar.bgColor }}>
          {notificationBar.message}
          <Link to={notificationBar.linkUrl}>{notificationBar.linkText}</Link>
        </TopBanner>
      )}
      <HeaderContainer>
        <Logo to="/">
          <img src="https://shop.mmartplus.com/images/white-logo.png" alt="M-Mart+ Logo" width="120" height="auto" />
        </Logo>
        
        <SearchBar>
          <input 
            type="text" 
            placeholder="Search Products, Brands and Categories" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </button>
        </SearchBar>
        
        <HeaderActions>
          <div style={{ position: 'relative' }}>
            <ActionButton onClick={handleAccountClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
              <span>{isAuthenticated ? user?.first_name || 'Account' : 'Login'}</span>
            </ActionButton>
            
            {isAuthenticated && (
              <UserMenu $visible={showUserMenu}>
                <UserMenuItem onClick={() => { setShowUserMenu(false); navigate('/account'); }}>
                  My Profile
                </UserMenuItem>
                <UserMenuItem onClick={() => { setShowUserMenu(false); navigate('/account/orders'); }}>
                  My Orders
                </UserMenuItem>
                {user?.email === 'admin@mmartplus.com' && (
                  <UserMenuItem onClick={() => { setShowUserMenu(false); navigate('/admin'); }}>
                    Admin Dashboard
                  </UserMenuItem>
                )}
                <UserMenuItem onClick={handleLogout}>
                  Logout
                </UserMenuItem>
              </UserMenu>
            )}
          </div>
          
          <ActionButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
            </svg>
            <span>Help</span>
          </ActionButton>
          
          <CartButton to="/cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            <span>My Items</span>
            {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
          </CartButton>
        </HeaderActions>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
