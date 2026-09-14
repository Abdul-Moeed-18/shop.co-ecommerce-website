const express = require("express");
const crypto = require("crypto");

const { readJSON, writeJSON } = require("../utils/db");
const { requireAuth } = require("../middleware/auth");

const Product = require("../models/Product");
const Order = require("../models/Order");

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

    if (!percent) {
        return res.status(404).json({
            error: "That promo code isn't valid.",
        });
    }

    res.json({
        code: String(code).toUpperCase(),
        percent,
    });
});

// Get logged-in user's orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ orders });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({
            error: "Failed to load orders.",
        });
    }
});

// Get one order
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findOne({
            id: req.params.id,
            userId: req.user.id,
        }).lean();

        if (!order) {
            return res.status(404).json({
                error: "Order not found.",
            });
        }

        res.json({ order });
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            error: "Failed to load order.",
        });
    }
});

// Create order
router.post("/", async (req, res) => {
    try {
        const { shippingAddress, couponCode } = req.body || {};

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.phone
        ) {
            return res.status(400).json({
                error: "A complete shipping address is required.",
            });
        }

        // Cart abhi existing JSON system se read hoga
        const carts = readJSON("carts");
        const cartItems = carts[req.user.id] || [];

        if (cartItems.length === 0) {
            return res.status(400).json({
                error: "Your cart is empty.",
            });
        }

        // Products MongoDB se
        const products = await Product.find().lean();

        const lineItems = cartItems.map((item) => {
            const product = products.find(
                (p) => p.id === item.productId
            );

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

        const subtotal = lineItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        let discountPercent = 0;
        let appliedCoupon = null;

        const normalizedCoupon = String(
            couponCode || ""
        ).toUpperCase();

        if (COUPONS[normalizedCoupon]) {
            appliedCoupon = normalizedCoupon;
            discountPercent = COUPONS[normalizedCoupon];
        }

        const discountAmount =
            Math.round(
                ((subtotal * discountPercent) / 100) * 100
            ) / 100;

        const total = Math.max(
            0,
            subtotal - discountAmount + DELIVERY_FEE
        );

        const order = await Order.create({
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
        });

        // Cart clear
        carts[req.user.id] = [];
        await writeJSON("carts", carts);

        res.status(201).json({
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            error: "Failed to create order.",
        });
    }
});

module.exports = router;