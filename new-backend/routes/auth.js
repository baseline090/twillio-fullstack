const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserDetails,getUserDetailsAdmin } = require('../controllers/authController');
router.post('/user/new', register);
router.post('/user/login', login);
router.get('/admin/allusers', getAllUsers);
router.get('/user/me',getUserDetails );
router.get('/admin/allusers', getAllUsers);
module.exports = router;
