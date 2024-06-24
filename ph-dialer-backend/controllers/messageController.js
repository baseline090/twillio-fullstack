const asyncHandler = require("express-async-handler");
const twilio = require("twilio");

const userModel = require("../models/userModel");
const msgModel = require("../models/SMSmodel");
const replyModel = require("../models/replyModel");
// const whatsappmsgModel = require("../models/whatsappMessageModel");
// const replyModel = require("../models/replyModel");
// const whatsappreplyModel = require("../models/whatsappreplymodel");
// const whatsappgroupModel = require("../models/whatsappGroupModel");
const client = new twilio(
  process.env.TWILIO_LIVE_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const createMessageInstance = async (r, user) => {
  try {
    const newMessage = new msgModel({
      user: user._id, // Assuming you have the user instance available
      from: r.from, // Assuming 'from' is a field in r
      to: r.to, // Assuming 'to' is a field in r
      body: r.body, // Assuming 'body' is a field in r
      sid: r.sid,
      status: r.status, // Assuming 'status' is a field in r
    });
    const savedMessage = await newMessage.save();
    console.log("Message saved:", savedMessage);
  } catch (error) {
    console.error("Error creating message instance:", error);
    throw error;
  }
};
const sendMessage = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  console.log("userr", user);
  try {
    const { messages } = req.body;
    for (const { phoneNumber, parsedMessage } of messages) {
      console.log(`Sending message to ${phoneNumber}: ${parsedMessage}`);
      // Perform sending message action for each contact here

      await client.messages
        .create({
          body: parsedMessage, // Customize the message body
          to: `${phoneNumber}`,
          from: process.env.TWILIO_PHONE_NUMBER,

          statusCallback:
            "https://ph-dialer-backend-1c2311450049.herokuapp.com/statusChanged",
          statusCallbackMethod: "POST",
        })
        .then((r) => {
          console.log("mesfsa", r);

          createMessageInstance(r, user);
        })
        .catch((e) => console.log("eeerror", e));
    }
    res.status(200).send("Messages sent successfully!");
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).send("Internal server error", error);
  }
});
const getAllMyMessagesDetails = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  try {
    const messages = await msgModel.find({ user: user._id });

    // Return the messages
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).send("Internal server error");
  }
});
const getAllMyRepliesDetails = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  try {
    const messages = await replyModel.find({
      To: process.env.TWILIO_PHONE_NUMBER,
    });

    // Return the messages
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting replies:", error);
    res.status(500).send("Internal server error");
  }
});
module.exports = {
  sendMessage,
  getAllMyMessagesDetails,
  getAllMyRepliesDetails,
};
