import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar, FaTimes, FaShoppingBag } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountSidebar from '../../components/account/AccountSidebar';
import { formatCurrency } from '../../utils/formatCurrency';

// Types for review items
interface ReviewItem {
  id: number;
  orderId: string;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  orderDate: string;
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

const ReviewsContent = styled.div`
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

const ReviewsList = styled.div`
  margin-bottom: 20px;
`;

const ReviewItem = styled.div`
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 15px;
  display: flex;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 10px;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ProductOrderInfo = styled.div`
  display: flex;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
`;

const ProductPrice = styled.div`
  font-weight: 500;
  color: #222;
`;

const ReviewActions = styled.div`
  display: flex;
  align-items: flex-start;
  
  @media (max-width: 576px) {
    margin-top: 15px;
  }
`;

const ReviewButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #0055b3;
  }
`;

const IgnoreButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #e0e0e0;
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

// Review Modal Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 5px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
    font-size: 18px;
  }
  
  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const ModalProductInfo = styled.div`
  display: flex;
  margin-bottom: 20px;
  
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 15px;
  }
`;

const RatingContainer = styled.div`
  margin-bottom: 15px;
  
  h4 {
    margin: 0 0 10px 0;
    font-size: 16px;
  }
`;

const StarRating = styled.div`
  display: flex;
  font-size: 24px;
  color: #ddd;
  
  .filled {
    color: #ffb800;
  }
  
  svg {
    cursor: pointer;
    margin-right: 5px;
  }
`;

const ReviewForm = styled.form`
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
    font-family: inherit;
    resize: vertical;
  }
  
  button {
    background-color: #0066cc;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background-color: #0055b3;
    }
  }
`;

const ReviewsPage: React.FC = () => {
  const [pendingReviews, setPendingReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewItem | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  useEffect(() => {
    // Fetch pending reviews from API
    const fetchPendingReviews = async () => {
      setLoading(true);
      try {
        // For now we'll create an empty array as we're still implementing the backend
        // This would normally be an API call like:
        // const response = await api.get('/user/pending-reviews');
        // setPendingReviews(response.data);
        
        // Empty array for new users
        setPendingReviews([]);
        
        // Uncomment to test with mock data if needed
        /*
        setPendingReviews([
          {
            id: 1,
            orderId: 'MM78945',
            productId: 101,
            productName: 'Golden Penny Semovita - 1kg',
            productImage: '/images/products/golden-penny-semovita.jpg',
            price: 1200,
            orderDate: '2025-02-25'
          },
          {
            id: 2,
            orderId: 'MM78945',
            productId: 102,
            productName: 'Dano Milk Powder - 400g',
            productImage: '/images/products/dano-milk.jpg',
            price: 1800,
            orderDate: '2025-02-25'
          },
          {
            id: 3,
            orderId: 'MM78856',
            productId: 103,
            productName: 'Indomie Chicken Flavor - Pack of 40',
            productImage: '/images/products/indomie-chicken.jpg',
            price: 5500,
            orderDate: '2025-03-01'
          }
        ]);
        */
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingReviews();
  }, []);
  
  const openReviewModal = (item: ReviewItem) => {
    setCurrentReview(item);
    setRating(0);
    setReviewText('');
    setIsModalOpen(true);
  };
  
  const closeReviewModal = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
  };
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentReview && rating > 0) {
      // In a real app, you would submit the review to the server here
      console.log('Submitting review:', {
        productId: currentReview.productId,
        rating,
        review: reviewText
      });
      
      // Remove the reviewed item from the pending list
      setPendingReviews(pendingReviews.filter(item => item.id !== currentReview.id));
      
      // Close the modal
      closeReviewModal();
    }
  };
  
  const ignoreReview = (id: number) => {
    setPendingReviews(pendingReviews.filter(item => item.id !== id));
  };
  
  return (
    <PageContainer>
      <title>Pending Reviews | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <ReviewsContent>
            <ContentHeader>
              <FaStar size={20} />
              <HeaderTitle>Pending Reviews</HeaderTitle>
            </ContentHeader>
            
            {loading ? (
              <div>Loading pending reviews...</div>
            ) : pendingReviews.length > 0 ? (
              <ReviewsList>
                {pendingReviews.map(item => (
                  <ReviewItem key={item.id}>
                    <ProductImage>
                      <img src={item.productImage} alt={item.productName} />
                    </ProductImage>
                    <ProductInfo>
                      <ProductName>{item.productName}</ProductName>
                      <ProductOrderInfo>
                        Order #{item.orderId} • {item.orderDate}
                      </ProductOrderInfo>
                      <ProductPrice>{formatCurrency(item.price)}</ProductPrice>
                    </ProductInfo>
                    <ReviewActions>
                      <ReviewButton onClick={() => openReviewModal(item)}>
                        <FaStar size={14} />
                        Write Review
                      </ReviewButton>
                      <IgnoreButton onClick={() => ignoreReview(item.id)}>
                        <FaTimes size={14} />
                        Ignore
                      </IgnoreButton>
                    </ReviewActions>
                  </ReviewItem>
                ))}
              </ReviewsList>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaStar />
                </EmptyIcon>
                <EmptyTitle>No pending reviews</EmptyTitle>
                <EmptyText>
                  You don't have any products to review at the moment. When you purchase products, you'll be able to share your feedback here.
                </EmptyText>
              </EmptyState>
            )}
          </ReviewsContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
      
      {/* Review Modal */}
      <ModalOverlay isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>Write Your Review</h3>
            <button onClick={closeReviewModal}>&times;</button>
          </ModalHeader>
          
          {currentReview && (
            <>
              <ModalProductInfo>
                <img src={currentReview.productImage} alt={currentReview.productName} />
                <div>
                  <ProductName>{currentReview.productName}</ProductName>
                  <ProductPrice>{formatCurrency(currentReview.price)}</ProductPrice>
                </div>
              </ModalProductInfo>
              
              <ReviewForm onSubmit={handleReviewSubmit}>
                <RatingContainer>
                  <h4>Rate this product</h4>
                  <StarRating>
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar
                        key={star}
                        className={star <= rating ? 'filled' : ''}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </StarRating>
                </RatingContainer>
                
                <div>
                  <h4>Share your thoughts</h4>
                  <textarea
                    placeholder="Tell others what you think about this product..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                </div>
                
                <button type="submit" disabled={rating === 0}>
                  Submit Review
                </button>
              </ReviewForm>
            </>
          )}
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
};

export default ReviewsPage;
