const express = require("express");

const Product = require("../models/Product");

const router = express.Router();

// Get categories and dress styles
router.get("/categories", async (req, res, next) => {
  try {
    const products = await Product.find()
      .select("category dressStyle")
      .lean();

    const categories = [
      ...new Set(products.map((p) => p.category)),
    ].sort();

    const dressStyles = [
      ...new Set(products.map((p) => p.dressStyle)),
    ].sort();

    res.json({ categories, dressStyles });
  } catch (error) {
    next(error);
  }
});

// Get products
router.get("/", async (req, res, next) => {
  try {
    const {
      category,
      dressStyle,
      color,
      size,
      minPrice,
      maxPrice,
      search,
      sort,
      isNew,
      onSale,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // Category filter
    if (category) {
      const wanted = String(category)
        .toLowerCase()
        .split(",");

      filter.category = {
        $in: wanted.map(
          (value) => new RegExp(`^${escapeRegex(value)}$`, "i")
        ),
      };
    }

    // Dress style filter
    if (dressStyle) {
      filter.dressStyle = new RegExp(
        `^${escapeRegex(String(dressStyle))}$`,
        "i"
      );
    }

    // Color filter
    if (color) {
      const wanted = String(color)
        .toLowerCase()
        .split(",");

      filter["colors.name"] = {
        $in: wanted.map(
          (value) => new RegExp(`^${escapeRegex(value)}$`, "i")
        ),
      };
    }

    // Size filter
    if (size) {
      const wanted = String(size)
        .toLowerCase()
        .split(",");

      filter.sizes = {
        $in: wanted.map(
          (value) => new RegExp(`^${escapeRegex(value)}$`, "i")
        ),
      };
    }

    // Price filters
    if (minPrice) {
      filter.price = {
        ...(filter.price || {}),
        $gte: Number(minPrice),
      };
    }

    if (maxPrice) {
      filter.price = {
        ...(filter.price || {}),
        $lte: Number(maxPrice),
      };
    }

    // New products
    if (isNew === "true") {
      filter.isNew = true;
    }

    // Sale products
    if (onSale === "true") {
      filter.discount = { $gt: 0 };
    }

    // Search
    if (search) {
      const q = escapeRegex(String(search));

      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;

      case "price-desc":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "newest":
        sortOption = { createdAt: -1 };
        break;

      default:
        sortOption = {};
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .select("-_id -__v")
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get("/:id", async (req, res, next) => {
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

    const related = await Product.find({
      id: { $ne: product.id },
      category: product.category,
    })
      .select("-_id -__v")
      .limit(4)
      .lean();

    res.json({
      product,
      related,
    });
  } catch (error) {
    next(error);
  }
});

// Escape special regex characters
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = router;