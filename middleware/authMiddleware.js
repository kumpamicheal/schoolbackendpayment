// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Read token from header
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded info to req.user for protected routes
        req.user = {
            schoolId: decoded.schoolId,
            email: decoded.email
        };

        next();

    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
