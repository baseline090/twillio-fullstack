const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const WebSocket = require("ws");

let wsClient;

const errHandler = require("./middleware/error");
// const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const accountSid = "AC5cfecd44569b0a29427b02943034086c";
const authToken = "71f60bc7cd3576712034a39c066bd2b4";
// const accountSid = "AC5cfecd44569b0a29427b02943034086c";
// const authToken = "71f60bc7cd3576712034a39c066bd2b4";
const client = new twilio(accountSid, authToken);
const userRoutes = require("./routes/userRoutes");
// const templateRoutes = require("./routes/templateRoutes");
const connectDB = require("./database");
// const callModel = require("./models/callmodel");
const msgModel = require("./models/SMSmodel");
const replyModel = require("./models/replyModel");
const callModel = require("./models/callModel");
// const whatsappreplyModel = require("./models/whatsappreplymodel");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api/v1", userRoutes);
// app.use("/api/v1", templateRoutes);
connectDB();

app.get("/", async (req, res) => {
  res.status(200).send("deployed successfully dialer!");
});

app.post("/webhookforcall", async (req, res) => {
  console.log("cal; stats", req.body.call);
  const {
    fromNumber,
    sid,
    toNumber,
    duration,
    outcome,
    primaryOutcomeAchieved,
  } = req.body.call;
  const call = await callModel.create({
    fromNumber,
    sid,
    toNumber,
    duration,
    outcome,
    primaryOutcomeAchieved,
  });
  res.status(201).json({
    success: true,
    call,
  });
});
wss.on("connection", (ws) => {
  wsClient = ws;
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

var identity;
function tokenGenerator() {
  identity = "ishowspeeeed";

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
app.get("/token", async (req, res) => {
  res.send(tokenGenerator());
});
app.post("/incomingcall", async (req, res) => {
  console.log("calllll", req.body);
  res.set("Content-Type", "text/xml");
  res.send(voiceResponse(req.body));
});
function voiceResponse(requestBody) {
  console.log("jelll", requestBody);
  const toNumberOrClientName = requestBody.To;
  // caller id can also be dynamically fetched through requestbody.From
  const callerId = requestBody.From;
  const twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == process.env.TWILIO_PHONE_NUMBER) {
    console.log("hellooee");
    const dial = twiml.dial({
      record: "record-from-answer-dual",

      action: "https://ph-dialer-backend-1c2311450049.herokuapp.com/callstatus",
    });

    // // This will connect the caller with your Twilio.Device/client
    // console.log("clientttt", tokenGenerator().identity);
    // dial.client(tokenGenerator().identity);
    // const tokenData = tokenGenerator();

    // if (wsClient) {
    //   wsClient.send(JSON.stringify(tokenData));
    // }

    dial.client("ishowspeeeed");
  } else if (requestBody.To) {
    // This is an outgoing call
    console.log("to is", requestBody.To);
    const sliceId = "number" + callerId.slice(6);
    console.log("caller id is", callerId);

    // set the callerId
    // const dial = twiml.dial({ callerId: process.env.TWILIO_PHONE_NUMBER });

    // record parameter can be passed to start recording
    // you can refer twilio docs for more parameters.
    const dial = twiml.dial({
      record: "record-from-answer-dual",
      callerId: process.env.TWILIO_PHONE_NUMBER,

      action: "https://ph-dialer-backend-1c2311450049.herokuapp.com/callstatus",
    });

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
app.post("/calloutcome", async (req, res) => {
  console.log("cal; stats", req.body.call);
  const {
    fromNumber,
    sid,
    toNumber,
    duration,
    outcome,
    primaryOutcomeAchieved,
  } = req.body.call;
  const call = await callModel.create({
    fromNumber,
    sid,
    toNumber,
    duration,
    outcome,
    primaryOutcomeAchieved,
  });
  res.status(201).json({
    success: true,
    call,
  });
});

app.post("/webhookforwhatsappmsg", async (req, res) => {
  console.log("whatsapp msg data", req.body);
  const { From, To, ProfileName, Body, MessageSid, SmsStatus } = req.body;
  const wms = await whatsappreplyModel.create({
    From,
    To,
    ProfileName,
    Body,
    MessageSid,
    SmsStatus,
  });
  res.status(201).json({
    success: true,
    wms,
  });
});

app.post("/webhookforincomingsms", async (req, res) => {
  console.log("cal; stat", req.body);
  const { From, MessageSid, To, Body } = req.body;
  const sms = await replyModel.create({
    From,
    MessageSid,
    To,
    Body,
  });
  res.status(201).json({
    success: true,
    sms,
  });
});
app.post("/recordingdata", async (req, res) => {
  console.log("recoding datataa", req.body);
});

app.get("/allincomingsms", async (req, res) => {
  const messages = await replyModel.find();
  res.status(201).json({
    success: true,
    messages,
  });
});
app.post("/callstatus", async (req, res) => {
  console.log("calll sttus", req.body);
  const twiml = new VoiceResponse();
  try {
    const callExist = await callModel.findOne({ sid: req.body.CallSid });
    callExist.status = req.body.DialCallStatus;
    callExist.recordingUrl = req.body.RecordingUrl;
    await callExist.save();
    // res.status(200).json({
    //   success: true,
    // });
    return twiml.toString();
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    // });
    console.log("erorr in status",error)
    return twiml.toString();

  }
});
const updateMessageStatus = async (messageSid, messageStatus) => {
  try {
    // Find the message in the messageModel by messageSid
    const message = await msgModel.findOne({ sid: messageSid });

    if (!message) {
      console.log(`Message with SID ${messageSid} not found.`);
      return;
    }

    // Update the status of the message
    message.status = messageStatus;
    await message.save();

    console.log(
      `Message with SID ${messageSid} status updated to ${messageStatus}.`
    );
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
};
app.post("/statusChanged", async (req, res) => {
  const messageSid = req.body.MessageSid;
  const messageStatus = req.body.MessageStatus;

  console.log(`SID: ${messageSid}, Status: ${messageStatus}`);

  try {
    await updateMessageStatus(messageSid, messageStatus);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).send("Internal server error");
  }
});
const sendWhen = new Date(new Date().getTime() + 17 * 60000);

app.use(errHandler);

// app.listen(4000, () => console.log("Server running on port 4000"));
server.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port 3000")
);

module.exports = app;

//https://help.twilio.com/tickets/17200737
