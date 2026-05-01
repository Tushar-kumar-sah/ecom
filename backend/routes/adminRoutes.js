const express = require("express");
const router = express.Router();

// MODELS
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

/* =========================
   DASHBOARD STATS
========================= */
router.get("/stats", async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      success: true,
      products,
      users,
      orders,
      revenue,
    });
  } catch (error) {
    console.error("Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
});

/* =========================
   RECENT ORDERS
========================= */
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Recent Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load recent orders",
    });
  }
});

module.exports = router;