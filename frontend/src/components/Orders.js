import React, { useState, useEffect } from "react";
import { API_URL } from "../api";

// Shows the logged-in user's own past orders (order history).
function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setMessage("Could not load orders");
    }
  };

  return (
    <div className="container">
      <h2>My Orders</h2>

      {message && <p className="error">{message}</p>}
      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="status-badge">{order.status}</span>
          </p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity} — ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: ₹{order.totalAmount}</strong>
          </p>
        </div>
      ))}
    </div>
  );
}

export default Orders;
