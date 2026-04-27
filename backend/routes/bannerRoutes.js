// routes/bannerRoutes.js
// FULL Secure Banner Routes

const express = require("express");
const router = express.Router();

const Banner =
  require("../models/Banner");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

/* ===================================
🟢 GET ACTIVE BANNERS
Public Homepage
GET /api/banners/active
=================================== */
router.get(
  "/active",
  async (req, res) => {
    try {
      const banners =
        await Banner.find({
          active: true,
        }).sort({
          order: 1,
          createdAt: -1,
        });

      res.json(banners);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch banners",
      });
    }
  }
);

/* ===================================
🟢 GET ALL BANNERS
Admin Only
GET /api/banners
=================================== */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const banners =
        await Banner.find().sort({
          order: 1,
          createdAt: -1,
        });

      res.json(banners);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch banners",
      });
    }
  }
);

/* ===================================
🟢 CREATE BANNER
Admin Only
POST /api/banners
=================================== */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const banner =
        new Banner(
          req.body
        );

      const saved =
        await banner.save();

      res.status(201).json(
        saved
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to create banner",
      });
    }
  }
);

/* ===================================
🟢 UPDATE BANNER
Admin Only
PUT /api/banners/:id
=================================== */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const updated =
        await Banner.findByIdAndUpdate(
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
          "Failed to update banner",
      });
    }
  }
);

/* ===================================
🟢 DELETE BANNER
Admin Only
DELETE /api/banners/:id
=================================== */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Banner.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Banner deleted",
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