const nodemailer = require('nodemailer');
const database = require('../data/database');
const { EMAIL, PASS } = require('../common/constants');

// Configure your email provider here
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL,
        pass: PASS
    }
});

async function sendRegistrationEmail(email, firstName) {
    const confirmUrl = `http://localhost:3030/api/users/confirm/${email}`; // Replace with your actual confirmation URL

    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Confirm Account',
        html: `
            <p>Dear ${firstName},</p>
            <p>Thank you for registering on our website!</p>
            <p>Please click the button below to confirm your account:</p>
            <a href="${confirmUrl}">
                <button style="background-color: #008CBA; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                    Confirm Account
                </button>
            </a>
        `
    };

    await transporter.sendMail(mailOptions);
}

async function confirm(email) {
    const query = `
        UPDATE Users
        SET IsValidated = 1
        WHERE Email = @email
    `;

    await database.executeQuery(query, { email });
}


module.exports = {
    sendRegistrationEmail,
    confirm
};
