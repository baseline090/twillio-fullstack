const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/sendingJWTtoken");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return new ErrorHandler("Enter all fields", 400);
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "user already exist with this email",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hp = await bcrypt.hash(password, salt);
    // const role = 'admin'
  
    const user = await User.create({
      name,
      email,
      password: hp,
    //   role
    });
  
    if (user) {
      sendToken(user, 200, res);
    }
  }

  exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Enter all fields", 400));
    }
  
    const userExists = await User.findOne({ email }).select("+password");
    if (!userExists) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  
    const isPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  
    sendToken(userExists, 200, res);
  };
  

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
          success: true,
          users,
        });
      } catch (error) {
        return error
      }
};

//get user details
exports.getUserDetails = async (req, res) => {
    console.log(req.user)
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  };
  
  exports.getUserDetailsAdmin = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
  };
