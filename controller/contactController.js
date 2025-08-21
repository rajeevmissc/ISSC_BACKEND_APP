const Contact = require("../models/Contact");
const moment = require("moment");

exports.submitContactForm = async (req, res) => {
    try {
      // Find the latest contact entry based on serialNumber
      const lastContact = await Contact.findOne().sort({ serialNumber: -1 });
  
      // Ensure serialNumber is a valid number
      const newSerialNumber = lastContact && lastContact.serialNumber ? lastContact.serialNumber + 1 : 1;
  
      // Get current date and time separately
      const formattedDate = moment().format("YYYY-MM-DD"); // Example: "2025-03-18"
      const formattedTime = moment().format("HH:mm:ss");   // Example: "14:30:45"
  
      // Create a new contact with serial number, date, and time
      const newContact = new Contact({
        ...req.body,
        serialNumber: newSerialNumber, // Ensure it's a valid number
        submittedDate: formattedDate,
        submittedTime: formattedTime,
      });
  
      await newContact.save();
      res.status(201).json({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ success: false, message: "Error saving form data", error });
    }
  };


exports.getContacts = async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 }); // Get all contacts, latest first
      res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ success: false, message: "Error fetching contacts" });
    }
  };
  
