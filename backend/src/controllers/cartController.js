const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity !== undefined && quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    // 🔥 Product details populate karo
    await cart.populate("items.product");

    let totalItems = 0;
    let subtotal = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      subtotal += item.quantity * item.product.price;
    });

    res.status(200).json({
      success: true,
      totalItems,
      subtotal,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Empty",
      });
    }

    let totalItems = 0;
    let subtotal = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      subtotal += item.quantity * item.product.price;
    });

    res.status(200).json({
      success: true,
      totalItems,
      subtotal,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    await cart.populate("items.product");

    let totalItems = 0;
    let subtotal = 0;

    cart.items.forEach((item) => {
      if (!item.product) return;

      totalItems += item.quantity;
      subtotal += item.quantity * item.product.price;
    });

    return res.status(200).json({
      success: true,
      message: "Cart Updated",
      totalItems,
      subtotal,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    await cart.populate("items.product");

    let totalItems = 0;
    let subtotal = 0;

    cart.items.forEach((item) => {
      if (!item.product) return;

      totalItems += item.quantity;
      subtotal += item.quantity * item.product.price;
    });

    return res.status(200).json({
      success: true,
      message: "Item Removed",
      totalItems,
      subtotal,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart Cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeItem,
  clearCart,
};
