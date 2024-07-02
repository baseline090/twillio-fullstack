const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserDetails,getUserDetailsAdmin } = require('../controllers/authController');
const verifyToken = require("../middlewares/verifyToken");
router.post('/user/new', register);
router.post('/user/login', login);
router.get('/admin/allusers', getAllUsers);
router.get('/user/me',verifyToken, getUserDetails );
router.get('/admin/allusers', getAllUsers);
module.exports = router;
