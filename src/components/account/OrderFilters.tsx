import React, { useState } from 'react';
import styled from 'styled-components';
import { OrderStatus, OrderStatusEnum, OrderFilterOptions } from '../../services/orderService';
import { FaFilter, FaSort, FaCalendarAlt } from 'react-icons/fa';

const FiltersContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 15px;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h5`
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const StatusFilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StatusButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#0071BC' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: 1px solid ${props => props.active ? '#0071BC' : '#ddd'};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#0062a3' : '#f5f5f5'};
  }
`;

const SortGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SortSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-grow: 1;
`;

const DateFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DateInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
`;

const ClearButton = styled.button`
  background-color: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ApplyButton = styled.button`
  background-color: #0071BC;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #0062a3;
  }
`;

interface OrderFiltersProps {
  onFilterChange: (filters: OrderFilterOptions) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const handleStatusChange = (selectedStatus: OrderStatus | undefined) => {
    setStatus(status === selectedStatus ? undefined : selectedStatus);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [newSortBy, newSortOrder] = value.split('-') as ['date' | 'total', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  
  const handleApplyFilters = () => {
    onFilterChange({
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder
    });
  };
  
  const handleClearFilters = () => {
    setStatus(undefined);
    setSortBy('date');
    setSortOrder('desc');
    setStartDate('');
    setEndDate('');
    
    onFilterChange({});
  };
  
  return (
    <FiltersContainer>
      <FilterTitle>
        <FaFilter />
        Filter Orders
      </FilterTitle>
      
      <FilterSection>
        <SectionTitle>Order Status</SectionTitle>
        <StatusFilterGroup>
          <StatusButton 
            active={status === undefined} 
            onClick={() => handleStatusChange(undefined)}
          >
            All
          </StatusButton>
          <StatusButton 
            active={status === OrderStatusEnum.PENDING} 
            onClick={() => handleStatusChange(OrderStatusEnum.PENDING)}
          >
            Pending
          </StatusButton>
          <StatusButton 
            active={status === OrderStatusEnum.PROCESSING} 
            onClick={() => handleStatusChange(OrderStatusEnum.PROCESSING)}
          >
            Processing
          </StatusButton>
          <StatusButton 
            active={status === OrderStatusEnum.SHIPPED} 
            onClick={() => handleStatusChange(OrderStatusEnum.SHIPPED)}
          >
            Shipped
          </StatusButton>
          <StatusButton 
            active={status === OrderStatusEnum.DELIVERED} 
            onClick={() => handleStatusChange(OrderStatusEnum.DELIVERED)}
          >
            Delivered
          </StatusButton>
          <StatusButton 
            active={status === OrderStatusEnum.CANCELLED} 
            onClick={() => handleStatusChange(OrderStatusEnum.CANCELLED)}
          >
            Cancelled
          </StatusButton>
        </StatusFilterGroup>
      </FilterSection>
      
      <FilterSection>
        <SectionTitle>
          <FaSort />
          Sort By
        </SectionTitle>
        <SortGroup>
          <SortSelect value={`${sortBy}-${sortOrder}`} onChange={handleSortChange}>
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="total-desc">Total (High to Low)</option>
            <option value="total-asc">Total (Low to High)</option>
          </SortSelect>
        </SortGroup>
      </FilterSection>
      
      <FilterSection>
        <SectionTitle>
          <FaCalendarAlt />
          Date Range
        </SectionTitle>
        <DateFilterGroup>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </DateFilterGroup>
      </FilterSection>
      
      <FilterActions>
        <ClearButton onClick={handleClearFilters}>
          Clear All
        </ClearButton>
        <ApplyButton onClick={handleApplyFilters}>
          Apply Filters
        </ApplyButton>
      </FilterActions>
    </FiltersContainer>
  );
};

export default OrderFilters;
