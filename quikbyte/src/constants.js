const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  REDUCE_QUANTITY: 'REDUCE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

// UI Labels
const LABELS = {
  // Cart
  CART: {
    TITLE: 'Your Cart',
    EMPTY_CART: 'Your added items will appear here',
    ORDER_TOTAL: 'Order Total',
    CONFIRM_ORDER: 'Confirm Order',
    PROCESSING: 'Processing...',
    CARBON_NEUTRAL: 'This is a carbon-neutral delivery',
    CLEAR_CART: 'Clear Cart',
  },
  
  // Order Confirmation
  ORDER: {
    CONFIRMED: 'Order Confirmed',
    HOPE_ENJOY: 'We hope you enjoy your food!',
    START_NEW: 'Start New Order',
    FAILED: 'Order Failed',
    TRY_AGAIN: 'Please try again',
  },
  
  // Product List
  PRODUCTS: {
    TITLE: 'Desserts',
    LOADING: 'Loading delicious desserts...',
    UPDATING_MENU: 'We are currently updating our menu. Check back soon for delicious treats!',
    ERROR: 'Failed to load products. Please try again.',
    SOMETHING_WRONG: 'Something went wrong. Please try again later.',
    EMPTY: 'No desserts available',
    RETRY: 'Retry',
    REFRESH: 'Refresh',
  },
  
  // Add to Cart Button
  ADD_TO_CART: {
    ADD: 'Add to Cart',
    ADDED: 'Added',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/product',
  PLACE_ORDER: '/api/order',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
};



export { CART_ACTIONS, LABELS };