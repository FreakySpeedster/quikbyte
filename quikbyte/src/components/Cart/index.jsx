import React from "react";
import { useCart } from "../../contexts/CartContext";
import EmptyCart from "../../../public/empty-cart.svg";
import "./styles.css";


const Cart = () => {
  const { cart, addItem, removeItem, clearCart } = useCart();

  // Example item for demo purposes
  const demoItem = { id: 1, name: "Sample Item" };

  return (
    <div className="cart-container">
      <h3>Your Cart</h3>
      {cart.length === 0 ? (
        <div className="empty-cart-content">
          <img src={EmptyCart} alt="Empty Cart" style={{ width: "180px", height: "180px" }} />
          <p>Your added items will appear here</p>
          {/* <button onClick={() => addItem(demoItem)}>Add a sample item</button> */}
        </div>
      ) : (
        <div>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} (Qty: {item.quantity}){" "}
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={() => addItem(demoItem)}>Add another sample item</button>
        </div>
      )}
    </div>
  );
};

export default Cart;