const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");

require("dotenv").config();

const createAdmin = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            email: "admin@medops.com"
        });

        if (existingAdmin) {

            console.log("Admin already exists");

            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        const admin = await User.create({

            name: "MedOps Admin",

            email: "admin@medops.com",

            password: hashedPassword,

            role: "admin"

        });

        console.log("Admin created successfully");

        console.log({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });

        process.exit(0);

    }
    catch (error) {

        console.error("Error creating admin:", error);

        process.exit(1);
    }
};

createAdmin();