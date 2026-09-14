const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            default: () => crypto.randomUUID(),
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        createdAt: {
            type: String,
            default: () => new Date().toISOString(),
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);