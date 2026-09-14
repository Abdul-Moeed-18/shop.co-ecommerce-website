require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");

async function migrateProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const filePath = path.join(__dirname, "../data/products.json");

        const products = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );

        console.log(`Found ${products.length} products`);

        for (const product of products) {
            await Product.updateOne(
                { id: product.id },
                { $set: product },
                { upsert: true }
            );
        }

        console.log("Products migrated successfully!");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    }
}

migrateProducts();