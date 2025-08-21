const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  serialNumber: { type: Number, unique: true },
  name: String,
  email: String,
  phone: String,
  company: String,
  role: String,
  message: String,
  country: String,
  submittedDate: { type: String }, // Store only date (YYYY-MM-DD)
  submittedTime: { type: String },
});

module.exports = mongoose.model("Contact", ContactSchema);
