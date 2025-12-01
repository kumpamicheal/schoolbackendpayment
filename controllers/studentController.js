const Student = require("../models/Student");
const { generatePaymentCode } = require("../utils/generateCode");

const createStudent = async (req, res) => {
    try {
        const { name, classLevel, stream, parentPhone } = req.body;

        if (!name || !classLevel || !stream || !parentPhone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Allow same parentPhone for multiple students if needed
        // Remove the check if you want unique phones:
        // const existingParent = await Student.findOne({ parentPhone });
        // if (existingParent) return res.status(400).json({ message: "This parent phone is already registered" });

        // Unique payment code
        let paymentCode;
        let exists = true;
        while (exists) {
            paymentCode = generatePaymentCode();
            exists = await Student.findOne({ paymentCode });
        }

        const student = await Student.create({
            name,
            classLevel,
            stream,
            parentPhone,
            paymentCode
        });

        res.status(201).json(student);

    } catch (err) {
        console.error("Error creating student:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const searchStudents = async (req, res) => {
    try {
        const { name, parentPhone } = req.query;
        const query = {};
        if (name) query.name = { $regex: name, $options: "i" };
        if (parentPhone) query.parentPhone = parentPhone;

        const results = await Student.find(query).sort({ name: 1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Student not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export all functions correctly
module.exports = {
    createStudent,
    getStudents,
    searchStudents,
    updateStudent,
    deleteStudent
};
