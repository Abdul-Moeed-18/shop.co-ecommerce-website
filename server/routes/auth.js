const express = require("express");
const bcrypt = require("bcryptjs");
const { readJSON, writeJSON } = require("../utils/db");
const { signToken, requireAuth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with that email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    res.cookie("token", token, COOKIE_OPTS);

    res.status(201).json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      error: "Registration failed.",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    res.cookie("token", token, COOKIE_OPTS);

    res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed.",
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTS);

  res.json({
    success: true,
  });
});

// CURRENT USER
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.user.id,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Me error:", error);

    res.status(500).json({
      error: "Unable to load user.",
    });
  }
});

module.exports = router;