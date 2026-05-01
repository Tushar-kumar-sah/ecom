// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

// Simple admin login (no JWT, just hardcoded check)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials – change to your own
  if (username === "admin" && password === "123456") {
    return res.json({
      success: true,
      user: {
        username: "admin",
        role: "admin"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
});

// Example protected route (you can add more later)
router.get("/dashboard", (req, res) => {
  // For now, just a placeholder – you can add token check later
  res.json({ success: true, message: "Welcome to admin dashboard" });
});

module.exports = router;