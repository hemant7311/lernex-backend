const User = require('../model/signup');
const jwt = require("jsonwebtoken");

// SIMPLE REGISTER
exports.Sginupuser = async (req, res) => {
    try {
        const { name, email, password, number } = req.body;

        const user = await User.create({ name, email, password, number });

        // Generate token after signup
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user,
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

// SIMPLE LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // IMPORTANT → JWT me user ke sab required fields daalo
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,     // phone number
                city: user.city,         // agar tum add karoge
                bio: user.bio            // agar user model me ho
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            message: "Login successful",
            success: true,
            user,
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
