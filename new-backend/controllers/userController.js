const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/sendingJWTtoken");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching users", 500));
  }
};

exports.grantAccess = async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.isActive = true;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


