const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    // 🔗 Course reference (kis course ka chapter hai)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // 📘 Course info (snapshot – safety ke liye)
    courseId: {
      type: String,
      required: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    // 📚 Chapter details
    chapterTitle: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    // 🔢 Chapter order (future use – sorting)
    chapterOrder: {
      type: Number,
      default: 1,
    },

    // 🎥 Video meta (optional – future)
    videoDuration: {
      type: String,
      default: null,
    }
    // 📌 Status
   
  },
);

module.exports = mongoose.model("Chapter", chapterSchema);
