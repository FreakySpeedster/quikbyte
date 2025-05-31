/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from '../../src/components/Cart';

// Mock fetch API
global.fetch = jest.fn();

// Mock the CartContext
const mockClearCart = jest.fn();
const mockCart = [
  { id: 'item-1', name: 'Chocolate Cake', price: 9.99, quantity: 2 },
  { id: 'item-2', name: 'Vanilla Ice Cream', price: 5.99, quantity: 1 }
];

jest.mock('../../src/contexts/CartContext', () => ({
  useCart: () => ({
    cart: mockCart,
    clearCart: mockClearCart
  })
}));

// Mock the Item component
jest.mock('../../src/components/Cart/Item', () => ({
  __esModule: true,
  default: ({ item }) => (
    <div data-testid="cart-item">
      <div>{item.name}</div>
      <div>{item.quantity}x ${item.price}</div>
    </div>
  )
}));

// Mock the lazy-loaded OrderConfirmationModal
jest.mock('../../src/components/OrderConfirmationModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, orderItems, orderTotal }) => (
    isOpen ? (
      <div data-testid="confirmation-modal">
        <div>Total: ${orderTotal}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  )
}));

// Mock SVG imports
jest.mock('../../../public/empty-cart.svg', () => 'empty-cart.svg');
jest.mock('../../../public/carbon-neutral.svg', () => 'carbon-neutral.svg');

// Mock constants
jest.mock('../../src/constants', () => ({
  LABELS: {
    CART: {
      TITLE: 'Your Cart',
      EMPTY_CART: 'Your cart is empty',
      ORDER_TOTAL: 'Order Total',
      CARBON_NEUTRAL: 'Carbon Neutral Delivery',
      CONFIRM_ORDER: 'Place Order',
      PROCESSING: 'Processing...'
    }
  }
}));

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ 
        products: [
          { id: 'item-1', name: 'Chocolate Cake', price: 9.99 },
          { id: 'item-2', name: 'Vanilla Ice Cream', price: 5.99 }
        ],
        items: [
          { productId: 'item-1', quantity: 2 },
          { productId: 'item-2', quantity: 1 }
        ]
      })
    });
  });

  test('renders cart with items', () => {
    render(<Cart />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getAllByTestId('cart-item').length).toBe(2);
    expect(screen.getByText('Order Total')).toBeInTheDocument();
  });
});
