const Student = require("../models/Student");

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json({
            name: student.name,
            classLevel: student.classLevel,
            stream: student.stream,
            parentPhone: student.parentPhone,   // ✅ NOW INCLUDED
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};
