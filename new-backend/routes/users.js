const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');
const { getAllUsers, grantAccess } = require('../controllers/userController');

router.get('/', getAllUsers);
router.post('/grant-access', grantAccess);

module.exports = router;
