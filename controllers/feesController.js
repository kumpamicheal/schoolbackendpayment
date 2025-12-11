import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

export default function StudentProfile() {
    const API = "https://schoolbackendpayment.onrender.com/api";

    const [studentData, setStudentData] = useState({
        name: "Loading...",
        classLevel: "",
        stream: "",
        parentPhone: "",
        school: "Loading...",
    });

    useEffect(() => {
        const saved = localStorage.getItem("parentData");
        if (!saved) return;

        const studentInfo = JSON.parse(saved);
        const studentId = studentInfo.studentId;

        if (!studentId) {
            console.log("❌ No studentId found in localStorage!");
            return;
        }

        console.log("StudentProfile fetching for studentId:", studentId);

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API}/student-profile/${studentId}`);
                const data = res.data;

                setStudentData({
                    name: data.name,
                    classLevel: data.classLevel,
                    stream: data.stream,
                    parentPhone: data.parentPhone,
                    school: data.school || "Unknown School", // ✅ Updated
                });
            } catch (error) {
                console.log("Error fetching student profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const dummy = {
        amount: 100000, // ✅ Dummy amount
        balance: 250000,
    };

    return (
        <div className="profile-container">
            <h2>Student Profile</h2>

            <div className="profile-card">

                <div className="profile-row">
                    <span className="label">Name:</span>
                    <span>{studentData.name}</span>
                </div>

                <div className="profile-row">
                    <span className="label">Class / Stream:</span>
                    <span>{studentData.classLevel} / {studentData.stream}</span>
                </div>

                <div className="profile-row">
                    <span className="label">School:</span>
                    <span>{studentData.school}</span> {/* ✅ Updated to fetch from backend */}
                </div>

                <div className="profile-row">
                    <span className="label">Parent Phone:</span>
                    <span>{studentData.parentPhone}</span>
                </div>

                <div className="profile-row">
                    <span className="label">Amount:</span>
                    <span style={{ color: "blue" }}>
                        UGX {dummy.amount.toLocaleString()} {/* ✅ Dummy amount */}
                    </span>
                </div>

                <div className="profile-row">
                    <span className="label">Balance:</span>
                    <span style={{ color: "red" }}>
                        UGX {dummy.balance.toLocaleString()}
                    </span>
                </div>

            </div>
        </div>
    );
}
