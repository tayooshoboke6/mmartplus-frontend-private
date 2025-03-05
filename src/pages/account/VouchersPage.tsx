import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTicketAlt, FaCheck, FaClock, FaUndo, FaCopy } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountSidebar from '../../components/account/AccountSidebar';
import { formatCurrency } from '../../utils/formatCurrency';
import { getVouchers } from '../../services/VoucherService';

// Types for vouchers
interface Voucher {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  maxUsage: number;
  categories?: string[];
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VouchersContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const ContentHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  svg {
    margin-right: 10px;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const VouchersTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 15px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#0066cc' : '#333'};
  border-bottom: ${props => props.active ? '2px solid #0066cc' : 'none'};
  cursor: pointer;
  
  &:hover {
    color: #0066cc;
  }
`;

const VouchersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const VoucherCard = styled.div<{ active: boolean }>`
  border: 1px solid ${props => props.active ? '#0066cc' : '#eee'};
  border-radius: 8px;
  padding: 15px;
  position: relative;
  overflow: hidden;
  
  ${props => !props.active && `
    opacity: 0.7;
    background-color: #f9f9f9;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 15px;
    right: 15px;
    height: 1px;
    background: repeating-linear-gradient(
      to right,
      #ddd,
      #ddd 5px,
      transparent 5px,
      transparent 10px
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 15px;
    right: 15px;
    height: 1px;
    background: repeating-linear-gradient(
      to right,
      #ddd,
      #ddd 5px,
      transparent 5px,
      transparent 10px
    );
  }
`;

const VoucherHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
`;

const VoucherType = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const VoucherValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #0066cc;
`;

const VoucherStatus = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${props => props.active ? '#2e7d32' : '#d32f2f'};
  
  svg {
    margin-right: 4px;
  }
`;

const VoucherCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px dashed #ccc;
`;

const Code = styled.div`
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const VoucherDetails = styled.div`
  margin-top: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  font-size: 14px;
  margin-bottom: 5px;
`;

const DetailLabel = styled.div`
  color: #666;
  width: 100px;
`;

const DetailValue = styled.div`
  flex: 1;
  color: #333;
`;

const VoucherFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 13px;
  color: #666;
`;

const UsageCount = styled.div``;

const ApplyButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #0055b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  color: #ccc;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
`;

const EmptyText = styled.p`
  text-align: center;
  margin: 0;
  color: #666;
`;

const VouchersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const fetchedVouchers = await getVouchers();
        setVouchers(fetchedVouchers);
      } catch (err) {
        console.error('Error fetching vouchers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // In a real app, you would show a notification here
  };
  
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const isExpired = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
  };
  
  const filteredVouchers = vouchers.filter(voucher => {
    if (activeTab === 'active') {
      return voucher.isActive && !isExpired(voucher.expiryDate);
    } else {
      return !voucher.isActive || isExpired(voucher.expiryDate);
    }
  });
  
  return (
    <PageContainer>
      <title>My Vouchers | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <VouchersContent>
            <ContentHeader>
              <FaTicketAlt size={20} />
              <HeaderTitle>My Vouchers</HeaderTitle>
            </ContentHeader>
            
            <VouchersTabs>
              <TabButton 
                active={activeTab === 'active'} 
                onClick={() => setActiveTab('active')}
              >
                Active Vouchers
              </TabButton>
              <TabButton 
                active={activeTab === 'expired'} 
                onClick={() => setActiveTab('expired')}
              >
                Expired/Used Vouchers
              </TabButton>
            </VouchersTabs>
            
            {loading ? (
              <div>Loading vouchers...</div>
            ) : filteredVouchers.length > 0 ? (
              <VouchersList>
                {filteredVouchers.map(voucher => {
                  const expired = isExpired(voucher.expiryDate);
                  const active = voucher.isActive && !expired;
                  const usedUp = voucher.usageCount >= voucher.maxUsage;
                  
                  return (
                    <VoucherCard key={voucher.id} active={active && !usedUp}>
                      <VoucherHeader>
                        <div>
                          <VoucherType>
                            {voucher.type === 'percentage' ? 'Percentage Discount' : 'Fixed Amount Off'}
                          </VoucherType>
                          <VoucherValue>
                            {voucher.type === 'percentage' 
                              ? `${voucher.value}% OFF` 
                              : `${formatCurrency(voucher.value)} OFF`
                            }
                          </VoucherValue>
                        </div>
                        <VoucherStatus active={active && !usedUp}>
                          {active && !usedUp ? (
                            <>
                              <FaCheck size={12} />
                              Valid
                            </>
                          ) : (
                            <>
                              <FaClock size={12} />
                              {expired ? 'Expired' : 'Used'}
                            </>
                          )}
                        </VoucherStatus>
                      </VoucherHeader>
                      
                      <VoucherCode>
                        <Code>{voucher.code}</Code>
                        <CopyButton onClick={() => copyToClipboard(voucher.code)}>
                          <FaCopy size={12} />
                          Copy
                        </CopyButton>
                      </VoucherCode>
                      
                      <VoucherDetails>
                        <DetailItem>
                          <DetailLabel>Min. Spend:</DetailLabel>
                          <DetailValue>{formatCurrency(voucher.minSpend)}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Expires On:</DetailLabel>
                          <DetailValue>{formatExpiryDate(voucher.expiryDate)}</DetailValue>
                        </DetailItem>
                        {voucher.categories && (
                          <DetailItem>
                            <DetailLabel>Categories:</DetailLabel>
                            <DetailValue>{voucher.categories.join(', ')}</DetailValue>
                          </DetailItem>
                        )}
                      </VoucherDetails>
                      
                      <VoucherFooter>
                        <UsageCount>
                          Used {voucher.usageCount} of {voucher.maxUsage} times
                        </UsageCount>
                        <ApplyButton disabled={!active || usedUp}>
                          Use Now
                        </ApplyButton>
                      </VoucherFooter>
                    </VoucherCard>
                  );
                })}
              </VouchersList>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaTicketAlt />
                </EmptyIcon>
                <EmptyTitle>
                  {activeTab === 'active' 
                    ? 'No active vouchers available' 
                    : 'No expired or used vouchers'
                  }
                </EmptyTitle>
                <EmptyText>
                  {activeTab === 'active'
                    ? 'Check back later for new promotional offers or complete purchases to earn vouchers.'
                    : 'You haven’t used any vouchers yet or none have expired.'
                  }
                </EmptyText>
              </EmptyState>
            )}
          </VouchersContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default VouchersPage;
