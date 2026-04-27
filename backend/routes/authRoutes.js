// backend/routes/authRoutes.js
// UPDATED LOGIN ROUTES
// Supports BOTH:
// 1) Existing admin account using username + password
// 2) Normal users using email + password

const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/* ===================================
🟢 REGISTER
POST /api/auth/register
=================================== */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = req.body;

    const exists =
      await User.findOne({
        email,
      });

    if (exists) {
      return res
        .status(400)
        .json({
          message:
            "Email already exists",
        });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        phone,
        role:
          role ||
          "customer",
      });

    res.json({
      success: true,
      message:
        "Registration successful",
      user: {
        id:
          user._id,
        name:
          user.name,
        email:
          user.email,
        role:
          user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Registration failed",
      });
  }
});

/* ===================================
🟢 LOGIN
POST /api/auth/login

Accepts:
{
 email, password
}

OR

{
 username, password
}
=================================== */
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      username,
      password,
    } = req.body;

    let user = null;

    /* ===============================
       FIND BY EMAIL
    =============================== */
    if (email) {
      user =
        await User.findOne({
          email,
        });
    }

    /* ===============================
       FIND BY USERNAME
    =============================== */
    if (!user && username) {
      user =
        await User.findOne({
          username,
        });
    }

    if (!user) {
      return res
        .status(400)
        .json({
          message:
            "User not found",
        });
    }

    /* Blocked account */
    if (
      user.isBlocked
    ) {
      return res
        .status(403)
        .json({
          message:
            "Account blocked",
        });
    }

    /* Compare Password */
    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res
        .status(400)
        .json({
          message:
            "Wrong password",
        });
    }

    /* ===============================
       AUTO FIX ADMIN ROLE
       If old admin doc has no role
    =============================== */
    let role =
      user.role;

    if (
      user.username ===
        "admin" &&
      !role
    ) {
      role = "admin";
    }

    /* ===============================
       CREATE JWT
    =============================== */
    const token =
      jwt.sign(
        {
          id:
            user._id,
          email:
            user.email ||
            "",
          username:
            user.username ||
            "",
          role:
            role ||
            "customer",
        },
        process.env.JWT_SECRET,
        {
          expiresIn:
            "7d",
        }
      );

    res.json({
      success: true,
      message:
        "Login successful",
      token,
      user: {
        id:
          user._id,
        name:
          user.name ||
          user.username,
        email:
          user.email ||
          "",
        username:
          user.username ||
          "",
        role:
          role ||
          "customer",
      },
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({
        message:
          "Login failed",
      });
  }
});

module.exports =
  router;