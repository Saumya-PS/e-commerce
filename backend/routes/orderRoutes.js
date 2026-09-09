// ==========================================
// Order Routes
// ==========================================
// "checkout" turns the user's current cart into an Order, then empties the cart.
// Users can view their own past orders.
// Admins can view ALL orders from every user (for the admin dashboard).

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { verifyToken, isAdmin } = require("../middleware/auth");

// POST - checkout (create an order from the current cart)
router.post("/checkout", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("cart.product");

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // build the order items from the cart, saving a snapshot of name/price
    const orderItems = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: user._id,
      items: orderItems,
      totalAmount,
    });

    await newOrder.save();

    // empty the cart after placing the order
    user.cart = [];
    await user.save();

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// GET - logged in user's own orders
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// GET - ALL orders from every user (admin only, for the admin dashboard)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// PUT - update order status (admin only), e.g. mark as "shipped"
router.put("/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = router;
