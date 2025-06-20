import React, { memo } from "react";
import AddToCartButton from "../AddToCartButton";
import "./styles.css";

const ProductCard = memo(function ProductCard({ product }) {
  const { id, name, price, image, category } = product;
  return (
    <div className="product-card">
      <img
        src={image.desktop}
        alt={name}
        className="product-image"
        loading="lazy"
      />
      <AddToCartButton 
        productId={id} 
        productName={name}
        productPrice={price}
      />
      <div className="product-content">
        <p className="product-category">{category}</p>
        <div className="product-name">{name}</div>
        <p className="product-price">${price}</p>
      </div>
    </div>
  );
});

export default ProductCard;