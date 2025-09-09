const User = require("../models/User");
const jwt = require("jsonwebtoken");

let blacklistedTokens = [];

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc Signup user
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: safeUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      token: generateToken(user._id, user.role),
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Logout (blacklist JWT)
exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    blacklistedTokens.push(token);
  }
  res.json({ message: "Logged out successfully" });
};

// Helper to check blacklist
exports.isTokenBlacklisted = (token) => {
  return blacklistedTokens.includes(token);
};

