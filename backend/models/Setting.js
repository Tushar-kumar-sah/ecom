// models/Setting.js
// Store Global Settings Model

const mongoose = require("mongoose");

const settingSchema =
  new mongoose.Schema(
    {
      storeName: {
        type: String,
        default:
          "UK Traders",
      },

      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      darkMode: {
        type: Boolean,
        default: true,
      },

      currency: {
        type: String,
        default: "INR",
      },

      taxPercent: {
        type: Number,
        default: 0,
      },

      shippingCharge: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Setting",
    settingSchema
  );