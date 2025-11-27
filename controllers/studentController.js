const Student = require("../models/Student");
const { generatePaymentCode } = require("../utils/generateCode");

// CREATE STUDENT
exports.createStudent = async (req, res) => {
    try {
        const { name, classLevel, stream, parentPhone } = req.body;

        // Generate unique payment code
        let paymentCode;
        let exists = true;

        while (exists) {
            paymentCode = generatePaymentCode();
            exists = await Student.findOne({ paymentCode });
        }

        const student = await Student.create({
            name,
            classLevel,
            stream,
            parentPhone,
            paymentCode
        });

        // OPTIONAL – send SMS after creation
        // sendSMS(parentPhone, `Your child's payment code is: ${paymentCode}`);

        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL STUDENTS
exports.getStudents = async (req, res) => {
    const students = await Student.find().sort({ studentId: 1 });
    res.json(students);
};

// SEARCH BY NAME OR PARENT PHONE
exports.searchStudents = async (req, res) => {
    const { name, parentPhone } = req.query;

    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (parentPhone) query.parentPhone = parentPhone;

    const results = await Student.find(query).sort({ studentId: 1 });
    res.json(results);
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// (OPTIONAL) SMS ALERT FUNCTION - you will plug in your provider later
function sendSMS(phone, message) {
    console.log("SMS to:", phone, "->", message);
}
