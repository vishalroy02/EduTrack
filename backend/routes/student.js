const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getStudentData,
  getStudentByRollNo,
  updateStudentProfile,
  uploadStudentPhoto
} = require("../controllers/studentController");

router.get("/roll/:rollNo", getStudentByRollNo);

router.get("/:studentId", getStudentData);

router.put("/update/:studentId", updateStudentProfile);

router.post(
  "/photo/:studentId",
  upload.single("photo"),
  uploadStudentPhoto
);

module.exports = router;