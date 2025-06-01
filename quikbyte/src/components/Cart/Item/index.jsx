import React, { memo } from "react";
import { useCart } from "../../../contexts/CartContext";
import CloseBtn from "../../../../public/close-btn.svg";
import "./styles.css";

const Item = memo(function Item({ item, discountValue = 0 }) {
  const { removeItem } = useCart();
  
  const { id, name, price, quantity } = item;
  const regularPrice = price;
  const regularTotalPrice = regularPrice * quantity;
  
  // Calculate discounted prices if discount is applied
  const discountedPrice = discountValue > 0 ? regularPrice * (1 - discountValue) : regularPrice;
  const discountedTotalPrice = discountedPrice * quantity;
  
  // Use discounted price if available, otherwise use regular price
  const displayPrice = discountValue > 0 ? discountedPrice : regularPrice;
  const displayTotalPrice = discountValue > 0 ? discountedTotalPrice : regularTotalPrice;
  
  return (
    <div className="cart-item">
      <div className="item-info">
        <h4 className="item-name">{name}</h4>
        <div className="item-details">
          <span className="quantity">{quantity}x</span>
          
          {discountValue > 0 ? (
            <span className="price">
              <span className="original-price">@${regularPrice.toFixed(2)}</span>
              <span className="discounted-price">@${displayPrice.toFixed(2)}</span>
            </span>
          ) : (
            <span className="price">@${displayPrice.toFixed(2)}</span>
          )}
          
          {discountValue > 0 ? (
            <span className="total-price">
              <span className="original-total">${regularTotalPrice.toFixed(2)}</span>
              <span>${displayTotalPrice.toFixed(2)}</span>
            </span>
          ) : (
            <span className="total-price">${displayTotalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
      <button 
        className="remove-button" 
        onClick={() => removeItem(id)}
        aria-label="Remove item"
      >
        <img src={CloseBtn} alt="Remove Item" />
      </button>
    </div>
  );
});

export default Item;