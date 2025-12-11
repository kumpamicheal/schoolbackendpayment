const Student = require("../models/Student");
const School = require("../models/School"); // ✅ Import School model
const GeneralFee = require("../models/GeneralFee"); // ✅ Corrected model name
const SpecialFee = require("../models/SpecialFee"); // ✅ Corrected model name

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        console.log("Fetched student:", student); // ✅ Debug log

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Fetch school info using schoolId
        let schoolName = "Unknown School";
        if (student.schoolId) {
            const school = await School.findById(student.schoolId);
            console.log("Fetched school:", school); // ✅ Debug log
            if (school) schoolName = school.name;
        }

        // Determine fee amount
        let amount = 0;

        // First check for special fees assigned to the student
        const specialFee = await SpecialFee.findOne({
            studentId: student._id
        });
        console.log("SpecialFee found:", specialFee); // ✅ Debug log

        if (specialFee) {
            amount = specialFee.amount;
        } else {
            // Otherwise, fallback to general fee for the student's class
            const generalFee = await GeneralFee.findOne({
                classLevel: student.classLevel
            });
            console.log("GeneralFee found:", generalFee); // ✅ Debug log
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
        console.log("Error in getStudentProfile:", error); // ✅ Debug log
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};
