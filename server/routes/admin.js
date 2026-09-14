const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const Order = require("../models/Order");
const router = express.Router();

// =========================
// GET ALL CUSTOMERS
// =========================

router.get("/customers", adminAuth, async (req, res) => {
    try {
        const users = await User.find()
            .select("-_id -__v -passwordHash")
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            customers: users,
            total: users.length,
        });
    } catch (error) {
        console.error("Customers error:", error);
        res.status(500).json({
            error: "Failed to fetch customers.",
        });
    }
});
// =========================
// ADMIN LOGIN
// =========================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required.",
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase(),
        });

        if (!admin) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        if (!match) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: "admin",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin",
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Login failed.",
        });
    }
});


// =========================
// ADMIN PROFILE
// =========================

router.get("/me", adminAuth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
            .select("-password");

        if (!admin) {
            return res.status(404).json({
                error: "Admin not found.",
            });
        }

        res.json({
            admin,
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to get admin.",
        });
    }
});


// =========================
// GET ALL PRODUCTS
// =========================

router.get("/products", adminAuth, async (req, res) => {
    try {
        const products = await Product.find()
            .select("-_id -__v")
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            products,
            total: products.length,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch products.",
        });
    }
});
router.get("/orders", adminAuth, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            orders,
            total: orders.length,
        });
    } catch (error) {
        console.error("Admin orders error:", error);

        res.status(500).json({
            error: "Failed to fetch orders.",
        });
    }
});

// =========================
// GET SINGLE PRODUCT
// =========================

router.get("/products/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findOne({
            id: req.params.id,
        })
            .select("-_id -__v")
            .lean();

        if (!product) {
            return res.status(404).json({
                error: "Product not found.",
            });
        }

        res.json({
            product,
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch product.",
        });
    }
});


// =========================
// ADD PRODUCT
// =========================

router.post("/products", adminAuth, async (req, res) => {
    try {
        const {
            name,
            category,
            dressStyle,
            price,
            originalPrice,
            discount,
            rating,
            reviewCount,
            colors,
            sizes,
            description,
            isNew,
            image,
        } = req.body;

        if (!name || !category || !dressStyle || price === undefined) {
            return res.status(400).json({
                error: "Name, category, dress style and price are required.",
            });
        }

        const product = await Product.create({
            id: `p-${crypto.randomUUID()}`,

            name,
            category,
            dressStyle,

            price: Number(price),

            originalPrice:
                originalPrice === "" ||
                    originalPrice === null ||
                    originalPrice === undefined
                    ? null
                    : Number(originalPrice),

            discount: Number(discount || 0),

            rating: Number(rating || 0),

            reviewCount: Number(reviewCount || 0),

            colors: Array.isArray(colors) ? colors : [],

            sizes: Array.isArray(sizes) ? sizes : [],

            description: description || "",

            isNew: Boolean(isNew),

            image: image || "",

            createdAt: new Date().toISOString(),
        });

        res.status(201).json({
            message: "Product created successfully.",
            product,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create product.",
        });
    }
});


// =========================
// UPDATE PRODUCT
// =========================

router.put("/products/:id", adminAuth, async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "category",
            "dressStyle",
            "price",
            "originalPrice",
            "discount",
            "rating",
            "reviewCount",
            "colors",
            "sizes",
            "description",
            "isNew",
            "image",
        ];

        const update = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                update[field] = req.body[field];
            }
        }

        if (update.price !== undefined) {
            update.price = Number(update.price);
        }

        if (update.originalPrice !== undefined) {
            update.originalPrice =
                update.originalPrice === "" ||
                    update.originalPrice === null
                    ? null
                    : Number(update.originalPrice);
        }

        if (update.discount !== undefined) {
            update.discount = Number(update.discount);
        }

        if (update.rating !== undefined) {
            update.rating = Number(update.rating);
        }

        if (update.reviewCount !== undefined) {
            update.reviewCount = Number(update.reviewCount);
        }

        const product = await Product.findOneAndUpdate(
            { id: req.params.id },
            { $set: update },
            {
                new: true,
                runValidators: true,
            }
        )
            .select("-_id -__v")
            .lean();

        if (!product) {
            return res.status(404).json({
                error: "Product not found.",
            });
        }

        res.json({
            message: "Product updated successfully.",
            product,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update product.",
        });
    }
});


// =========================
// DELETE PRODUCT
// =========================

router.delete("/products/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            id: req.params.id,
        });

        if (!product) {
            return res.status(404).json({
                error: "Product not found.",
            });
        }

        res.json({
            message: "Product deleted successfully.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete product.",
        });
    }
});


module.exports = router;