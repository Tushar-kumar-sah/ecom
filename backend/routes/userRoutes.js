// routes/userRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

/* ==================================
JWT TOKEN
================================== */

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "uktraders_secret",
    { expiresIn: "7d" }
  );
};

/* ==================================
REGISTER USER
POST /api/users/register
================================== */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields",
      });
    }

    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
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
        email:
          email.toLowerCase(),
        phone,
        password:
          hashedPassword,
      });

    const token =
      generateToken(user);

    res.status(201).json({
      success: true,
      message:
        "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address:
          user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(
      "REGISTER ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Registration failed",
    });
  }
});

/* ==================================
LOGIN USER
POST /api/users/login
================================== */

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token =
      generateToken(user);

    res.json({
      success: true,
      message:
        "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address:
          user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(
      "LOGIN ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Login failed",
    });
  }
});

/* ==================================
GET ALL USERS
GET /api/users
(Admin Panel)
================================== */

router.get("/", async (req, res) => {
  try {
    const users =
      await User.find().sort({
        createdAt: -1,
      });

    res.json(users);
  } catch (error) {
    console.log(
      "GET USERS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load users",
    });
  }
});

/* ==================================
GET SINGLE USER
GET /api/users/:id
================================== */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.json(user);
    } catch {
      res.status(404).json({
        message:
          "Invalid user id",
      });
    }
  }
);

/* ==================================
DELETE USER
DELETE /api/users/:id
(Admin Panel)
================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "User deleted",
      });
    } catch (error) {
      console.log(
        "DELETE USER ERROR:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Delete failed",
      });
    }
  }
);

module.exports = router;