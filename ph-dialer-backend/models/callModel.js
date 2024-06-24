const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
  // Define fields for your message template
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  from: {
    type: String,
    required: [true, "Please Enter Your Template name"],
  },
  sid: {
    type: String,
    required: [true, "Please Enter Your Template name"],
  },
  to: {
    type: String,
    required: [true, "Please Enter Your Message Content"],
  },
  //   body: {
  //     type: String,
  //     required: [true, "Please Enter Your Message Content"],
  //   },

  status: {
    type: String,
  },
  recordingUrl: {
    type: String,
  },
});
module.exports = mongoose.model("Calls", callSchema);
