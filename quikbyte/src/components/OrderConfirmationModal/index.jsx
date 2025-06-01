import React from 'react';
import { CheckCircle } from "lucide-react";
import { LABELS } from '../../constants';
import "./styles.css";

const OrderConfirmationModal = ({ isOpen, onClose, orderItems, orderTotal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="success-icon">
            <CheckCircle size={40} color="#4CAF50" strokeWidth={1.5} />
          </div>
          <h2 className="modal-title">{LABELS.ORDER.CONFIRMED}</h2>
          <p className="modal-subtitle">{LABELS.ORDER.HOPE_ENJOY}</p>
        </div>
        
        <div className="order-summary">
          {orderItems.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.image?.thumbnail} alt={item.name} className="item-image" />
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-quantity-price">
                  <span>{item.quantity}x</span>
                  
                  {item.originalPrice ? (
                    <span className="item-price">
                      <span className="original-price">@${item.originalPrice.toFixed(2)}</span>
                      <span className="discounted-price">@${item.price.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span className="item-price">@${item.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        <div className="order-total-row">
          <span>{LABELS.CART.ORDER_TOTAL}</span>
          <span className="order-total-amount">${orderTotal.toFixed(2)}</span>
        </div>
        
        <button onClick={onClose} className="new-order-button">
          {LABELS.ORDER.START_NEW}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;