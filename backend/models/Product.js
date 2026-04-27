// models/Product.js
// CLEAN VERIFIED PRODUCT MODEL

const mongoose = require("mongoose");

/* ===============================
REVIEW SCHEMA
=============================== */
const reviewSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

/* ===============================
PRODUCT SCHEMA
=============================== */
const productSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        unique: true,
        sparse: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      originalPrice: {
        type: Number,
        default: 0,
      },

      description: {
        type: String,
        default: "",
      },

      category: {
        type: String,
        required: true,
      },

      subCategory: {
        type: String,
        default: "",
      },

      brand: {
        type: String,
        default:
          "UK Traders",
      },

      stock: {
        type: Number,
        default: 0,
        min: 0,
      },

      sku: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      images: [
        {
          type: String,
        },
      ],

      sizes: [
        {
          type: String,
        },
      ],

      colors: [
        {
          type: String,
        },
      ],

      material: {
        type: String,
        default: "",
      },

      gender: {
        type: String,
        enum: [
          "Men",
          "Women",
          "Unisex",
          "",
        ],
        default: "",
      },

      tags: [
        {
          type: String,
        },
      ],

      featured: {
        type: Boolean,
        default: false,
      },

      bestseller: {
        type: Boolean,
        default: false,
      },

      newArrival: {
        type: Boolean,
        default: false,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      rating: {
        type: Number,
        default: 0,
      },

      numReviews: {
        type: Number,
        default: 0,
      },

      reviews: [
        reviewSchema,
      ],

      soldCount: {
        type: Number,
        default: 0,
      },

      seoTitle: {
        type: String,
        default: "",
      },

      seoDescription: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

/* ===============================
INDEX
=============================== */
productSchema.index({
  name: "text",
  category: "text",
  brand: "text",
});

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );