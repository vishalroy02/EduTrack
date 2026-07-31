const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Notice = require("../models/Notice");
const User = require("../models/User");

// ADD NOTICE
exports.addNotice = async (req, res) => {
  try {

    const { title, message } = req.body;

    // Today's Date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Duplicate Notice Check
    const existingNotice = await Notice.findOne({
      title: title.trim(),
      message: message.trim(),
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingNotice) {
      return res.status(400).json({
        message: "⚠ Same notice already posted today."
      });
    }

    const notice = await Notice.create({
      title: title.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      message: "✅ Notice Added Successfully",
      notice,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ADD ATTENDANCE
exports.addAttendance = async (req, res) => {

    try {

        const { rollNo, status } = req.body;

        const student = await User.findOne({

            rollNo,
            role: "student"

        });

        if (!student) {

            return res.status(404).json({

                message: "Student not found"

            });

        }

        // Today's Date
        const today = new Date().toISOString().split("T")[0];

        // Duplicate Check
        const alreadyMarked = await Attendance.findOne({

            studentId: student._id,

            date: today

        });

        if (alreadyMarked) {

            return res.status(400).json({

                message: "Attendance already marked for today."

            });

        }

        const attendance = await Attendance.create({

            studentId: student._id,

            date: today,

            status

        });

        res.status(201).json({

            message: "✅ Attendance Added Successfully",

            attendance

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// ADD MARKS
exports.addMarks = async (req, res) => {

    try {

        const { rollNo, subject, marks } = req.body;

        const student = await User.findOne({
            rollNo,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (marks < 0 || marks > 100) {
            return res.status(400).json({
                message: "Marks must be between 0 and 100."
            });
        }

        const existing = await Marks.findOne({
            studentId: student._id,
            subject: subject.trim()
        });

        if (existing) {

            return res.status(200).json({
                update: true,
                message: "Marks already exist."
            });

        }

        const newMarks = await Marks.create({

            studentId: student._id,

            subject: subject.trim(),

            marks

        });

        res.status(201).json({

            update: false,

            message: "✅ Marks Added Successfully",

            newMarks

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

exports.updateMarks = async (req,res)=>{

    try{

        const {rollNo,subject,marks}=req.body;
        if (marks < 0 || marks > 100) {

    return res.status(400).json({

        message: "Marks must be between 0 and 100."

    });

}

        const student=await User.findOne({

            rollNo,

            role:"student"

        });

        if(!student){

            return res.status(404).json({

                message:"Student not found"

            });

        }

        await Marks.findOneAndUpdate(

            {

                studentId:student._id,

                subject:subject.trim()

            },

            {

                marks

            }

        );

        res.json({

            message:"✅ Marks Updated Successfully"

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};
// ================= VIEW ALL STUDENTS =================

exports.getAllStudents = async (req, res) => {

  try {

    const students = await User.find({
      role: "student"
    }).select("-password");

    res.status(200).json(students);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// ================= SEARCH STUDENT =================

exports.searchStudent = async (req, res) => {

  try {

    const { keyword } = req.params;

    const students = await User.find({

      role: "student",

      $or: [

        {
          name: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          rollNo: {
            $regex: keyword,
            $options: "i"
          }
        }

      ]

    }).select("-password");

    res.status(200).json(students);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
// ================= DELETE STUDENT =================

exports.deleteStudent = async (req, res) => {

  try {

    const { id } = req.params;

    await User.findByIdAndDelete(id);

    await Attendance.deleteMany({ studentId: id });

    await Marks.deleteMany({ studentId: id });

    res.json({
      message: "✅ Student Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
// ================= UPDATE STUDENT =================

exports.updateStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const { name, rollNo, department, semester, phone } = req.body;

    const student = await User.findByIdAndUpdate(
      id,
      {
        name,
        rollNo,
        department,
        semester,
        phone,
      },
      { new: true }
    );

    res.json({
      message: "✅ Student Updated Successfully",
      student,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

exports.uploadPhoto = async (req, res) => {

    try {

        const { id } = req.params;

        await User.findByIdAndUpdate(id, {

            photo: req.file.filename

        });

        res.json({

            message: "✅ Photo Uploaded Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// ================= GET STUDENT BY ROLL =================

exports.getStudentByRollNo = async (req, res) => {

    try {

        const student = await User.findOne({
            rollNo: req.params.rollNo,
            role: "student"
        }).select("name department semester rollNo");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};