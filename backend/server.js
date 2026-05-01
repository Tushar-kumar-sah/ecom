// backend/server.js
// FIXED SERVER.JS - USER ROUTES LOAD PROPERLY
// ADMIN PANEL + FRONTEND + AUTH + STABLE
// ADDED: RAZORPAY PAYMENT INTEGRATION

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ========== ADDED FOR RAZORPAY ==========
const Razorpay = require("razorpay");
const crypto = require("crypto");
// ========================================

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
RAZORPAY PAYMENT ROUTES (ADDED)
================================== */

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order endpoint
app.post("/api/create-razorpay-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Number(amount), // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // auto capture
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("✅ Razorpay order created:", order.id);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
});

// Verify Razorpay payment endpoint
app.post("/api/verify-razorpay-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log("✅ Payment verified:", razorpay_payment_id);
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      console.error("❌ Invalid signature for payment:", razorpay_payment_id);
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

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