const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Notice = require("../models/Notice");
const User = require("../models/User");


// ================= GET STUDENT DATA (Student Login) =================

exports.getStudentData = async (req, res) => {

  try {

    const { studentId } = req.params;

    const student = await User.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const attendance = await Attendance.find({
  studentId: student._id,
}).sort({ date: -1 });

const totalAttendance = attendance.length;

const presentAttendance = attendance.filter(
  item => item.status === "present"
).length;

const absentAttendance = totalAttendance - presentAttendance;

const attendancePercentage =
  totalAttendance === 0
    ? 0
    : ((presentAttendance / totalAttendance) * 100).toFixed(2);

const recentAttendance = attendance.slice(0, 5);

    const marks = await Marks.find({
      studentId: student._id,
    });

    const notices = await Notice.find().sort({
      createdAt: -1,
    });

  res.status(200).json({
  student,

  attendanceSummary: {
    total: totalAttendance,
    present: presentAttendance,
    absent: absentAttendance,
    percentage: attendancePercentage,
  },

  recentAttendance,

  attendance,

  marks,

  notices,
});

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ================= GET STUDENT DATA BY ROLL NUMBER =================
// Parent Dashboard & Teacher Search

exports.getStudentByRollNo = async (req, res) => {

  try {

    const { rollNo } = req.params;

    const student = await User.findOne({
      rollNo,
      role: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

   const attendance = await Attendance.find({
  studentId: student._id,
}).sort({ date: -1 });

const totalAttendance = attendance.length;

const presentAttendance = attendance.filter(
  item => item.status === "present"
).length;

const absentAttendance = totalAttendance - presentAttendance;

const attendancePercentage =
  totalAttendance === 0
    ? 0
    : ((presentAttendance / totalAttendance) * 100).toFixed(2);

const recentAttendance = attendance.slice(0, 5);

    const marks = await Marks.find({
      studentId: student._id,
    });

    const notices = await Notice.find().sort({
      createdAt: -1,
    });

 res.status(200).json({
  student,

  attendanceSummary: {
    total: totalAttendance,
    present: presentAttendance,
    absent: absentAttendance,
    percentage: attendancePercentage,
  },

  recentAttendance,

  attendance,

  marks,

  notices,
});

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ================= UPDATE STUDENT PROFILE =================

exports.updateStudentProfile = async (req, res) => {

  try {

    const { studentId } = req.params;

    const updatedStudent = await User.findByIdAndUpdate(

      studentId,

    {
    name: req.body.name,
    email: req.body.email,
    rollNo: req.body.rollNo,
    department: req.body.department,
    semester: req.body.semester,
    phone: req.body.phone,
},

      { new: true }

    ).select("-password");
    

    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

exports.uploadStudentPhoto = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No photo selected"
            });
        }

        await User.findByIdAndUpdate(
            req.params.studentId,
            {
                photo: req.file.filename
            }
        );

        res.json({
            message: "Photo Uploaded Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};
