require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/admin");
const { attachUser } = require("./middleware/auth");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const IS_VERCEL = !!process.env.VERCEL;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(attachUser);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Serving the built React app from here is only relevant for a standalone
// Node deploy (e.g. Render) or local `npm start`. On Vercel, the client is
// built and served separately by @vercel/static-build (see vercel.json),
// so this block is skipped entirely there.
if (!IS_VERCEL) {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
      if (err) next();
    });
  });
}

app.use((req, res) => res.status(404).json({ error: "Not found." }));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

// On Vercel, @vercel/node imports this file and calls the exported app
// directly as a request handler for each invocation - it must NOT call
// app.listen() itself. Everywhere else (local dev, Render, etc.) it needs
// to actually start listening.
if (!IS_VERCEL) {
  app.listen(PORT, () => {
    console.log(`SHOP.CO API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
