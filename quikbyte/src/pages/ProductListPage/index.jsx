import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import Cart from "../../components/Cart";
import "./styles.css";


const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="desserts-page">
      <h1>Desserts</h1>
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