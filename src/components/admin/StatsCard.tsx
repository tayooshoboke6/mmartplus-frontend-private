import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const IconContainer = styled.div<{ color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: ${props => `${props.color}15`};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  color: #64748b;
  font-size: 14px;
  margin-bottom: 6px;
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card>
      <IconContainer color={color}>
        {icon}
      </IconContainer>
      <Content>
        <Title>{title}</Title>
        <Value>{value}</Value>
      </Content>
    </Card>
  );
};

export default StatsCard;
