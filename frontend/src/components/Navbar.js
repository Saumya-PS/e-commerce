import React from "react";
import { Link, useNavigate } from "react-router-dom";

// The top navigation bar. Shows different links depending on whether
// the user is logged in, and whether they are an admin.
function Navbar({ isLoggedIn, isAdmin, cartCount, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/" className="brand">E-Store</Link>

      <div className="nav-links">
        <Link to="/">Products</Link>

        {isLoggedIn && (
          <Link to="/cart">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        )}

        {isLoggedIn && <Link to="/orders">My Orders</Link>}

        {isLoggedIn && isAdmin && <Link to="/admin">Admin</Link>}

        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}

        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
}

export default Navbar;
