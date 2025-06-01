# QuikByte Food Ordering Application

QuikByte is a modern, responsive web application for ordering food online. It features an intuitive product browsing experience, a responsive shopping cart, and a streamlined checkout process.

![QuikByte App](https://quikbyte.vercel.app)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [User Flows](#user-flows)
- [Performance Optimizations](#performance-optimizations)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

- **Responsive Design**: Optimized for both desktop and mobile devices with seamless user experience
- **Dynamic Product Catalog**: Browse through available food items with detailed descriptions
- **Real-time Cart Management**: Add, remove, and update quantities of items in your cart
- **Discount Code Support**: Apply discount code - HAPPYHOURS to receive special offers
- **Order Confirmation**: Smooth checkout process with order confirmation

## Technology Stack

- **Frontend Framework**: React.js
- **Build Tool**: Vite.js
- **Styling**: CSS with custom variables for theming
- **Icons**: Lucide React
- **State Management**: React Context API
- **Testing Framework**: Jest with React Testing Library
- **API Integration**: Fetch API with REST endpoints
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quikbyte
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

## Running Tests

QuikByte has comprehensive test coverage to ensure reliability. Run tests with:

```bash
npm test
# or
yarn test
```


## User Flows

### Browsing Products

1. User lands on the Product List Page
2. Products are displayed in a responsive grid layout which will adjust according to screen size.
3. User can view product details including name, description, and price

### Managing Cart

1. User can add products to cart using the "Add to Cart" button
2. On mobile, a cart icon appears in the top-right corner with item count
3. On desktop, the cart is persistently visible on the right side
4. User can adjust quantities or remove items from the cart
5. Cart displays subtotal and updates in real-time

### Applying Discounts

1. User enters a discount code in the cart section
2. Valid codes (e.g., "HAPPYHOURS" for 18% off) are applied to the order total
3. User receives visual feedback on successful discount application

### Checkout Process

1. User reviews items in cart and final order total
2. User clicks "Confirm Order" to proceed with checkout
3. Order confirmation modal appears with order details
4. User receives confirmation that their order has been placed

## Performance Optimizations

1. **Code Splitting**: Used React's lazy loading and Suspense for component-level code splitting:
   - OrderConfirmationModal is lazy-loaded since it's not needed until checkout
   
2. **Optimized Rendering**:
   - Implemented useMemo and useCallback hooks to prevent unnecessary re-renders
   - Used component memoization for frequently updated components

3. **Responsive Design Optimizations**:
   - Conditional rendering of UI elements based on screen size
   - Different layout strategies for mobile vs desktop
   - Custom animations optimized for mobile performance

4. **State Management**:
   - Efficient context structure to minimize unnecessary re-renders
   - Local state for UI elements, global state only when needed

5. **Resource Loading**:
   - SVG icons for faster loading and better scaling
   - Images optimized for web delivery

6. **API Optimization**:
   - Efficient API request patterns with proper error handling
   - Smart retry logic for failed requests

## Project Structure

```
quikbyte/
├── api/               # API proxy configuration
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   └── pages/         # Application pages
└── tests/             # Test configuration and test files
```
