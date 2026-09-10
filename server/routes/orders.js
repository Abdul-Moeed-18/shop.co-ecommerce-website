const express = require("express");
const crypto = require("crypto");
const { readJSON, writeJSON } = require("../utils/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const DELIVERY_FEE = 15;
const COUPONS = {
  SHOPCO20: 20,
  WELCOME10: 10,
};

router.post("/apply-coupon", (req, res) => {
  const { code } = req.body || {};
  const percent = COUPONS[String(code || "").toUpperCase()];
  if (!percent) return res.status(404).json({ error: "That promo code isn't valid." });
  res.json({ code: String(code).toUpperCase(), percent });
});

router.get("/", (req, res) => {
  const orders = readJSON("orders").filter((o) => o.userId === req.user.id);
  res.json({ orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

router.get("/:id", (req, res) => {
  const order = readJSON("orders").find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json({ order });
});

router.post("/", async (req, res) => {
  const { shippingAddress, couponCode } = req.body || {};

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
    return res.status(400).json({ error: "A complete shipping address is required." });
  }

  const carts = readJSON("carts");
  const cartItems = carts[req.user.id] || [];
  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const products = readJSON("products");
  const lineItems = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : "Unknown product",
      category: product ? product.category : null,
      image: product ? product.image || null : null,
      price: product ? product.price : 0,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discountPercent = 0;
  let appliedCoupon = null;
  if (couponCode && COUPONS[String(couponCode).toUpperCase()]) {
    appliedCoupon = String(couponCode).toUpperCase();
    discountPercent = COUPONS[appliedCoupon];
  }
  const discountAmount = Math.round(((subtotal * discountPercent) / 100) * 100) / 100;
  const total = Math.max(0, subtotal - discountAmount + DELIVERY_FEE);

  const order = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    items: lineItems,
    shippingAddress,
    coupon: appliedCoupon,
    subtotal,
    discountPercent,
    discountAmount,
    deliveryFee: DELIVERY_FEE,
    total,
    status: "placed",
    createdAt: new Date().toISOString(),
  };

  const orders = readJSON("orders");
  orders.push(order);
  await writeJSON("orders", orders);

  carts[req.user.id] = [];
  await writeJSON("carts", carts);

  res.status(201).json({ order });
});

module.exports = router;
