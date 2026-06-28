require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const allRoutes = require("./allroute/allroute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Lernex Backend Running 😊");
});

app.use("/api", allRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server Started");
    });
  })
  .catch(console.error);