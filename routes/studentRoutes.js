const express = require("express");
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    searchStudents
} = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes now require the school to be logged in
router.post("/", authMiddleware, createStudent);        // CREATE a new student
router.get("/", authMiddleware, getStudents);           // GET all students
router.get("/search", authMiddleware, searchStudents);  // SEARCH students
router.put("/:id", authMiddleware, updateStudent);      // UPDATE a student by ID
router.delete("/:id", authMiddleware, deleteStudent);   // DELETE a student by ID

module.exports = router;
