import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import styled from 'styled-components';

interface SalesData {
  date: string;
  amount: number;
}

interface SalesChartProps {
  data: SalesData[];
}

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <p style={{ margin: 0 }}>{`Date: ${label}`}</p>
        <p style={{ margin: '5px 0 0 0', color: '#0071BC' }}>
          {`Amount: ₦${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <ChartContainer>
      <ChartTitle>Sales Overview</ChartTitle>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0071BC" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0071BC" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₦${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#0071BC"
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SalesChart;
