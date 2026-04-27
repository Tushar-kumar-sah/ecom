// backend/server.js
// FIXED SERVER.JS - USER ROUTES LOAD PROPERLY
// ADMIN PANEL + FRONTEND + AUTH + STABLE

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ==================================
ENV CHECK
================================== */

if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI missing in .env");
  process.exit(1);
}

/* ==================================
MIDDLEWARE
================================== */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ==================================
DATABASE CONNECT
================================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("📦 Database:", mongoose.connection.name);
  })
  .catch((error) => {
    console.log("❌ MongoDB Error:", error.message);
    process.exit(1);
  });

/* ==================================
MAIN ROUTES (DIRECT LOAD)
================================== */

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

/* ==================================
OPTIONAL ROUTES
================================== */

let couponRoutes = null;
let settingsRoutes = null;

try {
  couponRoutes = require("./routes/couponRoutes");
  console.log("✅ couponRoutes Loaded");
} catch (error) {
  console.log("⚠️ couponRoutes Missing");
}

try {
  settingsRoutes = require("./routes/settingsRoutes");
  console.log("✅ settingsRoutes Loaded");
} catch (error) {
  console.log("⚠️ settingsRoutes Missing");
}

/* ==================================
API ROUTES
================================== */

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

if (couponRoutes) {
  app.use("/api/coupons", couponRoutes);
}

if (settingsRoutes) {
  app.use("/api/settings", settingsRoutes);
}

/* ==================================
TEST ROUTES
================================== */

app.get("/", (req, res) => {
  res.send("🚀 UK Traders Backend Running");
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "API Working",
    time: new Date(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "Running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

/* ==================================
404 ROUTE
================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* ==================================
GLOBAL ERROR HANDLER
================================== */

app.use((err, req, res, next) => {
  console.log("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ==================================
START SERVER
================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});