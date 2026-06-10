const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: {
      type: String, // "100K", "10M"
      required: true
    },
    image: {
      type: String,
      default:null
      
    }
  }

);

module.exports = mongoose.model("Category", categorySchema);
