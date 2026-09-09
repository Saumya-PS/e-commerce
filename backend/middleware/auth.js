// ==========================================
// Auth Middleware
// ==========================================
// "verifyToken" checks that a valid JWT was sent, and lets the request continue.
// "isAdmin" checks that the logged in user is an admin (must be used AFTER verifyToken).

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "ecommerceSecretKey123";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // now req.user.userId is available
    next();
  });
}

// This must run AFTER verifyToken, since it needs req.user.userId
async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
}

module.exports = { verifyToken, isAdmin, JWT_SECRET };
