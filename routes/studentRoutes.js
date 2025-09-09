const express = require("express");
const { protect } = require("../middlewares/authMiddleware"); 
const { allowRoles } = require("../middlewares/roleMiddleware"); 
const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateMyProfile,
} = require("../controllers/studentController");

const router = express.Router();
//Student routes
router.get("/profile/me", protect, allowRoles("Student"), getStudentProfile);
router.put("/me", protect, allowRoles("Student"), updateMyProfile);


// Admin routes
router.get("/", protect, allowRoles("Admin"), getAllStudents);
router.post("/", protect, allowRoles("Admin"), createStudent);
router.put("/:id", protect, allowRoles("Admin"), updateStudent);
router.delete("/:id", protect, allowRoles("Admin"), deleteStudent);



module.exports = router;
