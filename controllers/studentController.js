const Student = require("../models/Student");

exports.getAllStudents = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const students = await Student.find()
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Student.countDocuments();
  res.json({ students, total });
};

exports.getStudentProfile = async (req, res) => {
  const student = await Student.findOne({ email: req.user.email });
  res.json(student);
};

exports.createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
};

exports.updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
};

exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
};




//Student Routere
// @desc Get logged-in student's profile
exports.getStudentProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Student") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      course: req.user.course || "", // optional field
      role: req.user.role,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update logged-in student's profile
exports.updateMyProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, course } = req.body;

    // Update user fields
    req.user.name = name || req.user.name;
    req.user.email = email || req.user.email;
    req.user.course = course || req.user.course;

    const updatedUser = await req.user.save();

    res.json({
      message: "Profile updated successfully",
      student: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        course: updatedUser.course,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
