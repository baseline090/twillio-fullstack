const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
});
userSchema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("User", userSchema);
