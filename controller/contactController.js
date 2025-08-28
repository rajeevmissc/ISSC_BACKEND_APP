// controllers/contactController.js
const Contact = require("../models/Contact");
const moment = require("moment");
const sgMail = require("../config/emailConfig"); // same as Job controller


exports.submitContactForm = async (req, res) => {
  try {
    // Get the next serial number
    const lastContact = await Contact.findOne().sort({ serialNumber: -1 });
    const newSerialNumber =
      lastContact && lastContact.serialNumber ? lastContact.serialNumber + 1 : 1;

    // Get current date and time
    const formattedDate = moment().format("YYYY-MM-DD");
    const formattedTime = moment().format("HH:mm:ss");

    // Save form data
    const newContact = new Contact({
      ...req.body,
      serialNumber: newSerialNumber,
      submittedDate: formattedDate,
      submittedTime: formattedTime,
    });

    await newContact.save();

    // Extract values from frontend form
    const { name, email, message, ...rest } = req.body;

    // ---------------- ADMIN EMAIL ----------------
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear Admin,</p>
        <p>A new contact form has been submitted. Details are below:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Name</td>
            <td style="padding: 8px; border: 1px solid #000;">${name}</td>
          </tr>
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Email</td>
            <td style="padding: 8px; border: 1px solid #000;">${email}</td>
          </tr>
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Message</td>
            <td style="padding: 8px; border: 1px solid #000;">${message}</td>
          </tr>
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Submitted On</td>
            <td style="padding: 8px; border: 1px solid #000;">${formattedDate} ${formattedTime}</td>
          </tr>
          ${Object.entries(rest)
            .map(([key, value]) => `<tr>
              <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">${key}</td>
              <td style="padding: 8px; border: 1px solid #000;">${value}</td>
            </tr>`).join('')}
        </table>
        <p style="margin-top:120px">Best Regards,<br>ISSC WebApp</p>
      </div>
    `;

    try {
      await sgMail.send({
        from: { email: process.env.SENDGRID_SENDER, name: "ISSC WebApp" },
        to: "sanketa@issc.co.in",
        subject: `New Contact Form Submission #${newSerialNumber}`,
        html: adminHtml,
        text: `New contact submission from ${name} - Message: ${message}`,
      });
    } catch (err) {
      console.error("❌ Error sending admin email:", err.response?.body || err.message || err);
    }

    // ---------------- USER ACKNOWLEDGMENT EMAIL ----------------
    if (email) {
      const userHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to ISSC. We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your submitted details:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
              <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Name</td>
              <td style="padding: 8px; border: 1px solid #000;">${name}</td>
            </tr>
            <tr>
              <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Email</td>
              <td style="padding: 8px; border: 1px solid #000;">${email}</td>
            </tr>
            <tr>
              <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Message</td>
              <td style="padding: 8px; border: 1px solid #000;">${message}</td>
            </tr>
            <tr>
              <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Submitted On</td>
              <td style="padding: 8px; border: 1px solid #000;">${formattedDate} ${formattedTime}</td>
            </tr>
          </table>
          <p>We appreciate your interest and will respond shortly.</p>
          <p>Best Regards,<br>ISSC WebApp Team</p>
        </div>
      `;

      try {
        await sgMail.send({
          from: { email: process.env.SENDGRID_SENDER, name: "ISSC WebApp" },
          to: email,
          subject: "Thank you for contacting ISSC",
          html: userHtml,
          text: `Hi ${name}, thank you for reaching out. Your message has been received.`,
        });
      } catch (err) {
        console.error("❌ Error sending acknowledgment email:", err.response?.body || err.message || err);
      }
    }

    res.status(201).json({
      success: true,
      message: "Form submitted and emails sent successfully!",
    });

  } catch (error) {
    console.error("❌ Error saving form data or sending email:", error);
    res.status(500).json({
      success: false,
      message: "Error saving form data or sending email",
      error,
    });
  }
};


exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Error fetching contacts" });
  }
};
