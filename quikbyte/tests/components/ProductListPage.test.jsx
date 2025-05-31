/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductListPage from '../../src/pages/ProductListPage';

// Mock the ProductCard component
jest.mock('../../src/components/ProductCard', () => ({
  __esModule: true,
  default: ({ product }) => (
    <div data-testid="product-card" data-product-id={product.id}>
      {product.name} - ${product.price}
    </div>
  )
}));

// Mock the Cart component
jest.mock('../../src/components/Cart', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-component">Cart Component</div>
}));

// Mock the fetch API
global.fetch = jest.fn();

// Mock the LABELS constant
jest.mock('../../src/constants', () => ({
  LABELS: {
    PRODUCTS: {
      TITLE: 'Desserts',
      LOADING: 'Loading delicious desserts...',
      UPDATING_MENU: 'We are currently updating our menu. Check back soon for delicious treats!',
      ERROR: 'Failed to load products. Please try again.',
      SOMETHING_WRONG: 'Something went wrong. Please try again later.',
      EMPTY: 'No desserts available',
      RETRY: 'Retry',
      REFRESH: 'Refresh',
    }
  }
}));

describe('ProductListPage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders loading state initially', async () => {
    // Mock the fetch to delay resolving
    fetch.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve([])
      }), 100))
    );

    render(<ProductListPage />);
    
    // Check if loading state is displayed
    expect(screen.getByText('Loading delicious desserts...')).toBeInTheDocument();
    const loadingSpinner = document.querySelector('.loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('renders products when API call is successful', async () => {
    const mockProducts = [
      { id: 'product-1', name: 'Chocolate Cake', price: 9.99 },
      { id: 'product-2', name: 'Cheesecake', price: 8.99 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts)
    });

    render(<ProductListPage />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Desserts')).toBeInTheDocument();
    });

    // Check if product count is displayed
    expect(screen.getByText('2 items available')).toBeInTheDocument();
    
    // Check if each product card is rendered
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);
    
    // Check if the Cart component is rendered
    expect(screen.getByTestId('cart-component')).toBeInTheDocument();
  });

  test('renders error state when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API error'));

    render(<ProductListPage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    });
    
    // Check if error message and retry button are rendered
    expect(screen.getByText('API error')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('renders empty state when API returns no products', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    render(<ProductListPage />);

    // Wait for empty state message to appear
    await waitFor(() => {
      expect(screen.getByText('No desserts available')).toBeInTheDocument();
    });
    
    // Check if empty state message and refresh button are rendered
    expect(screen.getByText('We are currently updating our menu. Check back soon for delicious treats!')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  test('retry button calls the API again', async () => {
    // First call fails
    fetch.mockRejectedValueOnce(new Error('API error'));
    
    // Second call succeeds
    const mockProducts = [{ id: 'product-1', name: 'Chocolate Cake', price: 9.99 }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts)
    });

    render(<ProductListPage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    });
    
    // Click retry button
    fireEvent.click(screen.getByText('Retry'));
    
    // Check if loading state appears again
    expect(screen.getByText('Loading delicious desserts...')).toBeInTheDocument();
    
    // Wait for products to load after retry
    await waitFor(() => {
      expect(screen.getByText('Desserts')).toBeInTheDocument();
      expect(screen.getByText('1 items available')).toBeInTheDocument();
    });
  });

  test('refresh button calls the API again', async () => {
    // First call returns empty array
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });
    
    // Second call returns products
    const mockProducts = [
      { id: 'product-1', name: 'Chocolate Cake', price: 9.99 },
      { id: 'product-2', name: 'Cheesecake', price: 8.99 }
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts)
    });

    render(<ProductListPage />);

    // Wait for empty state message to appear
    await waitFor(() => {
      expect(screen.getByText('No desserts available')).toBeInTheDocument();
    });
    
    // Click refresh button
    fireEvent.click(screen.getByText('Refresh'));
    
    // Check if loading state appears again
    expect(screen.getByText('Loading delicious desserts...')).toBeInTheDocument();
    
    // Wait for products to load after refresh
    await waitFor(() => {
      expect(screen.getByText('Desserts')).toBeInTheDocument();
      expect(screen.getByText('2 items available')).toBeInTheDocument();
    });
  });

  test('handles non-OK response from API', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    render(<ProductListPage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Failed to fetch products: 500 Internal Server Error')).toBeInTheDocument();
  });
});
