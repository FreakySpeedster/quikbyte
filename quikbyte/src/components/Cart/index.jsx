import React, { useState, useMemo, lazy, Suspense, useCallback } from "react";
import { useCart } from "../../contexts/CartContext";
import EmptyCart from "../../../public/empty-cart.svg";
import CarbonNeutral from "../../../public/carbon-neutral.svg";
import Item from "./Item";
import { LABELS } from "../../constants";
const OrderConfirmationModal = lazy(() => 
  import('../OrderConfirmationModal')
);
import "./styles.css";

const CONFIRM_ORDER_API_URL = "/api/order";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderItems, setConfirmedOrderItems] = useState([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const orderTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  const handleOrderSubmission = async () => {
    if (cart.length === 0) return;

    // Prepare order data
    const orderData = {
      couponCode: "",
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
        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        } else {
          throw new Error(result.message || `Error ${response.status}: Failed to place order`);
        }
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

  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, [setShowConfirmation]);

  return (
    <>
      <div className="cart-container">
        <div className="cart-heading">{LABELS.CART.TITLE}</div>
        {cart.length === 0 ? (
          <div className="empty-cart-content">
            <img src={EmptyCart} alt="Empty Cart" style={{ width: "180px", height: "180px" }} />
            <p>{LABELS.CART.EMPTY_CART}</p>
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
                <span className="order-total-label">{LABELS.CART.ORDER_TOTAL}</span>
                <span className="total-amount">${orderTotal.toFixed(2)}</span>
              </div>
              <div className="carbon-neutral">
                <img src={CarbonNeutral} alt="Empty Cart" style={{ width: "18px", height: "18px" }} />
                <p>{LABELS.CART.CARBON_NEUTRAL}</p>
              </div>
              <button className="place-order-btn" onClick={handleOrderSubmission} disabled={isSubmitting || cart.length === 0}>
                {isSubmitting ? LABELS.CART.PROCESSING : LABELS.CART.CONFIRM_ORDER}
              </button>
            </div>
          </div>
        )}
      </div>
      {showConfirmation && (
        <Suspense fallback={<div>Loading...</div>}>
          <OrderConfirmationModal 
            isOpen={showConfirmation}
            onClose={handleCloseConfirmation}
            orderItems={confirmedOrderItems}
            orderTotal={confirmedTotal}
          />
        </Suspense>
      )}
    </>
  );
};

export default Cart;