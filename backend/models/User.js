const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "parent", "admin"],
      required: true,
    },

    rollNo: {
      type: String,
      default: "",
    },

   department: {
    type: String,
    default: ""
},

semester: {
    type: String,
    default: ""
},
    phone: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);