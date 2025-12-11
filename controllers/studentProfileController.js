const Student = require("../models/Student");

// Get student profile by studentId (public route for parents)
const getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const student = await Student.findOne({ studentId });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);

    } catch (error) {
        console.error("PROFILE FETCH ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getStudentProfile };
