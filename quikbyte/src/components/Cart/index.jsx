import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import EmptyCart from "../../../public/empty-cart.svg";
import CarbonNeutral from "../../../public/carbon-neutral.svg";
import Item from "./Item";
import OrderConfirmationModal from "../OrderConfirmationModal";
import "./styles.css";

const CONFIRM_ORDER_API_URL = "/api/order";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderItems, setConfirmedOrderItems] = useState([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const orderTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const handleOrderSubmission = async () => {
    if (cart.length === 0) return;

    // Prepare order data
    const orderData = {
      couponCode: "", // This can be dynamic if you add coupon functionality
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    setIsSubmitting(true);
    setOrderStatus(null);

    try {
      const response = await fetch(CONFIRM_ORDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      // Extract products from the API response
      const confirmedProducts = result.products.map(product => {
        // Find the matching item in the original order to get the quantity
        const originalOrderItem = result.items.find(item => item.productId === product.id);
        return {
          ...product,
          quantity: originalOrderItem?.quantity || 1
        };
      });

      // Save the current cart items and total for display in the confirmation modal
      setConfirmedOrderItems(confirmedProducts);
      setConfirmedTotal(orderTotal);
      
      // Success handling
      setOrderStatus({
        success: true,
        message: "Order placed successfully!"
      });
      
      // Show confirmation modal
      setShowConfirmation(true);
      
      // Clear cart after successful order
      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);
      setOrderStatus({
        success: false,
        message: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
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
              {/* {!orderStatus?.success && (
                <div className="order-status error">
                  {orderStatus?.message}
                </div>
              )} */}
              <div className="order-total">
                <span className="order-total-label">Order Total</span>
                <span className="total-amount">${orderTotal.toFixed(2)}</span>
              </div>
              <div className="carbon-neutral">
                <img src={CarbonNeutral} alt="Empty Cart" style={{ width: "18px", height: "18px" }} />
                <p>This is a <span style={{color: '#837975'}}>carbon-neutral</span> delivery</p>
              </div>
              <button className="place-order-btn" onClick={handleOrderSubmission} disabled={isSubmitting || cart.length === 0}>
                {isSubmitting ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <OrderConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        orderItems={confirmedOrderItems}
        orderTotal={confirmedTotal}
      />
    </>
  );
};

export default Cart;