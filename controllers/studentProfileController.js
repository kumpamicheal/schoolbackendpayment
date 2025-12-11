const Student = require("../models/Student");
const School = require("../models/School");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        let schoolName = "Unknown School";
        if (student.schoolId) {
            const school = await School.findById(student.schoolId);
            if (school) schoolName = school.name;
        }

        // Determine fee amount
        let amount = 0;

        // ✅ FIXED — match by student NAME, because your DB stores "student: 'MUGABI EMMA'"
        const specialFee = await SpecialFee.findOne({
            student: student.name.trim()
        });

        console.log("SpecialFee found:", specialFee);

        if (specialFee) {
            amount = specialFee.amount;
        } else {
            // Fallback to general fee by school + class
            const generalFee = await GeneralFee.findOne({
                schoolId: student.schoolId,
                class: student.classLevel
            });

            console.log("GeneralFee found:", generalFee);

            if (generalFee) amount = generalFee.amount;
        }

        return res.status(200).json({
            name: student.name,
            classLevel: student.classLevel,
            stream: student.stream,
            parentPhone: student.parentPhone,
            school: schoolName,
            amount
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};
