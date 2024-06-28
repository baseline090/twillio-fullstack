const express = require('express');
const router = express.Router();
const countController = require('../controllers/countController'); // Adjust the path as necessary

// Increment counts
router.post('/email', countController.incrementEmailCount);
router.post('/sms', countController.incrementSmsCount);
router.post('/whatsapp', countController.incrementWhatsappCount);

module.exports = router;
