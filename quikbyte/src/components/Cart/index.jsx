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
const DISCOUNT_CODES = {
  "HAPPYHOURS": 0.18 // 18% discount
};

const Cart = () => {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderItems, setConfirmedOrderItems] = useState([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Apply discount code
  const applyDiscountCode = useCallback(() => {
    const code = discountCode.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount({
        code,
        percentage: DISCOUNT_CODES[code] * 100,
        value: DISCOUNT_CODES[code]
      });
      // Show success message
      setOrderStatus({
        success: true,
        message: LABELS.CART.DISCOUNT_APPLIED
      });
      setTimeout(() => setOrderStatus(null), 3000);
    } else if (code === "") {
      setAppliedDiscount(null);
    } else {
      // Show invalid code message briefly
      setOrderStatus({
        success: false,
        message: LABELS.CART.INVALID_CODE
      });
      setTimeout(() => setOrderStatus(null), 3000);
    }
  }, [discountCode]);
  
  // Clear the applied discount
  const clearDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountCode("");
  }, []);

  // Calculate order total with discount
  const orderTotal = useMemo(() => {
    const subtotal = cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Apply discount if valid
    if (appliedDiscount) {
      return subtotal * (1 - appliedDiscount.value);
    }
    return subtotal;
  }, [cart, appliedDiscount]);
  
  // Calculate total number of items in cart
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }, [cart]);

  const handleOrderSubmission = async () => {
    if (cart.length === 0) return;

    // Prepare order data
    const orderData = {
      couponCode: appliedDiscount ? appliedDiscount.code : "",
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

      // Apply the discount to the confirmed order items if applicable
      const confirmedItemsWithDiscount = confirmedProducts.map(item => {
        if (appliedDiscount) {
          // Apply discount to each item's price
          return {
            ...item,
            originalPrice: item.price,
            price: item.price * (1 - appliedDiscount.value)
          };
        }
        return item;
      });

      // Save the current cart items and total for display in the confirmation modal
      setConfirmedOrderItems(confirmedItemsWithDiscount);
      setConfirmedTotal(orderTotal);
      
      // Success handling - show the success message briefly
      setOrderStatus({
        success: true,
        message: "Order placed successfully!"
      });
      
      // Show confirmation modal
      setShowConfirmation(true);
      
      // Clear cart and discount after successful order
      clearCart();
      
      // Reset discount code and applied discount
      setDiscountCode("");
      setAppliedDiscount(null);
      
      // Clear the success message after a short delay
      setTimeout(() => {
        setOrderStatus(null);
      }, 1500);
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
    
    // Ensure discount is cleared when modal is closed
    if (discountCode || appliedDiscount) {
      setDiscountCode("");
      setAppliedDiscount(null);
    }
    
    // Clear any order status messages
    setOrderStatus(null);
  }, [setShowConfirmation, discountCode, appliedDiscount]);

  return (
    <>
      <div className="cart-container">
        <div className="cart-heading">
          {LABELS.CART.TITLE}
          {totalItems > 0 && <span className="cart-item-count">({totalItems})</span>}
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart-content">
            <img src={EmptyCart} alt="Empty Cart" style={{ width: "180px", height: "180px" }} />
            <p>{LABELS.CART.EMPTY_CART}</p>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map(item => (
                <Item 
                  key={item.id} 
                  item={item} 
                  discountValue={appliedDiscount ? appliedDiscount.value : 0} 
                />
              ))}
            </div>
            <div className="cart-summary">
              {/* Subtotal before discount */}
              {appliedDiscount && (
                <div className="subtotal">
                  <span>Subtotal</span>
                  <span>${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
              )}
              
              {/* Discount code input - only show if cart has items */}
              {cart.length > 0 && (
                <div className="discount-code-section">
                  <div className="discount-code-container">
                    <input
                      type="text"
                      className="discount-code-input"
                      placeholder={LABELS.CART.DISCOUNT_CODE}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyDiscountCode()}
                    />
                    <button 
                      className="apply-discount-btn"
                      onClick={applyDiscountCode}
                      disabled={discountCode.trim() === ""}
                    >
                      {LABELS.CART.APPLY_DISCOUNT}
                    </button>
                  </div>
                  
                  {/* Field level discount status message - always present to maintain layout */}
                  <div className={`discount-message ${
                    orderStatus && orderStatus.message && 
                    (orderStatus.message === LABELS.CART.DISCOUNT_APPLIED || 
                     orderStatus.message === LABELS.CART.INVALID_CODE) 
                      ? (orderStatus.success ? 'success' : 'error') 
                      : ''
                  }`}>
                    {orderStatus && orderStatus.message && 
                     (orderStatus.message === LABELS.CART.DISCOUNT_APPLIED || 
                      orderStatus.message === LABELS.CART.INVALID_CODE) 
                        ? orderStatus.message 
                        : '\u00A0'} {/* Non-breaking space to maintain height */}
                  </div>
                </div>
              )}
              
              {/* Display other order status messages */}
              {orderStatus && (cart.length > 0 || !orderStatus.success) && 
                orderStatus.message !== LABELS.CART.DISCOUNT_APPLIED && 
                orderStatus.message !== LABELS.CART.INVALID_CODE && (
                <div className={`order-status ${orderStatus.success ? 'success' : 'error'}`}>
                  {orderStatus.message}
                </div>
              )}
              
              {/* Show applied discount */}
              {appliedDiscount && (
                <div className="discount-info">
                  <div className="discount-label">
                    <span>Discount ({appliedDiscount.code} - {appliedDiscount.percentage}%)</span>
                    <button className="remove-discount" onClick={clearDiscount} aria-label="Remove discount">
                      &times;
                    </button>
                  </div>
                  <span className="discount-amount">-${(cart.reduce((total, item) => 
                    total + (item.price * item.quantity), 0) * appliedDiscount.value).toFixed(2)}</span>
                </div>
              )}
              
              {/* Order Total */}
              <div className="order-total">
                <span className="order-total-label">{LABELS.CART.ORDER_TOTAL}</span>
                <span className="total-amount">${orderTotal.toFixed(2)}</span>
              </div>
              
              <div className="carbon-neutral">
                <img src={CarbonNeutral} alt="Carbon Neutral" style={{ width: "18px", height: "18px" }} />
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