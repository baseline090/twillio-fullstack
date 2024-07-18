const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { sendToken } = require("../utils/sendingJWTtoken");
const SMSmodel = require("../models/SMSmodel");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const Call = require("../models/callModel");

const multer = require('multer');
const xlsx = require('xlsx');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');


const bulkEmailModel = require("../models/bulkEmailModel");


//singup user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return new ErrorHandler("Enter all fields", 400);
  }
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      message: "user already exist with this email",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hp = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    email,
    password: hp,
  });

  if (user) {
    sendToken(user, 200, res);
  }
});

//login user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Enter all fileds", 400));
  }
  const userExists = await userModel.findOne({ email }).select("+password");
  if (!userExists) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (userExists && !(await bcrypt.compare(password, userExists.password))) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (userExists && (await bcrypt.compare(password, userExists.password))) {
    sendToken(userExists, 201, res);
  }
});

//get user details
const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
}); 
const getUserDetailsAdmin = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  res.status(200).json({
    success: true,
    user,
  });
});

const addUserContacts = asyncHandler(async (req, res, next) => {
  const { phoneNumber, fullname } = req.body;

  // Find the user by ID
  const user = await userModel.findById(req.user.id);

  // Check if user exists
  if (!user) {
    return next(new ErrorHandler("No User found", 401));
  }

  // Create a new contact object
  const newContact = {
    name: fullname,
    phoneNumber: phoneNumber,
  };

  try {
    // Push the new contact to the user's contacts array
    user.contacts.push(newContact);

    // Save the user with the updated contacts array
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contact added successfully",
      user: user,
    });
  } catch (error) {
    return next(new ErrorHandler("Error adding contact", 500));
  }
});
const deleteUserContacts = asyncHandler(async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const userId = req.user.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler("No User found", 401));
    }

    // Find the index of the contact in the user's contacts array
    const contactIndex = user.contacts.findIndex(
      (contact) => contact._id == contactId
    );

    // Check if contact exists
    if (contactIndex === -1) {
      return next(new ErrorHandler("Contact not found", 404));
    }

    // Remove the contact from the user's contacts array
    user.contacts.splice(contactIndex, 1);

    // Save the user with the updated contacts array
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      user: user,
    });
  } catch (error) {
    return next(new ErrorHandler("Error deleting contact", 500));
  }
});
const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching users", 500));
  }
});
const grantAccess = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.accessGranted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Access granted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Error granting access", 500));
  }
});
const denyAccess = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.accessGranted = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Access denied successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Error denying access", 500));
  }
});
const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find and delete the user by ID
    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Error deleting user", 500));
  }
});
const getUserMessages = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find messages sent by the user
    const messages = await SMSmodel.find({ user: userId });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching messages", 500));
  }
});
function tokenGenerator() {
  identity = "dummy_username";

  const accessToken = new AccessToken(
    process.env.TWILIO_LIVE_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    {
      identity,
    }
  );

  const grant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWIML_APP_SID,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
}
function voiceResponse(requestBody) {
  const toNumberOrClientName = requestBody.To;
  // caller id can also be dynamically fetched through requestbody.From
  const callerId = requestBody.From;
  const twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    const dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client
    dial.client(identity);
  } else if (requestBody.To) {
    // This is an outgoing call

    // set the callerId
    const dial = twiml.dial({ callerId });

    // record parameter can be passed to start recording
    // you can refer twilio docs for more parameters.
    // const dial = twiml.dial({record: 'record-from-ringing-dual', callerId});

    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }

  return twiml.toString();
}
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
const getUserCallsByAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    const calls = await Call.find({ user: userId });
    res.status(200).json({ success: true, calls });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching calls", error });
  }
};

const createBulkSendEmail = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');
  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length > 3000) {
      fs.unlinkSync(file.path); // Clean up the file
      return res.status(400).send('Row count exceeds 3000.');
    }

    // const emails = data.map(row => row.email);
    // const bulkEmailModels = data.map(row => ({
    //   name: row.name,
    //   email: row.email,
    //   address: row.name,
    //   zipcode: row.email,
    //   city: row.name,
    //   phone: row.email,
    //   reference: row.email,
    //   createdAt: moment().toDate(),
    //   updatedAt: moment().toDate(),
    // }));

    ///New Way start
    const validData = [];
    const emails = [];
    const invalidRows = [];

    data.forEach((row, index) => {
      if (row.name && row.email) {
        validData.push({
          name: row.name,
          email: row.email,
          address: row.address,
          zipcode: row.zipcode,
          city: row.city,
          phone: row.phone,
          reference: row.reference,
          createdAt: moment().toDate(),
          updatedAt: moment().toDate(),
        });
        emails.push(row.email);
      } else {
        invalidRows.push({ rowNumber: index + 1, rowData: row });
      }
    });
    

     // Store valid data in the database
    //  await bulkEmailModel.insertMany(validData);

    ////
        // Check for existing emails in the database
        const existingEmails = await bulkEmailModel.find({ email: { $in: emails } }, 'email');
        const existingEmailSet = new Set(existingEmails.map(doc => doc.email));

        const newValidData = validData.filter(data => !existingEmailSet.has(data.email));
        const newEmails = emails.filter(email => !existingEmailSet.has(email));

            // Store new valid data in the database
    if (newValidData.length > 0) {
      await bulkEmailModel.insertMany(newValidData);
    }
    ///New Way end
    // await bulkEmailModel.insertMany(bulkEmailModels);

    // Prepare email messages only for entries with valid emails
    const templateId = process.env.SENDGRID_TEMPLATE_ID;
    const salutation = req.body.salutation;
    const lName = req.body.name;
    const dynamicData = {
      salutation: salutation,
      lName: lName,
    };

    // const messages = emails.map(email => ({
    const messages = newEmails.map(email => ({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // Replace with your verified sender email
      subject: 'Welcome!',
      templateId: templateId,
      dynamic_template_data: dynamicData, // Ensure
      // text: 'Welcome to our service!',
      // html: '<strong>Welcome to our service!</strong>',
    }));

    //Add New start
   // Send emails
   try {
    await sgMail.send(messages);
  } catch (emailError) {
    console.error('Error sending emails:', emailError);
    // Continue without stopping the execution if email sending fails
  }
    //Add new End
    // await sgMail.send(messages);
    fs.unlinkSync(file.path); // Clean up the file

    res.status(200).send('Emails sent and data stored.');
  } catch (error) {
    fs.unlinkSync(file.path); // Clean up the file
    console.error('Error processing data:', error); // Log the error for debugging
    res.status(500).send('Error processing data.');
  }


});

const getAllUserCalls = async (req, res) => {
  const userId = req.user.id;

  try {
    const calls = await Call.find({ user: userId });
    res.status(200).json({ success: true, calls });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching calls", error });
  }
};
module.exports = {
  registerUser,
  loginUser,
  addUserContacts,
  getAllUsers,
  grantAccess,
  denyAccess,
  getUserCallsByAdmin,
  getAllUserCalls,

  getUserDetails,
  deleteUserContacts,
  tokenGenerator,
  voiceResponse,
  deleteUser,
  getUserMessages,
  getUserDetailsAdmin,
  createBulkSendEmail,
};
