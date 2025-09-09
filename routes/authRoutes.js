const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// User logout (protected route)
router.post("/logout", protect, logout);

module.exports = router;
