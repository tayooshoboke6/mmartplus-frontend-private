import styled from 'styled-components';
import ProductCard from '../product/ProductCard';

const Container = styled.div`
  margin: 30px 0;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 20px 0;
  }
  
  @media (max-width: 480px) {
    margin: 15px 0;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  @media (max-width: 375px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &.prev {
    left: -20px;
  }
  
  &.next {
    right: -20px;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    
    &.prev {
      left: -10px;
    }
    
    &.next {
      right: -10px;
    }
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

// Sample product data aligned with the new grocery store category system
const products = [
  {
    id: 1,
    name: "Golden Penny Semovita - 5kg",
    image: "https://dummyimage.com/300x200/",
    price: 5500.00,
    rating: 5,
    reviewCount: 42,
    deliveryDays: 2,
    category: "Staples & Grains"
  },
  {
    id: 2,
    name: "Sunlight Detergent Powder - 900g",
    image: "https://dummyimage.com/300x200/",
    price: 1200.00,
    oldPrice: 1500.00,
    discount: true,
    rating: 4,
    reviewCount: 63,
    deliveryDays: 2,
    category: "Cleaning & Laundry"
  },
  {
    id: 3,
    name: "Mamador Cooking Oil - 3.8L",
    image: "https://dummyimage.com/300x200/",
    price: 8500.00,
    rating: 4,
    reviewCount: 32,
    deliveryDays: 2,
    category: "Cooking Essentials"
  },
  {
    id: 4,
    name: "Indomie Instant Noodles (Chicken Flavor) - Pack of 40",
    image: "https://dummyimage.com/300x200/",
    price: 7200.00,
    rating: 5,
    reviewCount: 87,
    deliveryDays: 2,
    category: "Packaged & Frozen Foods"
  },
  {
    id: 5,
    name: "Peak Milk Powder - 900g",
    image: "https://dummyimage.com/300x200/",
    price: 4400.00,
    rating: 4,
    reviewCount: 55,
    deliveryDays: 2,
    category: "Dairy & Breakfast"
  },
  {
    id: 6,
    name: "Mortein Insecticide Spray - 600ml",
    image: "https://dummyimage.com/300x200/",
    price: 2400.00,
    rating: 4,
    reviewCount: 29,
    deliveryDays: 2,
    category: "Pest Control & Safety"
  }
];

const ProductSection = () => {
  return (
    <Container>
      <ProductsGrid>
        {products.map(product => (
          <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            oldPrice={product.oldPrice}
            discount={product.discount}
            rating={product.rating}
            reviewCount={product.reviewCount}
            deliveryDays={product.deliveryDays}
            category={product.category}
          />
        ))}
      </ProductsGrid>
      
      <NavigationButton className="prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </NavigationButton>
      
      <NavigationButton className="next">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </NavigationButton>
    </Container>
  );
};

export default ProductSection;
