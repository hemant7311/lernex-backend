const User = require('../model/admin');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// SIGNUP
exports.adminsignup = async (req, res) => {
    try {
        const { adname, ademail, adpassword } = req.body;

        // ✅ check existing user
        const existing = await User.findOne({ ademail });
        if (existing) {
            return res.status(400).json({
                message: "Email already exists ❌"
            });
        }

        // ✅ hash password
        const hashedPassword = await bcrypt.hash(adpassword, 10);

        const user = await User.create({
            adname,
            ademail,
            adpassword: hashedPassword
        });

        const token = jwt.sign(
            {
                id: user._id,
                name: user.adname,
                email: user.ademail
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: "User registered successfully ✅",
            success: true,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: "Registration failed",
            success: false,
            error: err.message
        });
    }
};


// LOGIN
exports.adminlogin = async (req, res) => {
    try {
        const { ademail, adpassword } = req.body;

        const user = await User.findOne({ ademail });

        if (!user) {
            return res.status(404).json({
                message: "User not found ❌"
            });
        }

        // ✅ compare hashed password
        const isMatch = await bcrypt.compare(adpassword, user.adpassword);

        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong password ❌"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.adname,
                email: user.ademail
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            message: "Login successful ✅",
            success: true,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: "Login failed",
            success: false,
            error: err.message
        });
    }
};