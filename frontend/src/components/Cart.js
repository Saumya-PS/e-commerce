import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

// Shows the items in the logged-in user's cart.
// Lets them change quantity, remove items, and checkout.
function Cart({ token, onCartUpdate }) {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart`, { headers: authHeaders });
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setMessage("Could not load cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // don't allow 0 or negative quantity here, use remove button instead

    try {
      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ productId, quantity }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
      onCartUpdate(updatedCart);
    } catch (err) {
      setMessage("Could not update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
      onCartUpdate(updatedCart);
    } catch (err) {
      setMessage("Could not remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: authHeaders,
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Checkout failed");
        return;
      }

      onCartUpdate([]); // cart is now empty
      navigate("/orders");
    } catch (err) {
      setMessage("Checkout failed");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="container">
      <h2>Your Cart</h2>

      {message && <p className="error">{message}</p>}

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item) => (
        <div className="cart-item" key={item.product._id}>
          <div className="cart-item-info">
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div>
              <h4>{item.product.name}</h4>
              <p className="price">₹{item.product.price}</p>
            </div>
          </div>

          <div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              style={{ width: "60px" }}
              onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
            />
          </div>

          <button onClick={() => removeItem(item.product._id)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <p className="cart-total">Total: ₹{total}</p>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;
