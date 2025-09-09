const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// ✅ Correct CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",              // Local dev
    "https://auth-frontend-dgtg.vercel.app" // Deployed frontend (no trailing slash!)
  ],
  credentials: true,
}));

// Debugging middleware
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("✅ Server Running 🎉!");
});

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
