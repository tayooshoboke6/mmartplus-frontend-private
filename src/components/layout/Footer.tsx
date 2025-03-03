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
  display: flex;
  flex-direction: row;
  align-items: center;
  
  img {
    height: 30px;
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
        <img src="https://shop.mmartplus.com/images/white-logo.png" alt="M-Mart+" style={{ width: '120px', height: 'auto' }} />
      </TopSection>
      
      <MainContent>
        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <img src="https://shop.mmartplus.com/images/phone.png" alt="Phone" width="18" height="18" style={{ marginRight: '8px' }} />
              <span>+2348146628019</span>
            </ContactItem>
            <ContactItem>
              <img src="https://shop.mmartplus.com/images/email.png" alt="Email" width="18" height="18" style={{ marginRight: '8px' }} />
              <span>info@mmartplus.com</span>
            </ContactItem>
            <ContactItem>
              <img src="https://shop.mmartplus.com/images/location.png" alt="Location" width="18" height="18" style={{ marginRight: '8px' }} />
              <span>Plot 1407G Shalom Road, Amuwo Odofin, Lagos, Nigeria</span>
            </ContactItem>
          </ContactInfo>
        </Section>
        
        <Section>
          <SectionTitle>Payment method</SectionTitle>
          <PaymentMethods>
            <img src="https://shop.mmartplus.com/images/visa.png" alt="Visa" style={{ height: '30px', marginRight: '10px' }} />
            <img src="https://shop.mmartplus.com/images/master.png" alt="Mastercard" style={{ height: '30px', marginRight: '10px' }} />
            <img src="https://shop.mmartplus.com/images/book.png" alt="Verve" style={{ height: '30px' }} />
          </PaymentMethods>
        </Section>
        
        <Section>
          <SectionTitle>Download App</SectionTitle>
          <AppDownload>
            <img src="https://shop.mmartplus.com/images/playstore.png" alt="Get it on Google Play" style={{ height: '40px', marginRight: '10px', marginBottom: '10px' }} />
            <img src="https://shop.mmartplus.com/images/appstore.png" alt="Download on the App Store" style={{ height: '40px', marginBottom: '10px' }} />
          </AppDownload>
          
          <SectionTitle style={{ marginTop: '20px' }}>Our Socials</SectionTitle>
          <SocialIcons>
            <a href="#" aria-label="Facebook">
              <img src="https://shop.mmartplus.com/images/fbook.png" alt="Facebook" width="24" height="24" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src="https://shop.mmartplus.com/images/twitter.png" alt="Twitter" width="24" height="24" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src="https://shop.mmartplus.com/images/instagram.png" alt="Instagram" width="24" height="24" />
            </a>
            <a href="#" aria-label="TikTok">
              <img src="https://shop.mmartplus.com/images/tiktok.png" alt="TikTok" width="24" height="24" />
            </a>
            <a href="#" aria-label="YouTube">
              <img src="https://shop.mmartplus.com/images/youtube.png" alt="YouTube" width="24" height="24" />
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
