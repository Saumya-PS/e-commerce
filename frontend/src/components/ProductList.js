import React, { useState, useEffect } from "react";
import { API_URL } from "../api";

// Shows all products in a grid. If the user is logged in, they can
// click "Add to Cart" on any product.
function ProductList({ token, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?category=${category}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setMessage("Could not load products. Is the backend server running?");
    }
  };

  const addToCart = async (productId) => {
    if (!token) {
      setMessage("Please login first to add items to your cart");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const cart = await response.json();
      setMessage("Added to cart!");
      onCartUpdate(cart); // tell App.js the cart changed, so the navbar badge updates
    } catch (err) {
      setMessage("Could not add to cart");
    }
  };

  return (
    <div className="container">
      <h2>Our Products</h2>

      {message && <p style={{ textAlign: "center" }}>{message}</p>}

      <div className="tabs">
        {["all", "electronics", "clothing", "home", "stationery"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.imageUrl} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p className="price">₹{product.price}</p>
            <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {products.length === 0 && <p>No products found in this category.</p>}
    </div>
  );
}

export default ProductList;
