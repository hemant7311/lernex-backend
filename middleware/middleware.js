const jwt = require("jsonwebtoken");

exports.varifytoken = (req, res, next) => {
    
    // 1️⃣ Check header exists or not
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false,
            message: "Authorization token missing or incorrect format!"
        });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    try {
        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(400).json({
                success: false,
                message: "Token is valid but userId (id) missing!"
            });
        }

        // 4️⃣ Attach user data to request
        req.user = decoded;

        next(); // Continue to next middleware/route

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};
