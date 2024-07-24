const express = require("express");


const multer = require('multer');
const xlsx = require('xlsx');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const mongoose = require('mongoose');
// const User = require('./db');

const app = express();
const upload = multer({ dest: 'uploads/' });


const bulkEmailModel = require("../models/bulkEmailModel");
const {
  registerUser,
  loginUser,

  getUserDetails,
  deleteUserContacts,

  addUserContacts,
  voiceResponse,
  tokenGenerator,
  getAllUsers,
  deleteUser,
  getUserMessages,
  getUserDetailsAdmin,
  getAllUserCalls,
  getUserCallsByAdmin,
  createBulkSendEmail,
  getAllBulkEmails,
  getDailyBulkEmails,
} = require("../controllers/userController");
const Call = require("../models/callModel");
const {
  isAuthenticatedUser,
  authRoles,
} = require("../middleware/AuthMiddleware");
const {
  sendMessage,
  getAllMyMessagesDetails,
  getAllMyRepliesDetails,
} = require("../controllers/messageController");
// const {
//   sendMessage,
//   sendgroupmsgwhatsapp,
//   sendMessageSingleWhatsapp,
//   getAllMyRepliesDetailsWhatsapp,
//   sendScheduledMessage,
//   getAllMyMessagesDetails,
//   getIncomingMessageDetails,
//   getMessageStatusUpdate,
//   sendwhatsappMessage,
//   getMessageStatusUpdateWhatsapp,
//   sendMessageSingle,
//   getAllMyRepliesDetails,
//   createwhatsappGroup,
//   getAllMyGroupsWhatsapp,
// } = require("../controllers/messageControllers");
const router = express.Router();
router.post("/user/new", registerUser);
router.post("/user/login", loginUser);
// router.post("/user/contact/add", isAuthenticatedUser, addUserContacts);
// router.delete(
//   "/user/contact/delete/:id",
//   isAuthenticatedUser,
//   deleteUserContacts
// );
router.get("/user/me", isAuthenticatedUser, getUserDetails);
router.post("/user/sendmessage", isAuthenticatedUser, sendMessage);
// router.post("/user/sendmessagesingle", isAuthenticatedUser, sendMessageSingle);
// router.post(
//   "/user/sendmessagesingleWhatsapp",
//   isAuthenticatedUser,
//   sendMessageSingleWhatsapp
// );
// router.post(
//   "/user/sendwhatsappmessage",
//   isAuthenticatedUser,
//   sendwhatsappMessage
// );
// router.post("/user/sendscheduled", isAuthenticatedUser, sendScheduledMessage);
// router.post(
//   "/user/createwhatsappgroup",
//   isAuthenticatedUser,
//   createwhatsappGroup
// );
router.get("/user/allMyMessages", isAuthenticatedUser, getAllMyMessagesDetails);
router.get("/user/allMyReplies", isAuthenticatedUser, getAllMyRepliesDetails);
router.post("/saveCall", isAuthenticatedUser, async (req, res) => {
  const { from, to, sid } = req.body;
  const userId = req.user._id;

  try {
    const newCall = new Call({
      user: userId,
      from,
      to,
      sid,
    });

    await newCall.save();
    res
      .status(201)
      .json({ success: true, message: "Call information saved successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving call information",
      error,
    });
  }
});

router.get("/token", isAuthenticatedUser, (req, res) => {
  res.send(tokenGenerator());
});

router.post("/voice", isAuthenticatedUser, (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(voiceResponse(req.body));
});
router.get(
  "/admin/allusers",
  isAuthenticatedUser,
  authRoles("admin"),
  getAllUsers
);
router.delete(
  "/admin/user/delete/:id",
  isAuthenticatedUser,
  authRoles("admin"),
  deleteUser
);
router.get(
  "/admin/user/messages/:id",
  isAuthenticatedUser,
  authRoles("admin"),
  getUserMessages
);
router.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authRoles("admin"),
  getUserDetailsAdmin
);

router.get("/user/calls", isAuthenticatedUser, getAllUserCalls);
router.get(
  "/admin/user/calls/:id",
  isAuthenticatedUser,
  authRoles("admin"),
  getUserCallsByAdmin
);
// router.get("/user/allMyReplies", isAuthenticatedUser, getAllMyRepliesDetails);
// router.get("/user/allMyGroups", isAuthenticatedUser, getAllMyGroupsWhatsapp);
// router.get(
//   "/user/allMyRepliesWhatsapp",
//   isAuthenticatedUser,
//   getAllMyRepliesDetailsWhatsapp
// );
// router.post("/incomingmessage", getIncomingMessageDetails);
// router.post("/sendgmessagetogroup", isAuthenticatedUser, sendgroupmsgwhatsapp);
// router.post("/statuschanged", getMessageStatusUpdate);
// router.post("/statuschangedWhatsapp", getMessageStatusUpdateWhatsapp);


router.post(
  "/admin/upload",
  upload.single('file'),
  // isAuthenticatedUser,
  // authRoles("admin"),
  createBulkSendEmail
);

router.get(
  "/admin/allbulkemail",
  isAuthenticatedUser,
  authRoles("admin"),
  getAllBulkEmails
);

router.get(
  "/admin/dailybulkemail",
  isAuthenticatedUser,
  authRoles("admin"),
  getDailyBulkEmails
);
// router.post('/admin/upload', isAuthenticatedUser,authRoles("admin"),upload.single('file'), async (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(400).send('No file uploaded.');

//   const workbook = xlsx.readFile(file.path);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data = xlsx.utils.sheet_to_json(sheet);

//   if (data.length > 3000) {
//       return res.status(400).send('Row count exceeds 3000.');
//   }

//   const emails = data.map(row => row.email);
//   const bulkEmailModels = data.map(row => ({
//       name: row.name,
//       email: row.email,
//       createdAt: moment().toDate(),
//       updatedAt: moment().toDate(),
//   }));

//   try {
//       await bulkEmailModel.insertMany(bulkEmailModels);

//       const messages = emails.map(email => ({
//           to: email,
//           from: 'your-email@example.com',
//           subject: 'Welcome!',
//           text: 'Welcome to our service!',
//           html: '<strong>Welcome to our service!</strong>',
//       }));

//       await sgMail.send(messages);

//       res.status(200).send('Emails sent and data stored.');
//   } catch (error) {
//       res.status(500).send('Error processing data.');
//   }
// });

module.exports = router;
