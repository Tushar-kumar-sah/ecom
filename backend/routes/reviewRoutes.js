// routes/reviewRoutes.js
// FULL Secure Review Routes

const express = require("express");
const router = express.Router();

const Review =
  require("../models/Review");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

/* ===================================
🟢 GET ALL REVIEWS
Admin Only
GET /api/reviews
=================================== */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const reviews =
        await Review.find().sort({
          createdAt: -1,
        });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch reviews",
      });
    }
  }
);

/* ===================================
🟢 GET PRODUCT REVIEWS
Public
GET /api/reviews/product/:productId
=================================== */
router.get(
  "/product/:productId",
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          productId:
            req.params.productId,
          hidden: false,
        }).sort({
          createdAt: -1,
        });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch reviews",
      });
    }
  }
);

/* ===================================
🟢 CREATE REVIEW
Public Customer
POST /api/reviews
=================================== */
router.post(
  "/",
  async (req, res) => {
    try {
      const review =
        new Review(
          req.body
        );

      const saved =
        await review.save();

      res.status(201).json(
        saved
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to add review",
      });
    }
  }
);

/* ===================================
🟢 UPDATE REVIEW
Admin Only
PUT /api/reviews/:id
=================================== */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const updated =
        await Review.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to update review",
      });
    }
  }
);

/* ===================================
🟢 DELETE REVIEW
Admin Only
DELETE /api/reviews/:id
=================================== */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Review.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Review deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Delete failed",
      });
    }
  }
);

module.exports =
  router;