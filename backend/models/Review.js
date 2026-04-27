// models/Review.js
// Review Model for Main Website + Admin Panel

const mongoose = require("mongoose");

const reviewSchema =
  new mongoose.Schema(
    {
      userName: {
        type: String,
        required: true,
        trim: true,
      },

      userEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },

      productId: {
        type: String,
        required: true,
      },

      productName: {
        type: String,
        required: true,
        trim: true,
      },

      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      comment: {
        type: String,
        required: true,
        trim: true,
      },

      hidden: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Review",
    reviewSchema
  );