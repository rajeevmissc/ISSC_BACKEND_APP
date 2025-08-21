const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (recipient) => {
  const msg = {
    to: recipient,
    from: "rajeevm@issc.co.in", // Use verified email
    subject: "Newsletter Subscription Confirmation",
    text: "Thank you for subscribing to our newsletter! Stay tuned for updates.",
    html: "<p>Thank you for subscribing to our <strong>newsletter</strong>! Stay tuned.</p>",
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${recipient}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.response.body);
  }
};

module.exports = sendEmail;
