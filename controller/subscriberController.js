// controllers/subscriberController.js
const Subscriber = require("../models/subscriber");
const sgMail = require("../config/emailConfig"); // your centralized Brevo/SendGrid config
const moment = require("moment");

exports.subscribeUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    // Save new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    const formattedDate = moment().format("YYYY-MM-DD");
    const formattedTime = moment().format("HH:mm:ss");

    // ---------------- USER WELCOME EMAIL ----------------
    const userHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear Subscriber,</p>
        <p>Thank you for subscribing to ISSC updates! We're thrilled to have you on board.</p>
        <p>Here are your submitted details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Email</td>
            <td style="padding: 8px; border: 1px solid #000;">${email}</td>
          </tr>
          <tr>
            <td style="background-color: #5b3a7c; color: white; padding: 8px; border: 1px solid #000;">Subscribed On</td>
            <td style="padding: 8px; border: 1px solid #000;">${formattedDate} ${formattedTime}</td>
          </tr>
        </table>
        <p>We will keep you updated with the latest news and opportunities. Welcome aboard!</p>
        <p>Best Regards,<br>ISSC Team</p>
      </div>
    `;

    try {
      await sgMail.send({
        from: { email: process.env.SENDGRID_SENDER, name: "ISSC WebApp" },
        to: email,
        subject: "Welcome to ISSC Updates!",
        html: userHtml,
        text: `Thank you for subscribing to ISSC updates! Your email: ${email}`,
      });
      console.log("✅ Subscriber email sent successfully");
    } catch (err) {
      console.error("❌ Error sending subscriber email:", err.response?.body || err.message || err);
    }

    res.status(201).json({ message: "Subscription successful! Check your email." });
  } catch (error) {
    console.error("❌ Error subscribing user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSubscribeUser = async (req, res) => {
  try {
    const subscribeUser = await Subscriber.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, data: subscribeUser });
  } catch (error) {
    console.error("❌ Error fetching subscribeUser:", error);
    res.status(500).json({ success: false, message: "Error fetching subscribeUser" });
  }
};
