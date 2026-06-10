const express = require("express");
const router = express.Router();

const { Sginupuser, loginUser } = require("../controller/signup");
const { varifytoken } = require("../middleware/middleware");
const{adminsignup,adminlogin}=require("../controller/adminlogin");  

const student = require("../model/signup");
const {googleLogin}= require("../controller/googlelogin"); 
const courseController = require("../controller/addcoursecont");
const uploads = require("../middleware/uploadmiddleware");

const { addCategory, updateCategory, deleteCategory } = require("../controller/categorycon");
const getcate = require("../model/category");
const payment = require("../model/paymentschema");

// 🔥 CART MODEL
const Cart = require("../model/addtocart");
const {createPayment}=require('../controller/payemtgateway');

const { submitInquiry } = require("../controller/inqueryfrom");

const Inquiry = require("../model/inqueryformschema");
const {addChapter,getChaptersByCourse,updateChapter,deleteChapter} = require("../controller/addcheapercon");

const { getMyCourses } = require("../controller/buycoursecontroller");

// ===================user bought course routes===================
router.get("/mycourses",varifytoken,getMyCourses);


// ===================add chepaerter routes===

router.post("/chapter/add",addChapter);
router.get("/chapter/course/:courseId", getChaptersByCourse);
router.post("/chapter/update", updateChapter);
router.post("/chapter/delete", deleteChapter);
// ===================end cheapter routes===================



// ================= AUTH =================
router.post("/signup", Sginupuser);
router.post("/login", loginUser);
router.post("/googlelogin", googleLogin);

router.post("/inquiry", submitInquiry);

// 🔥 Admin routes
router.post("/adminsignup", adminsignup);
router.post("/adminlogin", adminlogin);
// ================= payment gateway route =================
router.post("/create-payment", varifytoken, createPayment);

// ================= PROFILE =================
router.get("/profile", varifytoken, async (req, res) => {
  try {
    const user = await student.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile access granted ✔",
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashbord", varifytoken, (req, res) => {
  res.json({
    message: "Dashboard access granted ✔",
    user: req.user
  });
});

// ================= STUDENTS =================
router.get("/students", async (req, res) => {
  try {
    const students = await student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ================= COURSES =================
router.post(
  "/addcourse",
  uploads.single("image"),
  courseController.createCourse
);

router.get("/courses", courseController.getAllCourses);
router.get("/course/:id", courseController.getCourseById);

router.put(
  "/course/:id",
  uploads.single("image"),
  courseController.updateCourse
);

router.delete("/course/:id", courseController.deleteCourse);

// ================= CATEGORY =================
router.post("/addcategory", uploads.single("image"), addCategory);

router.get("/getcategory", async (req, res) => {
  try {
    const categories = await getcate.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
});

router.put(
  "/updatecategory/:id",
  uploads.single("image"),
  updateCategory
);

router.delete(
  "/deletecategory/:id",
  deleteCategory
);

// ================= CART ROUTES =================

// ADD TO CART
router.post("/addcard", varifytoken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const already = await Cart.findOne({
      user: userId,
      course: courseId
    });

    if (already) {
      return res.json({ message: "Already in cart" });
    }

    await Cart.create({
      user: userId,
      course: courseId
    });

    res.json({ message: "Added to cart ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER CART
router.get("/getcard", varifytoken, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id })
      .populate("course");

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// REMOVE FROM CART
router.post("/removecard", varifytoken, async (req, res) => {
  try {
    const { courseId } = req.body;

    await Cart.findOneAndDelete({
      user: req.user.id,
      course: courseId
    });

    res.json({ message: "Removed from cart ❌" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/buyallcourse", async (req, res) => {
  try {
    const payments = await payment
      .find()
      .populate("user", "name email number") // 👈 MOST IMPORTANT
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/inquiry", async (req, res) => {
  try {
    const inquiries = await Inquiry
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
