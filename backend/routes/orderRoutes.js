// routes/orderRoutes.js
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

/* ===============================
GET ALL ORDERS
/api/orders
=============================== */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.log(
      "GET ORDERS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to load orders",
    });
  }
});

/* ===============================
CREATE ORDER
/api/orders
=============================== */
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    const saved = await order.save();

    res.status(201).json({
      success: true,
      order: saved,
    });
  } catch (error) {
    console.log(
      "CREATE ORDER ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

/* ===============================
UPDATE ORDER STATUS
/api/orders/:id
=============================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      order: updated,
    });
  } catch (error) {
    console.log(
      "UPDATE ORDER ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
});

/* ===============================
DELETE ORDER
/api/orders/:id
=============================== */
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    console.log(
      "DELETE ORDER ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

module.exports = router;