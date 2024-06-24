const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

// Twilio configuration
const accountSid = 'ACec5aff5c91360e3be823f08bf8f19b8f';
const authToken = '73fc1f9ac062ffc225625da38a3b4d59';
const client = twilio(accountSid, authToken);

// SendGrid configuration
sgMail.setApiKey('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');

app.use(cors())

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
            messagingServiceSid: 'MG86b01e2ca8d60bc028e397b73bbeee26', 
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
    const templateId = 'd-1ea4e27b28084725a86f014c1df8e3a8'; // Replace with your SendGrid template ID
    const dynamicData = {
        salutation: salutation,
        lName: lName,
        // Add more dynamic fields as required by your template
    };

    const msg = {
        to: to,
        from: 'schadennetzwerk@gmail.com', // Replace with your verified sender email
        subject: subject,
        templateId: templateId,
        // dynamic_template_data: dynamicData,
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
