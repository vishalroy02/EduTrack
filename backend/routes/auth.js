const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);

router.put("/change-password", auth, changePassword);

module.exports = router;