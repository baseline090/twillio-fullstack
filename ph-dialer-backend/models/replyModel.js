const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  // Define fields for your message template

  From: {
    type: String,
  },
  MessageSid: {
    type: String,
  },
  To: {
    type: String,
  },

  Body: {
    type: String,
  },
});
module.exports = mongoose.model("Replies", replySchema);
