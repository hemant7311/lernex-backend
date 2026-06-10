const multer = require("multer");
const path = require("path");

// ==============================
// STORAGE CONFIG
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder jahan image save hogi
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// ==============================
// FILE FILTER (only images)
// ==============================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

// ==============================
// MULTER INSTANCE
// ==============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024 // 2MB limit
  }
});

module.exports = upload;
