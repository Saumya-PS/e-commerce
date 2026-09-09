import React, { useState, useEffect } from "react";
import { API_URL } from "../api";

// Admin-only page with two tabs:
// 1. Products - add / edit / delete products
// 2. Orders - view all orders from all users and update their status
function AdminDashboard({ token }) {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // form state for adding/editing a product
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "general",
    stock: "",
  });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (tab === "products") fetchProducts();
    if (tab === "orders") fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/api/products`);
    const data = await response.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const response = await fetch(`${API_URL}/api/orders/all`, { headers: authHeaders });
    const data = await response.json();
    setOrders(data);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", imageUrl: "", category: "general", stock: "" });
    setEditingId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/api/products/${editingId}`
        : `${API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Something went wrong");
        return;
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock,
    });
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    fetchProducts();
  };

  const updateOrderStatus = async (orderId, status) => {
    await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="tabs">
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
          Products
        </button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
          Orders
        </button>
      </div>

      {message && <p className="error">{message}</p>}

      {/* ---------------- PRODUCTS TAB ---------------- */}
      {tab === "products" && (
        <div>
          <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleFormSubmit} className="narrow-container" style={{ margin: "0 0 20px 0" }}>
            <input
              type="text"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="general">general</option>
              <option value="electronics">electronics</option>
              <option value="clothing">clothing</option>
              <option value="home">home</option>
              <option value="stationery">stationery</option>
            </select>
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ marginLeft: "8px", backgroundColor: "#999" }}>
                Cancel
              </button>
            )}
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => startEdit(product)}>Edit</button>{" "}
                    <button onClick={() => deleteProduct(product._id)} style={{ backgroundColor: "#d63031" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- ORDERS TAB ---------------- */}
      {tab === "orders" && (
        <div>
          <h3>All Orders</h3>
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <p>
                <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
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
              <label>
                Status:{" "}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="placed">placed</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
