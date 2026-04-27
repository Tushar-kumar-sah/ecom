const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    role: String,
  },
  {
    collection: "admins", // exact collection
    strict: false,
  }
);

// Use a unique model name to avoid stale cached model issues
module.exports =
  mongoose.models.AdminAccount ||
  mongoose.model("AdminAccount", adminSchema);