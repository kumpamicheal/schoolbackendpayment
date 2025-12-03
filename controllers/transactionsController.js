// controllers/transactionsController.js
const Student = require("../models/Student");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");

exports.getTransactions = async (req, res) => {
    try {
        // schoolId from the logged-in user (set by authMiddleware)
        const schoolId = req.user.schoolId;

        // Fetch all students in this school
        const students = await Student.find({ school: schoolId });

        const transactions = await Promise.all(
            students.map(async (student) => {
                // Get general fee for the student's class
                const generalFee = await GeneralFee.findOne({ class: student.class, school: schoolId });
                // Get any special fee assigned to this student
                const specialFee = await SpecialFee.findOne({ student: student._id, school: schoolId });

                const feesAssigned = (generalFee ? generalFee.amount : 0) + (specialFee ? specialFee.amount : 0);

                return {
                    id: student._id,
                    studentName: student.name,
                    class: student.class,
                    stream: student.stream,
                    code: student.paymentCode || "N/A",
                    feesAssigned,
                    amountPaid: 0, // dummy for now
                    balance: feesAssigned, // initial balance = feesAssigned
                    status: "Pending", // dummy
                    method: "Mobile Money", // dummy
                    date: new Date().toLocaleString(), // dummy
                };
            })
        );

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
};
