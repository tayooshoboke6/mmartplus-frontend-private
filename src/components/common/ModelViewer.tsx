import React, { useState } from 'react';
import styled from 'styled-components';

interface ModelViewerProps {
  frontView?: string;
  angleView?: string;
  animatedView?: string;
  modelUrl?: string;
  name: string;
  loading?: boolean;
}

// Styled components
const ViewerContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  aspect-ratio: 1/1;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const AnimatedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ViewerHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const ModelTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? '#fff' : '#f5f5f5'};
  border: none;
  border-bottom: ${props => props.active ? '2px solid #1976d2' : 'none'};
  flex: 1;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: ${props => props.active ? '500' : 'normal'};
  color: ${props => props.active ? '#1976d2' : '#666'};
  
  &:hover {
    background: ${props => props.active ? '#fff' : '#e9e9e9'};
  }
`;

const TabPanel = styled.div<{ active: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
  height: calc(100% - 40px); /* Subtract tabs height */
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #1976d2;
  animation: spin 1s ease-in-out infinite;
  margin: 40px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const NoModelMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 14px;
`;

/**
 * Component for viewing 3D models as rendered images
 */
const ModelViewer: React.FC<ModelViewerProps> = ({
  frontView,
  angleView,
  animatedView,
  name,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  // If any of the views is not provided, skip that tab
  const tabOptions = [
    { label: 'Front', view: frontView, index: 0 },
    { label: 'Angle', view: angleView, index: 1 },
    { label: 'Animated', view: animatedView, index: 2 },
  ].filter(tab => tab.view);

  return (
    <div style={{ width: '100%' }}>
      <ViewerHeader>
        <ModelTitle>{name} 3D Model</ModelTitle>
      </ViewerHeader>
      
      <ViewerContainer>
        {loading ? (
          <ImageContainer>
            <LoadingSpinner />
          </ImageContainer>
        ) : tabOptions.length > 0 ? (
          <React.Fragment>
            <TabsContainer>
              {tabOptions.map((tab) => (
                <TabButton 
                  key={tab.index} 
                  active={activeTab === tab.index}
                  onClick={() => handleTabChange(tab.index)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </TabsContainer>
            
            {tabOptions.map((tab, index) => (
              <TabPanel key={tab.index} active={activeTab === index}>
                <ImageContainer>
                  {tab.label === 'Animated' ? (
                    <AnimatedImage src={tab.view} alt={`${name} - ${tab.label} view`} />
                  ) : (
                    <StyledImage src={tab.view} alt={`${name} - ${tab.label} view`} />
                  )}
                </ImageContainer>
              </TabPanel>
            ))}
          </React.Fragment>
        ) : (
          <NoModelMessage>
            No 3D model views available
          </NoModelMessage>
        )}
      </ViewerContainer>
    </div>
  );
};

export default ModelViewer;
