import React from "react";
import { useCart } from "../../../contexts/CartContext";
import CloseBtn from "../../../../public/close-btn.svg";
import "./styles.css";

const Item = ({ item }) => {
  const { removeItem } = useCart();
  
  const { id, name, price, quantity } = item;
  const totalPrice = price * quantity;
  
  return (
    <div className="cart-item">
      <div className="item-info">
        <h4 className="item-name">{name}</h4>
        <div className="item-details">
          <span className="quantity">{quantity}x</span>
          <span className="price">@${price}</span>
          <span className="total-price">${totalPrice}</span>
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
};

export default Item;