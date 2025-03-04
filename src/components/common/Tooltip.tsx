import React, { useState } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const TooltipIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 14px;
  background-color: #0071BC;
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  margin-left: 6px;
  cursor: help;
`;

interface TooltipContentProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  visible: boolean;
}

const TooltipContent = styled.div<TooltipContentProps>`
  position: absolute;
  background-color: #333;
  color: white;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.3;
  z-index: 100;
  white-space: normal;
  max-width: 320px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  
  ${(props) => {
    switch (props.position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          
          &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
          }
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(8px);
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent #333 transparent transparent;
          }
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          
          &::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent #333 transparent;
          }
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-8px);
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 100%;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent transparent #333;
          }
        `;
      default:
        return '';
    }
  }}
`;

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  position = 'top', 
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer>
      {children}
      <TooltipIcon
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        i
      </TooltipIcon>
      <TooltipContent position={position} visible={isVisible}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export { Tooltip };
export default Tooltip;
