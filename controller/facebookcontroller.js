// controllers/authController.js
const User=require( "../model/signup");
const{varifytoken } =require("../middleware/middleware");

exports.facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // 🔍 Facebook verify
    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const fbUser = await fbRes.json();

    if (!fbUser.id) {
      return res.status(400).json({ message: "Facebook token invalid" });
    }

    // 👤 Find / Create user
    let user = await User.findOne({ facebookId: fbUser.id });

    if (!user) {
      user = await User.create({
        facebookId: fbUser.id,
        name: fbUser.name,
        email: fbUser.email,
        picture: fbUser.picture?.data?.url,
      });
    }

    // 🔐 EXISTING JWT
    const token = varifytoken(user);

    res.json({
      success: true,
      user,
      token, // 👈 SAME JWT as normal login
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
