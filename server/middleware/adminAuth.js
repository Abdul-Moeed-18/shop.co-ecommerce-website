const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function adminAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Admin authentication required.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({
                error: "Admin access required.",
            });
        }

        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired admin token.",
        });
    }
}

module.exports = adminAuth;