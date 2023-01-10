const express = require('express');
const twilio = require('twilio');
require('dotenv').config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const app = express();

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.post('/verify/:phone', async(req, res) => {
    try {
        const { phone } = req.params;
        const { status } = await twilioClient.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
            to: phone,
            channel: 'whatsapp'
        });
        res.json({ status })
    } catch(err) {
        console.log(err)
    }
});

app.post('/check/:phone/:code', async (req, res) => {
    try {
        const { phone, code } = req.params;
        const { status } = await twilioClient.verify.v2.services(TWILIO_SERVICE_SID).verificationChecks.create({
            to: phone,
            code
        });
        if (status === "approved") {
            res.json({ status })
        } else {
            res.status(401).json( { status: "Not authorizated" })
        }
    } catch(err) {
        console.log(err)
    }
});

app.listen(3000);