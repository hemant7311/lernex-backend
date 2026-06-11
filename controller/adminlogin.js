const User = require('../model/admin');
const jwt = require("jsonwebtoken");


// SIGNUPexports.adminlogin = async (req, res) => {
  try {
    const { ademail, adpassword } = req.body;

    const user = await User.findOne({ ademail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Plain text password check
    if (adpassword !== user.adpassword) {
      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.ademail,
        name: user.adname
      },
      process.env.JWT_SECRET || "mysecretkey",
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  };