const Subscriber = require("../models/subscriber");
const sendEmail = require("../services/sendEmail");
exports.subscribeUser = async (req, res) => {
    const { email } = req.body;
  
    try {
      let subscriber = await Subscriber.findOne({ email });
  
      if (subscriber) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
  
      subscriber = new Subscriber({ email });
      await subscriber.save();
  
      console.log("📩 Calling sendEmail function...");
      await sendEmail(email);
      console.log("✅ Email function executed");
  
      res.status(201).json({ message: "Subscription successful! Check your email." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

exports.getSubscribeUser = async (req, res) => {
    try {
      const subscribeUser = await Subscriber.find().sort({ createdAt: -1 }); // Get all contacts, latest first
      res.status(200).json({ success: true, data: subscribeUser });
    } catch (error) {
      console.error("Error fetching subscribeUser:", error);
      res.status(500).json({ success: false, message: "Error fetching subscribeUser" });
    }
  };  
