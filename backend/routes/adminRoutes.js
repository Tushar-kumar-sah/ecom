const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

/* =========================
   DASHBOARD STATS
========================= */
router.get("/stats", async (req, res) => {
  try {
    const products =
      await Product.countDocuments();

    const users =
      await User.countDocuments();

    const orders =
      await Order.countDocuments();

    const revenueData =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum:
                "$totalPrice",
            },
          },
        },
      ]);

    const revenue =
      revenueData[0]
        ?.total || 0;

    res.json({
      products,
      users,
      orders,
      revenue,
    });
  } catch (error) {
    console.log(
      "Stats Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Stats failed",
    });
  }
});

/* =========================
   RECENT ORDERS
========================= */
router.get(
  "/recent-orders",
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .sort({
            createdAt: -1,
          })
          .limit(5);

      res.json(orders);
    } catch (error) {
      console.log(
        "Recent Orders Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Recent orders failed",
      });
    }
  }
);

module.exports = router;