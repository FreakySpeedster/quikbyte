import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import './styles.css';

const CartButton = ({ onClick, isCartVisible }) => {
  const { cart } = useCart();
  
  // Calculate total number of items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <button 
      className={`header-cart-button ${isCartVisible ? 'cart-open' : ''}`} 
      onClick={onClick} 
      aria-label={isCartVisible ? "Close cart" : "Open cart"}
    >
      {isCartVisible && window.innerWidth <= 768 ? <X size={20} /> : <ShoppingCart size={20} />}
      {totalItems > 0 && <span className="header-cart-count">{totalItems}</span>}
    </button>
  );
};

export default CartButton;
