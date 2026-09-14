require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {

        const hash = await bcrypt.hash("123456", 10);

        await Admin.create({
            name: "Moeed",
            email: "admin@shopco.com",
            password: hash
        });

        console.log("Admin Created");

        process.exit();
    });