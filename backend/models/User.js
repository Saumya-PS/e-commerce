// ==========================================
// User Model
// ==========================================
// A user can be a normal customer or an admin.
// "isAdmin" decides if they can manage products (admin dashboard).
// "cart" stores the items the user has added to their cart.

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // by default every new user is a normal customer
  },
  cart: [cartItemSchema], // array of items in the user's cart
});

module.exports = mongoose.model("User", userSchema);
