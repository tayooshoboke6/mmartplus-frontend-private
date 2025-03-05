import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';

interface SalesData {
  date: string;
  amount: number;
}

interface SalesChartProps {
  data: SalesData[];
}

const ChartContainer = styled.div`
  width: 100%;
  height: 360px;
  
  @media (max-width: 768px) {
    height: 280px;
  }
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 14px;
`;

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
        <p className="text-sm font-medium text-gray-600">
          {format(parseISO(label), 'MMM d, yyyy')}
        </p>
        <p className="text-base font-semibold text-blue-600">
          ₦{payload[0].value.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data?.map(item => ({
    date: item.date,
    sales: item.amount
  })) || [];
  
  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <NoDataMessage>No sales data available for the selected period</NoDataMessage>
      </ChartContainer>
    );
  }
  
  // Format the date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d');
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `₦${value.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ strokeWidth: 2 }}
            name="Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SalesChart;
