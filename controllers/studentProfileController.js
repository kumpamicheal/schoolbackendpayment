const Student = require("../models/Student");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");
const Payments = require("../models/Payment");

exports.getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ _id: studentId, schoolId: req.user.schoolId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Determine fee category
        let fees = [];
        if (student.specialCase) {
            fees = await SpecialFee.find({ schoolId: student.schoolId, classLevel: student.classLevel });
        } else {
            fees = await GeneralFee.find({ schoolId: student.schoolId, classLevel: student.classLevel });
        }

        // Total fees amount
        const totalFees = fees.reduce((acc, f) => acc + f.amount, 0);

        // Fetch payments and sum successful ones
        const payments = await Payments.find({ studentId: student._id, status: "Success" });
        const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0);

        // Remaining balance
        const balance = totalFees - paidAmount;

        res.status(200).json({
            student: {
                name: student.name,
                classLevel: student.classLevel,
                stream: student.stream,
                schoolId: student.schoolId,
                parentPhone: student.parentPhone,
                totalFees,
                paidAmount,
                balance,
                specialCase: student.specialCase,
                currentTerm: student.currentTerm,
                currentSchoolYear: student.currentSchoolYear
            }
        });
    } catch (err) {
        console.error("GET STUDENT PROFILE ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
