const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

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

// Route for sending WhatsApp messages
app.post('/send-message', (req, res) => {
    const to = req.body.phoneNumber;
    const salutation = req.body.salutation;
    const lName = req.body.lastName;
    const messageTemplate = `Guten Tag {{1}} {{2}},

    im Anhang finden Sie den Link zur Präsentation über die Kooperation mit dem SchadenNetzwerk von Justizcar:
    
    External Link
    
    Freundliche Grüße,
    Ihr SchadenNetzwerk`;

    const message = messageTemplate.replace('{{1}}', salutation).replace('{{2}}', lName);

    client.messages
        .create({
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            body: message,
            to: `whatsapp:${to}`
        })
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
