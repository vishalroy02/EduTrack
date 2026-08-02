const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Add Teacher
router.post("/addTeacher", adminAuth, async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Teacher already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       const teacher = new User({
    name,
    email,
    password: hashedPassword,
    role: "teacher",
    mustChangePassword: true
});

        await teacher.save();

        res.status(201).json({
            message: "Teacher Added Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;

// ================= VIEW ALL TEACHERS =================

router.get("/teachers", adminAuth, async (req, res) => {

    try {

        const teachers = await User.find(
            { role: "teacher" },
            "-password"
        );

        res.status(200).json(teachers);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// ================= DELETE TEACHER =================

router.delete("/teacher/:id", adminAuth, async (req, res) => {

    try {

        const teacher = await User.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher Not Found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "Teacher Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// ================= UPDATE TEACHER =================

router.put("/teacher/:id", adminAuth, async (req, res) => {

    try {

        const { name, email } = req.body;

        await User.findByIdAndUpdate(

            req.params.id,

            {
                name,
                email
            }

        );

        res.json({
            message: "Teacher Updated Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// ================= ADD PARENT =================

router.post("/addParent", adminAuth, async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Parent already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const parent = new User({
            name,
            email,
            password: hashedPassword,
            role: "parent",
            mustChangePassword: true
        });

        await parent.save();

        res.status(201).json({
            message: "Parent Added Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// ================= VIEW PARENTS =================

router.get("/parents", adminAuth, async (req, res) => {

    try {

        const parents = await User.find(
            { role: "parent" },
            "-password"
        );

        res.status(200).json(parents);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ================= DELETE PARENT =================

router.delete("/parent/:id", adminAuth, async (req, res) => {

    try {

        const parent = await User.findById(req.params.id);

        if (!parent) {
            return res.status(404).json({
                message: "Parent Not Found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "Parent Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ================= UPDATE PARENT =================

router.put("/parent/:id", adminAuth, async (req, res) => {

    try {

        const { name, email } = req.body;

        await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email
            }
        );

        res.json({
            message: "Parent Updated Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

}); 
