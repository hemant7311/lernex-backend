const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // 🔐 User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true
    },

    // 🧾 SINGLE COURSE (for backward compatibility)
    productId: {
      type: String
    },

    productName: {
      type: String
    },

    quantity: {
      type: Number,
      default:''
    },

    // 📦 MULTIPLE COURSES (Buy All)
    courses: [
      {
        productId: {
          type: String,
          required: true
        },
        productName: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    // 💰 Total Amount
    amount: {
      type: Number,
      required: true
    },

    // 💳 Cashfree identifiers
    orderId: {
      type: String,
      required: true,
      unique: true
    },

    paymentSessionId: {
      type: String,
      required: true
    },

    transactionId: {
      type: String,
      default: null
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    },

    paymentMethod: {
      type: String
    },

    paymentDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0]
    },

    paymentTime: {
      type: String,
      default: () =>
        new Date().toLocaleTimeString("en-IN", { hour12: false })
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
