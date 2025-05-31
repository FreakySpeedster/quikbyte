/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderConfirmationModal from '../../src/components/OrderConfirmationModal';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />
}));

// Mock constants
jest.mock('../../src/constants', () => ({
  LABELS: {
    ORDER: {
      CONFIRMED: 'Order Confirmed',
      HOPE_ENJOY: 'We hope you enjoy your treats!',
      START_NEW: 'Start New Order'
    },
    CART: {
      ORDER_TOTAL: 'Order Total'
    }
  }
}));

describe('OrderConfirmationModal', () => {
  const mockOrderItems = [
    { 
      id: 'item-1', 
      name: 'Chocolate Cake', 
      price: 9.99, 
      quantity: 2,
      image: { thumbnail: '/thumbnails/chocolate-cake.jpg' }
    },
    { 
      id: 'item-2', 
      name: 'Vanilla Ice Cream', 
      price: 5.99, 
      quantity: 1,
      image: { thumbnail: '/thumbnails/vanilla-ice-cream.jpg' }
    }
  ];
  
  const mockOrderTotal = 25.97; // (9.99 * 2) + 5.99
  const mockOnClose = jest.fn();

  test('renders modal when isOpen is true', () => {
    render(
      <OrderConfirmationModal 
        isOpen={true} 
        onClose={mockOnClose} 
        orderItems={mockOrderItems} 
        orderTotal={mockOrderTotal} 
      />
    );
    
    // Check if modal title is displayed
    expect(screen.getByText('Order Confirmed')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <OrderConfirmationModal 
        isOpen={false} 
        onClose={mockOnClose} 
        orderItems={mockOrderItems} 
        orderTotal={mockOrderTotal} 
      />
    );
    
    // Modal should not be in the document
    expect(screen.queryByText('Order Confirmed')).not.toBeInTheDocument();
  });
});
