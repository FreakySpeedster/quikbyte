/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Item from '../../src/components/Cart/Item';

// Mock the CartContext
const mockRemoveItem = jest.fn();

jest.mock('../../src/contexts/CartContext', () => ({
  useCart: () => ({
    removeItem: mockRemoveItem
  })
}));

// Mock the CloseBtn image
jest.mock('../../../public/close-btn.svg', () => 'close-button.svg');

describe('Cart Item', () => {
  const mockItem = {
    id: 'item-1',
    name: 'Chocolate Cake',
    price: 9.99,
    quantity: 2
  };

  test('renders item information correctly', () => {
    render(<Item item={mockItem} />);
    
    // Check if item name is displayed
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    
    // Check if quantity is displayed correctly
    expect(screen.getByText('2x')).toBeInTheDocument();
    
    // Check if price is displayed correctly
    expect(screen.getByText('@$9.99')).toBeInTheDocument();
    
    // Check if total price is displayed correctly
    const totalPrice = mockItem.price * mockItem.quantity;
    expect(screen.getByText(`$${totalPrice}`)).toBeInTheDocument();
  });

  test('calls removeItem when remove button is clicked', () => {
    render(<Item item={mockItem} />);
    
    // Find and click the remove button
    const removeButton = screen.getByRole('button', { name: /remove item/i });
    fireEvent.click(removeButton);
    
    // Check if removeItem function was called with the right id
    expect(mockRemoveItem).toHaveBeenCalledWith('item-1');
  });
});
