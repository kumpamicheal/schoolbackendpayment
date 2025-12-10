const Student = require("../models/Student");
const { generatePaymentCode } = require("../utils/generateCode");

// Helper to generate unique studentId
const generateStudentId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "STU-";
    for (let i = 0; i < 6; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
    }
    return id;
};

// CREATE a new student
const createStudent = async (req, res) => {
    try {
        const { name, classLevel, stream, parentPhone } = req.body;

        if (!name || !classLevel || !stream) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (!req.user || !req.user.schoolId) {
            return res.status(401).json({ message: "Unauthorized: Missing school ID" });
        }

        let paymentCode, studentId;
        let exists = true;

        // Ensure unique paymentCode and studentId
        while (exists) {
            paymentCode = generatePaymentCode();
            studentId = generateStudentId();
            exists = await Student.findOne({
                $or: [{ paymentCode }, { studentId }]
            });
        }

        const student = await Student.create({
            name,
            classLevel,
            stream,
            parentPhone: parentPhone || "",
            paymentCode,
            studentId,
            schoolId: req.user.schoolId // <-- link student to the school
        });

        res.status(201).json(student);
    } catch (err) {
        console.error("CREATE STUDENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// GET all students for the logged-in school
const getStudents = async (req, res) => {
    try {
        if (!req.user || !req.user.schoolId) {
            return res.status(401).json({ message: "Unauthorized: Missing school ID" });
        }

        const students = await Student.find({ schoolId: req.user.schoolId });
        res.status(200).json(students);
    } catch (err) {
        console.error("GET STUDENTS ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// UPDATE a student by ID (only if belongs to logged-in school)
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const student = await Student.findOneAndUpdate(
            { _id: id, schoolId: req.user.schoolId },
            updateData,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found or unauthorized" });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error("UPDATE STUDENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// DELETE a student by ID (only if belongs to logged-in school)
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findOneAndDelete({
            _id: id,
            schoolId: req.user.schoolId
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found or unauthorized" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("DELETE STUDENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// SEARCH students by name, classLevel, or stream (for logged-in school)
const searchStudents = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });
        if (!req.user || !req.user.schoolId) {
            return res.status(401).json({ message: "Unauthorized: Missing school ID" });
        }

        const students = await Student.find({
            schoolId: req.user.schoolId,
            $or: [
                { name: { $regex: q, $options: "i" } },
                { classLevel: { $regex: q, $options: "i" } },
                { stream: { $regex: q, $options: "i" } }
            ]
        });

        res.status(200).json(students);
    } catch (err) {
        console.error("SEARCH STUDENTS ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    searchStudents
};
