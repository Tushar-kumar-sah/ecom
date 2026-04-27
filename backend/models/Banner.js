// models/Banner.js
// Banner Model for Homepage Slider

const mongoose = require("mongoose");

const bannerSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        required: true,
        trim: true,
      },

      active: {
        type: Boolean,
        default: true,
      },

      link: {
        type: String,
        default: "",
      },

      order: {
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
    "Banner",
    bannerSchema
  );