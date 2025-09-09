const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isTokenBlacklisted } = require("../controllers/authController");

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Check blacklist
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Token has been blacklisted, please login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
