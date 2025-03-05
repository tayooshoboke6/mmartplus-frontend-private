import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { FaArrowLeft } from 'react-icons/fa';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  backLink?: string;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (min-width: 768px) {
    padding: 30px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SidebarWrapper = styled.div`
  width: 100%;
  
  @media (min-width: 768px) {
    width: 250px;
    flex-shrink: 0;
    align-self: flex-start;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 20px;
  position: relative;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #0071BC;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  margin-right: 15px;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AccountLayout: React.FC<AccountLayoutProps> = ({ 
  children, 
  title, 
  icon, 
  backLink 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <>
      <Header />
      <LayoutContainer>
        <ContentWrapper>
          <SidebarWrapper>
            <AccountSidebar />
          </SidebarWrapper>
          
          <MainContent>
            <PageHeader>
              {backLink !== undefined && (
                <BackButton onClick={handleBack}>
                  <FaArrowLeft size={12} />
                  Back
                </BackButton>
              )}
              <PageTitle>
                {icon && <span>{icon}</span>}
                {title}
              </PageTitle>
            </PageHeader>
            
            {children}
          </MainContent>
        </ContentWrapper>
      </LayoutContainer>
      <Footer />
    </>
  );
};

export default AccountLayout;
