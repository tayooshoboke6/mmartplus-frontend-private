import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProductSectionsWithProducts } from '../../services/ProductSectionService';
import { ProductSectionWithProducts } from '../../models/ProductSection';
import FeaturedProductsSlider from './FeaturedProductsSlider';

const SectionsContainer = styled.div`
  margin: 40px 0;
`;

// Default styling that matches the featured products section
const DEFAULT_BG_COLOR = '#f8f9fa';
const DEFAULT_TEXT_COLOR = '#333333';

const SectionWrapper = styled.div<{ backgroundColor?: string, textColor?: string }>`
  margin-bottom: 50px;
  padding: 30px;
  border-radius: 10px;
  background-color: ${props => props.backgroundColor || DEFAULT_BG_COLOR};
  color: ${props => props.textColor || DEFAULT_TEXT_COLOR};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 30px;
    border-radius: 8px;
  }
`;

const ProductSections: React.FC = () => {
  const [productSections, setProductSections] = useState<ProductSectionWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load product sections with their products
    const sections = getProductSectionsWithProducts();
    setProductSections(sections);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <div style={{ color: '#0071BC', fontSize: '16px' }}>Loading product sections...</div>
      </div>
    );
  }

  if (productSections.length === 0) {
    return null;
  }

  return (
    <SectionsContainer>
      {productSections.map(section => (
        <SectionWrapper 
          key={section.id}
          backgroundColor={section.backgroundColor}
          textColor={section.textColor}
        >
          <FeaturedProductsSlider 
            products={section.products}
            title={section.title}
          />
        </SectionWrapper>
      ))}
    </SectionsContainer>
  );
};

export default ProductSections;
