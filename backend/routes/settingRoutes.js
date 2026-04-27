// routes/settingsRoutes.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/* ===============================
MODEL
=============================== */

const settingsSchema =
  new mongoose.Schema(
    {
      storeName: String,
      email: String,
      phone: String,
      currency: String,
      shipping: Number,
      tax: Number,
      cod: Boolean,
      maintenance: Boolean,
    },
    {
      timestamps: true,
    }
  );

const Settings =
  mongoose.models.Settings ||
  mongoose.model(
    "Settings",
    settingsSchema
  );

/* ===============================
GET SETTINGS
=============================== */

router.get("/", async (req, res) => {
  try {
    let data =
      await Settings.findOne();

    if (!data) {
      data =
        await Settings.create({
          storeName:
            "UK Traders",
          email: "",
          phone: "",
          currency:
            "INR",
          shipping: 0,
          tax: 0,
          cod: true,
          maintenance: false,
        });
    }

    res.json(data);
  } catch (error) {
    console.log(
      "GET SETTINGS ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to load settings",
    });
  }
});

/* ===============================
SAVE SETTINGS
=============================== */

router.post("/", async (req, res) => {
  try {
    let data =
      await Settings.findOne();

    if (!data) {
      data =
        new Settings();
    }

    data.storeName =
      req.body.storeName ||
      "UK Traders";

    data.email =
      req.body.email ||
      "";

    data.phone =
      req.body.phone ||
      "";

    data.currency =
      req.body.currency ||
      "INR";

    data.shipping =
      parseFloat(
        req.body.shipping
      ) || 0;

    data.tax =
      parseFloat(
        req.body.tax
      ) || 0;

    data.cod =
      req.body.cod ===
        true ||
      req.body.cod ===
        "true";

    data.maintenance =
      req.body
        .maintenance ===
        true ||
      req.body
        .maintenance ===
        "true";

    const saved =
      await data.save();

    res.json({
      success: true,
      settings: saved,
    });
  } catch (error) {
    console.log(
      "SAVE SETTINGS ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to save settings",
    });
  }
});

module.exports = router;