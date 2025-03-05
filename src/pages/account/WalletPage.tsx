import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AccountLayout from '../../components/account/AccountLayout';
import { useAuth } from '../../contexts/AuthContext';
import { FaWallet, FaMoneyBillWave, FaHistory, FaExclamationTriangle } from 'react-icons/fa';

// Styled Components
const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const WalletCard = styled.div`
  background: linear-gradient(135deg, #0071BC, #005a96);
  border-radius: 12px;
  padding: 25px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 113, 188, 0.2);
`;

const WalletBalance = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin: 15px 0;
`;

const WalletSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AccountDetails = styled.div`
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const DetailValue = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #0071BC;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TransactionList = styled.div`
  margin-top: 15px;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionType = styled.div`
  font-weight: 500;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #666;
`;

const TransactionAmount = styled.div<{ type: 'credit' | 'debit' }>`
  font-weight: 500;
  color: ${props => props.type === 'credit' ? '#28a745' : '#dc3545'};
`;

const ComingSoonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  backdrop-filter: blur(3px);
`;

const ComingSoonText = styled.h2`
  font-size: 28px;
  color: #0071BC;
  margin-bottom: 15px;
`;

const ComingSoonDescription = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
`;

const Button = styled.button`
  background-color: #0071BC;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #005a96;
  }
`;

const Text = styled.p<{ size?: string; weight?: string; align?: string }>`
  font-size: ${props => props.size === 'sm' ? '14px' : props.size === 'lg' ? '18px' : '16px'};
  font-weight: ${props => props.weight === 'medium' ? '500' : props.weight === 'bold' ? '700' : '400'};
  text-align: ${props => props.align || 'left'};
  margin: 0;
`;

const FlexBox = styled.div<{ justify?: string; align?: string; direction?: string; gap?: string }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '0'};
`;

const LoadingSpinner = () => (
  <div style={{ 
    display: 'inline-block', 
    width: '30px', 
    height: '30px', 
    border: '3px solid rgba(0, 113, 188, 0.2)', 
    borderRadius: '50%', 
    borderTop: '3px solid #0071BC', 
    animation: 'spin 1s linear infinite' 
  }} />
);

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Get auth context, but handle the case when it might not be initialized yet
  const auth = useAuth();
  const user = auth?.user || { firstName: 'John', lastName: 'Doe' };

  useEffect(() => {
    // This would normally fetch wallet data from the API
    // For now, we'll use mock data
    const mockWalletData = {
      balance: 5000.00,
      accountNumber: '0123456789',
      accountName: `${user.firstName} ${user.lastName}`,
      bankName: 'Providus Bank',
    };
    
    const mockTransactions = [
      { id: 1, type: 'credit', description: 'Account funding', amount: 10000, date: '2025-03-01T10:30:00' },
      { id: 2, type: 'debit', description: 'Purchase - Order #12345', amount: 5000, date: '2025-03-02T14:15:00' },
      { id: 3, type: 'credit', description: 'Refund - Order #12300', amount: 2500, date: '2025-03-02T16:45:00' },
      { id: 4, type: 'debit', description: 'Purchase - Order #12350', amount: 2500, date: '2025-03-03T09:20:00' },
    ];
    
    // Simulate API call
    setTimeout(() => {
      setWalletData(mockWalletData);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`${field} copied to clipboard`);
      })
      .catch(err => {
        alert('Failed to copy text');
      });
  };

  return (
    <AccountLayout title="Wallet" icon={<FaWallet />}>
      <WalletContainer>
        {loading ? (
          <FlexBox justify="center" align="center" style={{ minHeight: '300px' }}>
            <LoadingSpinner />
          </FlexBox>
        ) : (
          <>
            <WalletCard>
              <Text size="sm" weight="medium">Available Balance</Text>
              <WalletBalance>₦{formatCurrency(walletData.balance)}</WalletBalance>
              <Button size="sm">Fund Wallet</Button>
            </WalletCard>
            
            <WalletSection>
              <SectionTitle><FaMoneyBillWave /> Account Details</SectionTitle>
              <Text size="sm" style={{ marginBottom: '10px' }}>
                Use the account details below to transfer funds to your wallet.
              </Text>
              <AccountDetails>
                <DetailRow>
                  <DetailLabel>Account Number</DetailLabel>
                  <DetailValue>
                    {walletData.accountNumber}
                    <CopyButton onClick={() => copyToClipboard(walletData.accountNumber, 'Account number')}>
                      Copy
                    </CopyButton>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Account Name</DetailLabel>
                  <DetailValue>{walletData.accountName}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Bank</DetailLabel>
                  <DetailValue>{walletData.bankName}</DetailValue>
                </DetailRow>
              </AccountDetails>
            </WalletSection>
            
            <WalletSection>
              <SectionTitle><FaHistory /> Recent Transactions</SectionTitle>
              <TransactionList>
                {transactions.length > 0 ? (
                  transactions.map(transaction => (
                    <TransactionItem key={transaction.id}>
                      <TransactionInfo>
                        <TransactionType>{transaction.description}</TransactionType>
                        <TransactionDate>
                          {new Date(transaction.date).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TransactionDate>
                      </TransactionInfo>
                      <TransactionAmount type={transaction.type}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{formatCurrency(transaction.amount)}
                      </TransactionAmount>
                    </TransactionItem>
                  ))
                ) : (
                  <Text align="center" style={{ padding: '20px 0' }}>
                    No transactions yet
                  </Text>
                )}
              </TransactionList>
            </WalletSection>
          </>
        )}
        
        {/* Coming Soon Overlay */}
        <ComingSoonOverlay>
          <FaExclamationTriangle size={40} color="#0071BC" />
          <ComingSoonText>Coming Soon!</ComingSoonText>
          <ComingSoonDescription>
            We're currently integrating with Providus Bank to provide you with a seamless wallet experience.
            This feature will be available soon.
          </ComingSoonDescription>
          <Button style={{ marginTop: '20px' }} onClick={() => navigate('/account')}>
            Back to Account
          </Button>
        </ComingSoonOverlay>
      </WalletContainer>
    </AccountLayout>
  );
};

export default WalletPage;
