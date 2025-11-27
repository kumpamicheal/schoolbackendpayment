const express = require("express");
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    searchStudents
} = require("../controllers/studentController");

const router = express.Router();

router.post("/", createStudent);        // CREATE
router.get("/", getStudents);           // GET ALL
router.get("/search", searchStudents);  // SEARCH
router.put("/:id", updateStudent);      // UPDATE
router.delete("/:id", deleteStudent);   // DELETE

module.exports = router;
