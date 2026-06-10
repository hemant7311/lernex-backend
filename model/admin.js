const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  adname: {
    type: String,
    required: true
  },
  ademail: {
    type: String,
    required: true
  },
  adpassword: {
    type: String,
    required: true,
    unique: true  
  },
});

// 🔥 SAFE EXPORT (OverwriteModelError FIX)
module.exports =
  mongoose.models.Admin || mongoose.model("Admin", admin);
