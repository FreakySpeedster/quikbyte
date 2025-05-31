import React, { useState, useMemo, useCallback, memo } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import "./styles.css";

const AddToCartButton = memo(function AddToCartButton ({ productId, productName, productPrice }) {
  const { cart, addItem, reduceQuantity } = useCart();

  const cartItem = useMemo(() => {
    return cart.find(item => item.id === productId);
  }, [cart, productId]);

  const quantity = useMemo(() => {
    return cartItem ? cartItem.quantity : 0;
  }, [cartItem]);

  const handleAdd = useCallback(() => {
    const itemToAdd = { 
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1
    };
    addItem(itemToAdd);
  }, [productId, productName, productPrice, addItem]);

  const handleRemove = useCallback(() => {
    if (quantity > 0) {
      reduceQuantity(productId);
    }
  }, [quantity, productId, reduceQuantity]);

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
});

export default AddToCartButton;
