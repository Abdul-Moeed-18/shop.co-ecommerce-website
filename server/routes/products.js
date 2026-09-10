const express = require("express");
const { readJSON } = require("../utils/db");

const router = express.Router();

router.get("/categories", (req, res) => {
  const products = readJSON("products");
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const dressStyles = [...new Set(products.map((p) => p.dressStyle))].sort();
  res.json({ categories, dressStyles });
});

router.get("/", (req, res) => {
  let products = readJSON("products");
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

  if (category) {
    const wanted = String(category).toLowerCase().split(",");
    products = products.filter((p) => wanted.includes(p.category.toLowerCase()));
  }
  if (dressStyle) {
    products = products.filter((p) => p.dressStyle.toLowerCase() === String(dressStyle).toLowerCase());
  }
  if (color) {
    const wanted = String(color).toLowerCase().split(",");
    products = products.filter((p) => p.colors.some((c) => wanted.includes(c.name.toLowerCase())));
  }
  if (size) {
    const wanted = String(size).toLowerCase().split(",");
    products = products.filter((p) => p.sizes.some((s) => wanted.includes(s.toLowerCase())));
  }
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));
  if (isNew === "true") products = products.filter((p) => p.isNew);
  if (onSale === "true") products = products.filter((p) => p.discount > 0);
  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "price-asc":
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      products = [...products].sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      products = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    default:
      break;
  }

  const total = products.length;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const start = (pageNum - 1) * limitNum;
  const paged = products.slice(start, start + limitNum);

  res.json({ products: paged, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
});

router.get("/:id", (req, res) => {
  const products = readJSON("products");
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  res.json({ product, related });
});

module.exports = router;
