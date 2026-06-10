require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const allRoutes = require("./allroute/allroute");

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   GLOBAL MIDDLEWARE
======================= */

// CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/uploads", express.static("uploads"));

/* =======================
   ROUTES
======================= */

// Health check
app.get("/", (req, res) => {
  res.send("Lernex Backend Running 😊");
});

// API routes
app.use("/api", allRoutes);

/* =======================
   DATABASE CONNECTION
======================= */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

/* =======================
   EXPORT (for testing)
======================= */
module.exports = app;
