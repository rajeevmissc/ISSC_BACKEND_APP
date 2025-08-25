const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  currentCTC: { type: String },
  expectedCTC: { type: String },
  noticePeriod: { type: String },
  portfolioLink: { type: String },
  resume: { type: String, required: false}, // Store file path here
}, { timestamps: true });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);

