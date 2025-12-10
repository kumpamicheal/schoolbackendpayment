// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { getStudentProfile, getStudents, createStudent, updateStudent, deleteStudent } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware"); // ensures req.user.schoolId is available

// Fetch student profile
router.get("/profile/:studentId", protect, getStudentProfile);

// Other student routes
router.post("/", protect, createStudent);
router.get("/", protect, getStudents);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;
