const Student = require("../models/Student");
const School = require("../models/School"); // ✅ Import School model

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Fetch school info using schoolId
        let schoolName = "Unknown School";
        if (student.schoolId) {
            const school = await School.findById(student.schoolId);
            if (school) schoolName = school.name;
        }

        return res.status(200).json({
            name: student.name,
            classLevel: student.classLevel,
            stream: student.stream,
            parentPhone: student.parentPhone,   // ✅ Already included
            school: schoolName,                 // ✅ Newly added
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};
