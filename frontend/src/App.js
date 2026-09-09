import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { API_URL } from "./api";

import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import AdminDashboard from "./components/AdminDashboard";

// This is the main App component. It:
// - keeps track of login state (token, name, isAdmin) using localStorage
// - keeps track of the cart items count (for the navbar badge)
// - sets up all the page routes
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [cart, setCart] = useState([]);

  const isLoggedIn = Boolean(token);

  // load the cart whenever the user logs in
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch(() => {});
    }
  }, [token]);

  const handleLoginSuccess = (newToken, newName, newIsAdmin) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("name", newName);
    localStorage.setItem("isAdmin", newIsAdmin);
    setToken(newToken);
    setName(newName);
    setIsAdmin(newIsAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("isAdmin");
    setToken("");
    setName("");
    setIsAdmin(false);
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        cartCount={cartCount}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<ProductList token={token} onCartUpdate={setCart} />}
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart token={token} onCartUpdate={setCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/orders"
          element={isLoggedIn ? <Orders token={token} /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={
            isLoggedIn && isAdmin ? (
              <AdminDashboard token={token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
