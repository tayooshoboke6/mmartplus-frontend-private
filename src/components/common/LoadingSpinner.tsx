import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size: string; color: string }>`
  display: inline-block;
  width: ${props => 
    props.size === 'sm' ? '20px' : 
    props.size === 'lg' ? '40px' : 
    '30px'
  };
  height: ${props => 
    props.size === 'sm' ? '20px' : 
    props.size === 'lg' ? '40px' : 
    '30px'
  };
  
  &:after {
    content: " ";
    display: block;
    width: ${props => 
      props.size === 'sm' ? '16px' : 
      props.size === 'lg' ? '32px' : 
      '24px'
    };
    height: ${props => 
      props.size === 'sm' ? '16px' : 
      props.size === 'lg' ? '32px' : 
      '24px'
    };
    margin: 2px;
    border-radius: 50%;
    border: ${props => 
      props.size === 'sm' ? '2px' : 
      props.size === 'lg' ? '4px' : 
      '3px'
    } solid ${props => props.color};
    border-color: ${props => props.color} transparent ${props => props.color} transparent;
    animation: ${spin} 1.2s linear infinite;
  }
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  color = '#0071BC'
}) => {
  return <SpinnerContainer size={size} color={color} />;
};

export default LoadingSpinner;
