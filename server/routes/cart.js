const express = require("express");
const crypto = require("crypto");
const { readJSON, writeJSON } = require("../utils/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function enrich(items) {
  const products = readJSON("products");
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);
}

router.get("/", (req, res) => {
  const carts = readJSON("carts");
  const items = carts[req.user.id] || [];
  res.json({ items: enrich(items) });
});

router.post("/", async (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body || {};
  if (!productId) return res.status(400).json({ error: "productId is required." });

  const products = readJSON("products");
  if (!products.find((p) => p.id === productId)) {
    return res.status(404).json({ error: "Product not found." });
  }

  const carts = readJSON("carts");
  const items = carts[req.user.id] || [];

  const existing = items.find(
    (i) => i.productId === productId && i.size === size && i.color === color
  );
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    items.push({
      itemId: crypto.randomUUID(),
      productId,
      size: size || null,
      color: color || null,
      quantity: Number(quantity),
    });
  }

  carts[req.user.id] = items;
  await writeJSON("carts", carts);
  res.status(201).json({ items: enrich(items) });
});

router.patch("/:itemId", async (req, res) => {
  const { quantity } = req.body || {};
  if (!quantity || quantity < 1) return res.status(400).json({ error: "quantity must be at least 1." });

  const carts = readJSON("carts");
  const items = carts[req.user.id] || [];
  const item = items.find((i) => i.itemId === req.params.itemId);
  if (!item) return res.status(404).json({ error: "Cart item not found." });

  item.quantity = Number(quantity);
  carts[req.user.id] = items;
  await writeJSON("carts", carts);
  res.json({ items: enrich(items) });
});

router.delete("/:itemId", async (req, res) => {
  const carts = readJSON("carts");
  const items = (carts[req.user.id] || []).filter((i) => i.itemId !== req.params.itemId);
  carts[req.user.id] = items;
  await writeJSON("carts", carts);
  res.json({ items: enrich(items) });
});

router.delete("/", async (req, res) => {
  const carts = readJSON("carts");
  carts[req.user.id] = [];
  await writeJSON("carts", carts);
  res.json({ items: [] });
});

// Merge a guest cart (kept in localStorage on the client) into the
// signed-in user's saved cart, e.g. right after login/register.
router.post("/merge", async (req, res) => {
  const { items: guestItems = [] } = req.body || {};
  const carts = readJSON("carts");
  const items = carts[req.user.id] || [];

  for (const g of guestItems) {
    const existing = items.find(
      (i) => i.productId === g.productId && i.size === g.size && i.color === g.color
    );
    if (existing) existing.quantity += Number(g.quantity || 1);
    else items.push({ itemId: crypto.randomUUID(), productId: g.productId, size: g.size || null, color: g.color || null, quantity: Number(g.quantity || 1) });
  }

  carts[req.user.id] = items;
  await writeJSON("carts", carts);
  res.json({ items: enrich(items) });
});

module.exports = router;
