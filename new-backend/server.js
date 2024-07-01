const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const countRoutes = require('./routes/countRoutes'); // Import the count routes
const getCount = require('./routes/count'); // Import the count routes

// Load environment variables from .env file
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// SendGrid configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use count routes
app.use('/increment', countRoutes); // Use the count routes for incrementing counts

app.use('/api', getCount);
console.log(getCount)

// Route for sending messages
app.post('/send-message', (req, res) => {
    const to = req.body.phoneNumber;
    const salutation = req.body.salutation;
    const lName = req.body.lastName;
    const messageType = req.body.type;
    const messageTemplate = `Guten Tag {{1}} {{2}},

hier der Link zur Präsentation für eine gemeinsame und erfolgreiche Kooperation mit uns, dem
SchadenNetzwerk von Justizcar GmbH!

https://youtu.be/5ELSARcct_k

www.Justizcar.de

www.SchadenNetzwerk.com

Wir freuen uns auf Sie!

Alles Gute

Ihr Frank Roll MSc,MBA`;

    const message = messageTemplate.replace('{{1}}', salutation).replace('{{2}}', lName);

    const messageOptions = {
        body: message,
        to: to,
    };

    if (messageType === 'whatsapp') {
        messageOptions.to = `whatsapp:${to}`;
        messageOptions.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    } else if (messageType === 'sms') {
        messageOptions.from = process.env.TWILIO_PHONE_NUMBER;
    } else {
        return res.status(400).send('Invalid message type');
    }

    client.messages
        .create(messageOptions)
        .then(message => {
            console.log(message.sid);
            res.status(200).send('Message sent!');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Failed to send message');
        });
});

// Route for sending emails
app.post('/send-email', (req, res) => {
    const to = req.body.email;
    const subject = "Good Morning";
    const salutation = req.body.salutation;
    const lName = req.body.lastName;
    const templateId = process.env.SENDGRID_TEMPLATE_ID;
    const dynamicData = {
        salutation: salutation,
        lName: lName,
        // Add more dynamic fields as required by your template
    };

    const msg = {
        to: to,
        from: process.env.SENDGRID_FROM_EMAIL, // Replace with your verified sender email
        subject: subject,
        templateId: templateId,
        dynamic_template_data: dynamicData, // Ensure this is uncommented
    };

    sgMail.send(msg)
        .then(() => {
            console.log('Email sent');
            res.status(200).send('Email sent!');
        })
        .catch(error => {
            console.error(error);
            if (error.response) {
                console.error('Error details:', error.response.body);
            }
            res.status(500).send('Failed to send email');
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
