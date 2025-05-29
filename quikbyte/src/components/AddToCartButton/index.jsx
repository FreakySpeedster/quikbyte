import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import "./styles.css";

const AddToCartButton = ({ productId }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity((q) => q + 1);
  };

  const handleRemove = () => {
    setQuantity((q) => (q > 0 ? q - 1 : 0));
  };

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
};

export default AddToCartButton;
