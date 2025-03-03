import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from '../common/ModelViewer';

interface Category3DDisplayProps {
  frontView?: string;
  angleView?: string;
  animatedView?: string;
  modelUrl?: string;
  categoryName: string;
  themeColor?: string;
}

// Styled components
const ModelContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.color || '#0066b2'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    opacity: 0.9;
  }
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

const ViewerBox = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

/**
 * Component to display a 3D model for a category with a toggle option
 */
const Category3DDisplay: React.FC<Category3DDisplayProps> = ({
  frontView,
  angleView,
  animatedView,
  modelUrl,
  categoryName,
  themeColor
}) => {
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'front' | 'angle' | 'animated'>('front');

  // If no model views are available, don't render anything
  if (!frontView && !angleView && !animatedView) {
    return null;
  }

  const handleToggle = () => {
    setShowModel(!showModel);
  };

  return (
    <ModelContainer>
      {!showModel ? (
        <ViewButton onClick={handleToggle}>
          View 3D Model
        </ViewButton>
      ) : (
        <>
          <ViewButton color="#1976d2" onClick={handleToggle}>
            Hide 3D Model
          </ViewButton>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ViewerBox>
              {!loading ? (
                <ModelViewer
                  frontView={frontView}
                  angleView={angleView}
                  animatedView={animatedView}
                  modelUrl={modelUrl}
                  name={categoryName}
                />
              ) : null}
            </ViewerBox>
          )}
        </>
      )}
    </ModelContainer>
  );
};

export default Category3DDisplay;
