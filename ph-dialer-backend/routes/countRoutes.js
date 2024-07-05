const express = require('express');
const router = express.Router();
const countController = require('../controllers/countController');
const { excelFile, formExcelFile } = require('../controllers/excelFileController'); // Correct import
const { customFieldData,getcustomfielddata } = require('../controllers/customController');

// Increment counts
router.post('/email', countController.incrementEmailCount);
router.post('/sms', countController.incrementSmsCount);
router.post('/whatsapp', countController.incrementWhatsappCount);
// router.get('/download-excel', excelFile);
router.get('/downloadsave-formdata-excel', formExcelFile); 
// router.post('/save-form-data', customFieldData);
// router.get('/customfielddata', getcustomfielddata);
module.exports = router;
