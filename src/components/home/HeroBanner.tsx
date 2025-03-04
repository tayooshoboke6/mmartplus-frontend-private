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

// Default banners to show if API fails
const defaultBanners: Banner[] = [
  {
    id: 1,
    active: true,
    label: 'Monthly Promotion',
    title: 'SHOP & SAVE BIG',
    description: 'Get up to 30% off on all groceries and household essentials',
    image: '/banners/groceries-banner.png',
    bgColor: '#0066b2',
    imgBgColor: '#e0f2ff',
    link: '/promotions'
  },
  {
    id: 2,
    active: true,
    label: 'Flash Sale',
    title: 'FRESH PRODUCE DEALS',
    description: 'Limited time offer on fresh fruits and vegetables',
    image: '/banners/fresh-produce.png',
    bgColor: '#4CAF50',
    imgBgColor: '#e8f5e9',
    link: '/flash-sale'
  }
];

const HeroBanner: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch active banners from the service
    const fetchBanners = async () => {
      try {
        const activeBanners = await getActiveBanners();
        if (activeBanners && activeBanners.length > 0) {
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Default banners already set in initial state
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanners();
  }, []);
  
  const handleSlideChange = (index: number) => {
    setCurrentBanner(index);
  };
  
  // Don't render if there are no active banners or still loading
  if (loading || banners.length === 0) {
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
