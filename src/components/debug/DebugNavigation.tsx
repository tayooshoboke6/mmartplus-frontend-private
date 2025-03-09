import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DebugNavContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const DebugButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #555;
  }
`;

const DebugMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 60px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  padding: 10px 0;
  width: 200px;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const DebugMenuItem = styled(Link)`
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DebugNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <DebugNavContainer>
      <DebugButton onClick={toggleMenu} title="Debug Tools">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </DebugButton>
      
      <DebugMenu isOpen={isOpen}>
        <DebugMenuItem to="/debug/category-api">Category API Debug</DebugMenuItem>
        <DebugMenuItem to="/debug/product-api">Product API Debug</DebugMenuItem>
        <DebugMenuItem to="/debug/login-api">Login API Debug</DebugMenuItem>
        <DebugMenuItem to="/debug/signup-api">Signup API Debug</DebugMenuItem>
      </DebugMenu>
    </DebugNavContainer>
  );
};

export default DebugNavigation;
