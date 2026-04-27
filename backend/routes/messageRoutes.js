// routes/messageRoutes.js
// FULL Secure Message Routes

const express = require("express");
const router = express.Router();

const Message =
  require("../models/Message");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

/* ===================================
🟢 GET ALL MESSAGES
Admin Only
GET /api/messages
=================================== */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const messages =
        await Message.find().sort({
          createdAt: -1,
        });

      res.json(messages);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch messages",
      });
    }
  }
);

/* ===================================
🟢 CREATE MESSAGE
Public Contact Form
POST /api/messages
=================================== */
router.post(
  "/",
  async (req, res) => {
    try {
      const message =
        new Message(
          req.body
        );

      const saved =
        await message.save();

      res.status(201).json(
        saved
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to send message",
      });
    }
  }
);

/* ===================================
🟢 UPDATE MESSAGE
Admin Only
PUT /api/messages/:id
=================================== */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const updated =
        await Message.findByIdAndUpdate(
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
          "Failed to update message",
      });
    }
  }
);

/* ===================================
🟢 DELETE MESSAGE
Admin Only
DELETE /api/messages/:id
=================================== */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Message.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Message deleted",
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