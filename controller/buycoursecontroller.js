const Payment = require("../model/paymentschema");
const Course = require("../model/addcourse");
const Chapter = require("../model/addcheapter");

// ================= USER BOUGHT COURSES =================
exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ user: userId });

    console.log("Payments:", payments);

    let courseIds = [];

    payments.forEach((p) => {
      if (p.productId) {
        courseIds.push(p.productId);
      }

      if (Array.isArray(p.courses)) {
        p.courses.forEach((c) => courseIds.push(c.productId));
      }
    });

    courseIds = [...new Set(courseIds)];

    console.log("Course IDs:", courseIds);

    const courses = await Course.find({ _id: { $in: courseIds } });

    const finalCourses = await Promise.all(
      courses.map(async (course) => {
        const chapters = await Chapter.find({
          courseId: course._id.toString(),
          status: "ACTIVE",
        });

        return { ...course.toObject(), chapters };
      })
    );

    res.json({ success: true, data: finalCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
