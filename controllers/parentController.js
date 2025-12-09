const Student = require("../models/Student");

// -------------------------------------
// PARENT LOGIN CONTROLLER
// -------------------------------------
exports.parentLogin = async (req, res) => {
    const { phone, paymentCode } = req.body;

    try {
        if (!phone || !paymentCode) {
            return res.status(400).json({ message: "Phone and payment code are required" });
        }

        // Find student by phone & payment code
        const student = await Student.findOne({
            parentPhone: phone,
            paymentCode
        });

        if (!student) {
            return res.status(404).json({ message: "Invalid phone or payment code" });
        }

        // Return the student object so frontend can store it
        return res.status(200).json({ student });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
