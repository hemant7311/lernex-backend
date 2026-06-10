const Inquiry = require("../model/inqueryformschema");

exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 🔒 Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const inquiry = new Inquiry({
      name,
      email,
      phone,
      message,
    });

    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("Inquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
