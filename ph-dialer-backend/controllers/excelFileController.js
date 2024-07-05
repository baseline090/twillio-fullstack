const ExcelJS = require('exceljs');
const userModel = require('../models/userModel');
const CustomModel = require('../models/customModel');

const excelFile = async (req, res) => {
  try {
    const users = await userModel.find();
    console.log('users: ', users);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Details');
    console.log('worksheet: ', worksheet);

    // Define columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 }
    ];

    // Add data to the worksheet
    users.forEach(user => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        role: user.role
      });
    });

    // Generate buffer from workbook
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers for downloading
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="user_details.xlsx"',
      'Content-Length': buffer.length
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
};


const formExcelFile = async (req, res) => {
  try {
    const formUsers = await CustomModel.find();
    console.log('formdata: ', formUsers);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Form Data Details');
    console.log('worksheet: ', worksheet);

    // Define columns
    worksheet.columns = [
      { header: 'Salutation', key: 'salutation', width: 20 },
      { header: 'LastName', key: 'lastname', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'PhoneNumber', key: 'phone', width: 20 },
      // { header: 'Message', key: 'message', width: 20 },
      // { header: 'Role', key: 'role', width: 15 }
    ];

    // Add data to the worksheet
    formUsers.forEach(formUser => {
      worksheet.addRow({
        salutation: formUser.salutation,
        lastname: formUser.lastName,
        email: formUser.email,
        phone: formUser.phoneNumber, 
        
      });
    });

    // Generate buffer from workbook
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers for downloading
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="form_data_details.xlsx"',
      'Content-Length': buffer.length
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
};

module.exports = { excelFile, formExcelFile };


