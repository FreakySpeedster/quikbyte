/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AddToCartButton from '../../src/components/AddToCartButton';

// Mock the CartContext
const mockAddItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockReduceQuantity = jest.fn();

jest.mock('../../src/contexts/CartContext', () => ({
  useCart: () => ({
    cart: [],
    addItem: mockAddItem,
    removeItem: mockRemoveItem,
    reduceQuantity: mockReduceQuantity
  })
}));

// Mock the constants
jest.mock('../../src/constants', () => ({
  LABELS: {
    ADD_TO_CART: {
      ADD: 'Add to Cart'
    }
  }
}));

describe('AddToCartButton', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Add to Cart button', () => {
    render(
      <AddToCartButton 
        productId="test-id" 
        productName="Test Product" 
        productPrice={9.99}
      />
    );
    
    // Use a more flexible query if the exact text might vary
    const buttonElement = screen.getByText(/Add to Cart/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls addItem when clicked', () => {
    render(
      <AddToCartButton 
        productId="test-id" 
        productName="Test Product" 
        productPrice={9.99}
      />
    );
    
    const buttonElement = screen.getByText(/Add to Cart/i);
    buttonElement.click();
    
    expect(mockAddItem).toHaveBeenCalledWith({
      id: "test-id",
      name: "Test Product",
      price: 9.99,
      quantity: 1
    });
  });
});
