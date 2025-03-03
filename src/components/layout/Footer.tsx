import styled from 'styled-components';

// Main footer container
const FooterContainer = styled.footer`
  width: 100%;
  background-color: #ECEFF1; // Light blue-gray background
  color: #333;
`;

// Top section with blue background
const TopSection = styled.div`
  background-color: #0057A6; // Deep blue background
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    height: 30px;
    margin-left: 0;
  }
  
  @media (max-width: 768px) {
    padding: 8px 0;
    
    img {
      height: 24px;
      margin-left: 0;
    }
  }
`;

// Main content sections
const MainContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 15px;
    justify-content: flex-start;
  }
`;

// Each section in the footer
const Section = styled.div`
  margin-right: 20px;
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    min-width: 45%;
  }
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

// Section title styling
const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

// Contact information styling
const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Individual contact item with icon and text
const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  img, svg {
    width: 18px;
    height: 18px;
  }
`;

// Payment methods section
const PaymentMethods = styled.div`
  margin-top: 10px;
  
  img {
    height: 24px;
    margin-right: 10px;
  }
`;

// App download section
const AppDownload = styled.div`
  img {
    height: 36px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;

// Social media icons
const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
  
  a {
    color: #0057A6;
    
    &:hover {
      color: #003D7A;
    }
  }
  
  svg, img {
    width: 24px;
    height: 24px;
  }
`;

// Feedback button
const FeedbackButton = styled.button`
  background-color: #0057A6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: block;
  margin: 0 auto 20px;
  
  &:hover {
    background-color: #003D7A;
  }
`;

// Bottom links section
const BottomLinks = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #0057A6;
  color: white;
  font-size: 14px;
  
  a {
    color: white;
    text-decoration: none;
    margin-right: 15px;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 15px;
    
    div {
      width: 100%;
    }
  }
`;

// Copyright text
const Copyright = styled.div`
  @media (max-width: 768px) {
    order: 2;
  }
`;

// Legal links
const LegalLinks = styled.div`
  @media (max-width: 768px) {
    order: 1;
    margin-bottom: 10px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <TopSection>
        <img src="/mmart-plus-logo-white.png" alt="M-Mart+" />
      </TopSection>
      
      <MainContent>
        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18px" height="18px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>+2348146628019</span>
            </ContactItem>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18px" height="18px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
              </svg>
              <span>info@mmartplus.com</span>
            </ContactItem>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18px" height="18px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>Plot 1407G Shalom Road, Amuwo Odofin, Lagos, Nigeria</span>
            </ContactItem>
          </ContactInfo>
        </Section>
        
        <Section>
          <SectionTitle>Payment method</SectionTitle>
          <PaymentMethods>
            <img src="/visa-icon.png" alt="Visa" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/60x30?text=VISA'}} />
            <img src="/mastercard-icon.png" alt="Mastercard" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/60x30?text=MasterCard'}} />
            <img src="/verve-icon.png" alt="Verve" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/60x30?text=Verve'}} />
          </PaymentMethods>
        </Section>
        
        <Section>
          <SectionTitle>Download App</SectionTitle>
          <AppDownload>
            <img src="/google-play-badge.png" alt="Get it on Google Play" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/120x40?text=Google+Play'}} />
            <img src="/app-store-badge.png" alt="Download on the App Store" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/120x40?text=App+Store'}} />
          </AppDownload>
          
          <SectionTitle style={{ marginTop: '20px' }}>Our Socials</SectionTitle>
          <SocialIcons>
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
              </svg>
            </a>
            <a href="#" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </SocialIcons>
        </Section>
      </MainContent>
      
      <FeedbackButton>
        Give Us Feedback
      </FeedbackButton>
      
      <BottomLinks>
        <LegalLinks>
          <a href="#">Privacy</a>
          <a href="#">Terms and Condition</a>
          <a href="#">Refund Policy</a>
        </LegalLinks>
        <Copyright>
          2024 M-Mart Plus. All Rights Reserved
        </Copyright>
      </BottomLinks>
    </FooterContainer>
  );
};

export default Footer;
