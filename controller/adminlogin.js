const User = require("../model/admin");
const jwt = require("jsonwebtoken");

// ================= ADMIN LOGIN =================
exports.adminlogin = async (req, res) => {
  try {
    const { ademail, adpassword } = req.body;

    if (!ademail || !adpassword) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required"
      });
    }

    const user = await User.findOne({ ademail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Plain password compare
    if (user.adpassword !== adpassword) {
      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        ademail: user.ademail
      },
      process.env.JWT_SECRET || "mysecretkey",
      {
        expiresIn: process.env.JWT_EXPIRE || "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: {
        id: user._id,
        adname: user.adname,
        ademail: user.ademail
      }
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message
    });
  }
};