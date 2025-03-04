import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TouchSlider from '../common/TouchSlider';
import { Banner } from '../../models/Promotion';
import { getActiveBanners } from '../../services/PromotionService';

const BannerContent = styled.div`
  padding: 30px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    order: 2;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const BannerLabel = styled.div`
  background-color: #ffa500;
  color: white;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 15px;
  font-weight: bold;
  margin-bottom: 15px;
  width: fit-content;
  
  @media (max-width: 480px) {
    padding: 3px 10px;
    font-size: 12px;
  }
`;

const BannerTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 15px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin: 0 0 10px;
  }
`;

const BannerDescription = styled.p`
  font-size: 16px;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const BannerImage = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    height: auto;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    min-height: 200px;
    order: 1;
    width: 100%;
  }
`;

const BannerSlide = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: #0066b2;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  @media (max-width: 480px) {
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const HeroBanner: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  
  useEffect(() => {
    // Fetch active banners from the service
    setBanners(getActiveBanners());
  }, []);
  
  const handleSlideChange = (index: number) => {
    setCurrentBanner(index);
  };
  
  // Don't render if there are no active banners
  if (banners.length === 0) {
    return null;
  }
  
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '20px 0' }}>
      <TouchSlider 
        autoRotate={true}
        rotationInterval={5000}
        showDots={true}
        onSlideChange={handleSlideChange}
      >
        {banners.map((banner) => (
          <div key={banner.id} style={{ backgroundColor: banner.bgColor }}>
            <BannerSlide>
              <BannerContent>
                <BannerLabel>{banner.label}</BannerLabel>
                <BannerTitle>{banner.title}</BannerTitle>
                <BannerDescription>{banner.description}</BannerDescription>
                <ActionButton to={banner.link}>Learn More</ActionButton>
              </BannerContent>
              
              <BannerImage style={{ backgroundColor: banner.imgBgColor }}>
                <img src={banner.image} alt={banner.title} />
              </BannerImage>
            </BannerSlide>
          </div>
        ))}
      </TouchSlider>
    </div>
  );
};

export default HeroBanner;
