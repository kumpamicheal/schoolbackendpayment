const Student = require("../models/Student");
const School = require("../models/School"); // ✅ Import School model
const Fees = require("../models/Fees");     // ✅ Import Fees model

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

        // Determine fee amount
        let amount = 0;

        // First check for special fees assigned to the student
        const specialFee = await Fees.findOne({
            type: "special",
            studentId: student._id
        });

        if (specialFee) {
            amount = specialFee.amount;
        } else {
            // Otherwise, fallback to general fee for the student's class
            const generalFee = await Fees.findOne({
                type: "general",
                classLevel: student.classLevel
            });
            if (generalFee) amount = generalFee.amount;
        }

        return res.status(200).json({
            name: student.name,
            classLevel: student.classLevel,
            stream: student.stream,
            parentPhone: student.parentPhone,   // ✅ Already included
            school: schoolName,                 // ✅ Already added
            amount                              // ✅ Newly added fee amount
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};
