import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import CategorySection from '../components/home/CategorySection';
import ProductSection from '../components/home/ProductSection';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 30px 0 20px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin: 25px 0 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin: 20px 0 10px;
  }
`;

const HomePage = () => {
  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <HeroBanner />
        
        <SectionTitle>Shop by Category</SectionTitle>
        <CategorySection />
        
        <SectionTitle>Featured Products</SectionTitle>
        <ProductSection />
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default HomePage;
