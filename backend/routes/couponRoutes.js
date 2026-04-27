// routes/couponRoutes.js
// FULL WORKING COUPON ROUTES
// ADD / GET / UPDATE / DELETE

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/* ==================================
MODEL
================================== */

const couponSchema =
  new mongoose.Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "percent",
          "flat",
        ],
        default:
          "percent",
      },

      value: {
        type: Number,
        required: true,
        min: 0,
      },

      minAmount: {
        type: Number,
        default: 0,
      },

      expiry: {
        type: Date,
        default: null,
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model(
    "Coupon",
    couponSchema
  );

/* ==================================
GET ALL COUPONS
/api/coupons
================================== */

router.get("/", async (req, res) => {
  try {
    const coupons =
      await Coupon.find().sort({
        createdAt: -1,
      });

    res.json(coupons);
  } catch (error) {
    console.log(
      "GET COUPONS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load coupons",
    });
  }
});

/* ==================================
GET SINGLE COUPON
/api/coupons/:id
================================== */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Coupon not found",
          });
      }

      res.json(coupon);
    } catch {
      res.status(404).json({
        success: false,
        message:
          "Invalid coupon id",
      });
    }
  }
);

/* ==================================
ADD COUPON
/api/coupons
================================== */

router.post("/", async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minAmount,
      expiry,
      active,
    } = req.body;

    const exists =
      await Coupon.findOne({
        code:
          code.toUpperCase(),
      });

    if (exists) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Coupon already exists",
        });
    }

    const coupon =
      new Coupon({
        code,
        type,
        value:
          Number(value),
        minAmount:
          Number(
            minAmount
          ) || 0,
        expiry:
          expiry ||
          null,
        active,
      });

    const saved =
      await coupon.save();

    res.status(201).json({
      success: true,
      message:
        "Coupon created",
      coupon: saved,
    });
  } catch (error) {
    console.log(
      "ADD COUPON ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create coupon",
    });
  }
});

/* ==================================
UPDATE COUPON
/api/coupons/:id
================================== */

router.put(
  "/:id",
  async (req, res) => {
    try {
      const updated =
        await Coupon.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
            value:
              Number(
                req.body
                  .value
              ),
            minAmount:
              Number(
                req.body
                  .minAmount
              ) || 0,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updated) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Coupon not found",
          });
      }

      res.json({
        success: true,
        message:
          "Coupon updated",
        coupon:
          updated,
      });
    } catch (error) {
      console.log(
        "UPDATE COUPON ERROR:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update coupon",
      });
    }
  }
);

/* ==================================
DELETE COUPON
/api/coupons/:id
================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const deleted =
        await Coupon.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Coupon not found",
          });
      }

      res.json({
        success: true,
        message:
          "Coupon deleted",
      });
    } catch (error) {
      console.log(
        "DELETE COUPON ERROR:",
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