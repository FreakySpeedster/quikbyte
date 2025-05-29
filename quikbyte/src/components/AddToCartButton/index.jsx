import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import "./styles.css";

const AddToCartButton = ({ productId }) => {
  const { cart, addItem, removeItem } = useCart();

  const cartItem = cart.find(item => item.id === productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    const itemToAdd = { id: productId, quantity: 1 };
    addItem(itemToAdd);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      removeItem(productId);
    }
  };

  if (quantity === 0) {
    return (
      <button className="add-to-cart-btn" onClick={handleAdd}>
        <ShoppingCart size={16} />
        <span>Add to Cart</span>
      </button>
    );
  }

  return (
    <div className="quantity-control">
      <button className="qty-btn" onClick={handleRemove}>
        –
      </button>
      <span className="qty-count">{quantity}</span>
      <button className="qty-btn" onClick={handleAdd}>
        +
      </button>
    </div>
  );
};

export default AddToCartButton;
