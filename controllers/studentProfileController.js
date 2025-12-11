const Student = require("../models/Student");
const School = require("../models/School");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");
const Payment = require("../models/Payment");   // ✅ added

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        let schoolName = "Unknown School";
        if (student.schoolId) {
            const school = await School.findById(student.schoolId);
            if (school) schoolName = school.name;
        }

        // ------------------------------------
        // Determine REQUIRED FEE (your old code)
        // ------------------------------------
        let amount = 0;

        const specialFee = await SpecialFee.findOne({
            student: student.name.trim()
        });

        console.log("SpecialFee found:", specialFee);

        if (specialFee) {
            amount = specialFee.amount;
        } else {
            const generalFee = await GeneralFee.findOne({
                schoolId: student.schoolId,
                class: student.classLevel
            });

            console.log("GeneralFee found:", generalFee);

            if (generalFee) amount = generalFee.amount;
        }

        // ------------------------------------
        // NEW: Calculate total paid by this student
        // ------------------------------------
        const paidData = await Payment.aggregate([
            { $match: { studentId: student._id.toString(), status: "Success" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const paid = paidData.length > 0 ? paidData[0].total : 0;

        // ------------------------------------
        // NEW: Calculate balance
        // ------------------------------------
        const balance = amount - paid;

        // ------------------------------------
        // Response (kept original + added paid & balance)
        // ------------------------------------
        return res.status(200).json({
            name: student.name,
            classLevel: student.classLevel,
            stream: student.stream,
            parentPhone: student.parentPhone,
            school: schoolName,
            amount,      // required fee (unchanged)
            paid,        // NEW: total paid
            balance: balance < 0 ? 0 : balance  // NEW: real balance
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};
