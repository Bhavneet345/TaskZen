const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Received Token in Middleware:", token); // Debugging

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }

        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};

module.exports = authenticateUser;
