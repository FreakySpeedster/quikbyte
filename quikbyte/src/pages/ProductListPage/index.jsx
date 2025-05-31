import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../../components/ProductCard";
import Cart from "../../components/Cart";
import { LABELS } from "../../constants";
import "./styles.css";

const PRODUCT_API_URL = "/api/product";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(PRODUCT_API_URL);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || LABELS.PRODUCTS.ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, retryCount]);
  
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{LABELS.PRODUCTS.LOADING}</p>
      </div>
    );
  }
  
  // Error state UI
  if (error) {
    return (
      <div className="error-container">
        <h2>{LABELS.PRODUCTS.SOMETHING_WRONG}</h2>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          {LABELS.PRODUCTS.RETRY}
        </button>
      </div>
    );
  }
  
  // Empty state UI
  if (products.length === 0) {
    return (
      <div className="empty-state-container">
        <h2>{LABELS.PRODUCTS.EMPTY}</h2>
        <p>{LABELS.PRODUCTS.UPDATING_MENU}</p>
        <button onClick={handleRetry} className="refresh-button">
          {LABELS.PRODUCTS.REFRESH}
        </button>
      </div>
    );
  }

  return (
    <div className="desserts-page">
      <div className="desserts-header">
        <h1>{LABELS.PRODUCTS.TITLE}</h1>
        <p className="product-count">{products.length} items available</p>
      </div>
      
      <div className="dessert-flex">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Cart />
    </div>
  );
};

export default ProductListPage;