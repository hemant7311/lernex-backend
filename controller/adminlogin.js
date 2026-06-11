const User = require("../model/admin");
const jwt = require("jsonwebtoken");

exports.adminlogin = async (req, res) => {
  try {
    const { ademail, adpassword } = req.body;

    const user = await User.findOne({ ademail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (adpassword !== user.adpassword) {
      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.ademail
      },
      process.env.JWT_SECRET || "mysecretkey",
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      token
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};