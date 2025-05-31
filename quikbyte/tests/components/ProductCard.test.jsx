/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../../src/components/ProductCard';

// Mock AddToCartButton component
jest.mock('../../src/components/AddToCartButton', () => ({
  __esModule: true,
  default: ({ productId, productName, productPrice }) => (
    <button data-testid="add-to-cart-button">
      Add {productName} to cart
    </button>
  )
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: 'product-1',
    name: 'Chocolate Cake',
    price: 9.99,
    category: 'Cake',
    image: {
      desktop: '/images/chocolate-cake.jpg'
    }
  };

  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check if product name is displayed
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    
    // Check if price is displayed correctly
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    
    // Check if category is displayed
    expect(screen.getByText('Cake')).toBeInTheDocument();
    
    // Check if the image is rendered with the right src and alt
    const image = screen.getByAltText('Chocolate Cake');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/chocolate-cake.jpg');
    
    // Check if the AddToCartButton is rendered with the right props
    expect(screen.getByTestId('add-to-cart-button')).toBeInTheDocument();
  });
});
