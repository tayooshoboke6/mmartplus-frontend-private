import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaShoppingBag, 
  FaHeart, 
  FaEdit,
  FaCreditCard,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import AccountSidebar from '../../components/account/AccountSidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AvatarSelector from '../../components/account/AvatarSelector';
import EmailVerificationStatus from '../../components/account/EmailVerificationStatus';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AccountContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const ContentHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  svg {
    margin-right: 10px;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const AccountDetails = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const EditButton = styled.button`
  background-color: transparent;
  color: #0066cc;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  position: relative;
  cursor: pointer;
`;

const ChangeAvatarOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  padding: 3px 0;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${ProfileImage}:hover & {
    opacity: 1;
  }
`;

const ProfileText = styled.div``;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ProfileEmail = styled.div`
  color: #666;
`;

const QuickLinks = styled.div`
  margin-top: 20px;
`;

const LinksList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const QuickLink = styled.button`
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f7ff;
    border-color: #b3d7ff;
  }
  
  svg {
    margin-right: 8px;
    color: #0066cc;
  }
`;

const AddressBook = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const AddressCard = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
`;

const AddressLabel = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const AddressText = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const EmptyAddress = styled.div`
  color: #666;
  font-style: italic;
  margin: 10px 0;
`;

const AddAddressButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #0055b3;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const AccountPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const goToPage = (path: string) => {
    navigate(path);
  };
  
  const handleSaveAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profile_picture: avatarUrl };
      updateUser(updatedUser);
      setShowAvatarSelector(false);
    }
  };
  
  const getDefaultAvatarUrl = () => {
    if (!user) return '';
    
    if (user.profile_picture) return user.profile_picture;
    
    const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
    const style = 'initials'; 
    return `https://api.dicebear.com/6.x/${style}/svg?seed=${user.email}&radius=50&backgroundColor=0066cc&textColor=fff&chars=2&size=256`;
  };
  
  return (
    <PageContainer>
      <title>My Account | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <AccountContent>
            <ContentHeader>
              <FaUser size={20} />
              <HeaderTitle>Account Overview</HeaderTitle>
            </ContentHeader>
            
            <OverviewContainer>
              <AccountDetails>
                <SectionHeader>
                  <SectionTitle>ACCOUNT INFORMATION</SectionTitle>
                  <EditButton>
                    <FaEdit size={14} />
                    Edit
                  </EditButton>
                </SectionHeader>
                
                <EmailVerificationStatus />
                
                <ProfileInfo onClick={() => setShowAvatarSelector(prev => !prev)}>
                  <ProfileImage>
                    <ChangeAvatarOverlay>
                      <span>Change</span>
                    </ChangeAvatarOverlay>
                    <img 
                      src={getDefaultAvatarUrl()} 
                      alt="Profile" 
                    />
                  </ProfileImage>
                  
                  <ProfileText>
                    <ProfileName>
                      {user?.first_name} {user?.last_name}
                    </ProfileName>
                    <ProfileEmail>{user?.email}</ProfileEmail>
                  </ProfileText>
                </ProfileInfo>
                
                {showAvatarSelector && (
                  <AvatarSelector 
                    currentAvatar={getDefaultAvatarUrl()}
                    onSave={handleSaveAvatar}
                    onCancel={() => setShowAvatarSelector(false)}
                  />
                )}
                
                <QuickLinks>
                  <SectionTitle>Quick Links</SectionTitle>
                  <LinksList>
                    <QuickLink onClick={() => goToPage('/account/orders')}>
                      <FaShoppingBag size={16} />
                      My Orders
                    </QuickLink>
                      
                    <QuickLink onClick={() => goToPage('/account/wishlist')}>
                      <FaHeart size={16} />
                      Wishlist
                    </QuickLink>
                      
                    <QuickLink onClick={() => goToPage('/account/wallet')}>
                      <FaCreditCard size={16} />
                      Wallet
                    </QuickLink>
                  </LinksList>
                </QuickLinks>
              </AccountDetails>
              
              <AddressBook>
                <SectionHeader>
                  <SectionTitle>ADDRESS BOOK</SectionTitle>
                  <EditButton>
                    <FaEdit size={14} />
                    Edit
                  </EditButton>
                </SectionHeader>
                
                <div>
                  <AddressLabel>Your default shipping address:</AddressLabel>
                  
                  {user ? (
                    <AddressCard>
                      <AddressText>
                        123 Main Street<br />
                        Ikeja<br />
                        Lagos State<br />
                        100001<br />
                        Nigeria<br />
                        Phone: {user.phone || 'Not provided'}
                      </AddressText>
                    </AddressCard>
                  ) : (
                    <EmptyAddress>
                      You haven't added any addresses yet.
                    </EmptyAddress>
                  )}
                  
                  <AddAddressButton>
                    <FaPlus size={14} />
                    Add New Address
                  </AddAddressButton>
                </div>
              </AddressBook>
            </OverviewContainer>
          </AccountContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default AccountPage;
