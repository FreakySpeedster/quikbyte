import React, { useState, useMemo, useCallback, memo } from "react";
import { ShoppingCart, CirclePlus, CircleMinus } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { LABELS } from "../../constants";
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
        <span>{LABELS.ADD_TO_CART.ADD}</span>
      </button>
    );
  }

  return (
    <div className="quantity-control">
      <div className="qty-btn" onClick={handleRemove}>
        <CircleMinus size={18}/>
      </div>
      <span className="qty-count">{quantity}</span>
      <div className="qty-btn" onClick={handleAdd}>
        <CirclePlus size={18}/>
      </div>
    </div>
  );
});

export default AddToCartButton;
