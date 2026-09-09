// ==========================================
// Cart Routes
// ==========================================
// The cart is stored directly on the User document (see User.js).
// All these routes need the user to be logged in.

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// GET the logged-in user's cart (with product details populated)
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("cart.product");
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// POST - add a product to the cart (or increase quantity if it's already there)
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.userId);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    const updatedUser = await User.findById(req.user.userId).populate("cart.product");
    res.status(200).json(updatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// PUT - update the quantity of a cart item
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.userId);

    const item = user.cart.find((item) => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(req.user.userId).populate("cart.product");
    res.status(200).json(updatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// DELETE - remove a product from the cart
router.delete("/remove/:productId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();

    const updatedUser = await User.findById(req.user.userId).populate("cart.product");
    res.status(200).json(updatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = router;
