const mongoose = require("mongoose");

const addcart = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",   // 👈 tumhara USER model name
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",    // 👈 tumhara COURSE model name
      required: true
    }
  },
 
);

module.exports = mongoose.model("Cart",addcart);
