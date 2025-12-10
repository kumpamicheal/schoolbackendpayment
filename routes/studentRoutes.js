// routes/studentRoutes.js
const express = require("express");
const router = express.Router();

// Import controllers
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    searchStudents
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

// All student CRUD routes (no profile here)
router.post("/", protect, createStudent);        // CREATE a new student
router.get("/", protect, getStudents);           // GET all students
router.get("/search", protect, searchStudents);  // SEARCH students
router.put("/:id", protect, updateStudent);      // UPDATE a student by ID
router.delete("/:id", protect, deleteStudent);   // DELETE a student by ID

module.exports = router;
