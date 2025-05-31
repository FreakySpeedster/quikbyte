import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../../components/ProductCard";
import Cart from "../../components/Cart";
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
      setError(err.message || "Failed to load products. Please try again.");
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
        <p>Loading delicious desserts...</p>
      </div>
    );
  }
  
  // Error state UI
  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }
  
  // Empty state UI
  if (products.length === 0) {
    return (
      <div className="empty-state-container">
        <h2>No Desserts Available</h2>
        <p>We're currently updating our menu. Check back soon for delicious treats!</p>
        <button onClick={handleRetry} className="refresh-button">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="desserts-page">
      <div className="desserts-header">
        <h1>Desserts</h1>
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