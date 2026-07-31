const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  addAttendance,
  addMarks,
  updateMarks,
  addNotice,
  getAllStudents,
  searchStudent,
  deleteStudent,
  updateStudent,
  uploadPhoto,
  getStudentByRollNo,
} = require("../controllers/teacherController");

// ================= NOTICE =================
router.post("/notice", addNotice);

// ================= ATTENDANCE =================
router.post("/attendance", addAttendance);

// ================= MARKS =================
router.post("/marks", addMarks);
router.put("/marks", updateMarks);

// ================= VIEW ALL STUDENTS =================
router.get("/students", getAllStudents);

// ================= SEARCH STUDENT =================
router.get("/search/:keyword", searchStudent);

// DELETE STUDENT
router.delete("/students/:id", deleteStudent);

router.put("/students/:id", updateStudent);

router.post(
  "/students/photo/:id",
  upload.single("photo"),
  uploadPhoto
);

router.get("/student/:rollNo", getStudentByRollNo);

module.exports = router;