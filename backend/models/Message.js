// models/Message.js
// Contact / Support Message Model

const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      subject: {
        type: String,
        default: "",
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      status: {
        type: String,
        default: "Unread",
      },

      replied: {
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
    "Message",
    messageSchema
  );