// ==========================================
// Week 4 Mini Project: E-Commerce Web Application (Backend)
// ==========================================
// This is the main entry file. It connects to MongoDB and plugs in
// all our route files (auth, products, cart, orders).

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// When deploying to Render, replace this with your MongoDB Atlas URL
// using an environment variable (see README for deployment steps).
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce API is running");
});

// Render (and most hosts) provide the PORT through an environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`E-Commerce backend running on http://localhost:${PORT}`);
});
