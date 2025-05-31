import React from "react";
import { useCart } from "../../contexts/CartContext";
import EmptyCart from "../../../public/empty-cart.svg";
import CarbonNeutral from "../../../public/carbon-neutral.svg";
import Item from "./Item";
import "./styles.css";


const Cart = () => {
  const { cart, addItem, removeItem, clearCart } = useCart();

  const orderTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <div className="cart-container">
      <div className="cart-heading">Your Cart</div>
      {cart.length === 0 ? (
        <div className="empty-cart-content">
          <img src={EmptyCart} alt="Empty Cart" style={{ width: "180px", height: "180px" }} />
          <p>Your added items will appear here</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <Item key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-summary">
            <div className="order-total">
              <span className="order-total-label">Order Total</span>
              <span className="total-amount">${orderTotal.toFixed(2)}</span>
            </div>
            <div className="carbon-neutral">
              <img src={CarbonNeutral} alt="Empty Cart" style={{ width: "18px", height: "18px" }} />
              <p>This is a <span style={{color: '#837975'}}>carbon-neutral</span> delivery</p>
            </div>
            <button className="place-order-btn" onClick={clearCart}>
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;