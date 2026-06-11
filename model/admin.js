const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adname: {
      type: String,
      required: true,
    },
    ademail: {
      type: String,
      required: true,
      unique: true,
    },
    adpassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);