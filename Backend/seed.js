// Seed script - INSERT ADMIN INTO MONGODB
// Run with: node seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@lokseva.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists, skipping...");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin1233", salt);

    await User.create({
      name: "Admin",
      email: "admin@lokseva.com",
      phone: "9876543212",
      password: hashedPassword,
      role: "admin",
      city: "Mumbai",
      address: "Admin HQ",
      isVerified: true,
    });

    console.log("\n📊 ADMIN CREATED SUCCESSFULLY!");
    console.log("────────────────────────────────");
    console.log("🛡️  Admin:");
    console.log("   Email:    admin@lokseva.com");
    console.log("   Password: admin1233");
    console.log("────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedData();
