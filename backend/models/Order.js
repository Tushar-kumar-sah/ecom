// models/Order.js
// FULL UPDATED + PREMIUM CLOTHING ECOMMERCE ORDER MODEL

const mongoose = require("mongoose");

/* ===================================
🟢 ORDER ITEM SCHEMA
=================================== */
const orderItemSchema =
  new mongoose.Schema(
    {
      product: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      productId: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        default: "",
      },

      price: {
        type: Number,
        required: true,
      },

      qty: {
        type: Number,
        required: true,
        min: 1,
      },

      size: {
        type: String,
        default: "",
      },

      color: {
        type: String,
        default: "",
      },

      sku: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

/* ===================================
🟢 SHIPPING ADDRESS SCHEMA
=================================== */
const shippingSchema =
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      addressLine1: {
        type: String,
        required: true,
      },

      addressLine2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },
    },
    {
      _id: false,
    }
  );

/* ===================================
🟢 ORDER SCHEMA
=================================== */
const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      orderNumber: {
        type: String,
        unique: true,
        sparse: true,
      },

      items: [
        orderItemSchema,
      ],

      shippingAddress:
        shippingSchema,

      paymentMethod: {
        type: String,
        enum: [
          "COD",
          "UPI",
          "Card",
          "NetBanking",
          "Wallet",
        ],
        default: "COD",
      },

      paymentStatus: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],
        default:
          "Pending",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Confirmed",
          "Packed",
          "Shipped",
          "Out for Delivery",
          "Delivered",
          "Cancelled",
          "Returned",
        ],
        default:
          "Pending",
      },

      itemsPrice: {
        type: Number,
        default: 0,
      },

      shippingPrice: {
        type: Number,
        default: 0,
      },

      taxPrice: {
        type: Number,
        default: 0,
      },

      discountPrice: {
        type: Number,
        default: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
      },

      couponCode: {
        type: String,
        default: "",
      },

      trackingId: {
        type: String,
        default: "",
      },

      courierName: {
        type: String,
        default: "",
      },

      estimatedDelivery: {
        type: Date,
      },

      deliveredAt: {
        type: Date,
      },

      cancelledAt: {
        type: Date,
      },

      refundAmount: {
        type: Number,
        default: 0,
      },

      customerNote: {
        type: String,
        default: "",
      },

      adminNote: {
        type: String,
        default: "",
      },

      isPaid: {
        type: Boolean,
        default: false,
      },

      paidAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

/* ===================================
🟢 INDEXES
=================================== */
orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  orderNumber: 1,
});

/* ===================================
🟢 EXPORT
=================================== */
module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );