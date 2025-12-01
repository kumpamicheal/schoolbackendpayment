const express = require("express");
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    searchStudents
} = require("../controllers/studentController");

const router = express.Router();

// Base path assumed as /students
router.post("/", createStudent);        // CREATE a new student
router.get("/", getStudents);           // GET all students
router.get("/search", searchStudents);  // SEARCH students
router.put("/:id", updateStudent);      // UPDATE a student by ID
router.delete("/:id", deleteStudent);   // DELETE a student by ID

module.exports = router;
