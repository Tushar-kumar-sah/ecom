const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

// 🔐 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ===============================
// 💳 CREATE ORDER
// ===============================
router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Amount received:", amount);

    // ❌ Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay Order Created:", order);

    res.json(order);
  } catch (err) {
    console.log("❌ Razorpay Order Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// 🔐 VERIFY PAYMENT
// ===============================
router.post("/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("Verification data:", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment Verified");
      res.json({ success: true });
    } else {
      console.log("❌ Signature mismatch");
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.log("❌ Verification Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;