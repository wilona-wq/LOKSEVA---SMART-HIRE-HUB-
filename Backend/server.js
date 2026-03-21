require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const providerRoutes = require("./routes/providerRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("   Body:", req.body);
  }
  next();
});

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  })
);

// Serve static files from Frontend
app.use(express.static(path.join(__dirname, "../Frontend")));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 LOKSEVA - Smart Hire Hub API is running",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;