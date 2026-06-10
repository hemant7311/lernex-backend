// controllers/chapter.controller.js
const Chapter = require("../model/addcheapter");
const Course = require("../model/addcourse");

// ================= ADD CHAPTER =================
exports.addChapter = async (req, res) => {
  try {
    const { courseId, chapterTitle, videoUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course)
      return res.json({ success: false, message: "Course not found" });

    const chapter = await Chapter.create({
      course: course._id,
      courseId: course._id.toString(),
      courseName: course.title,
      chapterTitle,
      videoUrl,
    });

    res.json({ success: true, data: chapter });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= GET CHAPTERS BY COURSE =================
exports.getChaptersByCourse = async (req, res) => {
  try {
    const chapters = await Chapter.find({
      courseId: req.params.courseId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: chapters });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= UPDATE CHAPTER =================
exports.updateChapter = async (req, res) => {
  try {
    const { chapterId, chapterTitle, videoUrl } = req.body;

    await Chapter.findByIdAndUpdate(chapterId, {
      chapterTitle,
      videoUrl,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= DELETE CHAPTER =================
exports.deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.body;

    await Chapter.findByIdAndDelete(chapterId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
