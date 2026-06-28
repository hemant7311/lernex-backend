const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // path apne project ke hisab se change karna

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "lernex",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
  }),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
});

module.exports = upload;