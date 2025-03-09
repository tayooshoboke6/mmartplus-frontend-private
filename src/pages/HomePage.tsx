import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import CategorySection from '../components/home/CategorySection';
import FeaturedProductsSlider from '../components/home/FeaturedProductsSlider';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  padding-top: 120px; /* Add padding to accommodate fixed header */
  
  @media (max-width: 768px) {
    padding-top: 110px;
  }
  
  @media (max-width: 480px) {
    padding-top: 100px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 0 15px;
  }
  
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
  const handleAddToCart = (productId: number) => {
    console.log(`Adding product ${productId} to cart`);
    // Implement cart functionality here
  };

  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <HeroBanner />
        
        <SectionTitle>Shop by Category</SectionTitle>
        <CategorySection />
        
        <SectionTitle>Featured Products</SectionTitle>
        <FeaturedProductsSlider title="" onAddToCart={handleAddToCart} />
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default HomePage;
