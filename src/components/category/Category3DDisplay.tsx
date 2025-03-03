import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from '../common/ModelViewer';

interface Category3DDisplayProps {
  categoryName: string;
  frontView?: string;
  angleView?: string;
  animatedView?: string;
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

const ToggleButton = styled.button`
  margin-bottom: 16px;
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  background-color: ${props => props.variant === 'outlined' ? 'transparent' : '#1976d2'};
  color: ${props => props.variant === 'outlined' ? '#1976d2' : 'white'};
  border: 1px solid #1976d2;

  &:hover {
    background-color: ${props => props.variant === 'outlined' ? 'rgba(25, 118, 210, 0.1)' : '#115293'};
  }

  svg {
    margin-right: 8px;
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
  categoryName,
  frontView,
  angleView,
  animatedView
}) => {
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no model views are available, don't render anything
  if (!frontView && !angleView && !animatedView) {
    return null;
  }

  const hasModel = frontView || angleView || animatedView;

  const handleToggle = () => {
    setLoading(true);
    setShowModel(!showModel);
    // Simulate loading time for better UX
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <ModelContainer>
      {!showModel ? (
        <ToggleButton onClick={handleToggle}>
          View 3D Model
        </ToggleButton>
      ) : (
        <>
          <ToggleButton variant="outlined" onClick={handleToggle}>
            Hide 3D Model
          </ToggleButton>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ViewerBox>
              <ModelViewer
                frontView={frontView}
                angleView={angleView}
                animatedView={animatedView}
                name={categoryName}
              />
            </ViewerBox>
          )}
        </>
      )}
    </ModelContainer>
  );
};

export default Category3DDisplay;
