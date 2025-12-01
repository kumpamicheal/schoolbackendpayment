const Student = require("../models/Student");
const { generatePaymentCode } = require("../utils/generateCode");

// CREATE a new student
const createStudent = async (req, res) => {
    try {
        const { name, classLevel, stream, parentPhone } = req.body;

        if (!name || !classLevel || !stream) {
            return res.status(400).json({ message: "All fields required" });
        }

        let paymentCode;
        let exists = true;

        // Ensure unique payment code
        while (exists) {
            paymentCode = generatePaymentCode();
            exists = await Student.findOne({ paymentCode });
        }

        const student = await Student.create({
            name,
            classLevel,
            stream,
            parentPhone: parentPhone || "",
            paymentCode
        });

        res.status(201).json(student);
    } catch (err) {
        console.error("CREATE STUDENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// GET all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        console.error("GET STUDENTS ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// UPDATE a student by ID
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const student = await Student.findByIdAndUpdate(id, updateData, { new: true });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error("UPDATE STUDENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// DELETE a student by ID
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("DELETE STUDENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// SEARCH students by name, classLevel, or stream
const searchStudents = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });

        const students = await Student.find({
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
