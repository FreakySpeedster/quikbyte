import React from "react";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image.desktop}
        alt={product.name}
        className="product-image"
      />
      <AddToCartButton productId={product.id} />
      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <div className="product-name">{product.name}</div>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;